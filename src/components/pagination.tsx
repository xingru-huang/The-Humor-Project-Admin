"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-faint)]">
        {(currentPage - 1) * pageSize + 1}
        &ndash;
        {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-white/72 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="min-w-[6.5rem] text-center text-xs font-medium uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-white/72 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
