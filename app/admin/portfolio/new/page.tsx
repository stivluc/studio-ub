import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { Card, CardContent } from "@/components/ui/Card";

export default async function NewProjectPage() {
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
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-cream)] mb-8">
        Nouveau projet
      </h1>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
