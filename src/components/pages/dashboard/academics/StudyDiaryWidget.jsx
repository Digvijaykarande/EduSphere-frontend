"use client";

import { useState, useEffect, useCallback } from "react";
import { NotebookPen, Loader2, Trash2, Send } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function StudyDiaryWidget() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMyDiaryEntries();
      setEntries(res.data?.entries || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load your study diary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await api.createDiaryEntry({ content: content.trim(), duration: duration.trim() });
      setContent("");
      setDuration("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setEntries((prev) => prev.filter((e) => e._id !== id));
    try {
      await api.deleteDiaryEntry(id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete entry.");
      load();
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="stat-icon-box stat-icon-violet">
          <NotebookPen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Study Diary</h3>
          <p className="text-xs text-slate-400">Your personal study log — only visible to you</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-5 space-y-2">
        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you study today?"
          className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (e.g. 1h 20m)"
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-4 py-1.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Log entry
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-4">{error}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">No entries yet — log your first study session above.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {entries.map((e) => (
            <div key={e._id} className="flex items-start justify-between gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 dark:text-slate-300">{e.content}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(e.createdAt).toLocaleDateString()}
                  {e.duration ? ` · ${e.duration}` : ""}
                </p>
              </div>
              <button onClick={() => handleDelete(e._id)} className="p-1 rounded text-slate-300 hover:text-destructive shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
