"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Generic "give me N items at a time" hook for any card with a list body.
// Resets to page 0 automatically if the underlying list shrinks below the
// current page (e.g. after a refetch). Moved here verbatim from
// dashboardpage/SharedUI.jsx so any module can paginate a small list the
// same way.
export function usePagedItems(items = [], pageSize = 3) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const pageItems = useMemo(
    () => items.slice(page * pageSize, page * pageSize + pageSize),
    [items, page, pageSize]
  );

  return {
    page,
    pageCount,
    pageItems,
    next: () => setPage((p) => Math.min(pageCount - 1, p + 1)),
    prev: () => setPage((p) => Math.max(0, p - 1)),
    setPage,
  };
}

// Compact modern pager: two small icon buttons flanking a row of dots.
// Renders nothing when there's only one page, so cards with short lists
// never show dead controls.
export function CardPagination({ page, pageCount, onPrev, onNext, className = "" }) {
  if (pageCount <= 1) return null;

  return (
    <div
      className={`flex items-center justify-center gap-1.5 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 ${className}`}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 0}
        aria-label="Previous page"
        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft size={13} />
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: pageCount }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === page
                ? "w-4 bg-primary"
                : "w-1.5 bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={page === pageCount - 1}
        aria-label="Next page"
        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

export default CardPagination;
