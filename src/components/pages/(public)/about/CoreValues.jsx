import React from "react";
import { Target, Heart, Globe, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/common/public/SectionHeader";
import { IconFeatureCard } from "@/components/common/public/IconFeatureCard";

export function CoreValues() {
  const coreValues = [
    { title: "Academic Rigor", desc: "Unwavering commitment to conceptual clarity, critical problem solving, and standard evaluation excellence.", icon: Target, color: "text-[#3454d1] bg-blue-50" },
    { title: "Empathetic Community", desc: "Fostering inclusive values where student mental health, safety, and mutual respect form our baseline.", icon: Heart, color: "text-red-500 bg-red-50" },
    { title: "Global Orientation", desc: "Preparing students with digital readiness, global cultural exposure, and sustainable leadership skills.", icon: Globe, color: "text-emerald-600 bg-emerald-50" },
    { title: "Innovation & Discovery", desc: "Encouraging curiosity through modern robotics labs, artistic expression, and interdisciplinary research.", icon: Sparkles, color: "text-[#c99a3f] bg-amber-50" },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Guiding Pillars"
        title="Our Core Institutional Values"
        subtitle="Principles that shape our daily interactions, policy decisions, and academic strategies."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {coreValues.map((v, idx) => (
          <IconFeatureCard
            key={idx}
            icon={v.icon}
            iconWrapperClassName={v.color}
            title={v.title}
            description={v.desc}
            className="flex flex-col justify-between hover:border-[#3454d1]"
          />
        ))}
      </div>
    </section>
  );
}
