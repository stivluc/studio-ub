import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PasswordChangeForm from "@/components/admin/PasswordChangeForm";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-cream)] mb-8">
        Paramètres
      </h1>

      <div className="space-y-8">
        {/* Informations du compte */}
        <section className="bg-[var(--color-pine)]/30 rounded-lg p-6 border border-[var(--color-cream)]/10">
          <h2 className="text-xl font-semibold text-[var(--color-cream)] mb-4">
            Informations du compte
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-cream)]/70 text-sm">
                Email
              </label>
              <p className="text-[var(--color-cream)] font-medium">
                {user.email}
              </p>
            </div>
            <div>
              <label className="text-[var(--color-cream)]/70 text-sm">
                ID Utilisateur
              </label>
              <p className="text-[var(--color-cream)]/50 text-sm font-mono">
                {user.id}
              </p>
            </div>
            <div>
              <label className="text-[var(--color-cream)]/70 text-sm">
                Dernière connexion
              </label>
              <p className="text-[var(--color-cream)]/70 text-sm">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("fr-FR")
                  : "Inconnue"}
              </p>
            </div>
          </div>
        </section>

        {/* Changement de mot de passe */}
        <section className="bg-[var(--color-pine)]/30 rounded-lg p-6 border border-[var(--color-cream)]/10">
          <h2 className="text-xl font-semibold text-[var(--color-cream)] mb-4">
            Changer le mot de passe
          </h2>
          <PasswordChangeForm />
        </section>

        {/* Informations du site */}
        <section className="bg-[var(--color-pine)]/30 rounded-lg p-6 border border-[var(--color-cream)]/10">
          <h2 className="text-xl font-semibold text-[var(--color-cream)] mb-4">
            Informations du site
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-cream)]/70 text-sm">
                Version Next.js
              </label>
              <p className="text-[var(--color-cream)] font-medium">
                {process.version}
              </p>
            </div>
            <div>
              <label className="text-[var(--color-cream)]/70 text-sm">
                Environnement
              </label>
              <p className="text-[var(--color-cream)] font-medium">
                {process.env.NODE_ENV}
              </p>
            </div>
          </div>
        </section>

        {/* Actions dangereuses */}
        <section className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
          <h2 className="text-xl font-semibold text-red-400 mb-4">
            Zone de danger
          </h2>
          <p className="text-[var(--color-cream)]/70 text-sm mb-4">
            Ces actions sont irréversibles. Soyez prudent.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[var(--color-dark)]/50 rounded-lg">
              <div>
                <h3 className="text-[var(--color-cream)] font-medium">
                  Supprimer tous les projets
                </h3>
                <p className="text-[var(--color-cream)]/50 text-sm">
                  Supprime définitivement tous les projets et leurs images
                </p>
              </div>
              <button
                disabled
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed"
              >
                Désactivé
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
