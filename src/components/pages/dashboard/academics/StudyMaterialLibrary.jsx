"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderOpen, FileText, Video, Link as LinkIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import AddMaterialModal from "./AddMaterialModal";

const TYPE_ICON = { pdf: FileText, video: Video, folder: FolderOpen, link: LinkIcon };

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StudyMaterialLibrary() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getMyTeacherMaterials();
      setMaterials(res.data?.materials || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load materials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreated = () => {
    setIsAddOpen(false);
    load();
  };

  const handleDelete = async (slug) => {
    setMaterials((prev) => prev.filter((m) => m.slug !== slug));
    try {
      await api.deleteStudyMaterial(slug);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete material.");
      load();
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-violet">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Study Material Library</h3>
            <p className="text-xs text-slate-400">Notes, PDFs, videos & links you've shared</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-6">{error}</p>
      ) : materials.length === 0 ? (
        <p className="text-sm text-slate-400 py-6">No materials  yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {materials.map((m) => {
            const Icon = TYPE_ICON[m.type] || FileText;
            return (
              <div
                key={m._id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <a href={m.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate block">
                    {m.title}
                  </a>
                  <p className="text-[11px] text-slate-400 truncate">
                    {m.sectionId?.gradeClass} - {m.sectionId?.section}
                    {m.subject ? ` • ${m.subject}` : ""}
                    {m.fileSize ? ` • ${formatSize(m.fileSize)}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(m.slug)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isAddOpen && <AddMaterialModal onClose={() => setIsAddOpen(false)} onCreate={handleCreated} />}
    </div>
  );
}
