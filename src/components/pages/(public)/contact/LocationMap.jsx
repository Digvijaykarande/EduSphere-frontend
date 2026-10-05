"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LocationMap() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.7643538419615!2d74.1682855!3d17.2789101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc173bb46aa27df%3A0xa64b38d01d4a0ea2!2sSGM%20College%20Karad!5e0!3m2!1sen!2sin!4v1715600000000!5m2!1sen!2sin";

  const handleLaunchMap = () => {
    window.open("https://maps.google.com", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mt-8 bg-[#0b1226] border-t border-slate-800 relative">
      {/* Full Background Live Map Layer */}
      <div className="absolute inset-0 w-full h-full z-0 bg-slate-950">
        <iframe
          title="Everest Global School Campus Map"
          src={mapUrl}
          className="w-full h-full border-0 invert hue-rotate-180 contrast-[0.9] saturate-75 opacity-50 transition-opacity duration-500 group-hover:opacity-40"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none z-10" />
      
      {/* Centered Modal Interactive UI Card */}
      <div className="w-full h-96 relative overflow-hidden flex items-center justify-center z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-4 w-full max-w-sm"
        >
          <Card className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl text-center text-white">
            <div className="h-12 w-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
              <Map className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-white text-xl">Find Us on the Map</h3>
            <p className="text-xs text-slate-300 mt-1.5 mb-5 leading-relaxed">
              Explore our 25-acre campus and get live directions via Google Maps.
            </p>
            <Button 
              size="lg" 
              onClick={handleLaunchMap}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md transition-transform active:scale-[0.98]"
            >
              Launch External Map App
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}