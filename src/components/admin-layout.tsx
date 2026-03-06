import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AmbientCanvas } from "./editorial-ui";
import { Sidebar } from "./sidebar";

export async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AmbientCanvas>
      <div className="mx-auto min-h-screen w-full max-w-[1520px] px-4 py-4 sm:px-5 lg:px-8 lg:py-6">
        <Sidebar userEmail={user?.email || ""} />
        <main className="mx-auto mt-6 min-w-0 w-full max-w-[1360px] pb-12 sm:mt-7">
          <div className="min-h-[calc(100vh-8rem)]">{children}</div>
        </main>
      </div>
    </AmbientCanvas>
  );
}
