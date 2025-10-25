import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Récupérer les statistiques
  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: imagesCount } = await supabase
    .from("project_images")
    .select("*", { count: "exact", head: true });

  const { data: lastUpdatedProject } = await supabase
    .from("projects")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-cream)] mb-2">
          Tableau de bord
        </h1>
        <p className="text-[var(--color-cream)]/70">
          Gérez le contenu de votre site Studio UB
        </p>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Management */}
        <Link
          href="/admin/portfolio"
          className="bg-[var(--color-pine)] p-6 rounded-lg border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 transition-all group"
        >
          <div className="mb-4">
            <svg
              className="w-12 h-12 text-[var(--color-cream)] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-cream)] mb-2">
            Portfolio
          </h2>
          <p className="text-[var(--color-cream)]/70">
            Gérer les projets et images du portfolio
          </p>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="bg-[var(--color-pine)] p-6 rounded-lg border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 transition-all group"
        >
          <div className="mb-4">
            <svg
              className="w-12 h-12 text-[var(--color-cream)] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-cream)] mb-2">
            Paramètres
          </h2>
          <p className="text-[var(--color-cream)]/70">
            Configuration générale du site
          </p>
        </Link>

      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-pine)] p-6 rounded-lg border border-[var(--color-cream)]/20">
          <p className="text-[var(--color-cream)]/70 font-medium mb-1">
            Projets
          </p>
          <p className="text-3xl font-bold text-[var(--color-cream)]">
            {projectsCount || 0}
          </p>
        </div>
        <div className="bg-[var(--color-pine)] p-6 rounded-lg border border-[var(--color-cream)]/20">
          <p className="text-[var(--color-cream)]/70 font-medium mb-1">
            Images
          </p>
          <p className="text-3xl font-bold text-[var(--color-cream)]">
            {imagesCount || 0}
          </p>
        </div>
        <div className="bg-[var(--color-pine)] p-6 rounded-lg border border-[var(--color-cream)]/20">
          <p className="text-[var(--color-cream)]/70 font-medium mb-1">
            Dernière mise à jour
          </p>
          <p className="text-3xl font-bold text-[var(--color-cream)]">
            {lastUpdatedProject?.updated_at
              ? new Date(lastUpdatedProject.updated_at).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )
              : "Aucune"}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-12 bg-[var(--color-pine)] border border-[var(--color-cream)]/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-cream)] mb-1">
              Connecté en tant que
            </h3>
            <p className="text-[var(--color-cream)]/80 font-medium">
              {user.email}
            </p>
          </div>
          <form action="/api/auth/sign-out" method="post">
            <button
              type="submit"
              className="bg-[var(--color-brown)] text-[var(--color-cream)] px-4 py-2 rounded font-medium hover:bg-[var(--color-brown)]/80 transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
