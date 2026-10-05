"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useExamStore } from "@/store/examStore";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Object-Oriented Software Eng.",
  "Full-Stack Web Dev",
  "Database Systems",
];
const EXAM_TYPES = ["Theory", "Practical", "Oral", "Project"];

const STEPS = [
  "Basic Details",
  "Classes & Schedule",
  "Marking Scheme",
  "Review",
];

const emptyForm = {
  title: "",
  subject: "",
  type: "Theory",
  sectionIds: [],
  date: "",
  startTime: "",
  endTime: "",
  room: "",
  maxMarks: 100,
  passingMarks: 40,
  weightage: 20,
  instructions: "",
};

function formFromExam(exam) {
  return {
    title: exam.title ?? "",
    subject: exam.subject ?? "",
    type: exam.type ?? "Theory",
    sectionIds: (exam.sections ?? []).map((s) => (typeof s === "string" ? s : s._id)),
    date: exam.date ?? "",
    startTime: exam.startTime ?? "",
    endTime: exam.endTime ?? "",
    room: exam.room ?? "",
    maxMarks: exam.maxMarks ?? 100,
    passingMarks: exam.passingMarks ?? 40,
    weightage: exam.weightage ?? 20,
    instructions: exam.instructions ?? "",
  };
}

export default function CreateExamModal({ isOpen, onClose, onCreated, editingExam }) {
  const isEditing = !!editingExam;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  const createExam = useExamStore((s) => s.createExam);
  const updateExam = useExamStore((s) => s.updateExam);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingSections(true);
    api
      .getSections()
      .then((res) => {
        const list = res.data?.sections ?? res.sections ?? [];
        setSections(list);
      })
      .catch(() => setSections([]))
      .finally(() => setLoadingSections(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
    setFormData(editingExam ? formFromExam(editingExam) : emptyForm);
  }, [isOpen, editingExam]);

  const update = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const toggleSection = (sectionId) => {
    setFormData((prev) => ({
      ...prev,
      sectionIds: prev.sectionIds.includes(sectionId)
        ? prev.sectionIds.filter((s) => s !== sectionId)
        : [...prev.sectionIds, sectionId],
    }));
  };

  const sectionLabel = (section) => `${section.gradeClass}-${section.section}`;

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!formData.title.trim()) e.title = "Give this exam a name";
      if (!formData.subject) e.subject = "Choose a subject";
    }
    if (step === 1) {
      if (formData.sectionIds.length === 0)
        e.sectionIds = "Select at least one class or section";
      if (!formData.date) e.date = "Pick a date";
      if (!formData.startTime) e.startTime = "Set a start time";
      if (!formData.endTime) e.endTime = "Set an end time";
      if (
        formData.startTime &&
        formData.endTime &&
        formData.startTime >= formData.endTime
      ) {
        e.endTime = "End time must be after start time";
      }
    }
    if (step === 2) {
      if (!formData.maxMarks || formData.maxMarks <= 0)
        e.maxMarks = "Enter total marks";
      if (Number(formData.passingMarks) > Number(formData.maxMarks))
        e.passingMarks = "Can't exceed total marks";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        title: formData.title,
        subject: formData.subject,
        type: formData.type,
        sectionIds: formData.sectionIds,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        maxMarks: Number(formData.maxMarks),
        passingMarks: Number(formData.passingMarks),
        weightage: Number(formData.weightage),
        instructions: formData.instructions,
      };

      const exam = isEditing
        ? await updateExam(editingExam.slug || editingExam._id, payload)
        : await createExam(payload);

      setSubmitted(true);
      onCreated?.(exam);
    } catch (err) {
      setSubmitError(
        err.message || `Failed to ${isEditing ? "update" : "create"} exam. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setFormData(emptyForm);
      setErrors({});
      setSubmitted(false);
      setSubmitError(null);
    }, 250);
  };

  const selectedSectionLabels = sections
    .filter((s) => formData.sectionIds.includes(s._id))
    .map(sectionLabel);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-2xl">
        {submitted ? (
          <div className="p-8 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? "Exam updated" : "Exam created"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {formData.title} is scheduled for{" "}
              {selectedSectionLabels.join(", ")} on{" "}
              {formData.date || "the selected date"}.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <>
            <ModalHeader>
              <div>
                <ModalTitle>{isEditing ? "Edit Exam" : "Create New Exam"}</ModalTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Step {step + 1} of {STEPS.length} — {STEPS[step]}
                </p>
              </div>
            </ModalHeader>

            <div className="flex items-center gap-2 pt-4">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="py-4 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1.5">
                        <Label htmlFor="ex-title">Exam Title</Label>
                        <Input
                          id="ex-title"
                          type="text"
                          placeholder="e.g., Unit Test 1"
                          value={formData.title}
                          onChange={(e) => update({ title: e.target.value })}
                        />
                        {errors.title && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label>Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(v) => update({ subject: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECTS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.subject && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label>Exam Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(v) => update({ type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXAM_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>Classes / Sections</Label>
                        {loadingSections ? (
                          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                            <Loader2 size={14} className="animate-spin" /> Loading sections…
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {sections.map((sec) => (
                              <button
                                key={sec._id}
                                type="button"
                                onClick={() => toggleSection(sec._id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                  formData.sectionIds.includes(sec._id)
                                    ? "bg-primary text-white border-primary"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/40"
                                }`}
                              >
                                {sectionLabel(sec)}
                              </button>
                            ))}
                            {sections.length === 0 && (
                              <p className="text-xs text-slate-400">
                                No sections found for your school.
                              </p>
                            )}
                          </div>
                        )}
                        {errors.sectionIds && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.sectionIds}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ex-date">Date</Label>
                        <Input
                          id="ex-date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => update({ date: e.target.value })}
                        />
                        {errors.date && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ex-room">Room / Venue</Label>
                        <Input
                          id="ex-room"
                          type="text"
                          placeholder="e.g., Room 204"
                          value={formData.room}
                          onChange={(e) => update({ room: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ex-start">Start Time</Label>
                        <div className="relative">
                          <Clock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            id="ex-start"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) =>
                              update({ startTime: e.target.value })
                            }
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ex-end">End Time</Label>
                        <div className="relative">
                          <Clock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            id="ex-end"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) =>
                              update({ endTime: e.target.value })
                            }
                            className="pl-9"
                          />
                        </div>
                        {errors.endTime && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.endTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="ex-max">Max Marks</Label>
                        <Input
                          id="ex-max"
                          type="number"
                          min={1}
                          value={formData.maxMarks}
                          onChange={(e) =>
                            update({ maxMarks: Number(e.target.value) })
                          }
                          className="font-mono"
                        />
                        {errors.maxMarks && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.maxMarks}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ex-pass">Passing Marks</Label>
                        <Input
                          id="ex-pass"
                          type="number"
                          min={0}
                          value={formData.passingMarks}
                          onChange={(e) =>
                            update({ passingMarks: Number(e.target.value) })
                          }
                          className="font-mono"
                        />
                        {errors.passingMarks && (
                          <p className="text-[11px] text-rose-500 font-semibold">
                            {errors.passingMarks}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ex-weight">Weightage (%)</Label>
                        <Input
                          id="ex-weight"
                          type="number"
                          min={0}
                          max={100}
                          value={formData.weightage}
                          onChange={(e) =>
                            update({ weightage: Number(e.target.value) })
                          }
                          className="font-mono"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1.5">
                        <Label htmlFor="ex-instr">Instructions (optional)</Label>
                        <Textarea
                          id="ex-instr"
                          rows={2}
                          value={formData.instructions}
                          onChange={(e) =>
                            update({ instructions: e.target.value })
                          }
                          placeholder="e.g., Bring your own calculator; no notes allowed."
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <SummaryRow label="Title" value={formData.title || "—"} />
                        <SummaryRow label="Subject" value={formData.subject || "—"} />
                        <SummaryRow label="Type" value={formData.type} />
                        <SummaryRow
                          label="Sections"
                          value={selectedSectionLabels.join(", ") || "—"}
                        />
                        <SummaryRow label="Date" value={formData.date || "—"} />
                        <SummaryRow
                          label="Time"
                          value={
                            formData.startTime && formData.endTime
                              ? `${formData.startTime} – ${formData.endTime}`
                              : "—"
                          }
                        />
                        <SummaryRow label="Room" value={formData.room || "—"} />
                        <SummaryRow
                          label="Marks"
                          value={`${formData.passingMarks} / ${formData.maxMarks} to pass`}
                        />
                        <SummaryRow
                          label="Weightage"
                          value={`${formData.weightage}% of final grade`}
                        />
                      </div>
                      {submitError && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />{" "}
                          {submitError}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={step === 0 ? handleClose : handleBack}
                disabled={submitting}
              >
                {step > 0 && <ChevronLeft size={16} className="mr-1" />}
                {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" size="sm" onClick={handleNext}>
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button type="button" size="sm" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin mr-1.5" />
                  ) : (
                    <Check size={16} className="mr-1.5" />
                  )}
                  {submitting
                    ? isEditing
                      ? "Saving…"
                      : "Creating…"
                    : isEditing
                    ? "Save Changes"
                    : "Create Exam"}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
        {value}
      </p>
    </div>
  );
}