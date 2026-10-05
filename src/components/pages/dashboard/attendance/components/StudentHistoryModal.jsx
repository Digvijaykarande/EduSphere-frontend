"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, XCircle, Clock, HelpCircle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useAttendanceStore } from "@/store/useAttendanceStore";

const STATUS_META = {
  present: {
    label: "Present",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    className:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    dot: "bg-rose-500",
  },
  late: {
    label: "Late",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    dot: "bg-amber-500",
  },
  "not-marked": {
    label: "Not Marked",
    icon: HelpCircle,
    className:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META["not-marked"];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${meta.className}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function ringColor(pct) {
  if (pct >= 90) return "#10b981"; // emerald-500
  if (pct >= 75) return "#f59e0b"; // amber-500
  return "#f43f5e"; // rose-500
}

/**
 * Full attendance record history for one student, in a modal. Used by
 * Principal (any student), Teacher (their assigned students), and
 * implicitly mirrored by the Student self-view (which uses studentHistory
 * from /attendance/mine directly instead of this fetch-by-slug path).
 */
export default function StudentHistoryModal({ slug, onClose }) {
  const history = useAttendanceStore((s) => s.selectedStudentHistory);
  const isLoading = useAttendanceStore((s) => s.isLoadingSelectedStudentHistory);
  const fetchStudentHistory = useAttendanceStore((s) => s.fetchStudentHistory);
  const clearSelectedStudentHistory = useAttendanceStore((s) => s.clearSelectedStudentHistory);

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (slug) fetchStudentHistory(slug);
    return () => clearSelectedStudentHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!slug) return null;

  const records = history?.records || [];
  const totalPages = Math.ceil(records.length / perPage) || 1;
  const paginated = records.slice((page - 1) * perPage, page * perPage);
  const stats = history?.stats;

  const pct = stats?.attendancePct ?? 0;
  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-white to-white dark:from-indigo-500/10 dark:via-slate-900 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {history?.student ? initials(history.student.name) : "…"}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {history?.student ? history.student.name : "Loading…"}
              </h3>
              {history?.student && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Roll No: {history.student.rollNumber}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-5 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-slate-100 dark:stroke-slate-800" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  stroke={ringColor(pct)}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.4s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800 dark:text-slate-100">
                {pct}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              {[
                { label: "Present", value: stats.present, meta: STATUS_META.present },
                { label: "Absent", value: stats.absent, meta: STATUS_META.absent },
                { label: "Late", value: stats.late, meta: STATUS_META.late },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.meta.dot}`} />
                  <div>
                    <p className="text-base font-black text-slate-800 dark:text-slate-100 leading-none">{s.value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Records */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading attendance history…</div>
          ) : records.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
              <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-400">No attendance records found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] sticky top-0 backdrop-blur">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Period</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {paginated.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-5 font-semibold">{formatDate(r.date)}</td>
                    <td className="py-2.5 px-3">{r.subject}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.period}</td>
                    <td className="py-2.5 px-5 text-right">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {records.length > perPage && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{(page - 1) * perPage + 1}
              –{Math.min(page * perPage, records.length)}</span> of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">{records.length}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1.5 tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}