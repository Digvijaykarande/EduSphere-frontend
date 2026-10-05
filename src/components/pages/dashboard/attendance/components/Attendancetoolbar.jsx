"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CalendarDays,
  Users,
  BookOpen,
  Clock,
  Check,
} from "lucide-react";
import { PERIODS } from "@/store/attendance.utils";

// ----------------------------------------------------------------------
// Reusable Modern Select Component
// ----------------------------------------------------------------------
function ModernSelect({ value, options, onChange, icon: Icon, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && (
            <Icon
              size={16}
              className="text-slate-400 dark:text-slate-500 shrink-0"
            />
          )}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[220px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
              {options.length === 0 && (
                <p className="px-3 py-2 text-xs text-slate-400">No options available</p>
              )}
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check
                        size={14}
                        className="text-indigo-600 dark:text-indigo-400 shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Toolbar Component
// ----------------------------------------------------------------------
export default function AttendanceToolbar({
  section,
  setSection,
  subject,
  setSubject,
  date,
  setDate,
  period,
  setPeriod,
  // Real, backend-driven options — a teacher's own sections (from
  // TeacherAssignment) and the subjects they teach for whichever section is
  // currently selected. Both are required now; there is no hardcoded
  // fallback list since class/subject assignment is per-teacher data.
  classOptionsOverride = [],
  subjectOptionsOverride = [],
}) {
  const dateInputRef = useRef(null);

  const classOptions = classOptionsOverride.map((c) => ({
    value: c.value,
    label: `${c.class} - ${c.section}`,
  }));
  const subjectOptions = subjectOptionsOverride.map((s) => ({ value: s, label: s }));
  const periodOptions = PERIODS.map((p) => ({ value: p, label: p }));

  // Programmatically trigger the hidden native date picker
  const handleDateClick = () => {
    try {
      if (
        dateInputRef.current &&
        typeof dateInputRef.current.showPicker === "function"
      ) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    } catch (error) {
      console.log("Picker API not supported in this browser environment");
    }
  };

  // Format date nicely (e.g., "Jul 23, 2026")
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select Date";

  return (
    <div className="dashboard-card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Class & Section */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
          Class & Section
        </label>
        <ModernSelect
          value={section}
          options={classOptions}
          onChange={setSection}
          icon={Users}
        />
      </div>

      {/* Subject */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
          Subject
        </label>
        <ModernSelect
          value={subject}
          options={subjectOptions}
          onChange={setSubject}
          icon={BookOpen}
        />
      </div>

      {/* Modern Date Picker Wrapper */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
          Date
        </label>
        <div className="relative group w-full">
          {/* Hidden native input */}
          <input
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => {
              if (e.target.value) setDate(e.target.value);
            }}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={handleDateClick}
            className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <CalendarDays
              size={16}
              className="text-slate-400 dark:text-slate-500 shrink-0"
            />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              {formattedDate === "Invalid Date" ? date : formattedDate}
            </span>
          </button>
        </div>
      </div>

      {/* Period */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
          Period
        </label>
        <ModernSelect
          value={period}
          options={periodOptions}
          onChange={setPeriod}
          icon={Clock}
        />
      </div>
    </div>
  );
}
