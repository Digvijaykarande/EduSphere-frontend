"use client";

import React from "react";
import { User } from "lucide-react";
import { STATUS_META } from "@/store/attendance.utils";

export default function SeatGrid({ students, onCycle, query = "" }) {
  const q = query.trim().toLowerCase();

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 z-3">
      {students.map((s) => {
        const dim = q && !s.name.toLowerCase().includes(q) && !String(s.rollNo).includes(q);
        const meta = STATUS_META[s.status];
        const overallPct = s.overall ? parseFloat(s.overall) : null;
        const isWarning = overallPct !== null && overallPct < 75;

        return (
          // Wrapped the button in a relative group to anchor the custom tooltip
          <div key={s.id} className="relative group">
            <button
              onClick={() => onCycle(s.id)}
              className={`w-full aspect-square rounded-lg border text-xs font-bold flex items-center justify-center transition-all hover:scale-105 ${meta.seat} ${dim ? "opacity-25" : ""}`}
            >
              {s.rollNo}
            </button>

            {/* Modern Custom Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none transform translate-y-1 group-hover:translate-y-0 z-22">
              
              {/* Profile Header */}
              <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <User size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Roll No: {s.rollNo}</p>
                </div>
              </div>

              {/* Term-to-date attendance %, when available */}
              {s.overall && (
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Term Attendance</span>
                  <span className={`text-[10px] font-bold ${isWarning ? "text-rose-500" : "text-slate-600 dark:text-slate-300"}`}>
                    {s.overall} {isWarning && "⚠️"}
                  </span>
                </div>
              )}
              
              {/* Status Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Status</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  s.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  s.status === 'absent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                  s.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`} style={{display:'flex'}}>
                  {meta.label}
                </span>
              </div>
              
              {/* Tooltip Arrow/Pointer pointing down at the button */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-slate-800" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
