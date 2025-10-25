'use client';

import { useEffect, useMemo, useRef } from 'react';

const INTERACTIVE_SELECTOR = '.glitch-on-hover, .glitch-on-hover-subtle';
const CLICKABLE_SELECTOR = 'button, a, [role="button"], [data-click-sound]';

interface RetroSoundManagerProps {
  volume?: number;
}

export default function RetroSoundManager({ volume = 0.32 }: RetroSoundManagerProps) {
  const stopTimeoutRef = useRef<number | null>(null);
  const audioElement = useMemo(
    () => (
      <>
        <audio
          id="retro-hover-sound"
          src="/sounds/tv-noise-2.mp3"
          preload="auto"
        />
        <audio id="global-button-sound" src="/sounds/button.mp3" preload="auto" />
      </>
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

    const playClickSound = () => {
      const primary = document.getElementById('button-sound') as HTMLAudioElement | null;
      const fallback = document.getElementById('global-button-sound') as HTMLAudioElement | null;
      const audioTarget = primary ?? fallback;
      if (!audioTarget) {
        return;
      }
      audioTarget.volume = 0.4;
      audioTarget.currentTime = 0;
      audioTarget.play().catch((err) => {
        console.log('Click sound playback blocked:', err);
      });
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

      playClickSound();
    };

    const primaryButtonAudio = document.getElementById('button-sound') as HTMLAudioElement | null;
    const fallbackButtonAudio = document.getElementById('global-button-sound') as HTMLAudioElement | null;
    if (fallbackButtonAudio) {
      fallbackButtonAudio.volume = 0.4;
    }
    if (primaryButtonAudio) {
      primaryButtonAudio.volume = 0.4;
    }

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerleave', handlePointerLeave, true);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerleave', handlePointerLeave, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      clearStopTimeout();
      audio.pause();
      audio.currentTime = 0;
    };
  }, [volume]);

  return audioElement;
}
