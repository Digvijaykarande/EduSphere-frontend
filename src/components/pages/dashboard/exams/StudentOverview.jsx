"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Award, Download, CalendarDays, Clock, MapPin, TrendingUp, Loader2 } from "lucide-react";
import { useExamStore } from "@/store/examStore";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function StudentOverview() {
  const overview = useExamStore((s) => s.studentOverview);
  const isLoadingStudentOverview = useExamStore((s) => s.isLoadingStudentOverview);
  const fetchStudentOverview = useExamStore((s) => s.fetchStudentOverview);

  useEffect(() => {
    fetchStudentOverview().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingStudentOverview && !overview) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading your exam overview…
      </div>
    );
  }

  const stats = overview?.stats;
  const upcomingExams = overview?.upcomingExams ?? [];
  const recentResults = overview?.recentResults ?? [];
  const examTimetable = overview?.examTimetable ?? [];
  const studentReportCard = overview?.studentReportCard ?? [];

  const totalScore = studentReportCard.reduce((sum, r) => sum + (r.score ?? 0), 0);
  const gpa = studentReportCard.length ? (totalScore / studentReportCard.length / 25).toFixed(1) : "0.0";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-900/50"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Exam Overview</h2>
            <p className="text-xs text-indigo-300 mt-1 font-medium">Your results & upcoming schedule</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900">
            <Download size={14} strokeWidth={2.5} /> Download Transcript
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4">
           <div className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 shadow-inner flex flex-col justify-center transition-colors hover:bg-white/10">
             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
               <TrendingUp size={12} /> GPA
             </p>
             <div className="flex items-baseline gap-1">
               <p className="text-3xl font-mono font-extrabold text-emerald-400 leading-none">{gpa}</p>
               <span className="text-sm font-bold text-indigo-400">/4.0</span>
             </div>
           </div>

           <div className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 shadow-inner flex flex-col justify-center transition-colors hover:bg-white/10">
             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5">Total Exam</p>
             <p className="text-3xl font-mono font-extrabold text-white leading-none">{stats?.totalExams ?? "—"}</p>
           </div>

           <div className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 shadow-inner flex flex-col justify-center transition-colors hover:bg-white/10">
             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5">Upcoming Exam</p>
             <p className="text-3xl font-mono font-extrabold text-amber-400 leading-none">{upcomingExams.length}</p>
           </div>

           <div className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 shadow-inner flex flex-col justify-center transition-colors hover:bg-white/10">
             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5">Completed Exam</p>
             <p className="text-3xl font-mono font-extrabold text-blue-400 leading-none">{studentReportCard.length}</p>
           </div>

           <div className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 shadow-inner flex flex-col justify-center transition-colors hover:bg-white/10">
             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5">Avg Score</p>
             <div className="flex items-baseline gap-1">
               <p className="text-3xl font-mono font-extrabold text-white leading-none">
                 {studentReportCard.length ? Math.round(totalScore / studentReportCard.length) : 0}
               </p>
               <span className="text-sm font-bold text-indigo-400">%</span>
             </div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Subject Breakdown</h3>
          </div>

          <div className="space-y-4">
            {studentReportCard.length === 0 ? (
              <p className="text-xs text-muted-foreground">No published results yet.</p>
            ) : (
              studentReportCard.map((res, idx) => (
                <div key={idx} className="group p-4 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 hover:bg-muted/50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-foreground">{res.subject}</p>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{res.score}/100</span>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-success/10 text-success font-bold text-[10px] border border-success/20">
                        {res.grade}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${res.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
           <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Upcoming Schedule</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {examTimetable.length === 0 ? (
              <p className="text-xs text-muted-foreground col-span-full">No upcoming exams.</p>
            ) : (
              examTimetable.map((exam, idx) => {
                const isCompleted = exam.status === 'Completed';
                return (
                  <div key={idx} className="group flex flex-col justify-between p-4 rounded-2xl bg-muted/20 border border-border hover:bg-muted/40 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border ${
                        isCompleted
                          ? 'bg-muted text-muted-foreground border-border'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {exam.status}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <CalendarDays className="w-3 h-3 text-primary/70" />
                        {new Date(exam.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{exam.subject}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-primary/70" /> {exam.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-primary/70" /> {exam.room || "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Upcoming Exams</h3>
          </div>

          <div className="space-y-3">
             {upcomingExams.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upcoming exams.</p>
             ) : (
              upcomingExams.map(ex => (
                <div key={ex.id} className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-muted/20 border border-border hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{ex.subject}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">{ex.test}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-[10px] font-bold text-foreground flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 text-muted-foreground" />
                      {new Date(ex.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))
             )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Recent Results</h3>
          </div>

          <div className="space-y-3">
             {recentResults.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent results.</p>
             ) : (
              recentResults.map(r => (
                <div key={r.id} className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-muted/20 border border-border hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.subject}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">{r.test}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="inline-flex px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border bg-success/10 text-success border-success/20">
                      {r.status}
                    </span>
                    {r.date && (
                      <p className="text-[10px] text-muted-foreground font-medium mt-2">
                        {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              ))
             )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
