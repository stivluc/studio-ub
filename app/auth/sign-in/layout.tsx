import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - Studio UB Admin",
  description: "Connexion au back-office Studio UB",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[var(--color-dark)]">
        {children}
      </body>
    </html>
  );
}
