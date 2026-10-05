"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Heart, Users, Building } from "lucide-react";
import { Card } from "@/components/ui/card";

const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      let start;
      const duration = 2000;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(easeOut * value));
        if (progress < 1) requestAnimationFrame(step);
        else setDisplay(value);
      };
      requestAnimationFrame(step);
    }
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
};

export function AboutHero() {
  const metrics = [
    { label: "Years of Excellence", val: 25, suffix: "+", icon: Award, tone: "text-[#c99a3f]" },
    { label: "Happy Students", val: 4000, suffix: "+", icon: Heart, tone: "text-red-400" },
    { label: "Expert Educators", val: 150, suffix: "+", icon: Users, tone: "text-emerald-400" },
    { label: "Campus Area (Acres)", val: 25, suffix: "+", icon: Building, tone: "text-blue-400" },
  ];

  return (
    <section className="bg-[#0b1226] text-white py-16 lg:py-28 relative flex flex-col justify-center min-h-[85vh] overflow-hidden">
      <div className="absolute -top-32 -left-32 w-72 h-72 md:w-96 md:h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 md:w-96 md:h-96 bg-[#c99a3f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4"
          >
            Discover Everest Global School
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            A Legacy of Trust. <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              A Future of Possibilities.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            For over two decades, Everest Global School has provided a holistic educational environment that balances academic rigor with character building, innovation, and global leadership skills.
          </motion.p>
        </div>

        {/* Fully Responsive dynamic Grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="h-full"
              >
                <Card className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl text-center backdrop-blur-md text-white h-full shadow-none">
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${m.tone} mx-auto mb-2`} />
                  <span className="block font-mono text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter value={m.val} suffix={m.suffix} />
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-1 block">{m.label}</span>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}