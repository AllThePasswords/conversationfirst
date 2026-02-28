import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { streamResponse } from '../lib/streamResponse';
import { uploadImage, imageUrlToBase64 } from '../lib/imageUpload';

async function buildApiContent(content, base64Cache) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return content;

  const blocks = [];
  for (const block of content) {
    if (block.type === 'image' && block.url) {
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

export function useChatDB(conversationId, onTitleUpdate, accessToken, brain) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const accumulatorRef = useRef('');
  const citationsRef = useRef([]);
  const base64CacheRef = useRef(new Map());

  // Load messages from Supabase when conversation changes
  useEffect(() => {
    if (!conversationId || !supabase) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function load() {
      const { data, error: err } = await supabase
        .from('messages')
        .select('id, role, content, citations, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (!err && data) {
        setMessages(data.map(m => ({
          role: m.role,
          content: m.content,
          citations: m.citations || undefined,
          timestamp: new Date(m.created_at).getTime(),
        })));
      }
    }

    load();
    setIsStreaming(false);
    setIsSearching(false);
    setIsUploading(false);
    setStreamingContent('');
    setError(null);

    return () => { cancelled = true; };
  }, [conversationId]);

  const sendMessage = useCallback(async (text, imageFiles = []) => {
    if ((!text.trim() && imageFiles.length === 0) || !conversationId) return;

    try {
      // Upload images to Supabase Storage if present
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

      // Save user message to Supabase
      if (supabase) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: content,
        });
      }

      const updated = [...messages, userMsg];
      setMessages(updated);

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

      // Recall relevant memories before sending
      let memories = [];
      if (brain?.recall) {
        try {
          memories = await brain.recall(text.trim());
        } catch {
          // Non-blocking — continue without memories
        }
      }

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
        async onDone() {
          const assistantContent = accumulatorRef.current;
          const citations = citationsRef.current.length > 0 ? citationsRef.current : undefined;

          const assistantMsg = {
            role: 'assistant',
            content: assistantContent,
            citations,
            timestamp: Date.now(),
          };

          // Save assistant message to Supabase
          if (supabase) {
            await supabase.from('messages').insert({
              conversation_id: conversationId,
              role: 'assistant',
              content: assistantContent,
              citations: citations || null,
            });
          }

          setMessages(prev => [...prev, assistantMsg]);
          setIsStreaming(false);
          setIsSearching(false);
          setStreamingContent('');

          // Brain: summarize this turn in the background
          if (brain?.summarize) {
            const turnIndex = updated.filter(m => m.role === 'user').length - 1;
            brain.summarize(conversationId, turnIndex, content, assistantContent);
          }
        },
        onError(errMsg) {
          setError(errMsg);
          setIsStreaming(false);
          setIsSearching(false);
          setStreamingContent('');
        },
      }, accessToken, memories);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setIsStreaming(false);
      setIsUploading(false);
    }
  }, [conversationId, onTitleUpdate, messages, accessToken, brain]);

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
