"use client";

import React from "react";
import { motion } from "framer-motion";
import { Headset } from "lucide-react";

export function ContactHero() {
  return (
    <section className="bg-[#0b1226] text-white py-16 md:py-24 relative overflow-hidden text-center">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c99a3f]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] mb-4 shadow-inner"
        >
          <Headset className="h-3.5 w-3.5" /> Helpdesk & Support
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
        >
          Get in Touch <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            With Everest
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 md:mt-6 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Whether you have questions about admissions, need technical support for the portal, or want to explore our campus, our administrative team is here to assist you.
        </motion.p>
      </div>
    </section>
  );
}