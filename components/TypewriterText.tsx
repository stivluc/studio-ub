'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay before starting (ms)
  showLoadingDots?: boolean; // Show animated dots after typing
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  className = '',
  delay = 0,
  showLoadingDots = false,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showDots, setShowDots] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Get typewriter audio
    audioRef.current = document.getElementById('typewriter-sound') as HTMLAudioElement;

    // Start typing after delay
    const startTimeout = setTimeout(() => {
      // Play typewriter sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log('Typewriter sound failed:', err));
      }

      let currentIndex = 0;
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;

          // Irregular timing like real typing (50-150ms between characters)
          const nextDelay = 50 + Math.random() * 100;
          const timeout = setTimeout(typeNextChar, nextDelay);
          timeoutsRef.current.push(timeout);
        } else {
          // Typing complete - stop sound
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          if (showLoadingDots) {
            setShowDots(true);
          }
          onComplete?.();
        }
      };

      typeNextChar();
    }, delay);

    timeoutsRef.current.push(startTimeout);

    return () => {
      // Cleanup
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [text, delay, showLoadingDots, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showDots && <span className="animate-loading-dots"></span>}
    </span>
  );
}
