"use client";

import React from "react";
import PageTransition from "@/components/common/dashboard/PageTransition";
import { AchievementsHero } from "@/components/pages/(public)/achievements/AchievementsHero";
import { ImpactMetrics } from "@/components/pages/(public)/achievements/ImpactMetrics";
import { MajorAccolades } from "@/components/pages/(public)/achievements/MajorAccolades";
import { StudentSpotlight } from "@/components/pages/(public)/achievements/StudentSpotlight";
import { AchievementsCta } from "@/components/pages/(public)/achievements/AchievementsCta";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <AchievementsHero />
        <ImpactMetrics />
        <MajorAccolades />
        <StudentSpotlight />
        <AchievementsCta />
      </PageTransition>
    </div>
  );
}