'use client';

import { useMemo, useEffect } from 'react';

interface TVAudioPlayerProps {
  autoplay?: boolean;
  turnOnDelay?: number;
  noiseDelay?: number;
  noiseVolume?: number;
  turnOnVolume?: number;
  buttonVolume?: number;
  clickVolume?: number;
  typewriterVolume?: number;
}

export default function TVAudioPlayer({
  autoplay = true,
  turnOnDelay = 1500,
  noiseDelay = 1500,
  noiseVolume = 0.3,
  turnOnVolume = 0.5,
  buttonVolume = 0.4,
  clickVolume = 0.3,
  typewriterVolume = 0.25,
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
        <audio
          id="button-sound"
          src="/sounds/button.mp3"
          preload="auto"
        />
        <audio
          id="click-sound"
          src="/sounds/click.mp3"
          preload="auto"
        />
        <audio
          id="typewriter-sound"
          src="/sounds/typewriter.mp3"
          preload="auto"
        />
      </div>
    ),
    []
  );

  useEffect(() => {
    const turnOnAudio = document.getElementById('tv-turn-on-sound') as HTMLAudioElement;
    const noiseAudio = document.getElementById('tv-noise-sound') as HTMLAudioElement;
    const buttonAudio = document.getElementById('button-sound') as HTMLAudioElement;
    const clickAudio = document.getElementById('click-sound') as HTMLAudioElement;
    const typewriterAudio = document.getElementById('typewriter-sound') as HTMLAudioElement;

    // Set volumes for all audio elements
    if (turnOnAudio) {
      turnOnAudio.volume = turnOnVolume;
    }

    if (noiseAudio) {
      noiseAudio.volume = noiseVolume;
    }

    if (buttonAudio) {
      buttonAudio.volume = buttonVolume;
    }

    if (clickAudio) {
      clickAudio.volume = clickVolume;
    }

    if (typewriterAudio) {
      typewriterAudio.volume = typewriterVolume;
    }

    if (!autoplay) return;

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
  }, [autoplay, turnOnDelay, noiseDelay, noiseVolume, turnOnVolume, buttonVolume, clickVolume, typewriterVolume]);

  return audioElements;
}
