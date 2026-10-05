"use client";

import React from "react";
import { UserCircle } from "lucide-react";

export default function RoleSwitcher({ activeRole, setActiveRole }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-indigo-50/50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-indigo-100 dark:border-slate-700 w-fit-content sm:w-max">
      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-2 flex items-center gap-1.5 uppercase tracking-wider w-full sm:w-auto mb-1 sm:mb-0">
        <UserCircle size={14} /> Test Role View:
      </span>
      <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
        {["Principal", "Teacher", "Student"].map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeRole === role
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}