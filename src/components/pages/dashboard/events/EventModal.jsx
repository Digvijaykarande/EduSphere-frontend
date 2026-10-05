"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Trash2,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LIST,
  CATEGORY_META,
  toKey,
  formatDayLabel,
  formatShort,
  getCategoryLabel,
} from "./events.utils";

export default function EventModal({
  modalDate,
  closeModal,
  eventsByDate,
  deleteEvent,
  handleAddEvent,
  draft,
  setDraft,
  onSelectDate,
  canManage,
  saving,
}) {
  const [activeDate, setActiveDate] = useState(modalDate);
  const [viewStartDate, setViewStartDate] = useState(modalDate);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (modalDate) {
      setActiveDate(modalDate);
      setViewStartDate(modalDate);
    }
  }, [modalDate]);

  const datePills = useMemo(() => {
    if (!viewStartDate) return [];
    const base = new Date(viewStartDate);
    const pills = [];
    base.setDate(base.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      pills.push(d);
    }
    return pills;
  }, [viewStartDate]);

  const formatInputDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (newDate) => {
    setActiveDate(newDate);
    setViewStartDate(newDate);
    if (onSelectDate) onSelectDate(newDate);
  };

  const shiftWeek = (direction) => {
    setViewStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + direction * 7);
      return d;
    });
  };

  const handleCustomCategorySelect = (cat) => {
    setDraft((d) => ({ ...d, category: cat }));
    setIsCategoryDropdownOpen(false);
  };

  return (
    <AnimatePresence>
      {modalDate && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-4 p-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-20 backdrop-blur-sm"
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              <div className="w-full md:w-1/2 flex flex-col border-r border-slate-100 dark:border-slate-800 overflow-y-auto no-scrollbar">
                <div className="px-6 pt-4 pb-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
                    Schedule Event
                  </p>
                  <div className="relative inline-block group">
                    <input
                      type="date"
                      value={formatInputDate(activeDate)}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const [year, month, day] = e.target.value
                          .split("-")
                          .map(Number);
                        handleDateChange(new Date(year, month - 1, day));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select a specific date"
                    />
                    <p className="text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                      {formatDayLabel(activeDate)}{" "}
                      <ChevronDown
                        size={18}
                        className="text-slate-400 group-hover:text-indigo-500"
                      />
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => shiftWeek(-1)}
                      className="h-8 w-8"
                    >
                      <ChevronLeft size={18} />
                    </Button>

                    <div className="flex-1 flex items-center justify-between gap-1">
                      {datePills.map((pillDate) => {
                        const isSelected =
                          toKey(pillDate) === toKey(activeDate);
                        const dayName = pillDate.toLocaleDateString("en-US", {
                          weekday: "narrow",
                        });
                        const dayNum = pillDate.getDate();

                        return (
                          <button
                            type="button"
                            key={pillDate.toISOString()}
                            onClick={() => handleDateChange(pillDate)}
                            className={`flex-1 min-w-[32px] py-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold scale-[1.08]"
                                : "text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <span
                              className={`text-[10px] uppercase ${isSelected ? "text-indigo-100" : "opacity-60"}`}
                            >
                              {dayName}
                            </span>
                            <span className="text-sm font-semibold">
                              {dayNum}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => shiftWeek(1)}
                      className="h-8 w-8"
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>

                {!canManage ? (
                  <div className="px-6 pb-6 flex-1 flex flex-col items-start justify-center">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      View only
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Only principals and teachers can add or remove events.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleAddEvent}
                    className="px-6 pb-6 space-y-3 flex-1 flex flex-col"
                  >
                    <input
                      type="hidden"
                      name="activeEventDate"
                      value={formatInputDate(activeDate)}
                    />

                    <div className="space-y-1">
                      <Label htmlFor="ev-title">Event Title</Label>
                      <Input
                        id="ev-title"
                        type="text"
                        required
                        value={draft.title}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        placeholder="e.g., Annual Science Fair"
                      />
                    </div>

                    <div className="relative z-30 space-y-1">
                      <Label>Category</Label>
                      <button
                        type="button"
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                        className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl py-2.5 px-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <span className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100 font-medium">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background: CATEGORY_META[draft.category]?.dot,
                            }}
                          />
                          {draft.category}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isCategoryDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setIsCategoryDropdownOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -5, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -5, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 overflow-hidden"
                            >
                              {CATEGORY_LIST.map((cat) => {
                                const isSelected = draft.category === cat;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() =>
                                      handleCustomCategorySelect(cat)
                                    }
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                      isSelected
                                        ? "bg-slate-50 dark:bg-slate-700/50"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                          background: CATEGORY_META[cat]?.dot,
                                        }}
                                      />
                                      <span
                                        className={`font-medium ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                                      >
                                        {cat}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <Check
                                        size={14}
                                        className="text-indigo-600 dark:text-indigo-400"
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {draft.category === "Other" && (
                      <div className="space-y-1">
                        <Label htmlFor="ev-custom">Custom label</Label>
                        <Input
                          id="ev-custom"
                          type="text"
                          value={draft.customCategoryLabel}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              customCategoryLabel: e.target.value,
                            }))
                          }
                          placeholder="e.g., Field Trip"
                          maxLength={60}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="ev-start">Start Time</Label>
                        <Input
                          id="ev-start"
                          type="text"
                          value={draft.start}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, start: e.target.value }))
                          }
                          placeholder="10:00 AM"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="ev-end">End Time</Label>
                        <Input
                          id="ev-end"
                          type="text"
                          value={draft.end}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, end: e.target.value }))
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="ev-loc">Location</Label>
                      <Input
                        id="ev-loc"
                        type="text"
                        value={draft.location}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, location: e.target.value }))
                        }
                        placeholder="e.g., Main Auditorium"
                      />
                    </div>

                    <div className="pt-4 mt-auto">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Plus size={16} strokeWidth={2.5} className="mr-1.5" />
                        {saving ? "Saving…" : "Add to Schedule"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="w-full md:w-1/2 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col h-[400px] md:h-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 relative">
                <div className="px-6 py-6 border-b border-slate-150 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                  <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CalendarIcon size={18} className="text-indigo-500" />
                    Agenda for {formatShort(activeDate)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage created events for this day
                  </p>
                </div>

                <div className="p-6 overflow-y-auto no-scrollbar space-y-3 flex-1 relative z-10">
                  {(eventsByDate[toKey(activeDate)] || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px] opacity-70">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <CalendarIcon size={24} />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Your schedule is clear
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                        Use the form to create the first event for this date.
                      </p>
                    </div>
                  ) : (
                    (eventsByDate[toKey(activeDate)] || []).map((ev) => (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex items-start gap-3 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5"
                          style={{
                            background:
                              CATEGORY_META[ev.category]?.dot || "#6366f1",
                          }}
                        />

                        <div className="flex-1 min-w-0 pl-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: CATEGORY_META[ev.category]?.bg,
                                color: CATEGORY_META[ev.category]?.text,
                              }}
                            >
                              {getCategoryLabel(ev)}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-1">
                            {ev.title}
                          </p>

                          <div className="flex flex-col gap-1.5 mt-2.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400" />
                              {ev.start}
                              {ev.end ? ` – ${ev.end}` : ""}
                            </span>
                            {ev.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} className="text-slate-400" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {canManage && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteEvent(ev.id)}
                            className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
