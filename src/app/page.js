"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import PageLoader from "@/components/pages/(public)/homePage/PageLoader";
import Navbar from "@/components/pages/(public)/demo/Navbar";
import Hero from "@/components/pages/(public)/homePage/Hero";
import ClientsMarquee from "@/components/pages/(public)/homePage/ClientsMarquee";
import ServicesSection from "@/components/pages/(public)/homePage/ServicesSection";
import FeaturesGrid from "@/components/pages/(public)/homePage/FeaturesGrid";
import StatsCounter from "@/components/pages/(public)/homePage/StatsCounter";
import Testimonials from "@/components/pages/(public)/homePage/Testimonials";
import CTABanner from "@/components/pages/(public)/homePage/CTABanner";
import Footer from "@/components/pages/(public)/demo/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageLoader loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={loading ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        <Navbar />
        <main className="bg-background relative">
          <Hero />
          <ClientsMarquee />
          <ServicesSection />
          <FeaturesGrid />
          <StatsCounter />
          <Testimonials />
          <CTABanner />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}