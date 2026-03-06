"use client";

import type { FunnyWord } from "@/lib/funny-words";

const BUBBLE_COLORS = [
  { bg: "rgba(79, 118, 154, 0.12)", border: "rgba(79, 118, 154, 0.22)", text: "#385a79" },
  { bg: "rgba(168, 204, 168, 0.18)", border: "rgba(136, 178, 136, 0.28)", text: "#4a7a4a" },
  { bg: "rgba(200, 170, 210, 0.16)", border: "rgba(180, 150, 195, 0.26)", text: "#6e4a80" },
  { bg: "rgba(230, 190, 138, 0.18)", border: "rgba(210, 170, 118, 0.28)", text: "#8a6530" },
  { bg: "rgba(170, 200, 225, 0.20)", border: "rgba(140, 175, 210, 0.28)", text: "#3a6a8a" },
  { bg: "rgba(225, 165, 165, 0.16)", border: "rgba(210, 140, 140, 0.26)", text: "#8a4040" },
];

export function FunnyWordBubbles({ words }: { words: FunnyWord[] }) {
  if (words.length === 0) {
    return (
      <div className="shell-panel rounded-[1.5rem] p-6">
        <p className="body-copy text-sm">No caption data yet.</p>
      </div>
    );
  }

  const maxCount = words[0].count;
  const minCount = words[words.length - 1].count;
  const range = maxCount - minCount || 1;

  return (
    <div className="shell-panel rounded-[1.5rem] px-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5 py-4">
        {words.map((item, i) => {
          const t = (item.count - minCount) / range;
          const size = 0.7 + t * 0.7;
          const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
          const delay = (i * 0.12).toFixed(2);
          const duration = (3.5 + (i % 5) * 0.8).toFixed(1);

          return (
            <span
              key={item.word}
              className="bubble-float inline-flex cursor-default items-center rounded-full transition-transform duration-200 hover:scale-110"
              style={{
                fontSize: `${size}rem`,
                padding: `${0.35 + t * 0.25}rem ${0.65 + t * 0.4}rem`,
                background: color.bg,
                border: `1px solid ${color.border}`,
                color: color.text,
                fontWeight: t > 0.5 ? 600 : 500,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: 0.65 + t * 0.35,
              }}
              title={`${item.count} times`}
            >
              {item.word}
              {t > 0.3 && (
                <span
                  className="ml-1.5 text-[0.65em] opacity-50"
                  style={{ fontWeight: 400 }}
                >
                  {item.count}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
