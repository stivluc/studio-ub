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
    <div className="bg-[var(--color-dark)] min-h-screen">
      {children}
    </div>
  );
}
