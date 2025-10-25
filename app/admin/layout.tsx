import type { Metadata } from "next";
import Link from "next/link";
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
    <html lang="fr">
      <body className="antialiased bg-[var(--color-dark)]">
        <div className="min-h-screen">
          {/* Admin Navigation */}
          <nav className="bg-[var(--color-pine)] border-b border-[var(--color-cream)]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <Link href="/admin">
                    <h1 className="text-xl font-bold text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 transition-colors">
                      Studio UB Admin
                    </h1>
                  </Link>
                  {user && (
                    <div className="hidden md:flex items-center gap-4">
                      <Link
                        href="/admin/portfolio"
                        className="text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] font-light text-sm transition-colors"
                      >
                        Portfolio
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] font-light text-sm transition-colors"
                      >
                        Paramètres
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <span className="hidden sm:inline text-[var(--color-cream)]/70 font-light text-sm">
                        {user.email}
                      </span>
                      <form action="/api/auth/sign-out" method="post">
                        <button
                          type="submit"
                          className="text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] font-light text-sm transition-colors"
                        >
                          Déconnexion
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link
                      href="/auth/sign-in"
                      className="text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] font-light text-sm transition-colors"
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
      </body>
    </html>
  );
}
