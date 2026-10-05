"use client";

import React, { useEffect } from "react";
import { useLeaveStore } from "@/store/use-leave-store";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import LeaveInbox from "./Leaveinbox";
import AttendanceChart from "./AttendanceChart";
import SectionRosterBrowser from "./SectionRosterBrowser";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Bell, 
  Activity 
} from "lucide-react";

export default function PrincipalAttendanceView() {
  const inbox = useLeaveStore((s) => s.inbox);
  const fetchInbox = useLeaveStore((s) => s.fetchInbox);
  const approveLeave = useLeaveStore((s) => s.approveLeave);
  const denyLeave = useLeaveStore((s) => s.denyLeave);

  const schoolTrend = useAttendanceStore((s) => s.schoolTrend);
  const fetchSchoolTrend = useAttendanceStore((s) => s.fetchSchoolTrend);
  const schoolStats = useAttendanceStore((s) => s.schoolStats);
  const fetchSchoolStats = useAttendanceStore((s) => s.fetchSchoolStats);
  const sections = useAttendanceStore((s) => s.sections);
  const isLoadingSections = useAttendanceStore((s) => s.isLoadingSections);
  const fetchSchoolSections = useAttendanceStore((s) => s.fetchSchoolSections);

  useEffect(() => {
    // Principal's inbox only ever contains TEACHER leaves — the backend
    // scopes /api/leave/inbox by role automatically, no params needed here.
    fetchInbox();
    fetchSchoolTrend();
    fetchSchoolStats();
    fetchSchoolSections();
  }, [fetchInbox, fetchSchoolTrend, fetchSchoolStats, fetchSchoolSections]);

  // Real counts from /api/attendance/school-stats. teachersMarkedToday is
  // used as the "Present Teachers" proxy since there's no separate
  // teacher-attendance schema — see getSchoolStats() for why.
  const stats = [
    {
      label: "Total Teachers",
      value: schoolStats ? String(schoolStats.totalTeachers) : "—",
      icon: Users,
      accent: "blue",
      trend: schoolStats ? `${schoolStats.totalSections} sections` : "",
    },
    {
      label: "Marked Today",
      value: schoolStats ? String(schoolStats.teachersMarkedToday) : "—",
      icon: UserCheck,
      accent: "emerald",
      trend: "Have taken attendance",
    },
    {
      label: "Total Students",
      value: schoolStats ? schoolStats.totalStudents.toLocaleString() : "—",
      icon: GraduationCap,
      accent: "indigo",
      trend: "Active enrollment",
    },
    {
      label: "Avg Attendance",
      value: schoolStats ? `${schoolStats.avgAttendancePct7d}%` : "—",
      icon: TrendingUp,
      accent: "violet",
      trend: "Last 7 days",
    },
  ];

  const ACCENTS = {
    blue: {
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-500/15",
      bar: "bg-blue-500",
    },
    emerald: {
      icon: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
      bar: "bg-emerald-500",
    },
    indigo: {
      icon: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-500/15",
      bar: "bg-indigo-500",
    },
    violet: {
      icon: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-50 dark:bg-violet-500/15",
      bar: "bg-violet-500",
    },
  };

  const criticalAlerts = [
    { id: 1, title: "Low Attendance: Grade 10-B", desc: "Current attendance is 72% (below 75% threshold).", time: "10 mins ago", type: "warning" },
    { id: 2, title: "Unmarked Registers", desc: "3 teachers have not submitted morning attendance.", time: "1 hour ago", type: "alert" },
    { id: 3, title: "Staff Shortage", desc: "Science department has 2 teachers on unexpected leave.", time: "2 hours ago", type: "warning" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Compact Stats Row */}
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

      {/* Middle Section: Chart and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Analytics Chart */}
        <div className="xl:col-span-2 dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> School-wide Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daily attendance percentages for the current week</p>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            {/* AttendanceChart now receives real daily-trend data. If no
                data has been marked yet school-wide, it falls back to its
                own internal sample series so the chart never renders empty. */}
            <AttendanceChart data={schoolTrend?.length ? schoolTrend : undefined} />
          </div>
        </div>

        {/* Critical Alerts Feed */}
        <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={16} className="text-rose-500" /> Action Required
            </h3>
            <span className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {criticalAlerts.length} New
            </span>
          </div>
          
          <div className="p-5 flex-1 space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex gap-3 items-start group">
                <div className={`mt-0.5 p-2 rounded-full shrink-0 ${
                  alert.type === 'alert' 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' 
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                }`}>
                  <AlertTriangle size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{alert.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{alert.desc}</p>
                  <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 block uppercase tracking-wider">
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class & Section drill-down — browse every section, then every
          student in it, then that student's full history */}
      <SectionRosterBrowser sections={sections} isLoading={isLoadingSections} />

      {/* Bottom Section: Leave Inbox — teacher leaves only, school-wide */}
      <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <LeaveInbox
          title="Staff Leave Approvals"
          subtitle="Pending requests across all departments"
          requests={inbox}
          onApprove={(id) => approveLeave(id)}
          onDeny={(id) => denyLeave(id)}
        />
      </div>
      
    </div>
  );
}