"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdmissionHero() {
  return (
    <section className="bg-[#0b1226] text-white py-20 lg:py-32 relative overflow-hidden h-[90vh] flex flex-col justify-center">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c99a3f]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 shadow-inner"
        >
          Session 2026 - 2027
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight"
        >
          Begin Your Journey <br />
          <span className="text-[#3454d1] bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            With Everest
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Our admissions process is designed to be transparent, entirely digital, and merit-based. Join a global community of learners and innovators today.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-[#3454d1] hover:bg-blue-600 text-white font-bold text-sm px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all gap-2 border-none">
            <Link href="/register">
              Start Online Application <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}