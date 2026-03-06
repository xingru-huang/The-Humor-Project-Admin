import { AdminLayout } from "@/components/admin-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ImagesClient } from "@/components/images-client";

const PAGE_SIZE = 20;

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));

  const supabase = await createSupabaseServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ count }, { data: images, error }] = await Promise.all([
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase
      .from("images")
      .select(
        "id, created_datetime_utc, modified_datetime_utc, url, is_common_use, is_public, image_description, celebrity_recognition, profiles(first_name, last_name)"
      )
      .order("created_datetime_utc", { ascending: false })
      .range(from, to),
  ]);

  return (
    <AdminLayout>
      <ImagesClient
        initialImages={images || []}
        error={error?.message}
        currentPage={page}
        totalCount={count || 0}
        pageSize={PAGE_SIZE}
      />
    </AdminLayout>
  );
}
