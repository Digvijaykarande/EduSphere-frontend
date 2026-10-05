"use client";

import React from "react";
import { motion } from "framer-motion";

export function AchievementsHero() {
  return (
    <section className="bg-[#0b1226] text-white py-20 lg:py-28 relative overflow-hidden text-center">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c99a3f]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <span className="inline-block text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
          Hall of Excellence
        </span>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Institutional <br />
          <span className="bg-gradient-to-r from-[#c99a3f] to-amber-200 bg-clip-text text-transparent">
            Distinctions
          </span>
        </h1>
        <p className="mt-4 md:mt-6 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Celebrating historical milestones, state standard medals, and student group accolades accumulated over decades of dedication to holistic education.
        </p>
      </div>
    </section>
  );
}