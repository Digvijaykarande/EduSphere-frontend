"use client";

import React from "react";
import { Check, X, Calendar, Clock, CheckCircle2, XCircle, Inbox } from "lucide-react";

export default function LeaveInbox({ title, subtitle, requests, onApprove, onDeny }) {
  // Split requests into Actionable (Pending) and Read-only (History)
  const pending = requests.filter((r) => r.status === "Pending");
  const history = requests.filter((r) => r.status !== "Pending");

  return (
    <div className="dashboard-card overflow-hidden flex flex-col lg:flex-row"
    style={{display:"flex",gap:"20px"}}>
      
      {/* ========================================= */}
      {/* LEFT SIDE: Pending Approvals (Actionable) */}
      {/* ========================================= */}
      <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
        
        {/* Left Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <p className="text-base font-display font-bold text-foreground flex items-center gap-2">
              <Inbox size={18} className="text-indigo-500" />
              {title}
            </p>
            {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <span className="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider">
            {pending.length} Pending
          </span>
        </div>
        
        {/* Left Body (Feed) */}
        <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
          {pending.length === 0 && (
             <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No pending leave requests to review.</p>
             </div>
          )}
          {pending.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.name}{r.section ? ` • ${r.section}` : ""}</p>
                   <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                     <Calendar size={12} className="text-indigo-400" /> {r.from}{r.to && r.to !== r.from ? ` – ${r.to}` : ""}
                   </p>
                 </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{r.reason}"
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => onApprove(r.id)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm shadow-indigo-500/20">
                  <Check size={16} strokeWidth={2.5} /> Approve
                </button>
                <button onClick={() => onDeny(r.id)} className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                  <X size={16} strokeWidth={2.5} /> Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE: Action History (Read-only)    */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/30" style={{border:"1px solid #97979714"}}>
        
        {/* Right Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-base font-display font-bold text-foreground flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Action History
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Recently processed requests</p>
          </div>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
            {history.length} Processed
          </span>
        </div>
        
        {/* Right Body (Feed) */}
        <div className="p-5 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
           {history.length === 0 && (
             <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-3">
                  <Clock size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No history yet</p>
                <p className="text-xs text-slate-500 mt-1">Processed requests will appear here.</p>
             </div>
          )}
          {history.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-2">
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.name}</p>
                   <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                     <Calendar size={12} /> {r.from} {r.to && r.to !== r.from ? ` – ${r.to}` : ""}
                   </p>
                 </div>
                 <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    r.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
                    "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                 }`}>
                    {r.status === "Approved" ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <XCircle size={12} strokeWidth={2.5} />}
                    {r.status}
                 </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 mt-3">
                "{r.reason}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}