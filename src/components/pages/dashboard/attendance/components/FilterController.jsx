"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Check, CalendarDays } from "lucide-react";

const GRADE_OPTIONS = [
  { id: "10-A", label: "Grade 10 - Sec A" },
  { id: "10-B", label: "Grade 10 - Sec B" },
  { id: "11-A", label: "Grade 11 - Sec A" },
];

export default function FilterController({ selectedGrade, setSelectedGrade, selectedDate, setSelectedDate }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null); // Added ref for the date input

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Programmatically trigger the native date picker
  const handleDateClick = () => {
    try {
      if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus(); // Fallback for older browsers
      }
    } catch (error) {
      console.log("Picker API not supported in this browser environment");
    }
  };

  // Format date for a beautiful UI display (e.g., "Jul 22, 2026")
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const activeGradeLabel = GRADE_OPTIONS.find(opt => opt.id === selectedGrade)?.label || "Select Grade";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-20">
      
      {/* Label Area */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-100 dark:border-slate-800 hidden sm:flex">
        <Filter size={14} className="text-indigo-500" />
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Filters</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        
        {/* Custom Animated Grade Dropdown */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-48 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activeGradeLabel}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-50 overflow-hidden"
              >
                {GRADE_OPTIONS.map((option) => {
                  const isSelected = selectedGrade === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedGrade(option.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isSelected 
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {option.label}
                      {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Custom Styled Date Picker Wrapper */}
        <div className="relative group w-full sm:w-auto">
          {/* Native input hidden securely in the background */}
          <input 
            ref={dateInputRef}
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(e.target.value);
            }}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            tabIndex={-1}
          />
          
          {/* Actionable UI Button calling the showPicker API */}
          <button 
            type="button"
            onClick={handleDateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 rounded-xl px-3.5 py-2 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <CalendarDays size={16} className="text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              {formattedDate === "Invalid Date" ? selectedDate : formattedDate}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

