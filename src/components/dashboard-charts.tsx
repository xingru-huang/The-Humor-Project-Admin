"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityDataPoint {
  date: string;
  captions: number;
  images: number;
}

export function DashboardCharts({
  activityData,
}: {
  activityData: ActivityDataPoint[];
}) {
  if (activityData.length === 0) {
    return (
      <div className="shell-panel rounded-[1.5rem] p-6">
        <p className="body-copy text-sm">No activity data yet.</p>
      </div>
    );
  }

  return (
    <div className="shell-panel rounded-[1.5rem] p-6">
      <div className="mb-6 flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#4f769a]" />
          <span className="text-xs text-[var(--ink-soft)]">Captions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#b8d1e6]" />
          <span className="text-xs text-[var(--ink-soft)]">Images</span>
        </div>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData} barGap={2}>
            <XAxis
              dataKey="date"
              stroke="#9bb1c3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9bb1c3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(76,111,142,0.12)",
                borderRadius: "14px",
                fontSize: "12px",
                boxShadow: "0 16px 36px rgba(77,114,147,0.12)",
              }}
            />
            <Bar
              dataKey="captions"
              fill="#4f769a"
              radius={[6, 6, 0, 0]}
              name="Captions"
            />
            <Bar
              dataKey="images"
              fill="#b8d1e6"
              radius={[6, 6, 0, 0]}
              name="Images"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
