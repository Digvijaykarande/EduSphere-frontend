"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
import DailyTimetable from "./DailyTimetable";
import AttendanceSummary from "./StudentAttendanceSummary";
import StudyMaterialsWidget from "./StudyMaterialsWidget";
import StudyDiaryWidget from "./StudyDiaryWidget";

const STATUS_STYLES = {
  IN_PROGRESS: "text-primary bg-primary/10",
  SUBMITTED: "text-success bg-success/10",
  GRADED: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
};

function HomeworkTable() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMyVisibleAssignments();
      setAssignments(res.data?.assignments || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load your assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = assignments.find((a) => a.slug === selectedSlug);

  return (
    <div className="dashboard-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground tracking-tight">My Assignments</h3>
        <p className="text-xs text-slate-400">Homework & tasks for your class</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-6">{error}</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-slate-400 py-6">No assignments yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignments.map((a) => {
            const status = a.submission?.status || "IN_PROGRESS";
            return (
              <button
                key={a._id}
                type="button"
                onClick={() => setSelectedSlug(a.slug)}
                className="text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-foreground text-sm leading-tight">{a.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 flex items-center gap-1 ${STATUS_STYLES[status]}`}>
                    {status === "SUBMITTED" && <CheckCircle2 className="w-3 h-3" />}
                    {status === "IN_PROGRESS" && <Clock className="w-3 h-3" />}
                    {status === "GRADED" ? `Graded${a.submission?.marks ? ` · ${a.submission.marks}` : ""}` : status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{a.subject}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <CalendarClock className="w-3.5 h-3.5" />
                  Due {new Date(a.dueDate).toLocaleDateString()}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <AssignmentDetailsModal assignment={selected} onClose={() => setSelectedSlug(null)} onStatusChange={load} />
      )}
    </div>
  );
}

export default function StudentAcademics() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <DailyTimetable />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <HomeworkTable />
          <StudyDiaryWidget />
        </div>
        <div className="space-y-6">
          <AttendanceSummary />
          <StudyMaterialsWidget />
        </div>
      </div>
    </motion.div>
  );
}
