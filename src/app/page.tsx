import { AdminLayout } from "@/components/admin-layout";
import { DashboardCharts } from "@/components/dashboard-charts";
import { FunnyWordBubbles } from "@/components/funny-word-bubbles";
import {
  PageHeader,
  SectionTitle,
  StatusBadge,
  SurfaceCard,
} from "@/components/editorial-ui";
import { formatUtcMonthDay } from "@/lib/date";
import { extractFunnyWords } from "@/lib/funny-words";
import { createSupabaseServerClient } from "@/lib/supabase-server";

async function getStats() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalProfiles },
    { count: totalImages },
    { count: totalCaptions },
    { data: recentCaptions },
    { data: recentImages },
    { data: mostCaptionedImages },
    { data: allCaptions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase
      .from("captions")
      .select("created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
      .limit(50),
    supabase
      .from("images")
      .select("created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
      .limit(50),
    supabase
      .from("captions")
      .select("image_id, images(url, image_description)")
      .not("image_id", "is", null)
      .limit(500),
    supabase
      .from("captions")
      .select("content")
      .order("created_datetime_utc", { ascending: false })
      .limit(1000),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupByDate = (items: any[], field: string) => {
    const groups: Record<string, number> = {};

    items.forEach((item) => {
      const date = formatUtcMonthDay(item[field]);
      groups[date] = (groups[date] || 0) + 1;
    });

    return groups;
  };

  const captionsByDate = groupByDate(recentCaptions || [], "created_datetime_utc");
  const imagesByDate = groupByDate(recentImages || [], "created_datetime_utc");
  const allDates = [
    ...new Set([...Object.keys(captionsByDate), ...Object.keys(imagesByDate)]),
  ]
    .slice(0, 10)
    .reverse();

  const activityData = allDates.map((date) => ({
    date,
    captions: captionsByDate[date] || 0,
    images: imagesByDate[date] || 0,
  }));

  const imageCounts: Record<string, { url: string; desc: string; count: number }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mostCaptionedImages?.forEach((caption: any) => {
    const imageId = caption.image_id;
    if (!imageCounts[imageId]) {
      imageCounts[imageId] = {
        url: caption.images?.url || "",
        desc: caption.images?.image_description || "",
        count: 0,
      };
    }

    imageCounts[imageId].count++;
  });

  const topImages = Object.values(imageCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const funnyWords = extractFunnyWords(
    (allCaptions || []).map((c) => c.content || "")
  );

  return {
    totalProfiles: totalProfiles || 0,
    totalImages: totalImages || 0,
    totalCaptions: totalCaptions || 0,
    activityData,
    topImages,
    funnyWords,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader title="Dashboard" />

        <div className="space-y-4">
          <SectionTitle
            label="Captions"
            title="Funny word bubbles"
            detail="Most repeated interesting words across the latest 1,000 captions."
          />
          <FunnyWordBubbles words={stats.funnyWords} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            <SectionTitle
              label="Activity"
              title="Recent volume"
              detail="Latest uploads and caption activity."
            />
            <DashboardCharts activityData={stats.activityData} />
          </div>

          <div>
            <SurfaceCard className="rounded-[1.5rem] px-6 py-6">
              <SectionTitle label="Images" title="Most captioned" />
              <div className="mt-5 space-y-3">
                {stats.topImages.length === 0 ? (
                  <p className="body-copy text-sm">No data yet.</p>
                ) : (
                  stats.topImages.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="soft-panel flex items-center gap-3 rounded-[1.2rem] px-3 py-3"
                    >
                      {image.url ? (
                        // Remote preview URLs come from stored records, so plain img avoids allowlist churn.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.url}
                          alt=""
                          className="h-14 w-14 rounded-[1rem] object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-[1rem] bg-white/50" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm leading-6 text-[var(--ink)]">
                          {image.desc || "Untitled image"}
                        </p>
                      </div>
                      <StatusBadge>{image.count}</StatusBadge>
                    </div>
                  ))
                )}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
