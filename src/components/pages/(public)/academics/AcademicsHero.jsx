"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Users, GraduationCap, Award, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

const AnimatedStatCounter = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const numberMatch = value.match(/\d+/);
    if (!numberMatch || !inView) {
      setDisplay(value);
      return;
    }

    const targetNumber = parseInt(numberMatch[0], 10);
    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * targetNumber);

      const updatedDisplay = value.replace(/\d+/, currentCount);
      setDisplay(updatedDisplay);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
};

export function AcademicsHero() {
  const outcomeStats = [
    { icon: Users, value: "50+", label: "Expert Educators" },
    { icon: GraduationCap, value: "1:15", label: "Teacher-Student Ratio" },
    { icon: Award, value: "98%", label: "Board Pass Rate" },
    { icon: Trophy, value: "120+", label: "Olympiad Scholars" },
  ];

  return (
    <section className="bg-[#0b1226] text-white py-16 lg:py-24 relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c99a3f]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <span className="inline-block text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
          Academic Excellence
        </span>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Curriculums Designed for <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Future Leaders
          </span>
        </h1>
        <p className="mt-4 md:mt-6 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore our standard curriculum streams, progressive grading frameworks, and specialized pedagogical systems crafted to unlock every student's ultimate potential.
        </p>

        {/* Dynamic Responsive Counters grid layout */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {outcomeStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-4 md:py-5 backdrop-blur-sm text-white shadow-none border-none">
                <Icon className="h-5 w-5 text-[#c99a3f] mx-auto mb-2" />
                <div className="font-display text-xl sm:text-2xl font-extrabold text-white">
                  <AnimatedStatCounter value={s.value} />
                </div>
                <div className="text-[9px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wide font-medium">{s.label}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}