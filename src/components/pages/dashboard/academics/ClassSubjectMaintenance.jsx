"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit, Save, X, ChevronLeft, ChevronRight, Loader2, CalendarClock, AlertTriangle } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { SUBJECTS } from "@/store/attendance.utils";
import TimetableBuilderModal from "./TimetableBuilderModal";

function SubjectTooltip({ children, label }) {
  return (
    <div className="group/tip relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tip:flex flex-col items-center z-20 opacity-0 group-hover/tip:opacity-100 translate-y-1 group-hover/tip:translate-y-0 transition-all duration-150">
        <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-foreground text-[11px] font-semibold py-1.5 px-3 rounded-lg whitespace-normal text-center shadow-xl border border-slate-100 dark:border-slate-700 max-w-[220px]">
          {label}
        </span>
        <span className="w-2 h-2 -mt-1 rotate-45 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700" />
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

export default function ClassSubjectMaintenance({ refreshKey, onNewClass }) {
  const [sections, setSections] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [timetableSection, setTimetableSection] = useState(null);
  const [timetableTeachers, setTimetableTeachers] = useState([]);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openTimetable = async (section) => {
    try {
      const res = await api.getAssignments({ sectionId: section._id });
      const byTeacher = new Map();
      for (const a of res.data?.assignments || []) {
        const teacher = a.teacherId;
        if (!teacher?._id) continue;
        if (!byTeacher.has(teacher._id)) {
          byTeacher.set(teacher._id, { id: teacher._id, label: `${teacher.firstName} ${teacher.lastName}`.trim(), subjects: [] });
        }
        byTeacher.get(teacher._id).subjects.push(...a.subjects);
      }
      setTimetableTeachers(Array.from(byTeacher.values()));
      setTimetableSection(section);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load teachers for this class.");
    }
  };

  const load = useCallback(async (page) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getSections({ page, limit: ITEMS_PER_PAGE });
      setSections(res.data?.sections || []);
      setPagination(res.data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(currentPage);
  }, [load, currentPage, refreshKey]);

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditForm({
      room: s.room || "",
      seatCapacity: String(s.seatCapacity ?? ""),
      subjects: [...(s.subjects || [])],
    });
  };

  const toggleEditSubject = (subject) => {
    setEditForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const saveEdit = async (section) => {
    setSaving(true);
    try {
      await api.updateSection(section.slug, {
        room: editForm.room,
        seatCapacity: editForm.seatCapacity ? Number(editForm.seatCapacity) : undefined,
        subjects: editForm.subjects,
      });
      setEditingId(null);
      await load(currentPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Open the confirmation modal instead of deleting immediately
  const handleDelete = (section) => {
    setError("");
    setDeleteTarget(section);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteSection(deleteTarget.slug);
      setDeleteTarget(null);
      await load(currentPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete class. It may still have active students.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = pagination.pages || 1;
  const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE;

  return (
    <div className="dashboard-card p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Class & Subject Maintenance</h3>
          <p className="text-xs text-slate-400">Manage sections, rooms, and subjects</p>
        </div>

        <button onClick={onNewClass} className="btn-pill-primary !px-4 !py-2.5 !text-xs gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>New class</span>
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-rose-500 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : sections.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No classes created yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-1">Class & section</th>
                <th className="pb-3 px-3">Room</th>
                <th className="pb-3 px-3">Subjects</th>
                <th className="pb-3 px-2">Seats</th>
                <th className="pb-3 pr-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {sections.map((s) => {
                const subjects = s.subjects || [];
                const visibleSubjects = subjects.slice(0, 3);
                const hiddenSubjects = subjects.slice(3);
                const isEditing = editingId === s._id;

                return (
                  <tr
                    key={s._id}
                    className={`${isEditing ? "bg-slate-50 dark:bg-slate-800/80" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"} transition-colors align-top`}
                  >
                    <td className="py-4 pl-1 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                          {s.gradeClass.replace(/\D/g, "") || s.gradeClass.charAt(0)}
                        </span>
                        <span className="font-bold text-foreground">
                          {s.gradeClass} - {s.section}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.room}
                          onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                          className="w-20 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 outline-none focus:border-primary"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{s.room || "—"}</span>
                      )}
                    </td>

                    <td className="py-4 px-3 max-w-[260px]">
                      {isEditing ? (
                        <div>
                          {editForm.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {editForm.subjects.map((sub) => (
                                <span
                                  key={sub}
                                  className="flex items-center gap-1 bg-primary text-white text-[11px] font-semibold pl-2 pr-1 py-0.5 rounded-full"
                                >
                                  {sub}
                                  <button type="button" onClick={() => toggleEditSubject(sub)} className="p-0.5 rounded-full hover:bg-white/20 transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {SUBJECTS.filter((sub) => !editForm.subjects.includes(sub)).map((subject) => (
                              <button
                                key={subject}
                                type="button"
                                onClick={() => toggleEditSubject(subject)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                              >
                                {subject} <Plus className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {visibleSubjects.length === 0 && <span className="text-xs text-slate-400">—</span>}
                          {visibleSubjects.map((sub, idx) => (
                            <SubjectTooltip key={idx} label={sub}>
                              <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center uppercase cursor-default">
                                {sub.charAt(0)}
                              </span>
                            </SubjectTooltip>
                          ))}
                          {hiddenSubjects.length > 0 && (
                            <SubjectTooltip label={hiddenSubjects.join(", ")}>
                              <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-[9px] flex items-center justify-center">
                                +{hiddenSubjects.length}
                              </span>
                            </SubjectTooltip>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-2">
                      {isEditing ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editForm.seatCapacity}
                          onChange={(e) => setEditForm({ ...editForm, seatCapacity: e.target.value.replace(/\D/g, "") })}
                          className="w-16 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 outline-none focus:border-primary"
                        />
                      ) : (
                        <span className="text-xs font-bold px-1 py-1 rounded-full bg-primary/10 text-primary">
                          {s.seatCapacity ?? "—"} Seats
                        </span>
                      )}
                    </td>

                    <td className="py-4 pr-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(s)} disabled={saving} className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-all disabled:opacity-50">
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => openTimetable(s)} title="Set timetable" className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                              <CalendarClock className="w-4 h-4" />
                            </button>
                            <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination.total > 0 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Showing <span className="text-foreground">{startIndex + 1}</span> to{" "}
            <span className="text-foreground">{Math.min(startIndex + ITEMS_PER_PAGE, pagination.total)}</span> of{" "}
            <span className="text-foreground">{pagination.total}</span> entries
          </span>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm border border-slate-200 dark:border-slate-600"
                    : "text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 border border-transparent"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {timetableSection && (
        <TimetableBuilderModal
          open={!!timetableSection}
          onClose={() => setTimetableSection(null)}
          mode="section"
          sectionId={timetableSection._id}
          sectionLabel={`${timetableSection.gradeClass} - ${timetableSection.section}`}
          counterparts={timetableTeachers}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-foreground">Delete class</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {deleteTarget.gradeClass} - {deleteTarget.section}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}