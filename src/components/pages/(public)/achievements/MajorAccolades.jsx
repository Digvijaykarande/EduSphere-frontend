import React from "react";
import { Award, Trophy, Microscope, Target } from "lucide-react";
import { SectionHeader } from "@/components/common/public/SectionHeader";
import { IconFeatureCard } from "@/components/common/public/IconFeatureCard";
import { cn } from "@/lib/utils";

export function MajorAccolades() {
  const awards = [
    {
      year: "2026",
      category: "Academics",
      title: "National Standard Curriculums Excellence Seal",
      desc: "Awarded by central regulatory panels recognizing exceptional pedagogical metric standard delivery values and a 100% board exam pass rate.",
      icon: Award,
      theme: "bg-blue-50 text-[#3454d1] border-blue-200",
    },
    {
      year: "2025",
      category: "Sports",
      title: "State Football Championship Gold Cup",
      desc: "Secured first rank consistently across comprehensive institutional level knockout championship rounds for the Under-19 category.",
      icon: Trophy,
      theme: "bg-amber-50 text-[#c99a3f] border-amber-200",
    },
    {
      year: "2025",
      category: "Technology",
      title: "Innovative Digital Classroom Deployment Honor",
      desc: "Recognized as a premier forward-integrated school integrating operational LMS nodes to standard learning channels and smart campuses.",
      icon: Microscope,
      theme: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      year: "2024",
      category: "Academics",
      title: "Best Regional STEM Program",
      desc: "Honored for outstanding contributions to science and mathematics education, featuring our newly integrated robotics and AI labs.",
      icon: Target,
      theme: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <SectionHeader
        eyebrow="Trophy Cabinet"
        title="Major Accolades"
        subtitle="A curated selection of our most prestigious institutional awards and recognitions."
        maxWidthClassName="max-w-2xl"
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {awards.map((aw, idx) => (
          <IconFeatureCard
            key={idx}
            icon={aw.icon}
            iconWrapperClassName={cn("border", aw.theme)}
            eyebrow={`${aw.year} • ${aw.category}`}
            title={aw.title}
            titleClassName="text-base md:text-lg group-hover:text-[#3454d1] transition-colors"
            description={aw.desc}
            descriptionClassName="text-xs md:text-sm text-slate-600"
            className="p-6 md:p-8 rounded-2xl hover:shadow-md transition-all group"
          />
        ))}
      </div>
    </section>
  );
}
