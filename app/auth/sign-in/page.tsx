'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CRTEffect } from '@/lib/animations';
import { useTVSound } from '@/lib/hooks/useTVSound';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // TV sounds: turn-on at 1500ms, noise loop starts at 1500ms
  useTVSound({
    turnOnDelay: 1500,
    noiseDelay: 1500,
    noiseVolume: 0.3,
    turnOnVolume: 0.5,
  });

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
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-pine)]">
      <div className="w-full max-w-5xl">
        {/* TV Container */}
        <div className="relative">
          {/* Dark background positioned inside the TV screen - BEHIND the TV */}
          <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 z-0">
            {/* Black screen with subtle grain - zooms in from small */}
            <div className="w-[75%] h-[55%] bg-[var(--color-dark)] rounded-sm animate-zoom-in" />

            {/* CRT Effect - fades in after 1 second */}
            <div className="absolute inset-0 flex items-center justify-start pl-[6%] -mt-6 animate-fade-in animation-delay-1500">
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

            {/* Sign-in Form overlaid on TV screen - positioned to the left inside the screen */}
            <div className="absolute inset-0 flex items-center justify-start pl-[20%] pr-[38%] -mt-6 z-20">
              <div className="w-full h-[55%] flex items-center justify-center">
                <div className="w-full space-y-4">
                    {/* Logo/Title - appears after CRT effect (3s) */}
                    <div className="text-center mb-2 animate-fade-in animation-delay-3500">
                      <h1 className="text-2xl font-bold text-[var(--color-cream)]">
                        Studio UB Admin
                      </h1>
                    </div>

                  {/* Form */}
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div className="animate-fade-in-up animation-delay-3700">
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
                        required
                        disabled={loading}
                        className="w-full px-3 py-1.5 text-sm bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 rounded text-[var(--color-cream)] placeholder-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)] disabled:opacity-50 font-light"
                        placeholder="admin@studioub.ch"
                      />
                    </div>

                    <div className="animate-fade-in-up animation-delay-3900">
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
                        required
                        disabled={loading}
                        className="w-full px-3 py-1.5 text-sm bg-[var(--color-pine)]/80 border border-[var(--color-cream)]/30 rounded text-[var(--color-cream)] placeholder-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)] disabled:opacity-50 font-light"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1 animate-fade-in-up animation-delay-4000">
                      <button
                        type="submit"
                        disabled={loading}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
