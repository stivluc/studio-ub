'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CRTEffect } from '@/lib/animations';
import TVAudioPlayer from '@/components/TVAudioPlayer';
import TVGlitchWrapper from '@/components/TVGlitchWrapper';
import TypewriterText from '@/components/TypewriterText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fadeOutAudio, playAudio } from '@/lib/utils/audioFade';
import '@/lib/animations/GlassEffect.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tvStarted, setTvStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Detect if mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
  }, []);

  // Function to start TV
  const startTV = () => {
    if (tvStarted) return;

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
      const emailInput = (document.getElementById('email') || document.getElementById('email-mobile')) as HTMLInputElement;
      emailInput?.focus();
    }, 2600);
  };

  // Handle Enter key to start TV
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !tvStarted) {
        startTV();
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
    <div className="auth-page min-h-screen flex items-center justify-center max-[599px]:p-0 p-4 max-[599px]:bg-[var(--color-dark)] bg-[var(--color-pine)]">
      {/* TV Audio Player - persists in DOM via useMemo - autoplay disabled */}
      <TVAudioPlayer autoplay={false} noiseVolume={0.3} turnOnVolume={0.5} />

      {/* Mobile version (< 600px) - Full screen TV */}
      <div className="max-[599px]:block hidden w-full h-screen relative bg-[var(--color-dark)]" onClick={!tvStarted ? startTV : undefined} style={{ cursor: !tvStarted ? 'pointer' : 'default' }}>
        {/* Full screen black background with glass effect when OFF */}
        <div className={`absolute inset-0 bg-[var(--color-dark)] ${!tvStarted ? 'glass-effect' : ''}`} />

        {/* CRT Effect - full screen when TV is started */}
        {tvStarted && (
          <div className="absolute inset-0">
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
              className="w-full h-full"
            >
              <div className="w-full h-full bg-transparent" />
            </CRTEffect>
          </div>
        )}

        {/* "TAP TO START TV" message - centered, only before TV starts */}
        {!tvStarted && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in animation-delay-1000 pointer-events-none" style={{ zIndex: 25 }}>
            <div className="px-4">
              <p
                className="text-[var(--color-cream)] font-bold text-sm tracking-wider whitespace-nowrap"
                style={{
                  textShadow: '0 0 10px rgba(250, 236, 187, 0.5)',
                  fontFamily: 'monospace',
                }}
              >
                <TypewriterText
                  text="> TAP TO START TV"
                  delay={1000}
                  showLoadingDots={true}
                />
              </p>
            </div>
          </div>
        )}

        {/* Sign-in Form overlaid - centered, only appears after TV is started */}
        {tvStarted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
            <div className="w-full max-w-sm">
              <TVGlitchWrapper
                enabled={tvStarted}
                intensity="low"
                frequency={8}
                selector="h1, input, button"
              >
                <div className="w-full space-y-3">
                {/* Logo/Title */}
                <div className="text-center mb-2 animate-fade-in animation-delay-1500">
                  <h1 className="text-xl font-bold text-[var(--color-cream)]">
                    Studio UB Admin
                  </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSignIn} className="space-y-2">
                  <Input
                    id="email-mobile"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    required
                    disabled={loading}
                    placeholder="admin@studioub.ch"
                    size="sm"
                    wrapperClassName="animate-fade-in-up animation-delay-2000"
                    label="Email"
                    labelClassName="text-xs font-medium text-[var(--color-cream)] mb-1"
                    className="bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 font-light placeholder:text-[var(--color-cream)]/40"
                  />

                  <Input
                    id="password-mobile"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                    size="sm"
                    wrapperClassName="animate-fade-in-up animation-delay-2200"
                    label="Mot de passe"
                    labelClassName="text-xs font-medium text-[var(--color-cream)] mb-1"
                    className="bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 font-light placeholder:text-[var(--color-cream)]/40"
                  />

                  <div className="space-y-1 animate-fade-in-up animation-delay-2400">
                    <Button
                      type="submit"
                      disabled={loading}
                      onClick={handleButtonClick}
                      size="sm"
                      className="w-full"
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                    {error && (
                      <div className="bg-red-900/30 border border-red-500/50 rounded p-2">
                        <p className="text-red-200 text-xs font-light !mb-0">{error}</p>
                      </div>
                    )}

                    <p className="text-center text-[var(--color-cream)]/80 font-light text-[10px] mt-2">
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

      {/* Desktop version (>= 600px) - TV with frame */}
      <div className="max-[599px]:hidden w-full max-w-5xl">
        {/* TV Container */}
        <div className="relative" onClick={!tvStarted ? startTV : undefined} style={{ cursor: !tvStarted ? 'pointer' : 'default' }}>
          {/* Dark background positioned inside the TV screen - BEHIND the TV */}
          <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 z-0">
            {/* Black screen - glass effect when OFF, grain + CRT when ON */}
            <div
              className={`w-[75%] h-[55%] rounded-sm animate-zoom-in ${!tvStarted ? 'glass-effect' : 'bg-[var(--color-dark)]'}`}
            />


            {/* CRT Effect - only appears after TV is started */}
            {tvStarted && (
              <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 max-[900px]:mt-0 animate-fade-in">
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

            {/* "Press ENTER/TAP" message - only before TV starts */}
            {!tvStarted && (
              <div className="absolute inset-0 flex items-center justify-start pl-[20%] pr-[38%] -mt-6 animate-fade-in animation-delay-1000 pointer-events-none" style={{ zIndex: 25 }}>
                <div className="w-full h-[55%] flex items-center justify-center px-2 sm:px-4">
                  <p
                    className="text-[var(--color-cream)] font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wider whitespace-nowrap"
                    style={{
                      textShadow: '0 0 10px rgba(250, 236, 187, 0.5)',
                      fontFamily: 'monospace',
                    }}
                  >
                    <TypewriterText
                      text={isMobile ? "> TAP TO START TV" : "> PRESS ENTER TO START TV"}
                      delay={1000}
                      showLoadingDots={true}
                    />
                  </p>
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
              sizes="(max-width: 599px) 0vw, 100vw"
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
                    <div className="w-full space-y-3 sm:space-y-4">
                      {/* Logo/Title - appears after CRT effect */}
                      <div className="text-center mb-1 sm:mb-2 animate-fade-in animation-delay-1500">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-cream)]">
                          Studio UB Admin
                        </h1>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSignIn} className="space-y-2 sm:space-y-3">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={handleInputFocus}
                          required
                          disabled={loading}
                          placeholder="admin@studioub.ch"
                          size="sm"
                          wrapperClassName="animate-fade-in-up animation-delay-2000"
                          label="Email"
                          labelClassName="text-[10px] sm:text-xs font-medium text-[var(--color-cream)] mb-1"
                          className="bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 font-light placeholder:text-[var(--color-cream)]/40 px-2 sm:px-3 py-1 sm:py-1.5"
                        />

                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={handleInputFocus}
                          required
                          disabled={loading}
                          placeholder="••••••••"
                          size="sm"
                          wrapperClassName="animate-fade-in-up animation-delay-2200"
                          label="Mot de passe"
                          labelClassName="text-[10px] sm:text-xs font-medium text-[var(--color-cream)] mb-1"
                          className="bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 font-light placeholder:text-[var(--color-cream)]/40 px-2 sm:px-3 py-1 sm:py-1.5"
                        />

                        <div className="space-y-1 animate-fade-in-up animation-delay-2400">
                          <Button
                            type="submit"
                            disabled={loading}
                            onClick={handleButtonClick}
                            size="sm"
                            className="w-full text-xs sm:text-sm"
                          >
                            {loading ? 'Connexion...' : 'Se connecter'}
                          </Button>
                          {error && (
                            <div className="bg-red-900/30 border border-red-500/50 rounded p-2 mb-2 mt-2">
                              <p className="text-red-200 text-xs font-light !mb-0">{error}</p>
                            </div>
                          )}

                          <p className="text-center text-[var(--color-cream)]/80 font-light text-[9px] sm:text-[10px] md:text-[11px] mt-2">
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
