"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, CalendarClock, Users2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import CreateAssignmentModal from "./CreateAssignmentModal";
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel";
import TeacherSchedule from "./TeacherSchedule";
import SyllabusTracker from "./SyllabusTracker";
import StudyMaterialLibrary from "./StudyMaterialLibrary";
import AttendanceSummary from "./TeacherAttendanceSummary";

function AssignmentsPanel() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSubmissionsAssignment, setActiveSubmissionsAssignment] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMyCreatedAssignments();
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

  const handleCreated = () => {
    setIsCreateOpen(false);
    load();
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">My Assignments</h3>
          <p className="text-xs text-slate-400">Homework & tasks you've assigned across your classes</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-6">{error}</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-slate-400 py-6">No assignments created yet. Click "New Assignment" to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignments.map((a) => {
            const isDueSoon = new Date(a.dueDate) - new Date() < 3 * 24 * 60 * 60 * 1000;
            return (
              <div key={a._id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-foreground text-sm leading-tight">{a.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      isDueSoon ? "bg-destructive/10 text-destructive" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <CalendarClock className="w-3 h-3 inline -mt-0.5 mr-1" />
                    {new Date(a.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  {a.sectionId?.gradeClass} - {a.sectionId?.section} • {a.subject}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubmissionsAssignment(a)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                  <Users2 className="w-3.5 h-3.5" />
                  {a.submittedCount}/{a.totalStudents} submitted
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isCreateOpen && <CreateAssignmentModal onClose={() => setIsCreateOpen(false)} onCreate={handleCreated} />}
      {activeSubmissionsAssignment && (
        <AssignmentSubmissionsPanel assignment={activeSubmissionsAssignment} onClose={() => setActiveSubmissionsAssignment(null)} />
      )}
    </div>
  );
}

export default function TeacherAcademics() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <TeacherSchedule />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AssignmentsPanel />
          <StudyMaterialLibrary />
        </div>
        <div className="space-y-6">
          <AttendanceSummary />
          <SyllabusTracker />
        </div>
      </div>
    </motion.div>
  );
}
