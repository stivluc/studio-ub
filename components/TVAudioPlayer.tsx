'use client';

import { useMemo, useEffect } from 'react';

interface TVAudioPlayerProps {
  autoplay?: boolean;
  turnOnDelay?: number;
  noiseDelay?: number;
  noiseVolume?: number;
  turnOnVolume?: number;
}

export default function TVAudioPlayer({
  autoplay = true,
  turnOnDelay = 1500,
  noiseDelay = 1500,
  noiseVolume = 0.3,
  turnOnVolume = 0.5,
}: TVAudioPlayerProps) {
  // Audio elements are memoized so they persist across re-renders
  const audioElements = useMemo(
    () => (
      <div className="hidden">
        <audio
          id="tv-turn-on-sound"
          src="/sounds/turn-on-old-tv.mp3"
          preload="auto"
        />
        <audio
          id="tv-noise-sound"
          src="/sounds/tv-noise-2.mp3"
          preload="auto"
          loop
        />
      </div>
    ),
    []
  );

  useEffect(() => {
    if (!autoplay) return;

    const turnOnAudio = document.getElementById('tv-turn-on-sound') as HTMLAudioElement;
    const noiseAudio = document.getElementById('tv-noise-sound') as HTMLAudioElement;

    if (turnOnAudio) {
      turnOnAudio.volume = turnOnVolume;
    }

    if (noiseAudio) {
      noiseAudio.volume = noiseVolume;
    }

    // Play turn-on sound after delay
    const turnOnTimeout = setTimeout(() => {
      turnOnAudio?.play().catch((err) => {
        console.log('Turn-on sound autoplay blocked:', err);
      });
    }, turnOnDelay);

    // Start noise loop after delay
    const noiseTimeout = setTimeout(() => {
      noiseAudio?.play().catch((err) => {
        console.log('Noise sound autoplay blocked:', err);
      });
    }, noiseDelay);

    // Cleanup timeouts only (audio elements persist in DOM)
    return () => {
      clearTimeout(turnOnTimeout);
      clearTimeout(noiseTimeout);
    };
  }, [autoplay, turnOnDelay, noiseDelay, noiseVolume, turnOnVolume]);

  return audioElements;
}
