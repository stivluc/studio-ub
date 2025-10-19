/**
 * Fade out audio element smoothly
 * @param audio - HTMLAudioElement to fade out
 * @param duration - Duration of fade out in milliseconds (default: 1000ms)
 * @param steps - Number of volume steps for smooth transition (default: 20)
 */
export function fadeOutAudio(
  audio: HTMLAudioElement,
  duration: number = 1000,
  steps: number = 20
): void {
  const volumeStep = audio.volume / steps;
  const stepInterval = duration / steps;

  const fadeInterval = setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume = Math.max(0, audio.volume - volumeStep);
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, stepInterval);
}

/**
 * Fade in audio element smoothly
 * @param audio - HTMLAudioElement to fade in
 * @param targetVolume - Target volume (0-1, default: 1)
 * @param duration - Duration of fade in in milliseconds (default: 1000ms)
 * @param steps - Number of volume steps for smooth transition (default: 20)
 */
export function fadeInAudio(
  audio: HTMLAudioElement,
  targetVolume: number = 1,
  duration: number = 1000,
  steps: number = 20
): void {
  audio.volume = 0;
  audio.play().catch(err => console.log('Audio play failed:', err));

  const volumeStep = targetVolume / steps;
  const stepInterval = duration / steps;

  const fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume - volumeStep) {
      audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
    } else {
      audio.volume = targetVolume;
      clearInterval(fadeInterval);
    }
  }, stepInterval);
}

/**
 * Play audio with optional volume
 * @param audioId - ID of the audio element
 * @param volume - Optional volume to set (0-1)
 */
export function playAudio(audioId: string, volume?: number): void {
  const audio = document.getElementById(audioId) as HTMLAudioElement;
  if (audio) {
    if (volume !== undefined) {
      audio.volume = volume;
    }
    audio.currentTime = 0;
    audio.play().catch(err => console.log(`Audio ${audioId} failed:`, err));
  }
}
