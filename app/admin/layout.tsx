import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin - Studio UB",
  description: "Back-office Studio UB",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.first_name || 'Admin';

  return (
    <div className="min-h-screen bg-[var(--color-dark)] grain-texture">
      {/* Admin Navigation */}
      <nav className="bg-[var(--color-pine)]/95 backdrop-blur-sm border-b border-[var(--color-cream)]/10 relative z-10 shadow-lg">
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
                    className="relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group"
                  >
                    Dashboard
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/admin/portfolio"
                    className="relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group"
                  >
                    Portfolio
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/admin/accounts"
                    className="relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group"
                  >
                    Comptes
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="hidden sm:inline text-[var(--color-cream)] font-semibold text-base">
                    {firstName}
                  </span>
                  <form action="/api/auth/sign-out" method="post">
                    <button
                      type="submit"
                      className="group flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cream)]/10 hover:bg-[var(--color-cream)]/20 text-[var(--color-cream)] font-semibold text-base rounded-xl border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 transition-all duration-200"
                    >
                      Déconnexion
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
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

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
