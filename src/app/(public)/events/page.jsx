"use client";

import React from "react";
import Navbar from "@/components/pages/(public)/demo/Navbar";
import Footer from "@/components/pages/(public)/demo/Footer";
import { CalendarRange, ArrowUpRight } from "lucide-react";

export default function EventsPage() {
  const articles = [
    { date: "Jul 10, 2026", cat: "Academics", title: "Mid-Term Structural Grade Matrix Adjustments", desc: "Important curriculum scheduling guidelines released by academic departments detailing updated evaluations." },
    { date: "Jun 28, 2026", cat: "Campus Notice", title: "Inter-School Science Project Registrations Open", desc: "Calling all student innovation clubs to lodge initial layout entries prior to the deadline schedules." },
    { date: "Jun 14, 2026", cat: "Sports", title: "Annual Athletic Trials Frameworks & Criteria", desc: "Comprehensive timing matrices and running registration guidelines for interested secondary standard groups." },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* <Navbar /> */}
      
      <section className="bg-[#0b1226] text-white py-16 text-center">
        <h1 className="font-display text-4xl font-extrabold">News & Announcements</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">Stay perfectly contextualized with live real-time institutional log streams, announcements, and timeline charts.</p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-primary transition-colors group">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>{art.date}</span>
                <span className="text-primary bg-blue-50 px-1.5 py-0.2 rounded uppercase">{art.cat}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-primary transition-colors leading-snug">{art.title}</h4>
              <p className="text-xs text-secondary mt-2 leading-relaxed line-clamp-3">{art.desc}</p>
            </div>
            <button className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
              Read Document <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </section>

      {/* <Footer /> */}
    </div>
  );
}