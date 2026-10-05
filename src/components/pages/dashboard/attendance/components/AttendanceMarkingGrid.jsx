"use client";

import React, { useState } from "react";
import { User, Check, X, Clock } from "lucide-react";

const initialStudents = [
  { id: "101", name: "Amit Sharma", rollNo: "01", status: "Present", overall: "96%" },
  { id: "102", name: "Neha Patil", rollNo: "02", status: "Present", overall: "92%" },
  { id: "103", name: "Mayur Deshmukh", rollNo: "03", status: "Absent", overall: "71%" },
  { id: "104", name: "Sneha Kulkarni", rollNo: "04", status: "Present", overall: "88%" },
  { id: "105", name: "Vikram Rathod", rollNo: "05", status: "Late", overall: "74%" },
];

export default function AttendanceMarkingGrid({ grade, query }) {
  const [students, setStudents] = useState(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState(null); // State for the popup module

  const updateStatus = (studentId, newStatus) => {
    setStudents(prev =>
      prev.map(stu => stu.id === studentId ? { ...stu, status: newStatus } : stu)
    );
  };

  const filteredStudents = students.filter(stu =>
    stu.name.toLowerCase().includes(query.toLowerCase()) || 
    stu.rollNo.includes(query)
  );

  // ... (imports and state setup remain the same) ...

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
              <th className="py-4 px-3 sm:px-6">Roll No</th>
              <th className="py-4 px-3 sm:px-6">Student Info</th>
              <th className="py-4 px-3 sm:px-6 hidden md:table-cell">Overall Term Stat</th>
              <th className="py-4 px-3 sm:px-6 text-center">Mark Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {filteredStudents.map((student) => {
              const isWarning = parseFloat(student.overall) < 75;

              return (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-slate-900">
                  <td className="py-4 px-3 sm:px-6 font-mono font-medium text-slate-500 dark:text-slate-400 w-16 sm:w-20">{student.rollNo}</td>
                  
                  <td className="py-3 px-3 sm:px-6">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="flex items-center gap-3 p-1.5 -ml-1.5 pr-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left w-max focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                        <User size={16} />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 block">{student.name}</span>
                        {/* Mobile only term stat visibility */}
                        <span className="md:hidden text-[10px] font-medium mt-0.5 block text-slate-500">
                          Term: <span className={isWarning ? "text-rose-500" : "text-slate-600 dark:text-slate-400"}>{student.overall} {isWarning && "⚠️"}</span>
                        </span>
                      </div>
                    </button>
                  </td>
                  
                  <td className="py-4 px-3 sm:px-6 hidden md:table-cell">
                    <span className={`font-semibold ${isWarning ? "text-rose-500" : "text-slate-600 dark:text-slate-300"}`}>
                      {student.overall} {isWarning && "⚠️"}
                    </span>
                  </td>
                  
                  <td className="py-4 px-3 sm:px-6">
                    {/* flex-wrap ensures buttons drop down neatly if space gets tight */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(student.id, "Present")}
                        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          student.status === "Present"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 scale-105 shadow-sm"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Check size={14} strokeWidth={3} /> <span className="hidden sm:inline">Present</span>
                      </button>
                      
                      <button
                        onClick={() => updateStatus(student.id, "Absent")}
                        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          student.status === "Absent"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 scale-105 shadow-sm"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <X size={14} strokeWidth={3} /> <span className="hidden sm:inline">Absent</span>
                      </button>
                      
                      <button
                        onClick={() => updateStatus(student.id, "Late")}
                        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          student.status === "Late"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 scale-105 shadow-sm"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Clock size={14} strokeWidth={2.5} /> <span className="hidden sm:inline">Late</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}