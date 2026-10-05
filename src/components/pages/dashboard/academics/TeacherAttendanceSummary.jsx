"use client";

import { useState, useEffect } from "react";
import { Loader2, ClipboardCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function AttendanceSummary() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getMyTodaySummaries()
      .then((res) => {
        if (!cancelled) setSummaries(res.data?.summaries || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load attendance summary.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="stat-icon-box stat-icon-violet">
          <ClipboardCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Today's Attendance</h3>
          <p className="text-xs text-slate-400">Across your assigned sections</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-4">{error}</p>
      ) : summaries.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">No sections assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {summaries.map((s) => {
            const pct = s.total ? Math.round((s.present / s.total) * 100) : 0;
            const isLow = pct < 75;
            return (
              <div key={s.sectionId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {s.classSection}
                    <span className="text-slate-400 font-medium ml-1.5">· {s.subject}</span>
                  </span>
                  <span className={`font-extrabold ${isLow ? "text-rose-500" : "text-success"}`}>
                    {s.present}/{s.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${isLow ? "bg-rose-500" : "bg-success"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
