"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { UserPlus, MoreVertical, Trash2, GripVertical, Loader2, CalendarClock } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import TimetableBuilderModal from "./TimetableBuilderModal";

// Groups flat TeacherAssignment rows (one per teacher+section) into one
// card per teacher, with each section+subjects combo shown as a chip.
function groupByTeacher(assignments) {
  const map = new Map();
  for (const a of assignments) {
    const teacher = a.teacherId;
    if (!teacher?._id) continue;
    if (!map.has(teacher._id)) {
      map.set(teacher._id, {
        teacherId: teacher._id,
        name: `${teacher.firstName} ${teacher.lastName}`.trim(),
        designation: teacher.employeeId ? `Employee ID: ${teacher.employeeId}` : "",
        chips: [],
      });
    }
    const section = a.sectionId;
    const sectionLabel = section ? `${section.gradeClass} - ${section.section}` : "Unknown section";
    for (const subject of a.subjects) {
      map.get(teacher._id).chips.push({
        assignmentId: a._id,
        label: `${sectionLabel} (${subject})`,
        sectionId: section?._id,
        sectionLabel,
        subject,
      });
    }
  }
  return Array.from(map.values());
}

export default function TeacherAllocation({ refreshKey, onAllocateNew }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [timetableTeacher, setTimetableTeacher] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  async function loadAssignments() {
    setLoading(true);
    setError("");
    try {
      const res = await api.getAssignments({});
      setAssignments(res.data?.assignments || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load teacher allocations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const teachers = useMemo(() => groupByTeacher(assignments), [assignments]);

  const handleActionClick = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Removes a single section+subject chip. Since one TeacherAssignment row
  // holds ALL subjects for a (teacher, section) pair, removing a chip either
  // drops one subject from that row (PATCH) or deletes the row entirely if
  // it was the last subject.
  async function removeChip(teacherId, assignmentId, chipLabel) {
    setRemovingId(assignmentId);
    try {
      // Re-derive which subject this chip represents and how many chips
      // share the same assignmentId, from current state.
      const group = teachers.find((t) => t.teacherId === teacherId);
      const siblingChips = group ? group.chips.filter((c) => c.assignmentId === assignmentId) : [];

      if (siblingChips.length <= 1) {
        await api.deleteAssignment(assignmentId);
      } else {
        const remainingSubjects = siblingChips
          .filter((c) => c.label !== chipLabel)
          .map((c) => c.label.match(/\(([^)]+)\)$/)?.[1])
          .filter(Boolean);
        await api.updateAssignment(assignmentId, { subjects: remainingSubjects });
      }
      await loadAssignments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update allocation.");
    } finally {
      setRemovingId(null);
      setOpenMenuId(null);
    }
  }

  async function removeAllForTeacher(teacherId) {
    const group = teachers.find((t) => t.teacherId === teacherId);
    if (!group) return;
    const uniqueAssignmentIds = [...new Set(group.chips.map((c) => c.assignmentId))];
    setRemovingId(teacherId);
    try {
      await Promise.all(uniqueAssignmentIds.map((id) => api.deleteAssignment(id)));
      await loadAssignments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove allocations.");
    } finally {
      setRemovingId(null);
      setOpenMenuId(null);
    }
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Teacher Allocation</h3>
          <p className="text-xs text-slate-400">Faculty & subject assignments across sections</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading allocations…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 py-6">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div
              key={t.teacherId}
              className="h-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 w-full min-w-0">
                  {/* <GripVertical className="w-4 h-4 text-slate-300 shrink-0" /> */}
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground text-sm leading-tight truncate">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{t.designation}</p>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTimetableTeacher(t)}
                    title="Set timetable"
                    className="p-1.5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <CalendarClock className="w-4 h-4" />
                  </button>
                  <div className="relative" ref={openMenuId === t.teacherId ? menuRef : null}>
                    <button
                      onClick={(e) => handleActionClick(t.teacherId, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {removingId === t.teacherId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MoreVertical className="w-4 h-4" />
                      )}
                    </button>

                    {openMenuId === t.teacherId && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-20">
                        <button
                          onClick={() => removeAllForTeacher(t.teacherId)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove all allocations
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="bg-success/10 text-success text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Classes</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.chips.map((chip, idx) => (
                    <span
                      key={`${chip.assignmentId}-${idx}`}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {chip.label}
                      <button
                        type="button"
                        onClick={() => removeChip(t.teacherId, chip.assignmentId, chip.label)}
                        disabled={removingId === chip.assignmentId}
                        className="hover:text-destructive transition-colors disabled:opacity-40"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {t.chips.length === 0 && (
                    <span className="text-xs text-slate-400">No classes assigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={onAllocateNew}
            className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary bg-slate-50/20 dark:bg-slate-800/10 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center min-h-[190px] group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 text-slate-400 group-hover:text-primary flex items-center justify-center mb-3 transition-colors">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
              Allocate new teacher
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Assign faculty to a subject & section</span>
          </button>
        </div>
      )}

      {timetableTeacher && (
        <TimetableBuilderModal
          open={!!timetableTeacher}
          onClose={() => setTimetableTeacher(null)}
          mode="teacher"
          teacherId={timetableTeacher.teacherId}
          teacherName={timetableTeacher.name}
          counterparts={Object.values(
            timetableTeacher.chips.reduce((acc, chip) => {
              if (!chip.sectionId) return acc;
              if (!acc[chip.sectionId]) acc[chip.sectionId] = { id: chip.sectionId, label: chip.sectionLabel, subjects: [] };
              acc[chip.sectionId].subjects.push(chip.subject);
              return acc;
            }, {})
          )}
        />
      )}
    </div>
  );
}
