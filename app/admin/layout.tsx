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

  return (
    <div className="min-h-screen bg-[var(--color-dark)]">
      {/* Admin Navigation */}
      <nav className="bg-[var(--color-pine)] border-b border-[var(--color-cream)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center">
                <Image
                  src="/images/logos/logo-beige.png"
                  alt="Studio UB"
                  width={50}
                  height={50}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              {user && (
                <div className="hidden md:flex items-center gap-6">
                  <Link
                    href="/admin/portfolio"
                    className="text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 font-medium text-lg transition-colors"
                  >
                    Portfolio
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 font-medium text-lg transition-colors"
                  >
                    Paramètres
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <span className="hidden sm:inline text-[var(--color-cream)]/80 font-light text-base">
                    {user.email}
                  </span>
                  <form action="/api/auth/sign-out" method="post">
                    <button
                      type="submit"
                      className="text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 font-medium text-base transition-colors"
                    >
                      Déconnexion
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 font-medium text-base transition-colors"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
