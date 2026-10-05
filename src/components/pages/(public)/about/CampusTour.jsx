"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CampusTour() {
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (!videoRef.current) return;
    const p = videoRef.current.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  return (
    <section className="py-16 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Immersive Campus</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Experience Everest Life First-Hand
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Take a virtual walk through our smart classrooms, science complexes, athletic arenas, and creative studios. See how technology and nature coexist in harmony across our 25-acre campus.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-[#0f1a3a] hover:bg-[#3454d1] text-xs font-bold shadow-sm border-none">
                <Link href="/campus-life">
                  Explore Campus Facilities &rarr;
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 w-full">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl group bg-slate-800">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="https://videos.pexels.com/video-files/11722040/11722040-hd_1920_1080_24fps.mp4"
                preload="metadata"
                playsInline
                controls
              />
              <div className="absolute inset-0 bg-[#0f172a]/30 transition-opacity group-hover:bg-[#0f172a]/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                <button
                  type="button"
                  onClick={handlePlay}
                  className="h-12 w-12 sm:h-16 sm:w-16 bg-white text-[#3454d1] rounded-full flex items-center justify-center shadow-2xl transform transition hover:scale-110 pointer-events-auto border-none"
                  aria-label="Play campus tour video"
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-1" />
                </button>
                <span className="text-[10px] sm:text-xs font-semibold mt-4 tracking-wider uppercase font-display drop-shadow text-center px-2">
                  Watch Our Campus Tour Video
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}