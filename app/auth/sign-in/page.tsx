'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CRTEffect } from '@/lib/animations';
import TVAudioPlayer from '@/components/TVAudioPlayer';
import TVGlitchWrapper from '@/components/TVGlitchWrapper';
import { fadeOutAudio, playAudio } from '@/lib/utils/audioFade';
import '@/lib/animations/GlassEffect.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tvStarted, setTvStarted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Handle Enter key to start TV
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !tvStarted) {
        setTvStarted(true);
        // Play sounds manually
        const turnOnAudio = document.getElementById('tv-turn-on-sound') as HTMLAudioElement;
        const noiseAudio = document.getElementById('tv-noise-sound') as HTMLAudioElement;

        if (turnOnAudio) {
          turnOnAudio.play().catch(err => console.log('Sound failed:', err));
        }
        if (noiseAudio) {
          setTimeout(() => {
            noiseAudio.play().catch(err => console.log('Noise failed:', err));
          }, 200);
        }

        // Focus on email input after animations (2400ms for all form animations to complete)
        setTimeout(() => {
          const emailInput = document.getElementById('email') as HTMLInputElement;
          emailInput?.focus();
        }, 2600);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [tvStarted]);

  const handleButtonClick = () => {
    // Play button sound (even if form is invalid)
    playAudio('button-sound');
  };

  const handleInputFocus = () => {
    // Play click sound when focusing an input
    playAudio('click-sound');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Fade out TV noise sound
        const noiseAudio = document.getElementById('tv-noise-sound') as HTMLAudioElement;
        if (noiseAudio) {
          fadeOutAudio(noiseAudio, 1000);
        }

        // Redirect after fade starts (keep loading state until redirect)
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      setLoading(false); // Only set loading to false on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-pine)]">
      {/* TV Audio Player - persists in DOM via useMemo - autoplay disabled */}
      <TVAudioPlayer autoplay={false} noiseVolume={0.3} turnOnVolume={0.5} />

      <div className="w-full max-w-5xl">
        {/* TV Container */}
        <div className="relative">
          {/* Dark background positioned inside the TV screen - BEHIND the TV */}
          <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 z-0">
            {/* Black screen - glass effect when OFF, grain + CRT when ON */}
            <div
              className={`w-[75%] h-[55%] rounded-sm animate-zoom-in ${!tvStarted ? 'glass-effect' : 'bg-[var(--color-dark)]'}`}
            />

            {/* CRT Effect - only appears after TV is started */}
            {tvStarted && (
              <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 animate-fade-in">
                <CRTEffect
                  effects={{
                    scanlines: true,
                    vcr: true,
                    snow: true,
                    vignette: false,
                    wobble: true,
                  }}
                  intensity={{
                    vcrOpacity: 0.6,
                    snowOpacity: 0.15,
                    vcrTracking: 220,
                    vcrTapeAge: 50,
                    vcrBlur: 1,
                  }}
                  className="w-[75%] h-[55%]"
                >
                  <div className="w-full h-full bg-transparent rounded-sm" />
                </CRTEffect>
              </div>
            )}

            {/* "Press ENTER" message - only before TV starts */}
            {!tvStarted && (
              <div className="absolute inset-0 flex items-center justify-start pl-[20%] pr-[38%] -mt-6 z-10 animate-fade-in animation-delay-1000">
                <div className="w-full h-[55%] flex items-center justify-center">
                  <div className="inline-block">
                    <p
                      className="text-[var(--color-cream)] font-bold text-xl tracking-wider animate-typewriter animation-delay-1000 animate-loading-dots"
                      style={{
                        textShadow: '0 0 10px rgba(250, 236, 187, 0.5)',
                        fontFamily: 'monospace',
                        display: 'inline-block',
                      }}
                    >
                      {`> PRESS ENTER TO START TV`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TV Image - zooms in with the dark background */}
          <div className="relative w-full aspect-[3/3] z-10 animate-zoom-in">
            <Image
              src="/images/vintage-tv.png"
              alt="Vintage TV"
              fill
              className="object-contain"
              priority
              loading="eager"
            />

            {/* Sign-in Form overlaid on TV screen - only appears after TV is started */}
            {tvStarted && (
              <div className="absolute inset-0 flex items-center justify-start pl-[20%] pr-[38%] -mt-6 z-20">
                <div className="w-full h-[55%] flex items-center justify-center">
                  <TVGlitchWrapper
                    enabled={tvStarted}
                    intensity="low"
                    frequency={8}
                    selector="h1, input, button"
                  >
                    <div className="w-full space-y-4">
                      {/* Logo/Title - appears after CRT effect */}
                      <div className="text-center mb-2 animate-fade-in animation-delay-1500">
                        <h1 className="text-2xl font-bold text-[var(--color-cream)]">
                          Studio UB Admin
                        </h1>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSignIn} className="space-y-3">
                        <div className="animate-fade-in-up animation-delay-2000">
                          <label
                            htmlFor="email"
                            className="block text-xs font-medium text-[var(--color-cream)] mb-1"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={handleInputFocus}
                            required
                            disabled={loading}
                            className="w-full px-3 py-1.5 text-sm bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 rounded text-[var(--color-cream)] placeholder-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)] disabled:opacity-50 font-light"
                            placeholder="admin@studioub.ch"
                          />
                        </div>

                        <div className="animate-fade-in-up animation-delay-2200">
                          <label
                            htmlFor="password"
                            className="block text-xs font-medium text-[var(--color-cream)] mb-1"
                          >
                            Mot de passe
                          </label>
                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={handleInputFocus}
                            required
                            disabled={loading}
                            className="w-full px-3 py-1.5 text-sm bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 rounded text-[var(--color-cream)] placeholder-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)] disabled:opacity-50 font-light"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="space-y-1 animate-fade-in-up animation-delay-2400">
                          <button
                            type="submit"
                            disabled={loading}
                            onClick={handleButtonClick}
                            className="w-full bg-[var(--color-cream)] text-[var(--color-pine)] py-2 px-4 rounded font-semibold hover:bg-[var(--color-cream)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                          >
                            {loading ? 'Connexion...' : 'Se connecter'}
                          </button>
                                        {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded p-2 mb-2 mt-2">
                      <p className="text-red-200 text-xs font-light">{error}</p>
                    </div>
                  )}

                          {/* Additional Info */}
                          <p className="text-center text-[var(--color-cream)]/80 font-light text-[11px] mt-2">
                            Accès réservé aux administrateurs
                          </p>
                        </div>
                      </form>
                    </div>
                  </TVGlitchWrapper>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
