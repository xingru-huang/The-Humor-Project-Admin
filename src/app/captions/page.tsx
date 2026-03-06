import { AdminLayout } from "@/components/admin-layout";
import { BooleanBadge, PageHeader, SurfaceCard } from "@/components/editorial-ui";
import { Pagination } from "@/components/pagination";
import { formatUtcDate } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Caption = Record<string, any>;

const PAGE_SIZE = 20;

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageStr || "1", 10));

  const supabase = await createSupabaseServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ count }, { data: captions, error }] = await Promise.all([
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase
      .from("captions")
      .select(
        "id, created_datetime_utc, content, is_public, is_featured, like_count, profiles(first_name, last_name), images(url)"
      )
      .order("created_datetime_utc", { ascending: false })
      .range(from, to),
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Captions"
          meta={`${(count || 0).toLocaleString()} total`}
        />

        {error ? (
          <div className="alert-error">
            Error loading captions: {error.message}
          </div>
        ) : null}

        <SurfaceCard className="table-card">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[980px]">
              <thead>
                <tr className="text-left">
                  {["Content", "Author", "Created", "Likes", "Public", "Featured"].map(
                    (label, index) => (
                      <th
                        key={label}
                        className={`${
                          index >= 3 ? "text-center" : label === "Content" ? "w-[42%]" : ""
                        }`}
                      >
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {(captions || []).map((caption: Caption) => (
                  <tr key={caption.id}>
                    <td>
                      <p className="line-clamp-2 leading-7 text-[var(--ink)]">
                        {caption.content}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-[var(--ink-soft)]">
                      {caption.profiles
                        ? `${caption.profiles.first_name || ""} ${caption.profiles.last_name || ""}`.trim()
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap text-[var(--ink-soft)]">
                      {formatUtcDate(caption.created_datetime_utc)}
                    </td>
                    <td className="text-center text-[var(--ink-soft)] tabular-nums">
                      {caption.like_count ?? 0}
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={caption.is_public} />
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={caption.is_featured} />
                    </td>
                  </tr>
                ))}
                {(!captions || captions.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-14 text-center text-sm text-[var(--ink-soft)]"
                    >
                      No captions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <Pagination
          currentPage={page}
          totalCount={count || 0}
          pageSize={PAGE_SIZE}
        />
      </div>
    </AdminLayout>
  );
}
