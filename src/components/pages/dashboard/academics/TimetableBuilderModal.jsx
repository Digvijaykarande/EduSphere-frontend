"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Loader2, Trash2, CalendarClock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PERIODS = [
  "Period 1",
  "Period 2",
  "Period 3",
  "Period 4",
  "Period 5",
  "Period 6",
  "Period 7",
  "Period 8",
];
const PERIOD_START = 540; // 9:00 AM, in minutes-from-midnight
const PERIOD_LENGTH = 45;

function startMinutesFor(periodIndex) {
  return PERIOD_START + periodIndex * PERIOD_LENGTH;
}

/**
 * Reusable grid for a principal to build out a timetable.
 *
 * mode="teacher": builds one teacher's week. `counterparts` = the sections
 * that teacher is allocated to (from Teacher Allocation), each with its
 * allowed subjects — so a cell picks (section, subject).
 *
 * mode="section": builds one class section's week. `counterparts` = the
 * teachers allocated to that section (from Class & Subject Maintenance /
 * Teacher Allocation), each with the subjects they're allowed to teach it —
 * so a cell picks (teacher, subject).
 */
export default function TimetableBuilderModal({
  open,
  onClose,
  mode,
  teacherId,
  teacherName,
  sectionId,
  sectionLabel,
  counterparts,
}) {
  const [slots, setSlots] = useState({}); // key `${day}-${period}` -> slot
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCell, setActiveCell] = useState(null); // { day, period }
  const [form, setForm] = useState({
    counterpartId: "",
    subject: "",
    room: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res =
        mode === "teacher"
          ? await api.getTeacherTimetable(teacherId)
          : await api.getSectionTimetable(sectionId);
      const week = res.data?.week || { days: DAYS, periods: [] };
      const map = {};
      for (const p of week.periods) {
        for (const day of DAYS) {
          const s = p[day];
          if (s) map[`${day}-${p.id}`] = s;
        }
      }
      setSlots(map);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load timetable.",
      );
    } finally {
      setLoading(false);
    }
  }, [mode, teacherId, sectionId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const openCell = (day, period) => {
    const existing = slots[`${day}-${period}`];
    setActiveCell({ day, period });
    setForm({
      counterpartId:
        (mode === "teacher" ? existing?.sectionId : existing?.teacherId) || "",
      subject: existing?.subject || "",
      room: existing?.room || "",
    });
  };

  const availableSubjects = useMemo(() => {
    const cp = counterparts.find((c) => c.id === form.counterpartId);
    return cp ? cp.subjects : [];
  }, [counterparts, form.counterpartId]);

  const saveCell = async () => {
    if (!activeCell || !form.counterpartId || !form.subject) return;
    setSaving(true);
    setError("");
    try {
      const periodIndex = PERIODS.indexOf(activeCell.period);
      const payload = {
        day: activeCell.day,
        period: activeCell.period,
        startMinutes: startMinutesFor(periodIndex),
        durationMinutes: PERIOD_LENGTH,
        subject: form.subject,
        room: form.room,
        sectionId: mode === "teacher" ? form.counterpartId : sectionId,
        teacherId: mode === "teacher" ? teacherId : form.counterpartId,
      };
      await api.upsertPrincipalTimetableSlot(payload);
      setActiveCell(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save slot.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCell = async (slot) => {
    setSaving(true);
    setError("");
    try {
      await api.deletePrincipalTimetableSlot(slot.id);
      setActiveCell(null);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to remove slot.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 shadow-2xl w-full sm:max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="stat-icon-box stat-icon-violet shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-foreground truncate">
                  {mode === "teacher"
                    ? `Timetable — ${teacherName}`
                    : `Timetable — ${sectionLabel}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Tap a cell to assign or edit a period
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 text-slate-400 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {error && (
              <p className="text-xs font-semibold text-rose-500 mb-3">
                {error}
              </p>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-28 text-[11px] font-bold text-slate-400 uppercase">
                        Period
                      </TableHead>
                      {DAYS.map((d) => (
                        <TableHead
                          key={d}
                          className="text-center text-[11px] font-extrabold text-slate-500 uppercase tracking-wider"
                        >
                          {d}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERIODS.map((period) => (
                      <TableRow key={period} className="hover:bg-transparent">
                        <TableCell className="text-xs font-bold text-slate-600 dark:text-slate-300 align-top py-1.5">
                          {period}
                        </TableCell>
                        {DAYS.map((day) => {
                          const key = `${day}-${period}`;
                          const slot = slots[key];
                          const isActive =
                            activeCell?.day === day &&
                            activeCell?.period === period;
                          return (
                            <TableCell key={key} className="p-1.5 align-top">
                              <button
                                type="button"
                                onClick={() => openCell(day, period)}
                                className={`w-full min-h-[64px] rounded-lg border p-2 text-left transition-all ${
                                  isActive
                                    ? "border-primary ring-2 ring-primary/20"
                                    : slot
                                      ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                                      : "border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-primary/5"
                                }`}
                              >
                                {slot ? (
                                  <>
                                    <p className="text-xs font-bold text-primary leading-tight truncate">
                                      {slot.subject}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {mode === "teacher"
                                        ? slot.classBadge
                                        : slot.teacher}
                                    </p>
                                    {slot.room && (
                                      <p className="text-[10px] text-slate-400 truncate">
                                        {slot.room}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-300">
                                    + Add
                                  </span>
                                )}
                              </button>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeCell && (
              <div className="sticky bottom-0 z-20 mt-5 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs font-bold">
                    {activeCell.day} · {activeCell.period}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      {mode === "teacher" ? "Section" : "Teacher"}
                    </Label>
                    <Select
                      value={form.counterpartId || undefined}
                      onValueChange={(value) =>
                        setForm({ ...form, counterpartId: value, subject: "" })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs font-semibold">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {counterparts.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="text-xs font-semibold"
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Subject
                    </Label>
                    <Select
                      value={form.subject || undefined}
                      onValueChange={(value) =>
                        setForm({ ...form, subject: value })
                      }
                      disabled={!form.counterpartId}
                    >
                      <SelectTrigger className="h-9 text-xs font-semibold disabled:opacity-50">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="text-xs font-semibold"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Room
                    </Label>
                    <Input
                      type="text"
                      value={form.room}
                      onChange={(e) =>
                        setForm({ ...form, room: e.target.value })
                      }
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  {slots[`${activeCell.day}-${activeCell.period}`] ? (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        deleteCell(
                          slots[`${activeCell.day}-${activeCell.period}`],
                        )
                      }
                      disabled={saving}
                      className="text-xs font-bold text-destructive hover:text-destructive px-0 hover:bg-transparent gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove slot
                    </Button>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveCell(null)}
                      className="text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveCell}
                      disabled={saving || !form.counterpartId || !form.subject}
                      className="text-xs font-bold px-4"
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
