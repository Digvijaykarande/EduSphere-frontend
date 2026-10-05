"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTABanner() {
  return (
    <section id="demo" className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden bg-sidebar-bg dot-grid px-10 py-16 text-center"
      >
        <span className="chip bg-white/10 text-gold border-gold/30 mb-6">Ready when you are</span>
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-white mt-4 mb-4">
          Give your campus a modern front desk
        </h2>
        <p className="text-sidebar-text max-w-lg mx-auto mb-8">
          Book a 20-minute walkthrough and see EduSphere set up for your school's exact workflow.
        </p>
        <Button size="lg" className="rounded-full bg-[#c99a3f] text-white hover:bg-[#b08535]" asChild>
          <a href="#">Book a free demo</a>
        </Button>
      </motion.div>
    </section>
  );
}