"use client";

import React from "react";
import PageTransition from "@/components/common/dashboard/PageTransition";
import { AcademicsHero } from "@/components/pages/(public)/academics/AcademicsHero";
import { Philosophy } from "@/components/pages/(public)/academics/Philosophy";
import { ProgressionTiers } from "@/components/pages/(public)/academics/ProgressionTiers";
import { Streams } from "@/components/pages/(public)/academics/Streams";
import { InnovationLabs } from "@/components/pages/(public)/academics/InnovationLabs";
import { Testimonial } from "@/components/pages/(public)/academics/Testimonial";
import { EvaluationFramework } from "@/components/pages/(public)/academics/EvaluationFramework";
import { Faq } from "@/components/pages/(public)/academics/Faq";

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <AcademicsHero />
        <Philosophy />
        <ProgressionTiers />
        <Streams />
        <InnovationLabs />
        <Testimonial />
        <EvaluationFramework />
        <Faq />
      </PageTransition>
    </div>
  );
}