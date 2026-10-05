"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const CATEGORY_COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  late: "#f59e0b",
  "not-marked": "#cbd5e1",
};
const CATEGORY_LABELS = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  "not-marked": "Not Marked",
};

export default function AttendanceSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getMyAttendance()
      .then((res) => {
        if (!cancelled) setStats(res.data?.stats || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load attendance.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-card p-6 flex items-center justify-center gap-2 text-sm text-slate-400 min-h-[200px]">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-bold text-foreground tracking-tight mb-4">Attendance Summary</h3>
        <p className="text-sm text-rose-500">{error || "No attendance data yet."}</p>
      </div>
    );
  }

  const records = ["present", "absent", "late", "not-marked"]
    .map((key) => ({
      category: CATEGORY_LABELS[key],
      count: stats[key] || 0,
      percentage: stats.total ? Math.round(((stats[key] || 0) / stats.total) * 100) : 0,
      color: CATEGORY_COLORS[key],
    }))
    .filter((r) => r.count > 0);

  let cursor = 0;
  const conicStops = records
    .map((r) => {
      const start = cursor;
      cursor += r.percentage;
      return `${r.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="dashboard-card p-6 h-fit flex flex-col justify-between">
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-4">Attendance Summary</h3>

      <div className="relative flex items-center justify-center my-4">
        <div
          className="w-[180px] h-[180px] rounded-full flex items-center justify-center"
          style={{ background: conicStops ? `conic-gradient(${conicStops})` : "hsl(var(--muted))" }}
        >
          <div className="w-[144px] h-[144px] rounded-full bg-card flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">{stats.attendancePct}%</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {records.length === 0 && <p className="text-xs text-slate-400 text-center">No records yet.</p>}
        {records.map((rec) => (
          <div key={rec.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rec.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-300">{rec.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground">{rec.count}</span>
              <span className="text-slate-400 font-normal min-w-[32px] text-right">{rec.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
