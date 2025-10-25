import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import { Card, CardContent } from "@/components/ui/Card";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
          Paramètres
        </h1>
        <p className="text-[var(--color-cream)]/60 text-lg">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="space-y-6">
        {/* Informations du compte */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
              Informations du compte
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
                  Email
                </label>
                <p className="text-[var(--color-cream)] font-semibold text-lg mt-1">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
                  ID Utilisateur
                </label>
                <p className="text-[var(--color-cream)]/60 text-sm font-mono mt-1">
                  {user.id}
                </p>
              </div>
              <div>
                <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
                  Dernière connexion
                </label>
                <p className="text-[var(--color-cream)]/60 text-sm mt-1">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString("fr-FR")
                    : "Inconnue"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
              Changer le mot de passe
            </h2>
            <PasswordChangeForm />
          </CardContent>
        </Card>

        {/* Informations du site */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
              Informations du site
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
                  Version Next.js
                </label>
                <p className="text-[var(--color-cream)] font-semibold text-lg mt-1">
                  {process.version}
                </p>
              </div>
              <div>
                <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
                  Environnement
                </label>
                <p className="text-[var(--color-cream)] font-semibold text-lg mt-1">
                  {process.env.NODE_ENV}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions dangereuses */}
        <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5">
          <CardContent>
            <h2 className="text-2xl font-bold text-red-400 mb-3 tracking-tight">
              Zone de danger
            </h2>
            <p className="text-[var(--color-cream)]/60 mb-6">
              Ces actions sont irréversibles. Soyez prudent.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-6 bg-[var(--color-dark)]/50 rounded-xl border border-red-500/20">
                <div>
                  <h3 className="text-[var(--color-cream)] font-semibold mb-1">
                    Supprimer tous les projets
                  </h3>
                  <p className="text-[var(--color-cream)]/50 text-sm">
                    Supprime définitivement tous les projets et leurs images
                  </p>
                </div>
                <button
                  disabled
                  className="bg-red-500/20 text-red-400 px-6 py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed border border-red-500/30"
                >
                  Désactivé
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
