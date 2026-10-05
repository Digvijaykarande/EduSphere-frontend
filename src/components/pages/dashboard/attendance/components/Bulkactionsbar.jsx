"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Grid3x3, List as ListIcon, 
  ChevronDown, CheckCircle2, XCircle, Clock, RotateCcw 
} from "lucide-react";

export default function BulkActionsBar({ onMarkAll, onClearAll, query, setQuery, view, setView }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleAction = (action) => {
    if (action === "clear") onClearAll();
    else onMarkAll(action);
    setIsDropdownOpen(false);
  };

  return (
    <div className="dashboard-card p-3 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible">
      
      {/* 1. Modern Bulk Actions Dropdown */}
      <div className="relative w-full sm:w-auto z-20" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95" style={{background:"#1447e6eb"}}
        >
          <span>Bulk Actions</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-[calc(100%+8px)] left-0 w-full sm:w-48 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-1.5"
            >
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleAction("present")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-full text-left">
                  <CheckCircle2 size={16} className="text-emerald-500" /> All Present
                </button>
                <button onClick={() => handleAction("absent")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors w-full text-left">
                  <XCircle size={16} className="text-rose-500" /> All Absent
                </button>
                <button onClick={() => handleAction("late")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors w-full text-left">
                  <Clock size={16} className="text-amber-500" /> All Late
                </button>
                
                <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1 mx-2" />
                
                <button onClick={() => handleAction("clear")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full text-left">
                  <RotateCcw size={16} /> Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Expanding Search & View Toggles */}
      <div className="flex items-center justify-end gap-3 w-full sm:w-auto ml-auto">
        
        {/* Animated Expanding Search Bar */}
        <div className={`relative transition-all duration-300 ease-out ${isSearchFocused ? "w-full sm:w-72" : "w-full sm:w-48"}`}>
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? "text-indigo-700" : "text-slate-400"}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search roll / name"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>        
      </div>
    </div>
  );
}