"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Award, GraduationCap, Trophy, Microscope } from "lucide-react";
import { StatsRow } from "@/components/common/public/StatsRow";

const AnimatedStat = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const rawNumber = value.match(/\d+/);
    if (!rawNumber || !inView) {
      setDisplay(value);
      return;
    }

    const target = parseInt(rawNumber[0], 10);
    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const calculated = Math.floor(easeOut * target);

      setDisplay(value.replace(/\d+/, calculated));

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

export function ImpactMetrics() {
  const stats = [
    { label: "National Awards", val: "45+", icon: Award, color: "text-[#c99a3f]" },
    { label: "Board Top Rankers", val: "120+", icon: GraduationCap, color: "text-[#3454d1]" },
    { label: "Sports Championships", val: "30+", icon: Trophy, color: "text-emerald-500" },
    { label: "Innovation Grants", val: "15+", icon: Microscope, color: "text-purple-500" },
  ];

  return (
    <section className="py-8 border-b border-slate-200/80 relative -mt-8 mx-4 sm:mx-auto max-w-5xl z-20">
      <StatsRow
        stats={stats.map((stat) => ({
          icon: stat.icon,
          colorClassName: stat.color,
          value: <AnimatedStat value={stat.val} />,
          label: stat.label,
        }))}
      />
    </section>
  );
}
