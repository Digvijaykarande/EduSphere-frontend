// src/components/pages/dashboard/exams/StudentExamView.jsx
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Download, Award, Clock, Loader2 } from "lucide-react";
import { useExamStore } from "@/store/examStore";

export default function StudentExamView() {
  const overview = useExamStore((s) => s.studentOverview);
  const isLoadingStudentOverview = useExamStore((s) => s.isLoadingStudentOverview);
  const fetchStudentOverview = useExamStore((s) => s.fetchStudentOverview);

  useEffect(() => {
    if (!overview) fetchStudentOverview().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingStudentOverview && !overview) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  const studentReportCard = overview?.studentReportCard ?? [];
  const examTimetable = overview?.examTimetable ?? [];
  const totalScore = studentReportCard.reduce((sum, r) => sum + (r.score ?? 0), 0);
  const gpa = studentReportCard.length ? (totalScore / studentReportCard.length / 25).toFixed(1) : "0.0";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">

      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Exam Results</h2>
          <p className="text-indigo-200 text-sm mt-1">Your published scores & upcoming schedule</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/40">
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Overall GPA</p>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">{gpa}<span className="text-sm text-indigo-500">/4.0</span></p>
            </div>
          </div>
        </div>
        <button className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download Official Transcript
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject Breakdown</h3>
          </div>
          <div className="space-y-3">
            {studentReportCard.length === 0 ? (
              <p className="text-xs text-muted-foreground">No published results yet.</p>
            ) : (
              studentReportCard.map((res, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.subject}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Theory Examination</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{res.score}/100</span>
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                      {res.grade}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Schedule</h3>
          </div>
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6 pb-2">
            {examTimetable.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-6">No upcoming exams.</p>
            ) : (
              examTimetable.map((exam, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-slate-900 ${exam.status === 'Completed' ? 'bg-slate-300 dark:bg-slate-600' : 'bg-primary'}`} />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{exam.subject}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(exam.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500"><Clock className="w-3 h-3" /> {exam.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Location: {exam.room || "TBD"}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
