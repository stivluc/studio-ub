'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fadeOutAudio } from '@/lib/utils/audioFade';

type AdminNavbarProps = {
  user: {
    user_metadata?: {
      first_name?: string;
    };
  } | null;
};

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const audio = document.getElementById('admin-music-audio') as HTMLAudioElement | null;
    const form = event.currentTarget;

    const submitForm = () => {
      closeMobileMenu();
      form.submit();
    };

    if (audio && !audio.paused) {
      fadeOutAudio(audio, 1100);
      window.setTimeout(submitForm, 1150);
    } else {
      submitForm();
    }
  };

  const navBg = scrolled ? 'bg-[var(--color-dark)]/75' : 'bg-[var(--color-dark)]/95';
  const navShadow = scrolled ? 'shadow-lg' : 'shadow-md';

  const NavLink = ({ href, label, className = '' }: { href: string; label: string; className?: string }) => (
    <Link
      href={href}
      onClick={closeMobileMenu}
      className={`relative group glitch-on-hover block md:inline-block text-[var(--color-cream)] font-semibold text-lg py-2 md:py-0 ${className}`}
    >
      <span className="glitch-on-hover-subtle">{label}</span>
      <span className="hidden md:block absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  const DesktopLinks = () => (
    <div className="hidden md:flex items-center gap-8">
      <NavLink href="/admin" label="Dashboard" />
      <NavLink href="/admin/portfolio" label="Portfolio" />
    </div>
  );

  const MobileLinks = () => (
    <div className="space-y-4">
      <NavLink href="/admin" label="Dashboard" />
      <NavLink href="/admin/portfolio" label="Portfolio" />
      <NavLink href="/admin/account" label="Compte" />
    </div>
  );

  return (
    <div className="h-0">
      {/* Safe area top fill - extends navbar background into notch area */}
      <div
        className={`fixed top-0 left-0 right-0 transition-colors duration-300 ${navBg}`}
        style={{
          height: 'env(safe-area-inset-top, 0px)',
          zIndex: 50,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-40 border-b border-[var(--color-cream)]/10 backdrop-blur-md transition-all duration-300 ${navBg} ${navShadow}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/admin" className="flex items-center group" aria-label="Tableau de bord">
              <Image
                src="/images/logos/logo-beige.png"
                alt="Studio UB"
                width={44}
                height={44}
                className="rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            {user && <DesktopLinks />}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <>
                <NavLink href="/admin/account" label="Compte" className="hidden sm:block" />
                <form
                  action="/api/auth/sign-out"
                  method="post"
                  onSubmit={handleSignOutSubmit}
                  className="hidden sm:block"
                >
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[var(--color-brown)] hover:bg-[var(--color-brown)]/80 text-[var(--color-cream)] font-semibold text-base rounded-xl transition-all duration-200 cursor-pointer glitch-on-hover"
                  >
                    <span className="glitch-on-hover-subtle">Déconnexion</span>
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="sm:hidden inline-flex items-center justify-center rounded-xl border border-[var(--color-cream)]/30 text-[var(--color-cream)] px-3 py-2 transition-colors duration-200 hover:bg-[var(--color-cream)]/10"
                  aria-label="Ouvrir le menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>
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

        {user && (
          <div
            className={`sm:hidden overflow-hidden transition-[max-height] duration-300 border-t border-[var(--color-cream)]/10 ${
              mobileMenuOpen ? 'max-h-80 mt-2' : 'max-h-0'
            }`}
          >
            <div className="py-4 space-y-4">
              <MobileLinks />
              <form action="/api/auth/sign-out" method="post" onSubmit={handleSignOutSubmit}>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[var(--color-brown)] hover:bg-[var(--color-brown)]/80 text-[var(--color-cream)] font-semibold text-base rounded-xl transition-all duration-200 cursor-pointer glitch-on-hover"
                >
                  <span className="glitch-on-hover-subtle">Déconnexion</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
    </div>
  );
}
