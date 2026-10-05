"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  FileText,
  UserCheck,
  BellRing,
  Activity,
  Wallet,
  Mail,
  Tag,
  Megaphone
} from "lucide-react";
import { Card } from "@/components/ui/card";

const tabs = [
  { 
    key: "academics", 
    label: "Academics", 
    icon: GraduationCap,
    title: "Plan curriculum without the spreadsheets",
    desc: "Build timetables, assign faculty, and track syllabus completion in one place — with changes reflected instantly for teachers and parents.",
    stats: [{ label: "Time saved / week", value: "6 hrs" }, { label: "Schools onboarded", value: "500+" }],
    accent: "bg-blue-500",
    glow: "shadow-blue-500/40",
    previewIcon: GraduationCap,
    previewTitle: "Syllabus Tracker",
    previewColor: "text-blue-400",
    mockupItems: [
      { title: "Grade 10 Physics Syllabus", subtitle: "Synced with Faculty", icon: BookOpen },
      { title: "Term 1 Timetable", subtitle: "Published 2 hours ago", icon: CalendarCheck },
      { title: "Progress Report Batch", subtitle: "Processing 142 records", icon: FileText },
    ]
  },
  { 
    key: "attendance", 
    label: "Attendance", 
    icon: CalendarCheck,
    title: "Attendance that takes 20 seconds, not 20 minutes",
    desc: "Mark attendance from any device, auto-notify parents of absences, and catch patterns before they become problems.",
    stats: [{ label: "Faster marking", value: "8x" }, { label: "Parent alerts sent", value: "2M+" }],
    accent: "bg-emerald-500",
    glow: "shadow-emerald-500/40",
    previewIcon: CheckCircle2,
    previewTitle: "Biometric Sync",
    previewColor: "text-emerald-400",
    mockupItems: [
      { title: "Grade 8-B Morning Roll Call", subtitle: "Locked at 08:30 AM", icon: UserCheck },
      { title: "Automated Absentee SMS", subtitle: "12 alerts dispatched", icon: BellRing },
      { title: "Terminal Gate A", subtitle: "Active & Scanning", icon: Activity },
    ]
  },
  { 
    key: "fees", 
    label: "Fees", 
    icon: CreditCard,
    title: "Fee collection, minus the follow-up calls",
    desc: "Automated reminders, online payments, and real-time reconciliation — so your accounts team stops chasing receipts.",
    stats: [{ label: "Faster collection", value: "35%" }, { label: "Processed this year", value: "₹120Cr" }],
    accent: "bg-amber-500",
    glow: "shadow-amber-500/40",
    previewIcon: CreditCard,
    previewTitle: "Invoice Engine",
    previewColor: "text-amber-400",
    mockupItems: [
      { title: "Invoice #INV-9042 Paid", subtitle: "+ ₹45,000 received", icon: Wallet },
      { title: "Term 2 Reminders", subtitle: "Queued for dispatch", icon: Clock },
      { title: "Payment Gateway Sync", subtitle: "Razorpay operational", icon: Activity },
    ]
  },
  { 
    key: "comms", 
    label: "Communication", 
    icon: MessageSquare,
    title: "One inbox for the whole school",
    desc: "Circulars, tickets, and parent queries land in a single shared inbox with clear ownership — nothing falls through the cracks.",
    stats: [{ label: "Faster response", value: "3x" }, { label: "Tickets resolved", value: "98%" }],
    accent: "bg-purple-500",
    glow: "shadow-purple-500/40",
    previewIcon: MessageSquare,
    previewTitle: "Unified Helpdesk",
    previewColor: "text-purple-400",
    mockupItems: [
      { title: "Parent Circular: Sports Day", subtitle: "Delivered to 850 inboxes", icon: Megaphone },
      { title: "Ticket #8091 Resolved", subtitle: "IT Support Desk", icon: Tag },
      { title: "Staff Meeting Agenda", subtitle: "Scheduled for 3:00 PM", icon: Mail },
    ]
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active);

  return (
    <section id="services" className="py-24 relative bg-[#030712] border-t border-white/5 overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 backdrop-blur-md mb-6 shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Core Architecture
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mt-2 leading-tight"
          >
            Every department, <br />
            <span className="text-slate-500">running on one system.</span>
          </motion.h2>
        </div>

        {/* Segmented Control Pill Bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 bg-white/[0.02] border border-white/10 p-1.5 backdrop-blur-xl rounded-full">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="servicesActivePill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`absolute inset-0 rounded-full shadow-lg ${t.accent} ${t.glow}`}
                    />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={current.key}>
            <Card className="grid lg:grid-cols-12 gap-8 items-center bg-[#091122]/80 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-card-foreground relative overflow-hidden">
              {/* Background Accent Gradient specific to the active tab */}
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-20 blur-[100px] rounded-full pointer-events-none ${current.accent}`} />

              {/* Left Column: Copy & Stats */}
              <div className="lg:col-span-6 space-y-8 relative z-10">
                <div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4 leading-snug">
                    {current.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                    {current.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                  {current.stats.map((s, i) => (
                    <div key={i}>
                      <p className={`font-mono font-bold text-3xl ${current.previewColor}`}>{s.value}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-slate-300 transition-colors group">
                    Explore {current.label} module <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Right Column: Populated UI Dashboard Mockup */}
              <div className="lg:col-span-6 relative z-10 h-full min-h-[300px] flex items-center justify-center">
                <div className="w-full max-w-sm bg-[#030712] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-white">
                      <current.previewIcon size={18} className={current.previewColor} />
                      <span className="font-mono text-xs font-bold">{current.previewTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                    </div>
                  </div>

                  {/* Populated Mockup Content Rows */}
                  <div className="space-y-3">
                    {current.mockupItems.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors cursor-default group">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-white/5 shadow-inner ${current.previewColor}`}>
                            <ItemIcon size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                            <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.subtitle}</p>
                          </div>
                          <div className="shrink-0 text-slate-600 group-hover:text-emerald-400 transition-colors">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Floating Notification Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`absolute -bottom-4 -right-4 bg-[#091122] border border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-3 ${current.previewColor}`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.accent}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${current.accent}`}></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white">System Synchronized</span>
                  </motion.div>

                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}