import type { ReactNode } from "react";

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AmbientCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,255,255,0)_24%,rgba(232,242,250,0.72)_100%)]" />
        <div className="absolute left-[-8rem] top-[-6rem] h-[24rem] w-[24rem] rounded-full bg-white/72 blur-[90px]" />
        <div className="absolute right-[4%] top-[0.5rem] h-[18rem] w-[18rem] rounded-full bg-[#d8e9f7]/55 blur-[85px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={joinClasses("shell-panel", className)}>{children}</div>;
}

export function PageHeader({
  title,
  description,
  meta,
  actions,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-[46rem]">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <h1 className="display-title text-[2.7rem] leading-[0.94] md:text-[3.55rem]">
            {title}
          </h1>
          {meta ? (
            <p className="pb-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--ink-faint)]">
              {meta}
            </p>
          ) : null}
        </div>
        {description ? (
          <p className="body-copy mt-2 max-w-2xl text-[15px] leading-7 md:text-[0.98rem]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3 self-start md:self-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

function getToneClass(tone: "neutral" | "sage" | "rose" | "gold") {
  if (tone === "sage") {
    return "border-[#d1e1da] bg-[#f4faf7] text-[#688579]";
  }

  if (tone === "rose") {
    return "border-[#eddfe4] bg-[#fcf7f9] text-[#a0727d]";
  }

  if (tone === "gold") {
    return "border-[#e5dfd1] bg-[#faf7f1] text-[#9a815c]";
  }

  return "border-[rgba(79,118,154,0.14)] bg-[var(--accent-soft)] text-[var(--accent-strong)]";
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "sage" | "rose" | "gold";
}) {
  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        getToneClass(tone)
      )}
    >
      {children}
    </span>
  );
}

export function BooleanBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex min-w-[3.2rem] items-center justify-center rounded-full border border-[rgba(92,128,159,0.14)] bg-[#f3f8fc] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#678095]">
      Yes
    </span>
  ) : (
    <span className="text-[var(--ink-faint)]">-</span>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
}) {
  return (
    <SurfaceCard className="rounded-[1.65rem] px-5 py-6">
      <p className="display-title text-4xl md:text-[3.25rem]">{value}</p>
      <p className="mt-4 text-sm font-medium text-[var(--ink-soft)]">{label}</p>
      {detail ? <p className="body-copy mt-1.5 text-sm leading-6">{detail}</p> : null}
    </SurfaceCard>
  );
}

export function SectionTitle({
  label,
  title,
  detail,
  meta,
}: {
  label?: string;
  title: string;
  detail?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {label ? <p className="section-label mb-2">{label}</p> : null}
        <h2 className="display-title text-3xl md:text-[2.2rem]">{title}</h2>
        {detail ? <p className="body-copy mt-2 text-sm leading-6">{detail}</p> : null}
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </div>
  );
}
