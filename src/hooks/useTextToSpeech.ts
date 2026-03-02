import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type TtsState = 'idle' | 'loading' | 'playing';

export function useTextToSpeech() {
  const [state, setState] = useState<TtsState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState('idle');
  }, []);

  const play = useCallback(async (text: string, voiceId?: string) => {
    // If loading or playing, stop
    if (state !== 'idle') {
      stop();
      return;
    }

    setState('loading');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState('idle');
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text, voiceId }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok || !data?.audio) {
        console.error('TTS error:', data?.error || 'No audio returned');
        setState('idle');
        return;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audioRef.current = audio;

      audio.onended = () => {
        audioRef.current = null;
        setState('idle');
      };

      audio.play();
      setState('playing');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState('idle');
      }
      audioRef.current = null;
    } finally {
      abortRef.current = null;
    }
  }, [state, stop]);

  return { state, play, stop };
}
