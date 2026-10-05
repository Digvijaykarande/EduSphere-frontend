"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, Sparkles, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const quotes = [
  { 
    name: "Anita Deshmukh", 
    role: "Principal, Vidya Niketan", 
    text: "We replaced four different registers with one screen. Our staff actually look forward to attendance now. The real-time syncing has completely eliminated end-of-day data entry.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  },
  { 
    name: "Rahul Kapoor", 
    role: "Admin Head, Greenwood High", 
    text: "Fee follow-ups used to eat up our accountant's whole week. Now reminders go out on their own, and our collection rate improved by 35% in the very first term.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  },
  { 
    name: "Sunita Rao", 
    role: "Director, Sanskar Global", 
    text: "Parents stopped calling the front desk for updates. From exam schedules to bus tracking, everything reaches them automatically. It is a massive operational relief.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(() => setActive((p) => (p + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, [isAutoPlaying, active]);

  const handleManualSelect = (idx) => {
    setActive(idx);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-24 relative bg-[#030712] overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 backdrop-blur-md mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Customer Success
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-3xl md:text-4xl text-white mt-2"
          >
            Loved by visionary administrators
          </motion.h2>
        </div>

        {/* Main Testimonial Stage */}
        <div className="max-w-4xl mx-auto">
          <Card className="relative bg-[#091122]/80 border border-white/10 rounded-3xl p-8 sm:p-14 backdrop-blur-xl shadow-2xl shadow-black/50 text-center text-card-foreground min-h-[320px] flex flex-col justify-center overflow-hidden">
            
            {/* Giant Watermark Quote Icons */}
            <Quote className="absolute top-8 left-8 h-32 w-32 text-white/[0.03] rotate-180 pointer-events-none" />
            <Quote className="absolute bottom-8 right-8 h-32 w-32 text-white/[0.03] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* 5-Star Row */}
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="font-display text-xl sm:text-2xl md:text-3xl text-slate-100 leading-relaxed mb-8">
                  "{quotes[active].text}"
                </p>
                
                <div>
                  <p className="text-base font-bold text-white">{quotes[active].name}</p>
                  <p className="text-xs font-mono font-semibold text-amber-400 mt-1 uppercase tracking-wider">{quotes[active].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Interactive Profile Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {quotes.map((q, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  onClick={() => handleManualSelect(idx)}
                  className={`group flex items-center gap-3 p-1.5 rounded-full sm:pr-4 transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-white/10 border border-white/20 shadow-lg" 
                      : "bg-transparent border border-transparent hover:bg-white/5"
                  }`}
                >
                  <Avatar className={`h-10 w-10 border-2 transition-colors duration-300 ${
                    isActive ? "border-amber-400" : "border-slate-700 group-hover:border-slate-500"
                  }`}>
                    <AvatarImage src={q.avatar} alt={q.name} className="object-cover" />
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                  
                  <div className="text-left hidden sm:block">
                    <p className={`text-xs font-bold transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                      {q.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}