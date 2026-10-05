"use client";

import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

const ROLES = [
  { id: "principal", label: "Principal" },
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
];

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 inline-flex flex-wrap items-center gap-1">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-primary font-semibold text-xs tracking-wider uppercase">
        <UserCheck className="w-4 h-4" />
        <span>Test role view:</span>
      </div>

      <div className="flex items-center bg-slate-200/60 dark:bg-slate-900/40 p-1 rounded-xl relative">
        {ROLES.map((r) => {
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              className={`relative px-5 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 z-10 ${
                isActive ? "text-white" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="roleActivePill"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
