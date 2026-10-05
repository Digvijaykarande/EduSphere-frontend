"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  AlertCircle,
  FileCheck2,
  CheckCircle2,
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

const PAPER_STATUS_STYLE = {
  Uploaded: "bg-success/10 text-success border-success/20",
  Draft: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-muted text-muted-foreground border-transparent",
};

function formatDate(d) {
  if (!d) return "—";
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

export default function AllExamsList() {
  const exams = useExamStore((s) => s.exams);
  const isLoadingExams = useExamStore((s) => s.isLoadingExams);
  const fetchExams = useExamStore((s) => s.fetchExams);
  const deleteExam = useExamStore((s) => s.deleteExam);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  useEffect(() => {
    fetchExams({}).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchExams({
        search: searchTerm || undefined,
        // "All" is a UI-only sentinel — the backend has no such status, so
        // never actually send it as a filter value.
        status: statusFilter === "All" ? undefined : statusFilter,
      }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteExam(id);
      showToast("Exam deleted successfully.");
    } catch (err) {
      showToast(err.message || "Failed to delete exam.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleEdit = (exam) => setEditingExam(exam);

  const handleUpdated = () => {
    setEditingExam(null);
    showToast("Exam updated successfully.");
    fetchExams({
      search: searchTerm || undefined,
      status: statusFilter === "All" ? undefined : statusFilter,
    }).catch(() => {});
  };

  const filteredExams = exams;

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-3 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-muted/20">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full appearance-none items-center justify-between rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoadingExams && exams.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading exams…
        </div>
      ) : (
        <>
          <div className="sm:hidden divide-y divide-border">
            <AnimatePresence initial={false}>
              {filteredExams.map((exam) => {
                const id = exam._id || exam.slug;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">
                          {exam.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {exam.subject}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                          exam.status === "Completed"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-warning/30 bg-warning/10 text-warning"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border">
                        {exam.slug}
                      </span>
                      {sectionLabels(exam).map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20"
                        >
                          Class {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />{" "}
                        {formatDate(exam.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {exam.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${exam.syllabusCoverage === 100 ? "bg-success" : "bg-primary"}`}
                          style={{ width: `${exam.syllabusCoverage ?? 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-muted-foreground w-8 text-right">
                        {exam.syllabusCoverage ?? 0}%
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold border shrink-0 ${PAPER_STATUS_STYLE[exam.questionPaperStatus] ?? PAPER_STATUS_STYLE.Pending}`}
                      >
                        <FileCheck2 className="w-3 h-3" />{" "}
                        {exam.questionPaperStatus ?? "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {confirmDeleteId === id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Delete?
                          </span>
                          <button
                            onClick={() => handleDelete(exam.slug || exam._id)}
                            disabled={deletingId === id}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm disabled:opacity-60"
                          >
                            {deletingId === id ? "…" : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(exam)}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(id)}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredExams.length === 0 && !isLoadingExams && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No exams found.
              </div>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">
                    Exam
                  </th>
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">
                    Subject / Class
                  </th>
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">
                    Schedule
                  </th>
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">
                    Readiness
                  </th>
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredExams.map((exam) => {
                    const id = exam._id || exam.slug;
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-6 align-middle">
                          <p className="font-bold text-foreground text-[13px]">
                            {exam.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border">
                              {exam.slug}
                            </span>
                            <span
                              className="text-[11px] font-medium text-muted-foreground"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>{exam.type}</span>{" "}
                              <span>{exam.maxMarks} Marks</span>
                            </span>
                          </div>
                        </td>

                        <td className="p-6 align-middle">
                          <p className="font-semibold text-foreground text-[13px]">
                            {exam.subject}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {sectionLabels(exam).map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20"
                              >
                                Class {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-6 align-middle">
                          <div className="flex flex-col gap-1.5">
                            <span className="flex items-center gap-2 font-medium text-foreground text-xs">
                              <Calendar className="w-3.5 h-3.5 text-primary" />{" "}
                              {formatDate(exam.date)}
                            </span>
                            <span className="flex items-center gap-2 text-muted-foreground text-[11px]">
                              <Clock className="w-3.5 h-3.5" /> {exam.duration}
                            </span>
                          </div>
                        </td>

                        <td className="p-6 align-middle w-48">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${exam.syllabusCoverage === 100 ? "bg-success" : "bg-primary"}`}
                                style={{
                                  width: `${exam.syllabusCoverage ?? 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-muted-foreground w-8 text-right">
                              {exam.syllabusCoverage ?? 0}%
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-[10px] font-bold border ${PAPER_STATUS_STYLE[exam.questionPaperStatus] ?? PAPER_STATUS_STYLE.Pending}`}
                          >
                            <FileCheck2 className="w-3 h-3" /> Paper{" "}
                            {exam.questionPaperStatus ?? "Pending"}
                          </span>
                        </td>

                        <td className="p-6 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors ${
                              exam.status === "Completed"
                                ? "border-success/30 bg-success/10 text-success"
                                : "border-warning/30 bg-warning/10 text-warning"
                            }`}
                          >
                            {exam.status}
                          </span>
                        </td>

                        <td className="p-6 align-middle text-right">
                          {confirmDeleteId === id ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                Delete?
                              </span>
                              <button
                                onClick={() =>
                                  handleDelete(exam.slug || exam._id)
                                }
                                disabled={deletingId === id}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm disabled:opacity-60"
                              >
                                {deletingId === id ? "…" : "Yes"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <MoreVertical className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 p-1.5 rounded-xl border-border bg-popover/95 backdrop-blur-md shadow-xl"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleEdit(exam)}
                                  className="flex items-center gap-2.5 cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-muted-foreground focus:bg-primary/10 focus:text-primary transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit Details
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-border" />

                                <DropdownMenuItem
                                  onClick={() => setConfirmDeleteId(id)}
                                  className="flex items-center gap-2.5 cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Exam
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>

                {filteredExams.length === 0 && !isLoadingExams && (
                  <tr>
                    <td colSpan="6" className="h-64 text-center align-middle">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mb-4 opacity-20" />
                        <p className="text-sm font-semibold text-foreground">
                          No exams found.
                        </p>
                        <p className="text-xs mt-1">
                          Try adjusting your search or filters.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("All");
                          }}
                          className="mt-5 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
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
            className="fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 bg-foreground text-background text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 border border-border"
          >
            <CheckCircle2 size={16} className="text-success shrink-0" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
