import React from "react";
import { Lock } from "lucide-react";

export default function ProfessionalDetails({ seed }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Employment Details
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Managed by administration.
          </p>
        </div>
        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
          <Lock size={14} />
        </div>
      </div>

      <div className="space-y-4">
        {seed.stats.map((s) => (
          <div key={s.label} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {s.label}
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {seed.chips && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
          {Object.entries(seed.chips).map(([label, values]) => (
            <div key={label} className="space-y-2">
              <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {values.map((v) => (
                  <span
                    key={v}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}