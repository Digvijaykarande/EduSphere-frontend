"use client";

import React from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/common/dashboard/PageTransition";
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Dumbbell, 
  Palette, 
  Cpu, 
  Globe2, 
  Stethoscope, 
  Coffee, 
  Library, 
  Camera,
  ArrowRight,
  Activity
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function CampusLifePage() {
  const facilities = [
    { label: "Central Library", desc: "40,000+ volumes & digital research archives spanning science, arts, and humanities.", icon: Library, img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop" },
    { label: "Nutritional Cafeteria", desc: "Hygienic, diet-planned multi-cuisine meals prepared fresh daily.", icon: Coffee, img: "https://images.unsplash.com/photo-1627561978149-e966316a632b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sJTIwY2FmZXRlcmlhfGVufDB8fDB8fHww" },
    { label: "Creative Studios", desc: "Dedicated acoustic spaces and studios for visual and performing arts.", icon: Palette, img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop" },
    { label: "Smart Amphitheater", desc: "1,200-seater tech-enabled venue for guest lectures, events, and seminars.", icon: Camera, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop" },
  ];


  const sports = [
    { name: "Olympic Swimming Pool", desc: "Temperature-controlled 50m pool with professional coaching.", color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
    { name: "Indoor Basketball Arena", desc: "Hardwood courts built to professional FIBA standards.", color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
    { name: "Athletics & Track", desc: "400m synthetic running track and dedicated field event zones.", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
    { name: "Fitness & Conditioning", desc: "Modern gymnasium with certified student strength trainers.", color: "text-slate-600", bg: "bg-slate-100 border-slate-200" },
  ];

  const clubs = [
    { title: "AI & Robotics Guild", desc: "Building autonomous bots and learning foundational machine learning models.", icon: Cpu, glow: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
    { title: "Model United Nations", desc: "Debating global policies, diplomacy, and international relations.", icon: Globe2, glow: "group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
    { title: "Fine Arts & Design", desc: "Exploring canvas painting, digital illustration, and sculpting.", icon: Palette, glow: "group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
    { title: "Community Outreach", desc: "Organizing social drives, environmental cleanups, and NGO partnerships.", icon: Heart, glow: "group-hover:border-rose-500/50 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d]">
      <PageTransition>
        
        {/* ---------------- 1. HERO SECTION ---------------- */}
        <section className="bg-[#0b1226] text-white py-24 lg:py-32 relative h-[90vh] overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c99a3f]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 shadow-inner"
            >
              Life Beyond Classrooms
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight"
            >
              The Everest <br />
              <span className="text-[#3454d1] bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Campus Experience
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Explore a 25-acre environment meticulously designed for cultural enrichment, competitive athletics, and absolute student well-being.
            </motion.p>
          </div>
        </section>


        {/* ---------------- 2. CAMPUS FACILITIES GRID ---------------- */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Infrastructure</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">World-Class Facilities</h2>
            <p className="text-sm text-slate-500 mt-3">Spaces engineered to inspire creativity, focus, and collaboration.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <motion.div 
                  variants={fadeUp}
                  key={idx} 
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default"
                >
                  <img 
                    src={fac.img} 
                    alt={fac.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dynamic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Content Block */}
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group-hover:bg-white/30 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-display text-2xl font-bold">{fac.label}</h3>
                    </div>
                    {/* Description fades in and slides up on hover */}
                    <p className="text-sm text-slate-300 ml-[64px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {fac.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>


        {/* ---------------- 3. ATHLETICS & SPORTS ---------------- */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c99a3f]">Physical Education</span>
                  <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight mt-3">
                    Sports Complex & Athletic Development
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-4">
                    We believe physical fitness is paramount to mental acuity. Our massive sports complex hosts state-level tournaments and provides students with expert coaching across multiple disciplines to build teamwork and resilience.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sports.map((sport, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${sport.bg}`}>
                        <Dumbbell className={`h-5 w-5 ${sport.color}`} />
                      </div>
                      <h4 className="font-bold text-white text-sm">{sport.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{sport.desc}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <button className="bg-white text-slate-900 hover:bg-slate-200 text-sm font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2">
                    View Sports Timetable <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Immersive Image Display */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              >
                <video
                  src="https://videos.pexels.com/video-files/8935537/8935537-hd_1080_1920_25fps.mp4"
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="auto"
                >
               </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-transparent to-transparent opacity-60" />
              </motion.div>

            </div>
          </div>
        </section>


        {/* ---------------- 4. CLUBS & SOCIETIES (GLASSMORPHIC) ---------------- */}
        <section className="py-24 bg-[#030712] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Student Organizations</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">Clubs & Innovation Guilds</h2>
              <p className="text-sm text-slate-400 mt-3">Find your tribe. Explore passions outside the academic curriculum through student-led initiatives and projects.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {clubs.map((club, idx) => {
                const Icon = club.icon;
                return (
                  <motion.div 
                    variants={fadeUp}
                    key={idx} 
                    className={`bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group ${club.glow}`}
                  >
                    <div>
                      <div className="h-14 w-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-display font-bold text-white text-lg">{club.title}</h4>
                      <p className="text-sm text-slate-400 mt-3 leading-relaxed">{club.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>


        {/* ---------------- 5. HEALTH, SAFETY & WELLBEING ---------------- */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0f1a3a] rounded-[2.5rem] p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px]" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                <div className="lg:w-1/3 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active Protocols
                  </div>
                  <h3 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                    Uncompromising <br /> Safety & Well-being
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Your child's physical safety and mental well-being are our highest priorities, supported by strict protocols, digital tracking, and dedicated staff.
                  </p>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
                    <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
                    <h4 className="font-bold text-white text-base">24/7 Digital Security</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">Comprehensive CCTV coverage, guarded perimeter checkpoints, and secure biometric campus entry nodes.</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
                    <Stethoscope className="h-8 w-8 text-red-400 mb-4" />
                    <h4 className="font-bold text-white text-base">On-Campus Medical Bay</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">Fully staffed infirmary with certified nursing staff, emergency first-aid protocols, and immediate ambulance tie-ups.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md sm:col-span-2 flex flex-col sm:flex-row items-start gap-5 hover:bg-white/10 transition-colors">
                    <div className="h-12 w-12 bg-[#c99a3f]/20 rounded-full flex items-center justify-center shrink-0">
                      <Heart className="h-6 w-6 text-[#c99a3f]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Student Counseling Center</h4>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">
                        Dedicated child psychologists and counselors available during school hours to support emotional growth, manage academic stress, and assist with holistic behavioral development.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </PageTransition>
    </div>
  );
}