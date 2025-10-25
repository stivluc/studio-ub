import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import ProfileUpdateForm from "@/components/admin/ProfileUpdateForm";

export default async function AccountsPage() {
  const supabase = await createClient();

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const firstName = user?.user_metadata?.first_name || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
          Gestion du compte
        </h1>
        <p className="text-[var(--color-cream)]/60 text-lg">
          Gérez votre profil administrateur
        </p>
      </div>

      <div className="space-y-6">
        {/* Mon profil */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
              Mon profil
            </h2>
            <ProfileUpdateForm firstName={firstName} />
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
              Changer le mot de passe
            </h2>
            <PasswordChangeForm />
          </CardContent>
        </Card>

        {/* Informations du compte */}
        <Card>
          <CardContent className="p-6 sm:p-8">
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
      </div>
    </div>
  );
}
