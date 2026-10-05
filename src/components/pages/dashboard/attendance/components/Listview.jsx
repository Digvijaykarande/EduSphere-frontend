"use client";

import React, { useState } from "react";
import { Check, X, Clock, User } from "lucide-react";
import { STATUS_META } from "@/store/attendance.utils";
import StudentQuickProfile from "./StudentQuickProfile"; // Import the profile modal

const OPTIONS = [
  { key: "present", icon: Check },
  { key: "absent", icon: X },
  { key: "late", icon: Clock },
];

export default function ListView({ students, onSetStatus, query = "" }) {
  // Add state to track which student profile is currently open
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      String(s.rollNo).includes(query),
  );
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
              <th className="py-3 px-3 sm:px-6">Roll</th>
              <th className="py-3 px-3 sm:px-6">Student</th>
              <th className="py-3 px-3 sm:px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-10 text-center text-slate-400 dark:text-slate-500"
                >
                  No students match.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-3 sm:px-6 font-mono text-slate-500 dark:text-slate-400">
                  {s.rollNo}
                </td>
                <td className="py-3 px-3 sm:px-6">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="flex items-center gap-2.5 text-left p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-max"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                      <User size={14} />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {s.name}
                    </span>
                  </button>
                </td>
                <td className="py-3 px-3 sm:px-6">
                  {/* Added flex-wrap for tighter mobile screens */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                    {OPTIONS.map(({ key, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => onSetStatus(s.id, key)}
                        className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all border ${
                          s.status === key
                            ? STATUS_META[key].seat
                            : "border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon size={14} />{" "}
                        <span className="hidden sm:inline">
                          {STATUS_META[key].label}
                        </span>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the profile modal */}
      <StudentQuickProfile
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
}
