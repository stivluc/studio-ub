'use client';

import { useEffect, useMemo, useRef } from 'react';

const INTERACTIVE_SELECTOR = '.glitch-on-hover, .glitch-on-hover-subtle';

interface RetroSoundManagerProps {
  volume?: number;
}

export default function RetroSoundManager({ volume = 0.32 }: RetroSoundManagerProps) {
  const stopTimeoutRef = useRef<number | null>(null);
  const audioElement = useMemo(
    () => (
      <audio
        id="retro-hover-sound"
        src="/sounds/tv-noise-2.mp3"
        preload="auto"
      />
    ),
    []
  );

  useEffect(() => {
    const audio = document.getElementById('retro-hover-sound') as HTMLAudioElement | null;
    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.loop = false;

    let lastElement: Element | null = null;
    let lastPlayedAt = 0;
    const clearStopTimeout = () => {
      if (stopTimeoutRef.current !== null) {
        window.clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    };

    const scheduleStop = () => {
      clearStopTimeout();
      stopTimeoutRef.current = window.setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        stopTimeoutRef.current = null;
      }, 420);
    };

    const playHoverSound = () => {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.log('Retro hover sound playback blocked:', err);
      });
      scheduleStop();
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) {
        return;
      }

      const now = performance.now();
      const shouldPlay = interactive !== lastElement || now - lastPlayedAt > 800;

      if (shouldPlay) {
        playHoverSound();
        lastElement = interactive;
        lastPlayedAt = now;
      }
    };

    const handlePointerLeave = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) {
        return;
      }

      const related = event.relatedTarget;
      if (!(related instanceof Element) || !interactive.contains(related)) {
        if (lastElement === interactive) {
          lastElement = null;
        }
        audio.pause();
        audio.currentTime = 0;
        clearStopTimeout();
      }
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerleave', handlePointerLeave, true);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerleave', handlePointerLeave, true);
      clearStopTimeout();
      audio.pause();
      audio.currentTime = 0;
    };
  }, [volume]);

  return audioElement;
}
