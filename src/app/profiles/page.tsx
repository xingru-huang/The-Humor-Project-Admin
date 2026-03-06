import { AdminLayout } from "@/components/admin-layout";
import { BooleanBadge, PageHeader, SurfaceCard } from "@/components/editorial-ui";
import { Pagination } from "@/components/pagination";
import { formatUtcDate } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface Profile {
  id: string;
  created_datetime_utc: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_superadmin: boolean;
  is_in_study: boolean;
  is_matrix_admin: boolean;
}

const PAGE_SIZE = 20;

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageStr || "1", 10));

  const supabase = await createSupabaseServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ count }, { data: profiles, error }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select(
        "id, created_datetime_utc, first_name, last_name, email, is_superadmin, is_in_study, is_matrix_admin"
      )
      .order("created_datetime_utc", { ascending: false })
      .range(from, to),
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Profiles"
          meta={`${(count || 0).toLocaleString()} total`}
        />

        {error ? (
          <div className="alert-error">
            Error loading profiles: {error.message}
          </div>
        ) : null}

        <SurfaceCard className="table-card">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[920px]">
              <thead>
                <tr className="text-left">
                  {["Name", "Email", "Joined", "Superadmin", "In Study", "Matrix Admin"].map(
                    (label, index) => (
                      <th key={label} className={index >= 3 ? "text-center" : ""}>
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {(profiles || []).map((profile: Profile) => (
                  <tr key={profile.id}>
                    <td className="text-[var(--ink)]">
                      {`${profile.first_name || ""} ${profile.last_name || ""}`.trim() || (
                        <span className="text-[var(--ink-faint)]">No name</span>
                      )}
                    </td>
                    <td className="text-[var(--ink-soft)]">{profile.email || "-"}</td>
                    <td className="text-[var(--ink-soft)]">
                      {formatUtcDate(profile.created_datetime_utc)}
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={profile.is_superadmin} />
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={profile.is_in_study} />
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={profile.is_matrix_admin} />
                    </td>
                  </tr>
                ))}
                {(!profiles || profiles.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-14 text-center text-sm text-[var(--ink-soft)]"
                    >
                      No profiles found.
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
