'use client';

import { useEffect, useMemo, useRef } from 'react';

const INTERACTIVE_SELECTOR = '.glitch-on-hover, .glitch-on-hover-subtle';
const CLICKABLE_SELECTOR = 'button, a, [role="button"], [data-click-sound]';

interface RetroSoundManagerProps {
  volume?: number;
}

export default function RetroSoundManager({ volume = 0.32 }: RetroSoundManagerProps) {
  const stopTimeoutRef = useRef<number | null>(null);
  const fallbackClickAudioRef = useRef<HTMLAudioElement | null>(null);

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
    const hoverAudio = document.getElementById('retro-hover-sound') as HTMLAudioElement | null;
    if (!hoverAudio) {
      return;
    }

    hoverAudio.volume = volume;
    hoverAudio.loop = false;

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
        hoverAudio.pause();
        hoverAudio.currentTime = 0;
        stopTimeoutRef.current = null;
      }, 420);
    };

    const playHoverSound = () => {
      hoverAudio.currentTime = 0;
      hoverAudio.play().catch((err) => {
        console.log('Retro hover sound playback blocked:', err);
      });
      scheduleStop();
    };

    const ensureClickAudio = () => {
      const existing = document.getElementById('button-sound') as HTMLAudioElement | null;
      if (existing) {
        existing.volume = Math.min(existing.volume || 0.4, 0.4);
        return existing;
      }

      if (!fallbackClickAudioRef.current) {
        const audio = new Audio('/sounds/button.mp3');
        audio.preload = 'auto';
        audio.volume = 0.4;
        fallbackClickAudioRef.current = audio;
      }

      return fallbackClickAudioRef.current;
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
        hoverAudio.pause();
        hoverAudio.currentTime = 0;
        clearStopTimeout();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const clickable = target.closest(CLICKABLE_SELECTOR);
      if (!clickable) {
        return;
      }

      if (clickable instanceof HTMLButtonElement && clickable.disabled) {
        return;
      }

      const clickAudio = ensureClickAudio();
      if (!clickAudio) {
        return;
      }

      try {
        clickAudio.currentTime = 0;
        clickAudio.play().catch((err) => {
          console.log('Click sound playback blocked:', err);
        });
      } catch (err) {
        console.log('Click sound playback failed:', err);
      }
    };

    const primaryButtonAudio = document.getElementById('button-sound') as HTMLAudioElement | null;
    if (primaryButtonAudio) {
      primaryButtonAudio.volume = Math.min(primaryButtonAudio.volume || 0.4, 0.4);
    }

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerleave', handlePointerLeave, true);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerleave', handlePointerLeave, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      clearStopTimeout();
      hoverAudio.pause();
      hoverAudio.currentTime = 0;
      if (fallbackClickAudioRef.current) {
        fallbackClickAudioRef.current.pause();
      }
    };
  }, [volume]);

  return audioElement;
}
