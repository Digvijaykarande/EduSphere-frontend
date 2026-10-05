"use client";

import { useState, useEffect } from "react";
import { X, Users, Loader2, Check } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const STATUS_STYLES = {
  GRADED: "bg-success/10 text-success",
  SUBMITTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  IN_PROGRESS: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

// `assignment` here is the summary row from getMyCreatedAssignments
// ({ slug, title, sectionId, totalStudents, submittedCount, ... }).
export default function AssignmentSubmissionsPanel({ assignment, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gradingId, setGradingId] = useState(null);
  const [marksInput, setMarksInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!assignment) return;
    let cancelled = false;
    api
      .getAssignmentDetail(assignment.slug)
      .then((res) => {
        if (!cancelled) setDetail(res.data || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load submissions.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [assignment]);

  if (!assignment) return null;

  const roster = detail?.submissions || [];
  const submittedCount = roster.filter((s) => s.status !== "IN_PROGRESS").length;

  const startGrading = (submission) => {
    setGradingId(submission._id || submission.studentId?._id);
    setMarksInput(submission.marks || "");
    setFeedbackInput(submission.feedback || "");
  };

  const saveGrade = async (studentSlug) => {
    if (!marksInput.trim()) return;
    setSaving(true);
    try {
      await api.gradeSubmission(assignment.slug, studentSlug, {
        marks: marksInput.trim(),
        feedback: feedbackInput.trim(),
      });
      const res = await api.getAssignmentDetail(assignment.slug);
      setDetail(res.data || null);
      setGradingId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save grade.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="dashboard-card w-full max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="stat-icon-box stat-icon-violet">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">{assignment.title}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {assignment.sectionId?.gradeClass} - {assignment.sectionId?.section}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                {submittedCount}/{roster.length} submitted · Due {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-sm text-rose-500 py-6 text-center">{error}</p>
          ) : roster.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No students in this section.</p>
          ) : (
            roster.map((sub) => {
              const student = sub.studentId;
              const isGrading = gradingId === (sub._id || student?._id);
              return (
                <div
                  key={student?._id || sub._id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {student ? `${student.firstName} ${student.lastName}` : "Unknown student"}
                      </p>
                      {sub.submittedAt && (
                        <p className="text-[11px] text-slate-400 font-medium">
                          Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sub.marks && <span className="text-xs font-bold text-foreground">{sub.marks}</span>}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          STATUS_STYLES[sub.status] || STATUS_STYLES.IN_PROGRESS
                        }`}
                      >
                        {sub.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {sub.status === "SUBMITTED" && student && (
                    <div className="mt-2">
                      {isGrading ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Marks e.g. 18/20"
                            value={marksInput}
                            onChange={(e) => setMarksInput(e.target.value)}
                            className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => saveGrade(student.slug)}
                            disabled={saving || !marksInput.trim()}
                            className="p-1.5 rounded-lg bg-primary text-white disabled:opacity-40"
                          >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => setGradingId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startGrading(sub)}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Grade this submission
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
