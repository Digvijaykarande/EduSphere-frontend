"use client";

import { useState } from "react";
import { X, Clock, CheckCircle, Upload, Paperclip, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const STATUS_META = {
  IN_PROGRESS: { label: "In progress", className: "text-primary bg-primary/10" },
  SUBMITTED: { label: "Submitted", className: "text-success bg-success/10" },
  GRADED: { label: "Graded", className: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
};

// `assignment` here is the merged shape from getMyVisibleAssignments:
// { ...Assignment fields, submission: { status, marks, feedback, attachments } }
export default function AssignmentDetailsModal({ assignment, onClose, onStatusChange }) {
  const [pendingFiles, setPendingFiles] = useState([]); // local File objects, not yet uploaded
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submission = assignment.submission || { status: "IN_PROGRESS", attachments: [] };
  const meta = STATUS_META[submission.status] || STATUS_META.IN_PROGRESS;

  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      let uploaded = [];
      if (pendingFiles.length > 0) {
        setUploading(true);
        const res = await api.uploadFiles(
          pendingFiles.map((f) => f.file),
          "submission"
        );
        uploaded = res.data?.attachments || [];
        setUploading(false);
      }

      await api.submitHomeworkAssignment(assignment.slug, {
        attachments: [...(submission.attachments || []), ...uploaded],
      });

      onStatusChange(assignment.slug, "SUBMITTED");
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const allAttachments = [...(submission.attachments || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full mb-2 ${meta.className}`}
            >
              {submission.status === "SUBMITTED" && <CheckCircle className="w-3 h-3" />}
              {submission.status === "IN_PROGRESS" && <Clock className="w-3 h-3" />}
              {meta.label}
              {submission.status === "GRADED" && submission.marks && (
                <span className="text-primary font-extrabold">· {submission.marks}</span>
              )}
            </span>
            <h3 className="text-lg font-bold text-foreground leading-tight">{assignment.title}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {assignment.subject} • {assignment.sectionId?.gradeClass} - {assignment.sectionId?.section}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-4 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Teacher</p>
              <p className="font-bold text-foreground">
                {assignment.createdBy ? `${assignment.createdBy.firstName} ${assignment.createdBy.lastName}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Given</p>
              <p className="font-bold text-foreground">{new Date(assignment.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Deadline</p>
              <p className="font-bold text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {assignment.description && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">Instructions</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{assignment.description}</p>
            </div>
          )}

          {assignment.attachments?.length > 0 && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                Reference material
              </p>
              <ul className="space-y-2">
                {assignment.attachments.map((f, i) => (
                  <li key={i}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2 hover:border-primary transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-primary truncate">{f.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {submission.feedback && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">Feedback</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3">
                {submission.feedback}
              </p>
            </div>
          )}

          {submission.status === "IN_PROGRESS" && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-2">
                Attach your work <span className="normal-case font-medium">(optional)</span>
              </p>

              <input
                type="file"
                id="assignment-upload-input"
                multiple
                onChange={(e) => {
                  if (e.target.files?.length) handleFilesSelected(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <label
                htmlFor="assignment-upload-input"
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/40 dark:bg-slate-800/20 hover:bg-primary/5 transition-all py-5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-primary">Click to attach files</span>
                <span className="text-[10px] text-slate-400">PDFs, images, docs — uploaded to Cloudinary</span>
              </label>

              {pendingFiles.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {pendingFiles.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-foreground truncate">{f.file.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              {error && <p className="text-xs font-semibold text-rose-500 mt-2">{error}</p>}
            </div>
          )}

          {allAttachments.length > 0 && submission.status !== "IN_PROGRESS" && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                Your submission
              </p>
              <ul className="space-y-2">
                {allAttachments.map((f, i) => (
                  <li key={i}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2 hover:border-primary transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-primary truncate">{f.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
          >
            Close
          </button>
          {submission.status === "IN_PROGRESS" && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>{uploading ? "Uploading…" : submitting ? "Submitting…" : "Mark as submitted"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
