"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, X, CheckCircle2 } from "lucide-react";

// Move mock data out of component to act as initial seed
const INITIAL_LEAVE_REQUESTS = [
  { id: 1, name: "Mayur Deshmukh", grade: "10-A", dates: "Oct 12 - Oct 14", reason: "Medical Leave (Fever)", status: "Pending" },
  { id: 2, name: "Sneha Kulkarni", grade: "10-A", dates: "Oct 15", reason: "Family Function", status: "Pending" },
];

export default function LeaveApplicationsPanel({ selectedGrade }) {
  // Initialize state so we can mutate the list when a teacher acts on a request
  const [requests, setRequests] = useState(INITIAL_LEAVE_REQUESTS);

  // Handler for both Approve and Deny actions
  const handleAction = (id) => {
    // In a production app, you would fire an API call here.
    // For the UI, we filter out the interacted request smoothly.
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave Requests</h3>
          <p className="text-xs text-slate-500 mt-0.5">Pending approvals for {selectedGrade}</p>
        </div>
        
        {/* Dynamic Counter Badge */}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
          requests.length > 0 
            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" 
            : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
        }`}>
          {requests.length} Pending
        </span>
      </div>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar">
        {/* AnimatePresence handles the exit animations of removed items */}
        <AnimatePresence mode="popLayout">
          {requests.length === 0 ? (
            // EMPTY STATE UI
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-col items-center justify-center text-center h-full min-h-[200px]"
            >
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                All caught up!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                There are no pending leave requests for this cohort right now.
              </p>
            </motion.div>
          ) : (
            // LIST OF PENDING REQUESTS
            <div className="space-y-4">
              {requests.map((leave) => (
                <motion.div 
                  layout // This animates the remaining items sliding up smoothly
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  key={leave.id} 
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{leave.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar size={12}/> {leave.dates}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 mb-3">
                    "{leave.reason}"
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAction(leave.id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20"
                    >
                      <Check size={14} strokeWidth={3} /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction(leave.id)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold py-2 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <X size={14} strokeWidth={3} /> Deny
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}