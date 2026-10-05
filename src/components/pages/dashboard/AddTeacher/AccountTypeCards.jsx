"use client";

import { GraduationCap, Users, Briefcase } from "lucide-react";
import { ACCOUNT_TYPES } from "./constants";

const ICON_BY_KEY = {
  teacher: Users,
  student: GraduationCap,
  staff: Briefcase,
};

const DESCRIPTION_BY_KEY = {
  teacher: "Invite a teacher and assign subjects.",
  student: "Enroll a student into a class & section.",
  staff: "Add non-teaching staff (library, accounts, etc).",
};

/**
 * Segmented cards for choosing which account type to create.
 *
 * @param {"teacher"|"student"|"staff"} activeKey
 * @param {(key: string) => void} onSelect
 */
export default function AccountTypeCards({ activeKey, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {ACCOUNT_TYPES.map(({ key, label }) => {
        const Icon = ICON_BY_KEY[key] || Users;
        const active = activeKey === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`text-left rounded-2xl border p-5 transition-all ${
              active
                ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon size={18} />
            </div>
            <h3
              className={`text-sm font-semibold ${
                active
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {DESCRIPTION_BY_KEY[key]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
