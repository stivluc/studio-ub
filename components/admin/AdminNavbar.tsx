'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fadeOutAudio } from '@/lib/utils/audioFade';

type AdminNavbarProps = {
  user: {
    user_metadata?: {
      first_name?: string;
    };
  } | null;
  firstName: string;
};

export default function AdminNavbar({ user, firstName }: AdminNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const signOutFormRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `sticky top-0 z-40 border-b border-[var(--color-cream)]/10 backdrop-blur-md transition-all duration-300 ${
    scrolled ? 'bg-[var(--color-dark)]/70 shadow-lg' : 'bg-[var(--color-dark)]/90 shadow-md'
  }`;

  const handleSignOutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      return;
    }

    event.preventDefault();
    submittingRef.current = true;

    const audio = document.getElementById('admin-music-audio') as HTMLAudioElement | null;
    if (audio && !audio.paused) {
      fadeOutAudio(audio, 700);
      window.setTimeout(() => {
        signOutFormRef.current?.submit();
      }, 720);
    } else {
      signOutFormRef.current?.submit();
    }
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center group">
              <Image
                src="/images/logos/logo-beige.png"
                alt="Studio UB"
                width={55}
                height={55}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/admin"
                  className="relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group glitch-on-hover"
                >
                  <span className="glitch-on-hover-subtle">Dashboard</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/admin/portfolio"
                  className="relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group glitch-on-hover"
                >
                  <span className="glitch-on-hover-subtle">Portfolio</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/admin/account"
                  className="hidden sm:inline relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group glitch-on-hover"
                >
                  <span className="glitch-on-hover-subtle">{firstName}</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <form ref={signOutFormRef} action="/api/auth/sign-out" method="post" onSubmit={handleSignOutSubmit}>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[var(--color-brown)] hover:bg-[var(--color-brown)]/80 text-[var(--color-cream)] font-semibold text-base rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <span className="glitch-on-hover-subtle">Déconnexion</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="px-5 py-2.5 bg-[var(--color-cream)]/10 hover:bg-[var(--color-cream)]/20 text-[var(--color-cream)] font-semibold text-base rounded-xl border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 transition-all duration-200"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
