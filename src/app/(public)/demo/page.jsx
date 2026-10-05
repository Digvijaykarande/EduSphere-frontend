"use client";

import React from "react";
import Navbar from "@/components/pages/(public)/demo/Navbar";
import Hero from "@/components/pages/(public)/demo/Hero";
import Pillars from "@/components/pages/(public)/demo/Pillars";
import AboutPreview from "@/components/pages/(public)/demo/AboutPreview";
import Highlights from "@/components/pages/(public)/demo/Highlights";
import EventsAchievements from "@/components/pages/(public)/demo/EventsAchievements";
import LifeAtEverest from "@/components/pages/(public)/demo/LifeAtEverest";
import Footer from "@/components/pages/(public)/demo/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] font-sans antialiased selection:bg-primary selection:text-white">
    {/* <Navbar /> */}
      <Hero />
      <Pillars />
      <AboutPreview />
      <Highlights />
      <EventsAchievements />
      <LifeAtEverest />
      {/* <Footer /> */}
    </div>
  );
}