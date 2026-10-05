// src/components/pages/dashboard/exams/PrincipalOverview.jsx
"use client";

import React, { useEffect } from "react";
import { BookOpen, Calendar, CheckSquare, TrendingUp, TrendingDown, Minus, FileText, Upload, Settings, Loader2 } from "lucide-react";
import { useExamStore } from "@/store/examStore";

const KPI_CARDS = [
  { key: "totalExams", label: "Total Exams" },
  { key: "upcomingExams", label: "Upcoming Exams" },
  { key: "completedExams", label: "Completed" },
  { key: "averageScore", label: "Average Score" },
  { key: "passPercentage", label: "Pass %" },
];

function TrendBadge({ trend }) {
  if (!trend) return null;
  const Icon = trend.direction === "up" ? TrendingUp : trend.direction === "down" ? TrendingDown : Minus;
  const color =
    trend.direction === "up" ? "text-emerald-500" : trend.direction === "down" ? "text-rose-500" : "text-slate-400";
  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold mt-1.5 ${color}`}>
      <Icon size={11} /> {trend.value}
    </span>
  );
}

export default function PrincipalOverview({ onNavigateTab, onCreateExam }) {
  const stats = useExamStore((s) => s.stats);
  const isLoadingStats = useExamStore((s) => s.isLoadingStats);
  const fetchStats = useExamStore((s) => s.fetchStats);

  const upcomingExams = useExamStore((s) => s.upcomingExams);
  const fetchUpcomingExams = useExamStore((s) => s.fetchUpcomingExams);

  const topPerformers = useExamStore((s) => s.topPerformers);
  const fetchTopPerformers = useExamStore((s) => s.fetchTopPerformers);

  const recentResults = useExamStore((s) => s.recentResults);
  const fetchRecentResults = useExamStore((s) => s.fetchRecentResults);

  useEffect(() => {
    fetchStats().catch(() => {});
    fetchUpcomingExams().catch(() => {});
    fetchTopPerformers().catch(() => {});
    fetchRecentResults().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (tab) => {
    if (onNavigateTab) onNavigateTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {KPI_CARDS.map(({ key, label }) => (
          <div key={key} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/40 transition-colors">
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {isLoadingStats && !stats ? "—" : stats?.[key] ?? "—"}
            </h3>
            {/* Backend doesn't compute term-over-term deltas yet — omitted rather than faked. */}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Upcoming Exams</h3>
            <button onClick={() => goTo("Schedule")} className="text-xs text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingExams.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upcoming exams.</p>
            ) : (
              upcomingExams.map(ex => (
                <div key={ex.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><BookOpen size={18}/></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ex.subject}</p>
                    <p className="text-[10px] text-slate-500">{ex.test}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1">
                      <Calendar size={10}/> {new Date(ex.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    {ex.class && <p className="text-[10px] text-slate-500 mt-0.5">Class {ex.class}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Exam Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No published results yet.</p>
            ) : (
              topPerformers.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-xs font-bold text-slate-400">{p.id}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-500">Class {p.class}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">{p.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Results</h3>
          <button onClick={() => goTo("Results")} className="text-xs text-primary font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {isLoadingStats && recentResults.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
          ) : recentResults.length === 0 ? (
            <p className="text-xs text-muted-foreground">No results yet.</p>
          ) : (
            recentResults.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{r.test}</p>
                  <p className="text-[10px] text-slate-500">{r.class} • {r.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${r.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {r.status}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Create Exam", icon: Upload, desc: "Schedule a new exam", onClick: onCreateExam },
          { label: "Enter Marks", icon: CheckSquare, desc: "Go to Gradebook", onClick: () => goTo("Gradebook") },
          { label: "Reports", icon: FileText, desc: "Go to Analytics", onClick: () => goTo("Analytics") },
          { label: "Schedule", icon: Settings, desc: "View exam calendar", onClick: () => goTo("Schedule") },
        ].map((act, i) => (
          <button
            key={i}
            onClick={act.onClick}
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-colors text-left"
          >
             <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><act.icon size={18}/></div>
             <div>
               <p className="text-xs font-bold text-slate-900 dark:text-white">{act.label}</p>
               <p className="text-[10px] text-slate-500">{act.desc}</p>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
}
