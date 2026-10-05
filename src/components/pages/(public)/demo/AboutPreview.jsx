"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Award, Heart, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPreview() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef(null);

  const videoSrc = useMemo(
    () =>
      "https://media.istockphoto.com/id/1744071641/video/diverse-group-of-kids-welcoming-the-new-school-year-with-enthusiasm.mp4?s=mp4-640x640-is&k=20&c=Mm720IpdGWFPBNW8D1e8Ve9_HwaqNK1U-Dtm2FQrkiQ=",
    []
  );

  const handlePlay = async () => {
    setIsVideoExpanded(true);

    setTimeout(async () => {
      const el = videoRef.current;
      if (!el) return;

      try {
        el.muted = true;
        await el.play();
      } catch {
        // Fallback catch
      }
    }, 0);
  };

  const handleClose = () => {
    const el = videoRef.current;
    if (el) el.pause();
    setIsVideoExpanded(false);
  };

  return (
    <section className="py-24 bg-white overflow-hidden transition-colors duration-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 lg:gap-12 lg:items-center lg:grid-cols-12"
        >
          {/* ---------------- TEXT COLUMN ---------------- */}
          <motion.div
            layout
            className={`flex flex-col justify-center transition-all duration-700 ${
              isVideoExpanded ? "lg:col-span-3 opacity-40 hover:opacity-100" : "lg:col-span-5 opacity-100"
            }`}
          >
            <motion.span layout className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">
              About Us
            </motion.span>

            <motion.h2
              layout
              className="font-display text-3xl font-extrabold tracking-tight text-slate-900 mt-2 leading-snug"
            >
              A Legacy of Trust. <br />A Future of Possibilities.
            </motion.h2>

            <motion.p layout className="mt-4 text-sm text-slate-600 leading-relaxed">
              With a strong foundation built on values, innovation, and student well-being, Everest Global School has been
              a place where excellence is a tradition and every child's potential is unlocked.
            </motion.p>

            {/* Quick Metrics */}
            <motion.div
              layout
              className={`mt-8 pt-8 border-t border-slate-100 grid gap-4 transition-all duration-700 ${
                isVideoExpanded ? "grid-cols-1" : "grid-cols-3"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-[#3454d1] font-bold text-xl font-mono">
                  <Award className="h-4 w-4 text-[#c99a3f] shrink-0" /> 25+
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                  Years of Excellence
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[#3454d1] font-bold text-xl font-mono">
                  <Heart className="h-4 w-4 text-red-500 shrink-0" /> 4000+
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                  Happy Students
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[#3454d1] font-bold text-xl font-mono">
                  <ShieldAlert className="h-4 w-4 text-emerald-500 shrink-0" /> 150+
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                  Expert Educators
                </p>
              </div>
            </motion.div>

            <motion.div layout>
              <Button variant="outline" className="mt-8 border-[#3454d1] text-[#3454d1] hover:bg-[#3454d1] hover:text-white text-xs font-bold px-6 py-3.5 rounded-lg shadow-sm" asChild>
                <Link href="/about">
                  Know More About Us →
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* ---------------- VIDEO COLUMN ---------------- */}
          <motion.div
            layout
            className={`relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 transition-all duration-700 ${
              isVideoExpanded ? "lg:col-span-9 aspect-[21/9]" : "lg:col-span-7 aspect-[16/9]"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <video
                  ref={videoRef}
                  src={videoSrc}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-[#0b1226]/40 transition-opacity duration-300 group-hover:bg-[#0b1226]/50" />

                {!isVideoExpanded ? (
                  <motion.div
                    className="absolute inset-0 group cursor-pointer flex flex-col items-center justify-center text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={handlePlay}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-16 w-16 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center shadow-2xl transition-all"
                    >
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </motion.div>
                    <span className="text-xs font-semibold mt-4 tracking-widest uppercase font-mono drop-shadow-lg">
                      Play Campus Tour
                    </span>
                  </motion.div>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClose}
                    className="absolute top-4 right-4 h-10 w-10 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}