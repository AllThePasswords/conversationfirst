import { useCallback, useRef } from 'react';

/**
 * Brain hook for authenticated users.
 * Handles memory summarization (fire-and-forget after each turn)
 * and recall (before sending a message to inject relevant context).
 */
export function useBrain(accessToken) {
  const lastMemoriesRef = useRef([]);

  const headers = useCallback(() => {
    const h = { 'Content-Type': 'application/json' };
    if (accessToken) h['Authorization'] = `Bearer ${accessToken}`;
    return h;
  }, [accessToken]);

  /**
   * Summarize a conversation turn and store in the brain.
   * Fire-and-forget — does not block UI.
   */
  const summarize = useCallback((conversationId, turnIndex, userMessage, assistantMessage) => {
    if (!accessToken) return;

    // Extract text from content (may be string or array of blocks)
    const userText = typeof userMessage === 'string'
      ? userMessage
      : Array.isArray(userMessage)
        ? userMessage.filter(b => b.type === 'text').map(b => b.text).join(' ')
        : '';

    const assistantText = typeof assistantMessage === 'string'
      ? assistantMessage
      : '';

    if (!userText.trim() || !assistantText.trim()) return;

    // Fire and forget
    fetch('/api/brain', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        action: 'summarize',
        conversation_id: conversationId,
        turn_index: turnIndex,
        user_message: userText.trim(),
        assistant_message: assistantText.trim().slice(0, 2000), // Cap to avoid huge payloads
      }),
    }).catch(() => {}); // Silently ignore errors
  }, [accessToken, headers]);

  /**
   * Recall relevant memories for a query.
   * Returns an array of memory objects.
   */
  const recall = useCallback(async (query) => {
    if (!accessToken || !query || query.trim().length < 5) {
      lastMemoriesRef.current = [];
      return [];
    }

    try {
      const response = await fetch('/api/brain', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          action: 'recall',
          query: query.trim(),
        }),
      });

      if (!response.ok) {
        lastMemoriesRef.current = [];
        return [];
      }

      const data = await response.json();
      const memories = data.memories || [];
      lastMemoriesRef.current = memories;
      return memories;
    } catch {
      lastMemoriesRef.current = [];
      return [];
    }
  }, [accessToken, headers]);

  return { recall, summarize, lastMemories: lastMemoriesRef };
}
