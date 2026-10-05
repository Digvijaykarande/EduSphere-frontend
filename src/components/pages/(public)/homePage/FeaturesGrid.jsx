"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Zap, BarChart3, Bell, Cloud, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { 
    icon: Zap, 
    title: "Set up in a day", 
    desc: "Import student records and go live without weeks of onboarding or complex manual data entry.",
    color: "text-amber-400",
    bgGlow: "group-hover:bg-amber-500/10",
    borderGlow: "group-hover:border-amber-500/30"
  },
  { 
    icon: ShieldCheck, 
    title: "Bank-grade security", 
    desc: "Role-based access and 256-bit encrypted records, audited every quarter to ensure absolute data privacy.",
    color: "text-emerald-400",
    bgGlow: "group-hover:bg-emerald-500/10",
    borderGlow: "group-hover:border-emerald-500/30"
  },
  { 
    icon: Smartphone, 
    title: "Works on any device", 
    desc: "Faculty and parents get the exact same powerful experience natively on their phone, tablet, or desktop.",
    color: "text-blue-400",
    bgGlow: "group-hover:bg-blue-500/10",
    borderGlow: "group-hover:border-blue-500/30"
  },
  { 
    icon: BarChart3, 
    title: "Real-time reporting", 
    desc: "Attendance, grades, and fees update live across the entire system — zero end-of-day batch exports.",
    color: "text-purple-400",
    bgGlow: "group-hover:bg-purple-500/10",
    borderGlow: "group-hover:border-purple-500/30"
  },
  { 
    icon: Bell, 
    title: "Smart notifications", 
    desc: "Parents and staff only get alerts that need their immediate attention via automated WhatsApp & SMS routing.",
    color: "text-rose-400",
    bgGlow: "group-hover:bg-rose-500/10",
    borderGlow: "group-hover:border-rose-500/30"
  },
  { 
    icon: Cloud, 
    title: "Always backed up", 
    desc: "Daily automated cloud backups distributed across multiple regions with one-click restore, included for free.",
    color: "text-cyan-400",
    bgGlow: "group-hover:bg-cyan-500/10",
    borderGlow: "group-hover:border-cyan-500/30"
  },
];

const container = { 
  hidden: {}, 
  show: { transition: { staggerChildren: 0.1 } } 
};

const item = { 
  hidden: { opacity: 0, y: 20 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
};

export default function FeaturesGrid() {
  return (
    <section id="product" className="py-24 relative bg-[#030712] border-y border-white/5 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300 backdrop-blur-md mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Why Schools Switch
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mt-2 leading-tight"
          >
            Built for how campuses <br className="hidden sm:block" />
            <span className="text-slate-500">actually run everyday.</span>
          </motion.h2>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={item}>
              <Card className={`group relative p-8 rounded-3xl bg-[#091122]/80 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 text-card-foreground shadow-none ${f.borderGlow}`}>
                {/* Dynamic Hover Gradient Background */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none ${f.bgGlow}`} />
                
                <div className="relative z-10">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 bg-[#030712] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500 ${f.color}`}>
                    <f.icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-100 mb-3 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {f.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}