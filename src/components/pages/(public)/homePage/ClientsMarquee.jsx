"use client";

import React from "react";
import { Building2, GraduationCap } from "lucide-react";

const row1 = [
  "St. Xavier's Academy", "Delhi Public School", "Ryan International",
  "DAV Public School", "Vidya Niketan", "Greenwood High",
  "Bharati Vidyapeeth", "Sanskar Global"
];

const row2 = [
  "Oakridge International", "The Doon School", "Bishop Cotton",
  "La Martiniere", "Springdales School", "Scindia School",
  "Symbiosis International", "Welham Girls"
];

export default function ClientsMarquee() {
  return (
    <section id="clients" className="py-20 border-y border-slate-200/70 bg-slate-50/50 overflow-hidden relative">
      
      {/* Gradient masks for smooth fade on edges */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">
          Powering 500+ Premier Campuses
        </p>
      </div>

      <div className="flex flex-col gap-6 relative z-0">
        
        {/* Row 1 - Right to Left (Normal Marquee) */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((school, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 px-6 py-4 mx-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-shadow hover:shadow-md min-w-[280px] sm:min-w-[300px] cursor-default"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 text-primary flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                {school}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2 - Left to Right (Reverse Marquee) */}
        <div className="flex w-max hover:[animation-play-state:paused] animate-marquee-reverse">
          {[...row2, ...row2].map((school, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 px-6 py-4 mx-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-shadow hover:shadow-md min-w-[280px] sm:min-w-[320px] cursor-default"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 text-gold flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                {school}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}