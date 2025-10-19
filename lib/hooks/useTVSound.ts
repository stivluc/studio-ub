'use client';

import { useEffect, useRef } from 'react';

interface UseTVSoundOptions {
  turnOnDelay?: number; // Delay before playing turn-on sound (ms)
  noiseDelay?: number; // Delay before starting noise loop (ms)
  noiseVolume?: number; // Volume for noise (0-1)
  turnOnVolume?: number; // Volume for turn-on sound (0-1)
}

export function useTVSound(options: UseTVSoundOptions = {}) {
  const {
    turnOnDelay = 1500,
    noiseDelay = 1500,
    noiseVolume = 0.3,
    turnOnVolume = 0.5,
  } = options;

  const turnOnAudioRef = useRef<HTMLAudioElement | null>(null);
  const noiseAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    turnOnAudioRef.current = new Audio('/sounds/turn-on-old-tv.mp3');
    turnOnAudioRef.current.volume = turnOnVolume;

    noiseAudioRef.current = new Audio('/sounds/tv-noise-2.mp3');
    noiseAudioRef.current.volume = noiseVolume;
    noiseAudioRef.current.loop = true;

    // Play turn-on sound after delay
    const turnOnTimeout = setTimeout(() => {
      turnOnAudioRef.current?.play().catch((err) => {
        console.log('Audio playback failed (user interaction required):', err);
      });
    }, turnOnDelay);

    // Start noise loop after delay
    const noiseTimeout = setTimeout(() => {
      noiseAudioRef.current?.play().catch((err) => {
        console.log('Audio playback failed (user interaction required):', err);
      });
    }, noiseDelay);

    // Cleanup on unmount
    return () => {
      clearTimeout(turnOnTimeout);
      clearTimeout(noiseTimeout);

      if (turnOnAudioRef.current) {
        turnOnAudioRef.current.pause();
        turnOnAudioRef.current = null;
      }

      if (noiseAudioRef.current) {
        noiseAudioRef.current.pause();
        noiseAudioRef.current = null;
      }
    };
  }, [turnOnDelay, noiseDelay, noiseVolume, turnOnVolume]);

  return {
    turnOnAudio: turnOnAudioRef.current,
    noiseAudio: noiseAudioRef.current,
  };
}
