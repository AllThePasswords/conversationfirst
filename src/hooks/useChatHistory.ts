import { useState, useCallback } from 'react';

const LIST_KEY = 'cf-chat-list';

function loadList() {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function useChatHistory() {
  const [conversations, setConversations] = useState(loadList);
  const [activeId, setActiveId] = useState(() => {
    const list = loadList();
    return list.length > 0 ? list[0].id : null;
  });

  const createConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const entry = { id, title: '', updatedAt: Date.now() };
    const updated = [entry, ...loadList()];
    saveList(updated);
    setConversations(updated);
    setActiveId(id);
    return id;
  }, []);

  const updateTitle = useCallback((id, title) => {
    const list = loadList();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return;
    list[idx].title = title.slice(0, 40);
    list[idx].updatedAt = Date.now();
    saveList(list);
    setConversations([...list]);
  }, []);

  const deleteConversation = useCallback((id) => {
    const list = loadList().filter(c => c.id !== id);
    saveList(list);
    localStorage.removeItem(`cf-chat-${id}`);
    setConversations(list);
    if (activeId === id) {
      setActiveId(list.length > 0 ? list[0].id : null);
    }
  }, [activeId]);

  return {
    conversations,
    activeId,
    setActiveId,
    createConversation,
    updateTitle,
    deleteConversation,
  };
}
