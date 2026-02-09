import { useState, useCallback, useEffect, useRef } from 'react';
import { streamResponse } from '../lib/streamResponse';
import { uploadImage, imageUrlToBase64 } from '../lib/imageUpload';

function loadMessages(id) {
  if (!id) return [];
  try {
    return JSON.parse(localStorage.getItem(`cf-chat-${id}`)) || [];
  } catch {
    return [];
  }
}

function saveMessages(id, messages) {
  if (!id) return;
  localStorage.setItem(`cf-chat-${id}`, JSON.stringify(messages));
}

// Build Anthropic-format content blocks, converting image URLs to base64
async function buildApiContent(content, base64Cache) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return content;

  const blocks = [];
  for (const block of content) {
    if (block.type === 'image' && block.url) {
      // Check cache first
      let cached = base64Cache.get(block.url);
      if (!cached) {
        cached = await imageUrlToBase64(block.url);
        base64Cache.set(block.url, cached);
      }
      blocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: cached.media_type,
          data: cached.data,
        },
      });
    } else if (block.type === 'text') {
      blocks.push({ type: 'text', text: block.text });
    }
  }
  return blocks;
}

export function useChat(conversationId, onTitleUpdate) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const accumulatorRef = useRef('');
  const citationsRef = useRef([]);
  const base64CacheRef = useRef(new Map());

  useEffect(() => {
    setMessages(loadMessages(conversationId));
    setIsStreaming(false);
    setIsSearching(false);
    setIsUploading(false);
    setStreamingContent('');
    setError(null);
  }, [conversationId]);

  const sendMessage = useCallback(async (text, imageFiles = []) => {
    if ((!text.trim() && imageFiles.length === 0) || !conversationId) return;

    try {
      // Upload images to Supabase if present
      let imageBlocks = [];
      if (imageFiles.length > 0) {
        setIsUploading(true);
        try {
          const uploads = await Promise.all(
            imageFiles.map(file => uploadImage(file, conversationId))
          );
          imageBlocks = uploads.map(u => ({
            type: 'image',
            url: u.url,
            media_type: u.media_type,
          }));
        } catch (uploadErr) {
          setError(uploadErr.message || 'Image upload failed.');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Build user message content
      let content;
      if (imageBlocks.length > 0) {
        content = [
          ...imageBlocks,
          ...(text.trim() ? [{ type: 'text', text: text.trim() }] : []),
        ];
      } else {
        content = text.trim();
      }

      const userMsg = { role: 'user', content, timestamp: Date.now() };
      const updated = [...loadMessages(conversationId), userMsg];
      setMessages(updated);
      saveMessages(conversationId, updated);

      // Set title from first user message
      if (updated.filter(m => m.role === 'user').length === 1 && onTitleUpdate) {
        const titleText = text.trim() || 'Image conversation';
        onTitleUpdate(conversationId, titleText);
      }

      setIsStreaming(true);
      setStreamingContent('');
      setError(null);
      accumulatorRef.current = '';
      citationsRef.current = [];

      // Build API messages with base64 images
      const apiMessages = [];
      for (const m of updated) {
        const apiContent = await buildApiContent(m.content, base64CacheRef.current);
        apiMessages.push({ role: m.role, content: apiContent });
      }

      streamResponse(apiMessages, {
        onChunk(chunk) {
          accumulatorRef.current += chunk;
          setStreamingContent(accumulatorRef.current);
        },
        onSearchStart() {
          setIsSearching(true);
        },
        onSearchDone(results) {
          setIsSearching(false);
          if (Array.isArray(results)) {
            for (const r of results) {
              if (r.type === 'web_search_result' && r.url) {
                citationsRef.current.push({ url: r.url, title: r.title || r.url });
              }
            }
          }
        },
        onContentBlock() {},
        onDone() {
          const assistantMsg = {
            role: 'assistant',
            content: accumulatorRef.current,
            citations: citationsRef.current.length > 0 ? citationsRef.current : undefined,
            timestamp: Date.now(),
          };
          const final = [...loadMessages(conversationId), assistantMsg];
          setMessages(final);
          saveMessages(conversationId, final);
          setIsStreaming(false);
          setIsSearching(false);
          setStreamingContent('');
        },
        onError(errMsg) {
          setError(errMsg);
          setIsStreaming(false);
          setIsSearching(false);
          setStreamingContent('');
        },
      });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setIsStreaming(false);
      setIsUploading(false);
    }
  }, [conversationId, onTitleUpdate]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isStreaming,
    isSearching,
    isUploading,
    streamingContent,
    error,
    sendMessage,
    clearError,
  };
}
