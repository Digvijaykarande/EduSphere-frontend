import React from "react";
import { SectionHeader } from "@/components/common/public/SectionHeader";
import { IconFeatureCard } from "@/components/common/public/IconFeatureCard";

export function Timeline() {
  const milestones = [
    { year: "2001", title: "Foundation Laid", desc: "Established with a single campus block and an initial cohort of 120 primary students." },
    { year: "2010", title: "Senior Secondary Expansion", desc: "Introduced advanced Science & Commerce streams with state-of-the-art laboratory complexes." },
    { year: "2018", title: "Digital ERP Transformation", desc: "Pioneered smart classrooms, biometric access corridors, and cloud-integrated student tracking." },
    { year: "2026", title: "Global Accreditation", desc: "Recognized among top regional schools with 4,000+ active students and 150+ expert faculty members." },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Journey"
          title="Milestones Over the Decades"
          theme="dark"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {milestones.map((m, idx) => (
            <IconFeatureCard
              key={idx}
              eyebrow={m.year}
              eyebrowClassName="text-xl md:text-2xl font-mono font-bold text-[#c99a3f] block mb-1"
              title={m.title}
              titleClassName="text-white text-xs md:text-sm"
              description={m.desc}
              descriptionClassName="text-slate-400"
              className="bg-white/5 border-white/10 text-white shadow-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
