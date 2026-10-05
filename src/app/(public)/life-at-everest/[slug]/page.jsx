"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Award,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

// Robust mock storage mapped against your slugs to provide tailored details instantly
const campusEventsData = {
  "smart-classrooms": {
    title: "Smart Classrooms & Next-Gen Infrastructure",
    subtitle: "Experience modern interactive learning frameworks designed for high engagement.",
    heroImg: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop",
    category: "Academic Facilities",
    managedBy: "Prof. Aniket Sharma (IT & Infrastructure Head)",
    capacity: "40 Students per cluster session",
    highlights: [
      "AI-driven smart digital whiteboards with real-time screen sharing",
      "Ergonomically engineered modular furniture layouts",
      "IoT-enabled climate control and ambient adaptive studio lighting",
      "Integrated Lecture Capture Systems for automated offline viewing"
    ],
    timeline: [
      { time: "08:30 AM", session: "Interactive Audio-Visual Lectures Commencement" },
      { time: "11:15 AM", session: "Collaborative Project-Based Virtual Lab Interaction" },
      { time: "02:30 PM", session: "Peer Evaluation & Assessment Presentations" }
    ],
    faqs: [
      { q: "Are lectures recorded automatically?", a: "Yes, our automated matrix records every lecture stream and pushes summaries directly to the student portal application." },
      { q: "How is data safety managed?", a: "Every terminal operates within secure school firewalls filtering outbound connections securely." }
    ]
  },
  "sports-and-fitness": {
    title: "Annual Sports Meet & Athletic Excellence",
    subtitle: "Developing strategic leadership, teamwork and grit on professional arenas.",
    heroImg: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1600&auto=format&fit=crop",
    category: "Campus Life / Athletics",
    managedBy: "Coach Sandeep Patil (Director of Physical Education)",
    capacity: "Open to all Houses & Departments",
    highlights: [
      "Olympic-spec multi-lane running track and synthetic football turf",
      "Indoor wooden sports arena for badminton and table tennis tournaments",
      "Professional standard live electronic scoreboards and streaming arrays",
      "On-site athletic performance center with specialized kinesiologists"
    ],
    timeline: [
      { time: "07:00 AM", session: "Track and Field Sprint Qualifiers" },
      { time: "10:00 AM", session: "Inter-House Football Championship Final Match" },
      { time: "03:30 PM", session: "Closing Medals Distribution and Awards Gala Ceremony" }
    ],
    faqs: [
      { q: "Are medical facilities available?", a: "A professional medical emergency response team with an active trauma vehicle is on call throughout track operations." },
      { q: "Can external visitors attend?", a: "Parents and family members are invited using standard entry barcode gate passes." }
    ]
  }
};

// Fallback template for slugs not explicitly defined yet
const fallbackEvent = {
  title: "Everest Campus Activity Feature",
  subtitle: "Enriching holistic developments through continuous ecosystem integration.",
  heroImg: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600&auto=format&fit=crop",
  category: "General Activity",
  managedBy: "Everest Administration Panel",
  capacity: "Varies by registered batches",
  highlights: [
    "Holistic development framework prioritizing student well-being",
    "Guided mentorship from seasoned campus subject faculties",
    "Continuous feedback Loops via the Everest digital portal framework",
    "Industry standard certification pathways for advanced technical programs"
  ],
  timeline: [
    { time: "09:00 AM", session: "Introductory Orientation & Keynote Overview" },
    { time: "01:00 PM", session: "Practical Skill Workshops & Breakout Team Circles" }
  ],
  faqs: [
    { q: "Where can I check eligibility?", a: "Check your academic track profile in the management dashboard app to view eligibility criteria mapping." }
  ]
};

export default function EventDetailPage() {
  const { slug } = useParams();
  
  // Choose correct dataset based on dynamic segment slug
  const data = campusEventsData[slug] || {
    ...fallbackEvent,
    title: slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : fallbackEvent.title
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-primary/10 pb-16">
      
      {/* ---------------- 1. DYNAMIC HERO BRAND BAR ---------------- */}
      <div className="relative w-full h-[55vh] md:h-[65vh] bg-slate-950 overflow-hidden flex items-end">
        <img 
          src={data.heroImg} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-100 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/40 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl mb-6 backdrop-blur-sm transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          
          <div className="space-y-3 max-w-4xl">
            <span className="inline-block bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">
              {data.category}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Page Layout Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INTERACTIVE TRACK COLUMN - SECTIONS 2, 3, 4 */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* ---------------- 2. OVERVIEW & HIGHLIGHTS ---------------- */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Key Feature Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Everest Management Systems integrate institutional resources directly to operations. This feature block connects live telemetry data metrics ensuring comprehensive visibility across departmental performance parameters.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50/80 border border-slate-100 p-4 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700 leading-normal">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------------- 3. OPERATION ROUTINE SCHEDULE ---------------- */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Operational Timeline Flow
              </h2>
              <div className="relative border-l-2 border-slate-100 pl-5 ml-2.5 space-y-6">
                {data.timeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Ring Indicator */}
                    <div className="absolute -left-[27px] top-0 h-3.5 w-3.5 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors duration-200" />
                    <div>
                      <span className="inline-block font-mono font-bold text-[11px] text-primary bg-blue-50/60 px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5">{item.session}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Ecosystem coordination checkpoint sync monitored by automated node triggers.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------------- 4. COMPLIANCE & HELP DESK FREQUENT FAQS ---------------- */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Resource Guidelines & FAQs
              </h2>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 border border-slate-100 bg-slate-50/40 rounded-2xl space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-primary text-xs font-black">Q.</span> {faq.q}
                    </h4>
                    <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ---------------- 5. RIGHT SIDEBAR META WIDGET CARD ---------------- */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              <h3 className="font-display font-bold text-slate-900 text-base">Administrative Context</h3>
              
              <div className="space-y-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3 text-xs">
                  <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Authority In-Charge</span>
                    <span className="font-bold text-slate-800">{data.managedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Capacity Matrix</span>
                    <span className="font-bold text-slate-800">{data.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Hub Terminal</span>
                    <span className="font-bold text-slate-800">Everest Central Campus Grounds</span>
                  </div>
                </div>
              </div>

              {/* Action Button Integration */}
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-primary/10 transition-transform active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer">
                  Register / Check-in to Session <ChevronRight className="h-4 w-4" />
                </button>
                
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 p-3 rounded-xl text-amber-800 text-[10px] font-medium leading-relaxed">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Verified Identity configuration requires active auth token confirmation inside your teacher/student profile.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}