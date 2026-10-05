"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const dates = [
  { event: "Applications Open", date: "August 15, 2026", status: "Active", desc: "Portal opens for new digital registrations." },
  { event: "Document Deadline", date: "September 30, 2026", status: "Upcoming", desc: "Last day to upload required KYC documents." },
  { event: "Assessment Week", date: "Oct 10 - Oct 15, 2026", status: "Pending", desc: "On-campus student interactions & faculty reviews." },
  { event: "First Merit List", date: "November 01, 2026", status: "Pending", desc: "Official publication of selected candidates." },
];

export default function ImportantDeadlines() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Admissions Schedule</span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">Important Deadlines</h2>
          <p className="text-xs text-slate-500 mt-2">Keep track of crucial dates to ensure a smooth enrollment process.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {dates.map((d, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group text-card-foreground h-full">
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center ${
                    d.status === "Active" ? "bg-emerald-500" : d.status === "Upcoming" ? "bg-amber-400" : "bg-slate-300"
                  }`}>
                    {d.status === "Active" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  </div>

                  <div className="text-center mt-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      d.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                      d.status === "Upcoming" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {d.status}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-4">{d.event}</h4>
                    <div className="flex items-center justify-center gap-1.5 text-sm font-mono font-bold text-[#3454d1] mt-2 mb-3 bg-blue-50/50 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4 text-[#c99a3f]" />
                      {d.date}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}