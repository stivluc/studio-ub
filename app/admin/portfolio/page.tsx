import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function PortfolioAdminPage() {
  const supabase = await createClient();

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Récupérer tous les projets avec leurs images
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_images (*)
    `
    )
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-bold text-[var(--color-cream)] mb-3 tracking-tight">
            Gestion du Portfolio
          </h1>
          <p className="text-[var(--color-cream)]/60 text-lg">
            {projects?.length || 0} projet{projects?.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button size="lg">+ Nouveau projet</Button>
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 rounded-2xl border border-[var(--color-cream)]/10 p-16 text-center shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-cream)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[var(--color-cream)]/50"
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
            <h2 className="text-2xl font-bold text-[var(--color-cream)] mb-3">
              Aucun projet pour le moment
            </h2>
            <p className="text-[var(--color-cream)]/60 mb-8">
              Commencez par créer votre premier projet pour le portfolio
            </p>
            <Link href="/admin/portfolio/new">
              <Button size="lg">Créer mon premier projet</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const firstImage = project.project_images?.[0];
            return (
              <Card key={project.id} hover interactive className="overflow-hidden relative">
                <div className="crt-scanlines-hover" style={{ zIndex: 20 }}></div>
                <Link
                  href={`/admin/portfolio/${project.id}`}
                  className="block relative glitch-on-hover"
                >
                  {firstImage ? (
                    <div className="relative h-56 bg-[var(--color-dark)] overflow-hidden">
                      <Image
                        src={firstImage.url}
                        alt={firstImage.alt_text || project.title_fr}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-56 bg-[var(--color-dark)] flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 text-[var(--color-cream)]/20 mx-auto mb-2"
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
                        <span className="text-[var(--color-cream)]/30 text-sm">
                          Pas d&apos;image
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/90">
                    <h3 className="text-2xl font-bold text-[var(--color-cream)] mb-2 tracking-tight group-hover:text-[var(--color-cream)] transition-colors">
                      {project.title_fr}
                    </h3>
                    {project.subtitle_fr && (
                      <p className="text-[var(--color-cream)]/60 text-sm mb-3 line-clamp-2">
                        {project.subtitle_fr}
                      </p>
                    )}
                    {project.date && (
                      <p className="text-[var(--color-cream)]/40 text-xs font-semibold uppercase tracking-wider">
                        {new Date(project.date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
