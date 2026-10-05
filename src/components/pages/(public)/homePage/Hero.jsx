"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Users, CheckCircle2, TrendingUp, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";

// Premium placeholder portraits matching your administrator demographic
const administrators = [
  { initial: "A", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" },
  { initial: "P", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" },
  { initial: "S", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" },
  { initial: "M", src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" },
];

export default function Hero() {
  const ref = useRef(null);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-40, 40], [4, -4]);
  const rotateY = useTransform(mx, [-40, 40], [-4, 4]);

  useEffect(() => {
    const timer = setTimeout(() => setIsSimulatingLoad(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  function handleMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Column Copy */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] md:text-xs font-bold text-blue-600 mb-4">
            <Sparkles size={12} /> Trusted by 500+ schools across India
          </span>
          
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-5xl leading-tight text-slate-900 mb-4">
            Run your entire campus <span className="text-blue-600">on one screen.</span>
          </h1>
          
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
            Attendance, fees, exams, and communication — EduSphere brings every department onto a single, modern system your staff will actually enjoy using.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
            <Button size="lg" className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md" asChild>
              <a href="#demo">Book a free demo</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-sm" asChild>
              <a href="#product">See how it works</a>
            </Button>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-3.5">
            <AvatarGroup>
              {administrators.map((admin, i) => (
                <Avatar key={i} className="h-8 w-8 ring-2 ring-white bg-slate-100">
                  <AvatarImage src={admin.src} alt={`Administrator ${admin.initial}`} className="object-cover" />
                  <AvatarFallback className="bg-slate-900 text-[#c99a3f] text-[10px] font-display font-semibold">
                    {admin.initial}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <div className="text-xs text-slate-500 text-left">
              <span className="flex items-center gap-1 font-semibold text-slate-900">
                <Star size={12} className="fill-current text-[#c99a3f]" /> 4.9/5
              </span>
              from 300+ administrators
            </div>
          </div>
        </div>

        {/* Right Column Component Mockup */}
        <div 
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative order-1 lg:order-2 w-full max-w-md mx-auto"
        >
          <Card className="p-5 pt-6 border border-slate-100 bg-white shadow-xl rounded-2xl min-h-[220px]">
            <AnimatePresence mode="wait">
              {isSimulatingLoad ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-xl border border-slate-50 p-3 bg-slate-50/50">
                        <div className="h-6 w-6 rounded bg-slate-200 animate-pulse mb-2" />
                        <div className="h-4 w-16 bg-slate-200 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-16 bg-slate-100 rounded-t-lg animate-pulse mt-2" />
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl border border-slate-100 p-3.5">
                      <div className="h-7 w-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5"><Users size={14} /></div>
                      <div className="text-lg font-bold text-slate-900">1,248</div>
                      <p className="text-[10px] text-slate-400">Students</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-3.5">
                      <div className="h-7 w-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5"><CheckCircle2 size={14} /></div>
                      <div className="text-lg font-bold text-slate-900">94%</div>
                      <p className="text-[10px] text-slate-400">Attendance</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-16 pt-2 border-t border-slate-50">
                    {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Floating Context Labels Layer */}
          {!isSimulatingLoad && (
            <>
              <div className="absolute -left-3 top-6 hidden lg:flex items-center gap-1 bg-white border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-md">
                <TrendingUp size={12} className="text-emerald-600" /> Fees +18% this term
              </div>
              <div className="absolute -right-5 bottom-6 hidden lg:flex items-center gap-1 bg-white border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-md">
                <CheckCircle2 size={12} className="text-blue-600" /> 14 tickets resolved today
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}