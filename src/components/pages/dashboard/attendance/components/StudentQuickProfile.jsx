"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, TrendingUp, CalendarDays, 
  MessageSquare, AlertCircle, FileText, CheckCircle2, Clock 
} from "lucide-react";
import { useLeaveStore } from "@/store/use-leave-store";

export default function StudentQuickProfile({ student, onClose }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "leaves"

  // Fetch this specific student's leaves from the Zustand store
  const rawStudentLeaves = useLeaveStore((s) => s.studentLeaves);
  const studentLeaves = useMemo(() => {
    if (!student) return [];
    return rawStudentLeaves.filter((r) => r.name === student.name);
  }, [rawStudentLeaves, student]);

  // Generate a mock 5-day history for the visualization
  const recentHistory = useMemo(() => {
    if (!student) return [];
    const statuses = ["Present", "Present", "Present", "Absent", "Late"];
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (i + 1));
      const randomStatus = parseFloat(student.overall) > 85 
        ? (Math.random() > 0.1 ? "Present" : "Late")
        : statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: i,
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: i === 0 ? student.status : randomStatus,
      };
    });
  }, [student]);

  const isWarning = student && parseFloat(student.overall) < 75;

  return (
    <AnimatePresence>
      {student && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />

          {/* Modal Card - Increased to max-w-md to fit more details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
              
              {/* Header Cover */}
              <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 text-red rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Avatar & Identity Area */}
              <div className="px-6 relative -mt-12 flex items-end justify-between mb-4">
                <div className="flex items-end gap-4">
                  <div className="h-24 w-24 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm">
                    <div className="h-full w-full bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <User size={40} />
                    </div>
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {student.name}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Roll: {student.rollNo}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>Grade 10-A</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Tab Navigation */}
              <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex gap-4">
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "overview" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  Overview
                  {activeTab === "overview" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("leaves")}
                  className={`pb-3 text-sm font-bold transition-colors relative flex items-center gap-1.5 ${activeTab === "leaves" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  Leave History
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">{studentLeaves.length}</span>
                  {activeTab === "leaves" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 overflow-y-auto max-h-[400px] bg-slate-50/50 dark:bg-slate-900/30 no-scrollbar">
                
                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className={`p-4 rounded-2xl border ${isWarning ? "bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                          <TrendingUp size={12} /> Term Stat
                        </p>
                        <p className={`text-2xl font-bold ${isWarning ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-100"}`}>
                          {student.overall} {isWarning && <span className="text-sm">⚠️</span>}
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                          <CalendarDays size={12} /> Today's Status
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          {student.status === "Present" && <CheckCircle2 size={16} className="text-emerald-500" />}
                          {student.status === "Absent" && <X size={16} className="text-rose-500" />}
                          {student.status === "Late" && <Clock size={16} className="text-amber-500" />}
                          <p className={`text-sm font-bold ${
                            student.status === "Present" ? "text-emerald-600 dark:text-emerald-400" : 
                            student.status === "Absent" ? "text-rose-600 dark:text-rose-400" : 
                            "text-amber-600 dark:text-amber-400"
                          }`}>
                            {student.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                        Recent History 
                        {isWarning && <AlertCircle size={14} className="text-rose-500" />}
                      </h3>
                      <div className="flex justify-between items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                        {recentHistory.map((day) => (
                          <div key={day.id} className="flex flex-col items-center gap-1.5 group cursor-default">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              day.status === "Present" ? "border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              day.status === "Absent" ? "border-rose-100 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                              "border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}>
                              <span className="text-[10px] font-bold uppercase">{day.status.charAt(0)}</span>
                            </div>
                            <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                              {day.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: LEAVE HISTORY */}
                {activeTab === "leaves" && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                    {studentLeaves.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <FileText size={20} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Leave Records</p>
                        <p className="text-xs text-slate-500 mt-1">This student has no leave history on file.</p>
                      </div>
                    ) : (
                      studentLeaves.map((leave) => (
                        <div key={leave.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date Applied</p>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                <CalendarDays size={14} className="text-indigo-500" />
                                {leave.from} {leave.to && leave.to !== leave.from ? ` — ${leave.to}` : ""}
                              </p>
                            </div>
                            <StatusPill status={leave.status} />
                          </div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 mt-3">
                            "{leave.reason}"
                          </p>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm">
                  <MessageSquare size={16} /> Contact Guardian
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Reusable Status Pill for the Leave tab
function StatusPill({ status }) {
  const map = {
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    Denied: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
  };
  return (
    <span className={`shrink-0 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider ${map[status] || map.Pending}`}>
      {status}
    </span>
  );
}