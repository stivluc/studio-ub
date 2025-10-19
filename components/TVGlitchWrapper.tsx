'use client';

import { useEffect, useRef, ReactNode } from 'react';
import '@/lib/animations/TVGlitch.css';

interface TVGlitchWrapperProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  frequency?: number; // seconds between glitches (average)
  enabled?: boolean;
  selector?: string; // CSS selector to target specific children (default: all direct children)
}

export default function TVGlitchWrapper({
  children,
  intensity = 'low',
  frequency = 8,
  enabled = true,
  selector = '> *',
}: TVGlitchWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Get all children elements matching the selector
    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];

    if (elements.length === 0) return;

    // Add intensity class to all elements
    elements.forEach((element) => {
      element.classList.add(`tv-glitch-${intensity}`);
    });

    const scheduleGlitch = (element: HTMLElement) => {
      const triggerGlitch = () => {
        if (!element) return;

        // Add glitch class
        element.classList.add('tv-glitching');

        // Remove after animation completes
        const duration = intensity === 'low' ? 150 : intensity === 'medium' ? 250 : 300;
        const removeTimeout = setTimeout(() => {
          if (element) {
            element.classList.remove('tv-glitching');
          }
        }, duration);
        timeoutsRef.current.push(removeTimeout);

        // Schedule next glitch with some randomness
        const nextGlitch = (frequency + (Math.random() - 0.5) * frequency) * 1000;
        const nextTimeout = setTimeout(triggerGlitch, nextGlitch);
        timeoutsRef.current.push(nextTimeout);
      };

      // Start first glitch after initial delay (random for each element)
      const initialDelay = (frequency + Math.random() * frequency) * 1000;
      const initialTimeout = setTimeout(triggerGlitch, initialDelay);
      timeoutsRef.current.push(initialTimeout);
    };

    // Schedule glitches for all elements
    elements.forEach(scheduleGlitch);

    return () => {
      // Clear all timeouts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      // Remove classes from all elements
      elements.forEach((element) => {
        if (element) {
          element.classList.remove('tv-glitching', `tv-glitch-${intensity}`);
        }
      });
    };
  }, [intensity, frequency, enabled, selector]);

  return <div ref={containerRef} className="w-full">{children}</div>;
}
