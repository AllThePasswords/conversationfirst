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
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const accumulatorRef = useRef('');

  useEffect(() => {
    setMessages(loadMessages(conversationId));
    setIsStreaming(false);
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

    const apiMessages = updated.map(m => ({ role: m.role, content: m.content }));

    streamResponse(
      apiMessages,
      (chunk) => {
        accumulatorRef.current += chunk;
        setStreamingContent(accumulatorRef.current);
      },
      () => {
        const assistantMsg = {
          role: 'assistant',
          content: accumulatorRef.current,
          timestamp: Date.now(),
        };
        const final = [...loadMessages(conversationId), assistantMsg];
        setMessages(final);
        saveMessages(conversationId, final);
        setIsStreaming(false);
        setStreamingContent('');
      },
      (errMsg) => {
        setError(errMsg);
        setIsStreaming(false);
        setStreamingContent('');
      },
    );
  }, [conversationId, onTitleUpdate]);

  const clearError = useCallback(() => setError(null), []);

  return { messages, isStreaming, streamingContent, error, sendMessage, clearError };
}
