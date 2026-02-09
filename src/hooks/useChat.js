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

export function useChat(conversationId, onTitleUpdate) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const accumulatorRef = useRef('');
  const citationsRef = useRef([]);

  useEffect(() => {
    setMessages(loadMessages(conversationId));
    setIsStreaming(false);
    setIsSearching(false);
    setStreamingContent('');
    setError(null);
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
    accumulatorRef.current = '';
    citationsRef.current = [];

    // Build API messages — always pass text content as string for simplicity
    // Web search tool handles fresh searches each turn
    const apiMessages = updated.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content,
    }));

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
  }, [conversationId, onTitleUpdate]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isStreaming,
    isSearching,
    streamingContent,
    error,
    sendMessage,
    clearError,
  };
}
