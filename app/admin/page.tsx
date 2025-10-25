import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";

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

  let storageUsagePercentage: number | null = null;
  try {
    const { data, error } = await supabaseService.rpc('storage_usage_bytes');
    if (error) {
      throw error;
    }

    const bytesUsed = typeof data === 'number' ? data : 0;
    const freePlanLimit = 500 * 1024 * 1024; // 500 MB
    storageUsagePercentage = Math.min(100, (bytesUsed / freePlanLimit) * 100);
  } catch (error) {
    console.error('Unable to fetch storage usage:', error);
  }

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
        <Link href="/admin/portfolio" className="block">
          <Card hover interactive className="p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="crt-scanlines-hover"></div>
            <div className="relative z-10 glitch-on-hover">
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
          </Card>
        </Link>

        {/* Account */}
        <Link href="/admin/account" className="block">
          <Card hover interactive className="p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="crt-scanlines-hover"></div>
            <div className="relative z-10 glitch-on-hover">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
                Compte
              </h2>
              <p className="text-[var(--color-cream)]/60 leading-relaxed">
                Gérer votre profil administrateur
              </p>
            </div>
          </Card>
        </Link>

      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Projets
          </p>
          <p className="text-5xl font-bold text-[var(--color-cream)] tracking-tight">
            {projectsCount || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Images
          </p>
          <p className="text-5xl font-bold text-[var(--color-cream)] tracking-tight">
            {imagesCount || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 p-8 rounded-2xl border border-[var(--color-cream)]/10 shadow-lg backdrop-blur-sm">
          <p className="text-[var(--color-cream)]/50 font-semibold text-sm uppercase tracking-wider mb-3">
            Dernière mise à jour
          </p>
          <p className="text-4xl font-bold text-[var(--color-cream)] tracking-tight">
            {lastUpdatedProject?.updated_at
              ? (() => {
                  const date = new Date(lastUpdatedProject.updated_at);
                  const formattedDate = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  });
                  const year = String(date.getFullYear()).slice(-2);
                  return `${formattedDate} ${year}`;
                })()
              : 'Aucune'}
          </p>
        </div>
      </div>

      {/* Site Info */}
      <div className="mt-12 bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 border border-[var(--color-cream)]/10 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-6 tracking-tight">
          Informations du site
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
              Version Node.js
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

        <div className="mt-6">
          <label className="text-[var(--color-cream)]/50 text-sm font-semibold uppercase tracking-wider">
            Stockage Supabase (500 MB)
          </label>
          {storageUsagePercentage !== null ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[var(--color-cream)]/70 text-xs">
                <span>{storageUsagePercentage.toFixed(1)}%</span>
                <span>{((storageUsagePercentage / 100) * 500).toFixed(1)} MB / 500 MB</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-cream)]/10 overflow-hidden">
                <div
                  className="h-full bg-[var(--color-cream)] transition-all duration-500"
                  style={{ width: `${storageUsagePercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-[var(--color-cream)]/50 text-sm mt-2">
              Usage non disponible pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
