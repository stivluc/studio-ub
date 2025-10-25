import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminMusicPlayer from "@/components/admin/AdminMusicPlayer";
import AdminNavbar from "@/components/admin/AdminNavbar";

export const metadata: Metadata = {
  title: "Admin - Studio UB",
  description: "Back-office Studio UB",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[var(--color-pine)] grain-texture">
      <AdminMusicPlayer />
      <AdminNavbar user={user} />

      {/* Main Content */}
      <main className="relative z-0">{children}</main>
    </div>
  );
}
