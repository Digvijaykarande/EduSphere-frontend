"use client";

import React from "react";
import PageTransition from "@/components/common/dashboard/PageTransition";
import { ContactHero } from "@/components/pages/(public)/contact/ContactHero";
import { InfoCards } from "@/components/pages/(public)/contact/InfoCards";
import { DigitalForm } from "@/components/pages/(public)/contact/DigitalForm";
import { LocationMap } from "@/components/pages/(public)/contact/LocationMap";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <ContactHero />
        <InfoCards />
        <DigitalForm />
        <LocationMap />
      </PageTransition>
    </div>
  );
}