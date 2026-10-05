"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}