import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-cream)]">
          Gestion du Portfolio
        </h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-[var(--color-cream)] text-[var(--color-pine)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-cream)]/90 transition-colors"
        >
          + Nouveau projet
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-cream)]/70 text-lg mb-4">
            Aucun projet pour le moment
          </p>
          <Link
            href="/admin/portfolio/new"
            className="text-[var(--color-cream)] hover:text-[var(--color-cream)]/80 underline"
          >
            Créer votre premier projet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const firstImage = project.project_images?.[0];
            return (
              <Link
                key={project.id}
                href={`/admin/portfolio/${project.id}`}
                className="bg-[var(--color-pine)]/30 rounded-lg overflow-hidden hover:bg-[var(--color-pine)]/50 transition-colors border border-[var(--color-cream)]/10"
              >
                {firstImage ? (
                  <div className="relative h-48 bg-[var(--color-dark)]">
                    <Image
                      src={firstImage.url}
                      alt={firstImage.alt_text || project.title_fr}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-[var(--color-dark)] flex items-center justify-center">
                    <span className="text-[var(--color-cream)]/30 text-sm">
                      Pas d'image
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[var(--color-cream)] mb-2">
                    {project.title_fr}
                  </h3>
                  {project.subtitle_fr && (
                    <p className="text-[var(--color-cream)]/70 text-sm mb-2">
                      {project.subtitle_fr}
                    </p>
                  )}
                  {project.date && (
                    <p className="text-[var(--color-cream)]/50 text-xs">
                      {new Date(project.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
