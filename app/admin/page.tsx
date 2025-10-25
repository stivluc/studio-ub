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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-[var(--color-cream)]/60 text-lg">
          Gérez le contenu de votre site Studio UB
        </p>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Management */}
        <Link
          href="/admin/portfolio"
          className="relative bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 hover:border-[var(--color-cream)]/30 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[var(--color-cream)]/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="mb-6 inline-block p-3 bg-[var(--color-cream)]/10 rounded-xl group-hover:bg-[var(--color-cream)]/20 transition-colors duration-300">
              <svg
                className="w-10 h-10 text-[var(--color-cream)] group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
              Portfolio
            </h2>
            <p className="text-[var(--color-cream)]/60 leading-relaxed">
              Gérer les projets et images du portfolio
            </p>
          </div>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="relative bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 hover:border-[var(--color-cream)]/30 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[var(--color-cream)]/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="mb-6 inline-block p-3 bg-[var(--color-cream)]/10 rounded-xl group-hover:bg-[var(--color-cream)]/20 transition-colors duration-300">
              <svg
                className="w-10 h-10 text-[var(--color-cream)] group-hover:scale-110 group-hover:rotate-90 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
              Paramètres
            </h2>
            <p className="text-[var(--color-cream)]/60 leading-relaxed">
              Configuration générale du site
            </p>
          </div>
        </Link>

      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Projets
          </p>
          <p className="text-5xl font-bold text-[var(--color-cream)] tracking-tight">
            {projectsCount || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Images
          </p>
          <p className="text-5xl font-bold text-[var(--color-cream)] tracking-tight">
            {imagesCount || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Dernière mise à jour
          </p>
          <p className="text-4xl font-bold text-[var(--color-cream)] tracking-tight">
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
      <div className="mt-12 bg-gradient-to-br from-[var(--color-pine)] to-[var(--color-pine)]/80 border border-[var(--color-cream)]/10 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-cream)]/50 uppercase tracking-wider mb-2">
              Connecté en tant que
            </h3>
            <p className="text-xl text-[var(--color-cream)] font-semibold">
              {user.email}
            </p>
          </div>
          <form action="/api/auth/sign-out" method="post">
            <button
              type="submit"
              className="bg-[var(--color-brown)] text-[var(--color-cream)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-brown)]/90 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
