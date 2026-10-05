"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Send,
  Loader2,
  AlertCircle,
  BarChart3,
  CheckSquare
} from "lucide-react";
import { useExamStore } from "@/store/examStore";

const STATUS_STYLE = {
  Published: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  Processing: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
  "Not Started": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
};

export default function ResultsManagement() {
  const results = useExamStore((s) => s.resultsQueue);
  const isLoadingResultsQueue = useExamStore((s) => s.isLoadingResultsQueue);
  const fetchResultsQueue = useExamStore((s) => s.fetchResultsQueue);
  const publishResults = useExamStore((s) => s.publishResults);

  const [publishingId, setPublishingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResultsQueue().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePublish = async (id) => {
    setPublishingId(id);
    setError(null);
    try {
      await publishResults(id);
      setToast("Results successfully published to the student portal.");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to publish results.");
    } finally {
      setPublishingId(null);
    }
  };

  const metrics = useMemo(() => {
    const total = results.length;
    const published = results.filter((r) => r.status === "Published").length;
    const ready = results.filter((r) => r.entered === r.total && r.status !== "Published").length;
    return { total, published, ready };
  }, [results]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Results Pipeline</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monitor grading progress and publish final scorecards.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-card border border-border text-xs font-bold text-foreground px-4 py-2.5 rounded-xl hover:bg-muted/50 hover:border-primary/30 transition-all shadow-sm group w-full sm:w-auto">
          <FileSpreadsheet className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          Export Report
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Exams</p>
            <p className="text-2xl font-black text-foreground">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ready to Publish</p>
            <p className="text-2xl font-black text-foreground">{metrics.ready}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Published</p>
            <p className="text-2xl font-black text-foreground">{metrics.published}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">

        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-4">Exam & Class</div>
          <div className="col-span-4">Grading Progress</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {isLoadingResultsQueue && results.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground gap-2 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading results…
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {results.map((r) => {
              const pct = r.total ? Math.round((r.entered / r.total) * 100) : 0;
              const ready = pct === 100 && r.status !== "Published";

              return (
                <div key={r.id} className="flex flex-col gap-4 px-4 py-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6 sm:py-5 sm:items-center hover:bg-muted/10 transition-colors">

                  <div className="flex items-start justify-between gap-3 sm:col-span-4 sm:flex-col sm:justify-center sm:block">
                    <div>
                      <h3 className="text-sm sm:text-[15px] font-bold text-foreground leading-tight">{r.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-muted-foreground">
                        <span className="text-primary font-semibold">Class {r.class}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span>{r.subject}</span>
                      </div>
                    </div>
                    <span className={`sm:hidden shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${STATUS_STYLE[r.status]}`}>
                      {r.status === "Published" && <CheckCircle2 className="h-3 w-3" />}
                      {r.status === "Processing" && <Clock className="h-3 w-3" />}
                      {r.status === "Not Started" && <AlertCircle className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </div>

                  <div className="sm:col-span-4 flex flex-col justify-center sm:pr-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Marks Entered</span>
                      <span className="text-[11px] font-black text-foreground">{r.entered} / {r.total}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-primary"}`}
                      />
                    </div>
                  </div>

                  <div className="hidden sm:flex sm:col-span-2 items-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLE[r.status]}`}>
                      {r.status === "Published" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {r.status === "Processing" && <Clock className="h-3.5 w-3.5" />}
                      {r.status === "Not Started" && <AlertCircle className="h-3.5 w-3.5" />}
                      {r.status}
                    </span>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end">
                    {r.status === "Published" ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Live
                      </div>
                    ) : (
                      <button
                        disabled={!ready || publishingId === r.id}
                        onClick={() => handlePublish(r.id)}
                        className={`inline-flex items-center justify-center gap-2 h-9 px-5 rounded-xl text-[12px] font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto ${
                          ready
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                            : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                        }`}
                      >
                        {publishingId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {publishingId === r.id ? "Publishing" : "Publish"}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}

            {results.length === 0 && (
              <div className="p-12 text-center text-sm font-medium text-muted-foreground">
                No results data available.
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 bg-foreground text-background text-sm font-bold px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-border"
          >
            <CheckCircle2 size={18} className="text-emerald-500" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
