import { useState, useCallback, useEffect, useRef } from 'react';
import { streamResponse } from '../lib/streamResponse';

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

// Extract display text from content (string or array of blocks)
function getDisplayText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}

export function useChat(conversationId, onTitleUpdate) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const accumulatorRef = useRef('');
  const contentBlocksRef = useRef([]);
  const citationsRef = useRef([]);

  useEffect(() => {
    setMessages(loadMessages(conversationId));
    setIsStreaming(false);
    setIsSearching(false);
    setStreamingContent('');
    setError(null);
  }, [conversationId]);

  const doStream = useCallback((apiMessages) => {
    accumulatorRef.current = '';
    contentBlocksRef.current = [];
    citationsRef.current = [];

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
        // Collect citation URLs from search results
        if (Array.isArray(results)) {
          for (const r of results) {
            if (r.type === 'web_search_result' && r.url) {
              citationsRef.current.push({ url: r.url, title: r.title || r.url });
            }
          }
        }
      },
      onContentBlock(block) {
        contentBlocksRef.current.push(block);
      },
      onDone(stopReason) {
        // Build the assistant content — use full content blocks for multi-turn
        const contentBlocks = contentBlocksRef.current;
        const hasSearchBlocks = contentBlocks.some(
          b => b.type === 'server_tool_use' || b.type === 'web_search_tool_result'
        );

        // For display, we always store the text + citations
        // For API multi-turn, we store the full content array if search was used
        const assistantMsg = {
          role: 'assistant',
          content: accumulatorRef.current,
          citations: citationsRef.current.length > 0 ? citationsRef.current : undefined,
          // Store raw content blocks for multi-turn API calls when search was used
          _contentBlocks: hasSearchBlocks ? contentBlocks : undefined,
          timestamp: Date.now(),
        };
        const final = [...loadMessages(conversationId), assistantMsg];
        setMessages(final);
        saveMessages(conversationId, final);
        setIsStreaming(false);
        setIsSearching(false);
        setStreamingContent('');

        // Handle pause_turn — continue the turn automatically
        if (stopReason === 'pause_turn') {
          // Send the response back to continue
          const continueMessages = [...apiMessages, {
            role: 'assistant',
            content: contentBlocks,
          }];
          doStream(continueMessages);
        }
      },
      onError(errMsg) {
        setError(errMsg);
        setIsStreaming(false);
        setIsSearching(false);
        setStreamingContent('');
      },
    });
  }, [conversationId]);

  const sendMessage = useCallback((text) => {
    if (!text.trim() || !conversationId) return;

    const userMsg = { role: 'user', content: text.trim(), timestamp: Date.now() };
    const updated = [...loadMessages(conversationId), userMsg];
    setMessages(updated);
    saveMessages(conversationId, updated);

    // Set title from first user message
    if (updated.filter(m => m.role === 'user').length === 1 && onTitleUpdate) {
      onTitleUpdate(conversationId, text.trim());
    }

    setIsStreaming(true);
    setStreamingContent('');
    setError(null);

    // Build API messages — pass content blocks for multi-turn search context
    const apiMessages = updated.map(m => ({
      role: m.role,
      content: m._contentBlocks || m.content,
    }));

    doStream(apiMessages);
  }, [conversationId, onTitleUpdate, doStream]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isStreaming,
    isSearching,
    streamingContent,
    error,
    sendMessage,
    clearError,
    getDisplayText,
  };
}
