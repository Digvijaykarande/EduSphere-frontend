"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Calendar } from "lucide-react";

export default function LeaveApplyForm({ applicantName, applicantMeta, submittedTo, onSubmit }) {
  const [form, setForm] = useState({ from: "", to: "", reason: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.from || !form.reason.trim()) {
      setError("Please select a start date and provide a reason.");
      return;
    }
    setError("");
    onSubmit({ name: applicantName, ...applicantMeta, from: form.from, to: form.to || form.from, reason: form.reason.trim() });
    setForm({ from: "", to: "", reason: "" });
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  // Refined SaaS Input Styling
  const saasInput = "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 shadow-sm disabled:opacity-60";
  const saasLabel = "text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 relative overflow-hidden">
      
      {/* Header Section */}
      <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Apply for Leave</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Submitting as <span className="font-medium text-slate-700 dark:text-slate-300">{applicantName}</span>. Sent to <span className="font-medium text-slate-700 dark:text-slate-300">{submittedTo}</span> for review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Start Date */}
          <div>
            <label className={saasLabel}>Start Date</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="date" 
                disabled={done}
                value={form.from} 
                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))} 
                className={`${saasInput} pl-9 cursor-pointer`} 
              />
            </div>
          </div>
          
          {/* End Date */}
          <div>
            <label className={saasLabel}>End Date <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="date" 
                disabled={done}
                value={form.to} 
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))} 
                className={`${saasInput} pl-9 cursor-pointer`} 
              />
            </div>
          </div>
        </div>

        {/* Reason Textarea */}
        <div>
          <label className={saasLabel}>Reason for Leave</label>
          <textarea 
            rows={4} 
            disabled={done}
            placeholder="Briefly explain your reason for requesting leave..."
            value={form.reason} 
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} 
            className={`${saasInput} resize-none`} 
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={done}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm ${
              done 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-[0.98]"
            }`}
          >
            {done ? (
              <><CheckCircle2 size={16} /> Request Submitted</>
            ) : (
              <><Send size={16} /> Submit Application</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}