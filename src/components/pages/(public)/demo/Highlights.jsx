"use client";

import React from "react";
import { GraduationCap, Sparkles, UserCheck, Trophy, Shield, HelpCircle } from "lucide-react";

export default function Highlights() {
  const highlights = [
    { label: "98%", desc: "Board Exam Success Rate", icon: GraduationCap },
    { label: "45+", desc: "Co-curricular Activities", icon: Sparkles },
    { label: "10:1", desc: "Student-Teacher Ratio", icon: UserCheck },
    { label: "20+", desc: "Sports Facilities", icon: Trophy },
    { label: "100%", desc: "Safe & Secure Environment", icon: Shield },
    { label: "24/7", desc: "Digital Learning Support", icon: HelpCircle },
  ];

  return (
    <section className="bg-[#0b132b] text-white py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold tracking-widest text-gold uppercase">Our Key Highlights</span>
          <div className="h-[2px] w-12 bg-gold mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-2 flex flex-col items-center">
                <div className="h-10 w-10 text-gold bg-white/5 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-mono text-2xl font-bold tracking-tight text-white">{item.label}</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}