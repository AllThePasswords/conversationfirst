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

  const play = useCallback(async (text: string, voiceId?: string) => {
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

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text, voiceId }),
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
