'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface AdminMusicPlayerProps {
  volume?: number;
}

const interactionEvents: Array<keyof DocumentEventMap> = ['pointerdown', 'keydown'];

function shuffle<T>(values: T[]): T[] {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function AdminMusicPlayer({ volume = 0.1 }: AdminMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTracks = async () => {
      try {
        const response = await fetch('/api/admin/music', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch admin music: ${response.status}`);
        }

        const data = await response.json();
        const rawTracks = Array.isArray(data?.tracks) ? data.tracks : [];
        const uniqueTracks = Array.from(
          new Set(
            rawTracks
              .filter((track: unknown): track is string => typeof track === 'string' && track.trim().length > 0)
              .map((track) => (track.startsWith('/') ? track : `/${track}`))
          )
        );

        if (!isMounted) {
          return;
        }

        if (uniqueTracks.length > 0) {
          const randomized = shuffle(uniqueTracks);
          setTracks(randomized);
          setCurrentIndex(Math.floor(Math.random() * randomized.length));
        } else {
          setTracks([]);
          setCurrentIndex(null);
        }
      } catch (error) {
        console.error('Failed to load admin music tracks:', error);
        if (isMounted) {
          setTracks([]);
          setCurrentIndex(null);
        }
      }
    };

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!tracks.length || currentIndex === null) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const track = tracks[currentIndex];
    audio.src = track;
    audio.loop = false;
    audio.volume = volume;
    audio.currentTime = 0;

    let interactionHandler: (() => void) | null = null;

    const ensurePlayback = () => {
      audio.play().catch((err) => {
        console.log('Admin music autoplay blocked:', err);
        if (interactionHandler) {
          return;
        }

        interactionHandler = () => {
          audio.play().catch((playErr) => {
            console.log('Admin music playback failed after interaction:', playErr);
          });
        };

        interactionEvents.forEach((eventName) => {
          document.addEventListener(eventName, interactionHandler as EventListener, { once: true });
        });
      });
    };

    ensurePlayback();

    const trackCount = tracks.length;
    const handleEnded = () => {
      setCurrentIndex((prev) => {
        if (prev === null) {
          return null;
        }

        if (trackCount <= 1) {
          return prev;
        }

        let nextIndex = prev;
        while (nextIndex === prev) {
          nextIndex = Math.floor(Math.random() * trackCount);
        }

        return nextIndex;
      });
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      if (interactionHandler) {
        interactionEvents.forEach((eventName) => {
          document.removeEventListener(eventName, interactionHandler as EventListener);
        });
      }
    };
  }, [tracks, currentIndex, volume]);

  const audioElement = useMemo(
    () => (
      <audio ref={audioRef} className="hidden" preload="auto" />
    ),
    []
  );

  return audioElement;
}
