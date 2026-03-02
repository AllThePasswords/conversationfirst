import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type TtsState = 'idle' | 'loading' | 'playing';

export function useTextToSpeech() {
  const [state, setState] = useState<TtsState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async (text: string) => {
    // If already playing, stop
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setState('idle');
      return;
    }

    setState('loading');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState('idle');
        return;
      }

      const response = await supabase.functions.invoke('synthesize-voice', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { text },
      });

      if (response.error || !response.data?.audio) {
        setState('idle');
        return;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${response.data.audio}`);
      audioRef.current = audio;

      audio.onended = () => {
        audioRef.current = null;
        setState('idle');
      };

      audio.play();
      setState('playing');
    } catch {
      audioRef.current = null;
      setState('idle');
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState('idle');
  }, []);

  return { state, play, stop };
}
