"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Edit3,
  Trash2,
  CheckCircle2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExamStore } from "@/store/examStore";
import CreateExamModal from "./CreateExamModal";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sectionLabels(exam) {
  return (exam.sections ?? []).map((s) =>
    typeof s === "string" ? s : `${s.gradeClass}-${s.section}`,
  );
}

export default function ExamSchedule() {
  const exams = useExamStore((s) => s.exams);
  const isLoadingExams = useExamStore((s) => s.isLoadingExams);
  const fetchExams = useExamStore((s) => s.fetchExams);
  const deleteExam = useExamStore((s) => s.deleteExam);

  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  useEffect(() => {
    fetchExams({ limit: 100 }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheduled exam?"))
      return;
    setDeletingId(id);
    try {
      await deleteExam(id);
      showToast("Exam schedule deleted.");
    } catch (err) {
      showToast(err.message || "Failed to delete exam.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (exam) => setEditingExam(exam);

  const handleUpdated = () => {
    setEditingExam(null);
    showToast("Exam updated successfully.");
    fetchExams({ limit: 100 }).catch(() => {});
  };

  const sorted = useMemo(
    () => [...exams].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [exams],
  );

  // Flag same room booked twice on the same day.
  const conflicts = useMemo(() => {
    const byDateRoom = new Map();
    sorted.forEach((exam) => {
      if (!exam.room) return;
      const key = `${formatDate(exam.date)}|${exam.room}`;
      if (!byDateRoom.has(key)) byDateRoom.set(key, []);
      byDateRoom.get(key).push(exam);
    });
    const flagged = new Set();
    byDateRoom.forEach((group) => {
      if (group.length > 1) group.forEach((e) => flagged.add(e._id || e.slug));
    });
    return flagged;
  }, [sorted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Exam Schedule</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage and resolve scheduling conflicts for all active exams.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {conflicts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold shadow-sm overflow-hidden"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>
              Warning: {conflicts.size} exam{conflicts.size > 1 ? "s" : ""}{" "}
              share a room booking with another exam on the same day. Please
              review the highlighted cards below.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoadingExams && exams.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading schedule…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {sorted.map((exam) => {
              const id = exam._id || exam.slug;
              const hasConflict = conflicts.has(id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  key={id}
                  className={`flex flex-col justify-between p-5 rounded-[20px] bg-card border shadow-sm transition-all hover:shadow-md ${
                    hasConflict
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <CalendarDays className="h-3 w-3" />{" "}
                      {formatDate(exam.date)}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border-border bg-popover/95 backdrop-blur-md shadow-xl p-1.5"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEdit(exam)}
                          className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-muted-foreground focus:text-primary focus:bg-primary/10 rounded-lg py-2"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50 my-1" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(exam.slug || exam._id)}
                          disabled={deletingId === id}
                          className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg py-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />{" "}
                          {deletingId === id ? "Deleting…" : "Delete Exam"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-foreground leading-tight">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {exam.subject}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 bg-background/50 rounded-xl p-3 border border-border/50">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-primary/70" />{" "}
                        {exam.startTime} – {exam.endTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin
                          className={`h-3 w-3 ${hasConflict ? "text-destructive" : "text-primary/70"}`}
                        />{" "}
                        {exam.room || "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground pt-2 border-t border-border/50">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-primary/70" />{" "}
                        {sectionLabels(exam).join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-4 border-t border-border/60">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border ${
                        exam.status === "Completed"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {sorted.length === 0 && (
            <div className="col-span-full h-48 flex items-center justify-center text-sm text-muted-foreground">
              No exams scheduled.
            </div>
          )}
        </div>
      )}

      <CreateExamModal
        isOpen={!!editingExam}
        editingExam={editingExam}
        onClose={() => setEditingExam(null)}
        onCreated={handleUpdated}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 bg-foreground text-background text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 border border-border"
          >
            <CheckCircle2 size={16} className="text-success" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
