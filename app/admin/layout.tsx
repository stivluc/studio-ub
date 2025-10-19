import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin - Studio UB",
  description: "Back-office Studio UB",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[var(--color-dark)]">
        <div className="min-h-screen">
          {/* Admin Navigation */}
          <nav className="bg-[var(--color-pine)] border-b border-[var(--color-cream)]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-[var(--color-cream)]">
                    Studio UB Admin
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[var(--color-cream)]/70 font-light text-sm">
                    Admin Panel
                  </span>
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
