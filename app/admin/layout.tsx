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

      {/* Spacer for fixed navbar */}
      <div className="h-20 sm:h-24" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 5rem)' }} />

      {/* Main Content */}
      <main className="relative z-0">{children}</main>
    </div>
  );
}
