import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useChatHistoryDB(userId) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(true);

  // Fetch conversations on mount and when userId changes
  useEffect(() => {
    if (!userId || !supabase) {
      setDbAvailable(false);
      return;
    }

    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        // Tables don't exist or Supabase is misconfigured
        setDbAvailable(false);
        setLoaded(true);
        return;
      }

      if (data) {
        const list = data.map(c => ({
          id: c.id,
          title: c.title || '',
          updatedAt: new Date(c.updated_at).getTime(),
        }));
        setConversations(list);
        if (list.length > 0 && !cancelled) {
          setActiveId(prev => prev && list.some(c => c.id === prev) ? prev : list[0].id);
        }
      }
      setLoaded(true);
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  const createConversation = useCallback(async () => {
    if (!userId || !supabase) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title: '' })
      .select('id, title, updated_at')
      .single();

    if (error || !data) return null;

    const entry = { id: data.id, title: '', updatedAt: new Date(data.updated_at).getTime() };
    setConversations(prev => [entry, ...prev]);
    setActiveId(data.id);
    return data.id;
  }, [userId]);

  const updateTitle = useCallback(async (id, title) => {
    if (!supabase) return;

    const trimmed = title.slice(0, 40);
    const now = new Date().toISOString();

    await supabase
      .from('conversations')
      .update({ title: trimmed, updated_at: now })
      .eq('id', id);

    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, title: trimmed, updatedAt: Date.now() } : c)
    );
  }, []);

  const deleteConversation = useCallback(async (id) => {
    if (!supabase) return;

    await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    setConversations(prev => {
      const list = prev.filter(c => c.id !== id);
      if (activeId === id) {
        setActiveId(list.length > 0 ? list[0].id : null);
      }
      return list;
    });
  }, [activeId]);

  return {
    conversations,
    activeId,
    setActiveId,
    createConversation,
    updateTitle,
    deleteConversation,
    loaded,
    dbAvailable,
  };
}
