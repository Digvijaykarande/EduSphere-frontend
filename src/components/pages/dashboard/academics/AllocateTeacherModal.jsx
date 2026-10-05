"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, UserPlus, ChevronDown, Check, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api, ApiError } from "@/lib/api";
import { SUBJECTS } from "@/store/attendance.utils";

/* Compact select dropdown — same pattern used in CreateClassModal */
function SelectField({ label, value, displayValue, options, onChange, renderOption, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((p) => !p)}
        className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all disabled:opacity-50 disabled:pointer-events-none ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
        }`}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto py-1"
          >
            {options.length === 0 && (
              <p className="px-3.5 py-2 text-xs text-slate-400">No options available</p>
            )}
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                    selected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {renderOption ? renderOption(opt) : opt.label}
                  {selected && <Check className="w-4 h-4 shrink-0" />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CLASS_GRADES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTION_LETTERS = ["A", "B", "C", "D", "E"];

export default function AllocateTeacherModal({ onClose, onAllocate }) {
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [teacherId, setTeacherId] = useState("");
  const [sectionId, setSectionId] = useState(""); // "" or "__new__" or a real Section._id
  const [newGradeClass, setNewGradeClass] = useState(CLASS_GRADES[9]);
  const [newSectionLetter, setNewSectionLetter] = useState(SECTION_LETTERS[0]);

  const [pendingSubjects, setPendingSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]); // [{ sectionId, sectionLabel, subject }]

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [creatingSection, setCreatingSection] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [teachersRes, sectionsRes] = await Promise.all([
          api.getTeachers({ limit: 200 }),
          api.getSections({ limit: 200 }),
        ]);
        if (cancelled) return;
        setTeachers(teachersRes.data?.teachers || []);
        setSections(sectionsRes.data?.sections || []);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Failed to load teachers/sections.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: t._id,
        label: `${t.firstName} ${t.lastName}`.trim(),
      })),
    [teachers]
  );

  const sectionOptions = useMemo(() => {
    const existing = sections.map((s) => ({
      value: s._id,
      label: `${s.gradeClass} - ${s.section}`,
    }));
    return [...existing, { value: "__new__", label: "+ Create new section" }];
  }, [sections]);

  const selectedTeacher = teachers.find((t) => t._id === teacherId);
  const selectedSection = sections.find((s) => s._id === sectionId);
  const isCreatingNewSection = sectionId === "__new__";

  const currentSectionLabel = isCreatingNewSection
    ? `${newGradeClass} - Section ${newSectionLetter}`
    : selectedSection
    ? `${selectedSection.gradeClass} - ${selectedSection.section}`
    : "";

  const toggleSubject = (subject) => {
    setPendingSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  // Resolves a real Section._id for the currently selected slot, creating
  // the Section on the backend first if "+ Create new section" was chosen.
  // The new section's classTeacherId is set to the teacher being allocated
  // here — a sensible default the principal can reassign later from the
  // Sections screen.
  async function resolveSectionId() {
    if (!isCreatingNewSection) return sectionId;

    setCreatingSection(true);
    try {
      const res = await api.createSection({
        gradeClass: newGradeClass,
        section: `Section ${newSectionLetter}`,
        classTeacherId: teacherId,
      });
      const created = res.data?.section;
      if (!created) throw new Error("Section creation returned no data");
      setSections((prev) => [...prev, created]);
      return created._id;
    } finally {
      setCreatingSection(false);
    }
  }

  const addAssignment = async () => {
    if (!teacherId || !sectionId || pendingSubjects.length === 0) return;
    setSubmitError("");
    try {
      const resolvedSectionId = await resolveSectionId();
      const label = currentSectionLabel;
      const newEntries = pendingSubjects
        .filter(
          (sub) => !assignments.some((a) => a.sectionId === resolvedSectionId && a.subject === sub)
        )
        .map((sub) => ({ sectionId: resolvedSectionId, sectionLabel: label, subject: sub }));

      setAssignments((prev) => [...prev, ...newEntries]);
      setPendingSubjects([]);
      // Once a section has been created for real, switch the selector to
      // point at it directly rather than staying on "__new__".
      if (isCreatingNewSection) setSectionId(resolvedSectionId);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to create section.");
    }
  };

  const removeAssignment = (idx) => {
    setAssignments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherId || assignments.length === 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      // Group pending assignment chips by sectionId so each Section gets one
      // TeacherAssignment row with all its subjects (matches the backend's
      // upsert-merge semantics in createOrMergeAssignment).
      const bySection = new Map();
      for (const a of assignments) {
        if (!bySection.has(a.sectionId)) bySection.set(a.sectionId, []);
        bySection.get(a.sectionId).push(a.subject);
      }

      const results = [];
      for (const [secId, subjects] of bySection.entries()) {
        const res = await api.createAssignment({ teacherId, sectionId: secId, subjects });
        results.push(res.data?.assignment);
      }

      onAllocate({
        teacher: selectedTeacher,
        assignments: results.filter(Boolean),
      });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save allocation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 className="text-lg font-bold text-foreground">Allocate Teacher to Class</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading teachers & sections…
          </div>
        ) : loadError ? (
          <div className="p-6 text-sm text-rose-500">{loadError}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4 overflow-y-auto">
            <SelectField
              label="Teacher"
              value={teacherId}
              displayValue={selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : "Select a teacher"}
              options={teacherOptions}
              onChange={(v) => setTeacherId(v)}
            />

            {/* Class + Section + Subject assignment builder */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">
                Assign classes & subjects
              </label>

              <SelectField
                label="Section"
                value={sectionId}
                displayValue={
                  isCreatingNewSection ? "+ Create new section" : selectedSection ? currentSectionLabel : "Select a section"
                }
                options={sectionOptions}
                onChange={(v) => setSectionId(v)}
              />

              {isCreatingNewSection && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <SelectField
                    label="Class grade"
                    value={newGradeClass}
                    displayValue={newGradeClass}
                    options={CLASS_GRADES.map((g) => ({ value: g, label: g }))}
                    onChange={setNewGradeClass}
                  />
                  <SelectField
                    label="Section"
                    value={newSectionLetter}
                    displayValue={`Section ${newSectionLetter}`}
                    options={SECTION_LETTERS.map((s) => ({ value: s, label: `Section ${s}` }))}
                    onChange={setNewSectionLetter}
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-400 mb-2 mt-3">
                {sectionId
                  ? `Click subjects to teach for ${currentSectionLabel}, then add`
                  : "Select a section first"}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {SUBJECTS.map((subject) => {
                  const selected = pendingSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      disabled={!sectionId || !teacherId}
                      onClick={() => toggleSubject(subject)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                        selected
                          ? "bg-primary text-white border-primary"
                          : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {subject} {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={addAssignment}
                disabled={!teacherId || !sectionId || pendingSubjects.length === 0 || creatingSection}
                className="w-full text-xs font-bold text-primary border border-primary/30 hover:bg-primary/5 rounded-lg py-2 transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5"
              >
                {creatingSection ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating section…
                  </>
                ) : (
                  `+ Add ${currentSectionLabel || "class"} assignment`
                )}
              </button>

              {assignments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <AnimatePresence initial={false}>
                    {assignments.map((entry, idx) => (
                      <motion.span
                        key={`${entry.sectionId}-${entry.subject}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-lg"
                      >
                        {entry.sectionLabel} ({entry.subject})
                        <button
                          type="button"
                          onClick={() => removeAssignment(idx)}
                          className="p-0.5 rounded hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {submitError && <p className="text-xs font-semibold text-rose-500">{submitError}</p>}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignments.length === 0 || submitting}
                className="px-5 py-2.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>{submitting ? "Saving…" : "Allocate faculty"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
