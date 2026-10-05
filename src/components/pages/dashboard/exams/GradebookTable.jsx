"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, Search, CheckCircle2, Loader2, Filter, ArrowLeft } from "lucide-react";
import { useExamStore } from "@/store/examStore";

// GradebookTable now operates on ONE exam at a time (marks entry is always
// scoped to an exam — that's what the backend's /exams/:id/gradebook and
// /exams/:id/marks endpoints expect). The parent (PrincipalExamView) is
// responsible for picking which exam and passing its id/slug down.
export default function GradebookTable({ examId, onBack }) {
  const gradebook = useExamStore((s) => s.gradebook);
  const isLoadingGradebook = useExamStore((s) => s.isLoadingGradebook);
  const fetchGradebook = useExamStore((s) => s.fetchGradebook);
  const clearGradebook = useExamStore((s) => s.clearGradebook);
  const saveMarks = useExamStore((s) => s.saveMarks);

  const [edits, setEdits] = useState({}); // { studentId: newScore }
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [saveError, setSaveError] = useState(null);
  const itemsPerPage = 10;

  const load = useCallback(
    (page = 1, search = searchTerm) => {
      if (!examId) return;
      fetchGradebook(examId, { page, limit: itemsPerPage, search: search || undefined }).catch(() => {});
    },
    [examId, fetchGradebook, searchTerm]
  );

  useEffect(() => {
    if (!examId) return;
    setEdits({});
    setCurrentPage(1);
    load(1, "");
    return () => clearGradebook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Debounced search
  useEffect(() => {
    if (!examId) return;
    const t = setTimeout(() => {
      setCurrentPage(1);
      load(1, searchTerm);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const exam = gradebook?.exam;
  const rows = gradebook?.results ?? [];
  const pagination = gradebook?.pagination;

  const getGrade = (score, maxMarks) => {
    if (score === null || score === undefined || score === "") {
      return { label: "—", color: "bg-muted text-muted-foreground border-border" };
    }
    const pct = maxMarks ? (Number(score) / maxMarks) * 100 : 0;
    if (pct >= 90) return { label: "A+", color: "bg-success/10 text-success border-success/20" };
    if (pct >= 80) return { label: "A", color: "bg-success/10 text-success border-success/20" };
    if (pct >= 70) return { label: "B", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    if (pct >= 60) return { label: "C", color: "bg-warning/10 text-warning border-warning/20" };
    if (pct >= 40) return { label: "D", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "F", color: "bg-destructive/10 text-destructive border-destructive/20" };
  };

  const handleScoreChange = (studentId, value) => {
    setEdits((prev) => ({ ...prev, [studentId]: value }));
  };

  const unsavedCount = Object.keys(edits).length;

  const handleSaveAll = async () => {
    if (unsavedCount === 0 || !examId) return;
    setSaveState("saving");
    setSaveError(null);
    try {
      const entries = Object.entries(edits).map(([studentId, value]) => ({
        studentId,
        marksObtained: value === "" ? null : Number(value),
      }));
      await saveMarks(examId, entries);
      setEdits({});
      setSaveState("saved");
      load(currentPage, searchTerm); // reconcile with server-computed grades
      setTimeout(() => setSaveState("idle"), 1800);
    } catch (err) {
      setSaveState("error");
      setSaveError(err.message || "Failed to save marks.");
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    load(page, searchTerm);
  };

  if (!examId) {
    return (
      <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-12 text-center text-muted-foreground">
        <Filter className="h-8 w-8 mb-3 opacity-20 mx-auto" />
        <p className="text-sm font-medium">Select an exam to enter marks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {exam ? exam.title : "Gradebook Entry"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {exam ? `${exam.subject} • Max ${exam.maxMarks} marks, passing ${exam.passingMarks}` : "Loading exam…"}
            </p>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
          {saveError}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        {/* TOOLBAR */}
        <div className="p-3 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-muted/20">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {unsavedCount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-bold text-warning whitespace-nowrap bg-warning/10 px-3 py-1.5 rounded-lg border border-warning/20"
              >
                {unsavedCount} unsaved
              </motion.span>
            )}
            <button
              disabled={unsavedCount === 0 || saveState === "saving"}
              onClick={handleSaveAll}
              className="flex items-center gap-2 h-10 px-4 sm:px-5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap"
            >
              {saveState === "saving" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saveState === "saved" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Save size={14} />
              )}
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save Changes"}
            </button>
          </div>
        </div>

        {isLoadingGradebook && rows.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading gradebook…
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <div className="sm:hidden divide-y divide-border">
              <AnimatePresence initial={false}>
                {rows.map((r) => {
                  const studentId = r.studentId?._id || r.studentId;
                  const currentScore = edits[studentId] !== undefined ? edits[studentId] : r.marksObtained ?? "";
                  const grade = getGrade(currentScore, exam?.maxMarks);
                  const isEdited = edits[studentId] !== undefined;
                  const section = r.sectionId;
                  return (
                    <motion.div
                      key={studentId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 space-y-3 ${isEdited ? "bg-warning/5" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-[13px] text-foreground truncate">
                            {r.studentId?.firstName} {r.studentId?.lastName}
                          </p>
                          <p className="font-mono text-[11px] font-bold text-muted-foreground mt-0.5">
                            {r.studentId?.rollNumber}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md text-[11px] font-black tracking-wider border shrink-0 ${grade.color}`}
                        >
                          {grade.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {section && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                            {section.gradeClass}-{section.section}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                          Score (/{exam?.maxMarks ?? 100})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={exam?.maxMarks}
                          value={currentScore}
                          onChange={(e) => handleScoreChange(studentId, e.target.value)}
                          className={`flex h-9 w-24 rounded-lg border bg-background px-3 py-1 text-sm font-mono font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isEdited ? "border-warning text-warning focus-visible:ring-warning/50" : "border-input text-foreground"
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {rows.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground px-6 text-center">
                  <Filter className="h-8 w-8 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No students found.</p>
                </div>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Roll No</th>
                    <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Student Name</th>
                    <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Class</th>
                    <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs w-32">
                      Score (/{exam?.maxMarks ?? 100})
                    </th>
                    <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {rows.map((r) => {
                      const studentId = r.studentId?._id || r.studentId;
                      const currentScore = edits[studentId] !== undefined ? edits[studentId] : r.marksObtained ?? "";
                      const grade = getGrade(currentScore, exam?.maxMarks);
                      const isEdited = edits[studentId] !== undefined;
                      const section = r.sectionId;
                      return (
                        <motion.tr
                          key={studentId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`transition-colors hover:bg-muted/30 ${isEdited ? "bg-warning/5" : ""}`}
                        >
                          <td className="p-6 align-middle font-mono text-[11px] font-bold text-muted-foreground">
                            {r.studentId?.rollNumber}
                          </td>
                          <td className="p-6 align-middle font-bold text-[13px] text-foreground">
                            {r.studentId?.firstName} {r.studentId?.lastName}
                          </td>
                          <td className="p-6 align-middle">
                            {section && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                {section.gradeClass}-{section.section}
                              </span>
                            )}
                          </td>
                          <td className="p-6 align-middle">
                            <input
                              type="number"
                              min={0}
                              max={exam?.maxMarks}
                              value={currentScore}
                              onChange={(e) => handleScoreChange(studentId, e.target.value)}
                              className={`flex h-9 w-20 rounded-lg border bg-background px-3 py-1 text-sm font-mono font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                isEdited ? "border-warning text-warning focus-visible:ring-warning/50" : "border-input text-foreground"
                              }`}
                            />
                          </td>
                          <td className="p-6 align-middle text-center">
                            <span
                              className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md text-[11px] font-black tracking-wider border ${grade.color}`}
                            >
                              {grade.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="h-48 text-center align-middle">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Filter className="h-8 w-8 mb-3 opacity-20" />
                          <p className="text-sm font-medium">No students found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PAGINATION */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-3 sm:p-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of{" "}
              {pagination.total} entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] sm:max-w-none no-scrollbar">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === pagination.totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
