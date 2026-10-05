import React from "react";
import { Download } from "lucide-react";
import { CtaSection } from "@/components/common/public/CtaSection";

export default function AdmissionCta() {
  return (
    <CtaSection
      title="Ready to Submit Your Application?"
      description="Access the digital portal to create your profile, upload your documents, and track your application status in real-time."
      primaryAction={{ label: "Create Applicant Account", href: "/register" }}
      secondaryAction={{ label: "Download Prospectus", href: "#", icon: Download }}
      bgClassName="bg-[#0f1a3a] py-20"
      primaryButtonClassName="bg-[#3454d1] hover:bg-blue-600 text-white px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-blue-900/50 hover:-translate-y-1"
    />
  );
}
