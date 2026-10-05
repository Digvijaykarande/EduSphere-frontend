"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useLeaveStore } from "@/store/use-leave-store";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import LeaveApplyForm from "./Leaveapplyform";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  CalendarDays,
  FileText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  XCircle,
  History,
} from "lucide-react";

const RECORD_STATUS_META = {
  present: {
    label: "Present",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    className:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  late: {
    label: "Late",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  "not-marked": {
    label: "Not Marked",
    icon: HelpCircle,
    className:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
};

function RecordStatusPill({ status }) {
  const meta = RECORD_STATUS_META[status] || RECORD_STATUS_META["not-marked"];
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

function formatRecordDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Full attendance record history, styled after FeesTable (StudentAvatar-less
// since this is the student's own single-row-per-period history, not a
// per-student roster).
function AttendanceHistoryTable({ records }) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(records.length / perPage) || 1;
  const paginated = records.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <History size={16} className="text-indigo-500" />
          Attendance History
        </h3>
        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
          {records.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <CalendarDays size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No attendance records yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your attendance history will appear here once classes are marked.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-3">Subject</th>
                <th className="py-4 px-3">Period</th>
                <th className="py-4 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {paginated.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {formatRecordDate(r.date)}
                  </td>
                  <td className="py-3 px-3 text-xs">{r.subject}</td>
                  <td className="py-3 px-3 text-xs text-slate-500">{r.period}</td>
                  <td className="py-3 px-5 text-right">
                    <RecordStatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {records.length > perPage && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 mt-auto">
          <span className="text-xs text-slate-500 font-medium">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, records.length)} of {records.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Accent palette shared with the compact stat-card style used on the
// Principal dashboard — keeps the visual language consistent across roles.
const ACCENTS = {
  indigo: {
    icon: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/15",
    bar: "bg-indigo-500",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    bar: "bg-emerald-500",
  },
  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 dark:bg-rose-500/15",
    bar: "bg-rose-500",
  },
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-500/15",
    bar: "bg-amber-500",
  },
};

export default function StudentAttendanceView() {
  const user = useAuthStore((s) => s.user);
  const myLeaves = useLeaveStore((s) => s.myLeaves);
  const fetchMyLeaves = useLeaveStore((s) => s.fetchMyLeaves);
  const submitLeave = useLeaveStore((s) => s.submitLeave);

  const studentHistory = useAttendanceStore((s) => s.studentHistory);
  const fetchMyAttendance = useAttendanceStore((s) => s.fetchMyAttendance);

  useEffect(() => {
    if (user) {
      fetchMyLeaves();
      fetchMyAttendance();
    }
  }, [user, fetchMyLeaves, fetchMyAttendance]);

  if (!user) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  async function handleSubmitLeave(payload) {
    // LeaveApplyForm calls onSubmit({ name, role, section, from, to, reason })
    // — the store only needs from/to/reason; identity is resolved
    // server-side from the auth cookie.
    await submitLeave(payload);
  }

  const s = studentHistory?.stats;

  // Real stats from /api/attendance/mine (see attendance.service.js ->
  // getMyAttendanceHistory). No fabricated "+2% this month" comparison —
  // there's no prior-period endpoint yet, so trend text stays factual.
  const stats = [
    {
      label: "Overall Attendance",
      value: s ? `${s.attendancePct}%` : "—",
      icon: TrendingUp,
      accent: "indigo",
      trend: s ? `${s.total} periods recorded` : "",
    },
    {
      label: "Days Present",
      value: s ? String(s.present) : "—",
      icon: CheckCircle2,
      accent: "emerald",
      trend: "Consistent",
    },
    {
      label: "Days Absent",
      value: s ? String(s.absent) : "—",
      icon: AlertCircle,
      accent: "rose",
      trend: s && s.absent > 0 ? "Needs attention" : "On track",
    },
    {
      label: "Days Late",
      value: s ? String(s.late) : "—",
      icon: Clock,
      accent: "amber",
      trend: "Mostly on time",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Compact Stats Row — matches PrincipalAttendanceView design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const a = ACCENTS[stat.accent];
          return (
            <div
              key={i}
              className="relative flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl pl-4 pr-3 py-3 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${a.bar}`} />
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${a.iconBg} ${a.icon}`}>
                <stat.icon size={17} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5 truncate">
                  {stat.label}
                </p>
                {stat.trend && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{stat.trend}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full attendance record history — every marked period, paginated */}
      <AttendanceHistoryTable records={studentHistory?.records || []} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="xl:col-span-2 flex flex-col">
          <LeaveApplyForm
            applicantName={user.name}
            applicantMeta={{ role: "Student", section: user.section || "10-A" }}
            submittedTo="your class teacher"
            onSubmit={handleSubmitLeave}
          />
        </div>

        {/* Right Column: Flush SaaS Activity Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <FileText size={16} className="text-indigo-500" />
              Leave History
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {myLeaves.length} Records
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            {myLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <CalendarDays size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No requests found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your leave history will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {myLeaves.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          {r.from}
                          {r.to && r.to !== r.from ? `  →  ${r.to}` : ""}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 mt-3 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/20" />
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed pl-1.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
                          Reason:
                        </span>
                        {r.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimalist SaaS Status Badge
function StatusBadge({ status }) {
  const map = {
    Pending:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Approved:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Denied:
      "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };
  return (
    <span
      className={`inline-flex shrink-0 font-bold px-2 py-0.5 rounded-[6px] text-[9px] uppercase tracking-wider border ${map[status] || map.Pending}`}
    >
      {status}
    </span>
  );
}