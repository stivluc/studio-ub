'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { fadeInAudio, fadeOutAudio } from '@/lib/utils/audioFade';

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
    if (!tracks.length || currentIndex === null) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const track = tracks[currentIndex];
    const cleanupTimeouts: number[] = [];

    const targetVolume = volume;
    const fadeOutAndPause = () => {
      if (!audio || audio.paused || audio.currentTime === 0) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        fadeOutAudio(audio, 600);
        const timeout = window.setTimeout(() => {
          audio.pause();
          resolve();
        }, 650);
        cleanupTimeouts.push(timeout);
      });
    };

    let cancelled = false;

    const startPlayback = async () => {
      await fadeOutAndPause();
      if (cancelled) return;

      audio.src = track;
      audio.loop = false;
      audio.currentTime = 0;

      const attemptPlay = () => {
        if (cancelled) return;
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            if (!cancelled) {
              fadeInAudio(audio, targetVolume, 1800);
            }
          })
          .catch((err) => {
            console.log('Admin music autoplay blocked:', err);
            if (interactionHandler) {
              return;
            }

            interactionHandler = () => {
              attemptPlay();
            };

            interactionEvents.forEach((eventName) => {
              document.addEventListener(eventName, interactionHandler as EventListener, { once: true });
            });
          });
      };

      attemptPlay();
    };

    let interactionHandler: (() => void) | null = null;

    startPlayback();

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
      cancelled = true;
      fadeOutAndPause();
      audio.removeEventListener('ended', handleEnded);
      if (interactionHandler) {
        interactionEvents.forEach((eventName) => {
          document.removeEventListener(eventName, interactionHandler as EventListener);
        });
      }
      cleanupTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [tracks, currentIndex, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      audio.volume = Math.min(volume, 1);
    }
  }, [volume]);

  const audioElement = useMemo(
    () => (
      <audio ref={audioRef} id="music-audio" className="hidden" preload="auto" />
    ),
    []
  );

  return audioElement;
}
