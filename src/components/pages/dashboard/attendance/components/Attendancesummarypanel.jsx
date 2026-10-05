"use client";

import React, { useState, useEffect } from "react";

export default function AttendanceSummaryPanel({ students, onSave, saved }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animatedDash, setAnimatedDash] = useState(0);

  const total = students.length;
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const late = students.filter((s) => s.status === "late").length;
  const notMarked = total - present - absent - late;
  const pct = total ? Math.round((present / total) * 1000) / 10 : 0;

  const circumference = 2 * Math.PI * 46;
  const targetDash = (pct / 100) * circumference;
  const absentList = students.filter((s) => s.status === "absent");

  // Trigger mount animations
  useEffect(() => {
    setMounted(true);
    // Slight delay before animating the circle for a better visual effect
    const timeout = setTimeout(() => {
      setAnimatedDash(targetDash);
    }, 150);
    return () => clearTimeout(timeout);
  }, [targetDash]);

  const handleConfirmSave = () => {
    onSave();
    setIsConfirming(false);
  };

  return (
    <div className="space-y-4">
      <div className="dashboard-card p-5">
        <p className="text-sm font-display font-semibold text-foreground mb-4">Attendance Summary</p>
        <div className="flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="46" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="10"
              strokeDasharray={`${animatedDash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="transition-all duration-1000 ease-out"
            />
            <text x="60" y="56" textAnchor="middle" className="fill-foreground" style={{ fontSize: 20, fontWeight: 700 }}>
              {pct}%
            </text>
            <text x="60" y="74" textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
              Present
            </text>
          </svg>
        </div>
        
        <div className="mt-4 space-y-2 text-sm overflow-hidden">
          <Row color="#10b981" label="Present" value={present} pct={total ? Math.round((present / total) * 1000) / 10 : 0} />
          <Row color="#ef4444" label="Absent" value={absent} pct={total ? Math.round((absent / total) * 1000) / 10 : 0} />
          <Row color="#f59e0b" label="Late" value={late} pct={total ? Math.round((late / total) * 1000) / 10 : 0} />
          <Row color="#cbd5e1" label="Not Marked" value={notMarked} pct={total ? Math.round((notMarked / total) * 1000) / 10 : 0} />
        </div>
      </div>

      <div className="dashboard-card p-5">
        <p className="text-sm font-display font-semibold text-foreground mb-3">Absent Students ({absent})</p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto overflow-x-hidden p-1">
          {absentList.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 transition-opacity duration-300">
              No absentees marked yet.
            </p>
          )}
          {absentList.map((s, index) => (
            <div 
              key={s.id} 
              className={`flex items-center gap-2 text-xs transition-all duration-500 ease-out transform ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="h-5 w-5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">
                {s.rollNo}
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Button Wrapper with fixed height to handle absolute positioning crossfade */}
      <div className="relative h-12 w-full">
        
        {/* Default Save Button */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ease-in-out ${
            isConfirming ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <button 
            onClick={() => setIsConfirming(true)} 
            className="btn-pill-primary w-full h-full text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            {saved ? "Saved ✓" : "Save Attendance"}
          </button>
        </div>

        {/* Confirm / Cancel Buttons */}
        <div 
          className={`absolute inset-0 flex gap-3 transition-all duration-300 ease-in-out ${
            isConfirming ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <button 
            onClick={() => setIsConfirming(false)} 
            className="w-full h-full text-sm flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmSave} 
            className="btn-pill-primary w-full h-full text-sm flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            Confirm
          </button>
        </div>
        
      </div>
    </div>
  );
}

function Row({ color, label, value, pct }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-slate-600 dark:text-slate-300 flex-1">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-slate-400 dark:text-slate-500 text-xs w-10 text-right">{pct}%</span>
    </div>
  );
}