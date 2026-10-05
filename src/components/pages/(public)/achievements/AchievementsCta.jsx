import React from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { CtaSection } from "@/components/common/public/CtaSection";

export function AchievementsCta() {
  return (
    <CtaSection
      icon={Trophy}
      title="Be Part of Our Next Success Story"
      description="At Everest Global School, we provide the platform, the mentorship, and the resources. The next great achievement could be yours."
      primaryAction={{ label: "Begin Admission Process", href: "/admissions" }}
      secondaryAction={{ label: "Explore Campus Life", href: "/campus-life", icon: ArrowRight }}
      bgClassName="bg-[#0b1226]"
      primaryButtonClassName="bg-[#c99a3f] hover:bg-amber-600 text-white"
    />
  );
}
