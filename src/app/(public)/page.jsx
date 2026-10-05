"use client";

import React from "react";

// Importing the new SaaS components
import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Hero from "@/components/landing/Hero";
import ClientsMarquee from "@/components/landing/ClientsMarquee";
import ServicesSection from "@/components/landing/ServicesSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import StatsCounter from "@/components/landing/StatsCounter";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function SaaSLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-white">
      {/* SaaS Navigation */}
      <MarketingNavbar />

      <main>
        {/* 1. Above the Fold */}
        <Hero />
        
        {/* 2. Social Proof Ticker */}
        <ClientsMarquee />
        
        {/* 3. Core Product Modules (Tabs) */}
        <ServicesSection />
        
        {/* 4. Technical & Operational Features */}
        <FeaturesGrid />
        
        {/* 5. Scale & Trust Metrics */}
        <StatsCounter />
        
        {/* 6. Customer Success Stories */}
        <Testimonials />
        
        {/* 7. Final Conversion Push */}
        <CTABanner />
      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}