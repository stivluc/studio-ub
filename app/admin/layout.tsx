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
    <div className="min-h-screen bg-[var(--color-pine)] grain-texture">
      {/* Admin Navigation */}
      <nav className="bg-[var(--color-dark)]/95 backdrop-blur-sm border-b border-[var(--color-cream)]/10 relative z-10 shadow-lg">
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
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    href="/admin/account"
                    className="hidden sm:inline relative text-[var(--color-cream)] hover:text-[var(--color-cream)] font-bold text-lg transition-colors group"
                  >
                    {firstName}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[var(--color-cream)] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <form action="/api/auth/sign-out" method="post">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[var(--color-brown)] hover:bg-[var(--color-brown)]/80 text-[var(--color-cream)] font-semibold text-base rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      Déconnexion
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
