"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Loader2, Pencil, Check, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function SyllabusTracker() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPct, setEditPct] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMyTeacherSyllabus();
      setSubjects(res.data?.syllabus || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load syllabus.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditPct(String(item.progressPercentage));
    setEditUnit(item.currentUnit || "");
  };

  const saveEdit = async (item) => {
    setSaving(true);
    try {
      await api.upsertSyllabusProgress({
        sectionId: item.sectionId._id,
        subject: item.subject,
        progressPercentage: Number(editPct) || 0,
        currentUnit: editUnit,
        color: item.color,
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save progress.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="stat-icon-box stat-icon-violet">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Syllabus Tracking</h3>
          <p className="text-xs text-slate-400">Progress across your subjects</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-4">{error}</p>
      ) : subjects.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">No syllabus progress tracked yet. Mark attendance for a class first, then set progress here.</p>
      ) : (
        <div className="space-y-5">
          {subjects.map((item) => {
            const isEditing = editingId === item._id;
            return (
              <div key={item._id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {item.subject}
                    <span className="text-slate-400 font-medium ml-1.5">
                      · {item.sectionId?.gradeClass} {item.sectionId?.section}
                    </span>
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editPct}
                        onChange={(e) => setEditPct(e.target.value)}
                        className="w-14 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 outline-none focus:border-primary"
                      />
                      <button onClick={() => saveEdit(item)} disabled={saving} className="p-1 rounded text-success hover:bg-success/10">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(item)} className="flex items-center gap-1 font-extrabold text-primary hover:underline">
                      {item.progressPercentage}% <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.progressPercentage}%`, backgroundColor: item.color || "hsl(var(--primary))" }}
                  />
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="Current unit"
                    className="w-full text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 outline-none focus:border-primary"
                  />
                ) : (
                  <p className="text-[11px] text-slate-400 font-medium">Current: {item.currentUnit || "—"}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
