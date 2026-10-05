"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Building, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export function InfoCards() {
  const departments = [
    { name: "Admissions Desk", phone: "+91 98765 43210 (Ext 1)", email: "admissions@everest.edu.in" },
    { name: "Fee & Finance", phone: "+91 98765 43210 (Ext 2)", email: "finance@everest.edu.in" },
    { name: "IT Portal Support", phone: "+91 98765 43211", email: "tech.support@everest.edu.in" },
  ];

  const formatPhoneHref = (phoneStr) => {
    return phoneStr.replace(/\s*\(Ext\s*\d+\)/i, "").replace(/\s+/g, "");
  };

  const handleDirectionsClick = () => {
    window.open("https://maps.google.com", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-19 -mt-10 relative z-20">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        
        {/* Card 1: Main Campus */}
        <motion.div variants={fadeUp} className="h-full">
          <Card className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-300 text-card-foreground h-full">
            <div>
              <div className="h-11 w-11 bg-blue-50 text-[#3454d1] rounded-2xl flex items-center justify-center mb-5 border border-blue-100">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 mb-2">Main Campus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Everest Global School<br />
                123 Education Street, Knowledge City<br />
                Maharashtra, SG0001, India
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button 
                onClick={handleDirectionsClick}
                className="text-xs font-bold text-[#3454d1] hover:text-blue-700 flex items-center gap-1.5 group transition-colors cursor-pointer focus:outline-none"
              >
                Get Google Maps Directions <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Card 2: Department Routing */}
        <motion.div variants={fadeUp} className="h-full">
          <Card className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md flex flex-col text-card-foreground h-full">
            <div className="h-11 w-11 bg-amber-50 text-[#c99a3f] rounded-2xl flex items-center justify-center mb-5 border border-amber-100">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 mb-4">Department Routing</h3>
            <div className="space-y-4 flex-1">
              {departments.map((dept, idx) => (
                <div key={idx} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{dept.name}</h4>
                  <div className="mt-1.5 space-y-1.5 text-[11px] font-semibold text-slate-500 flex flex-col">
                    <a 
                      href={`tel:${formatPhoneHref(dept.phone)}`}
                      className="flex items-center gap-2 hover:text-blue-600 hover:underline w-fit transition-all duration-200"
                    >
                      <Phone className="h-3 w-3 text-slate-400 shrink-0" /> 
                      <span>{dept.phone}</span>
                    </a>
                    <a 
                      href={`mailto:${dept.email}`}
                      className="flex items-center gap-2 hover:text-blue-600 hover:underline w-fit transition-all duration-200"
                    >
                      <Mail className="h-3 w-3 text-slate-400 shrink-0" /> 
                      <span>{dept.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Card 3: Operating Hours */}
        <motion.div variants={fadeUp} className="h-full">
          <Card className="bg-gradient-to-br from-[#0b1226] to-[#1a295c] p-6 md:p-8 rounded-3xl shadow-md flex flex-col text-white border-none relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="h-11 w-11 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md border border-white/20">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-slate-100 mb-4">Campus Hours</h3>
            <ul className="space-y-3.5 text-xs text-slate-300 flex-1">
              <li className="flex flex-col gap-0.5 pb-2.5 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monday - Friday</span>
                <span className="font-mono font-bold text-[#c99a3f] text-sm md:text-base">08:00 AM - 04:00 PM</span>
              </li>
              <li className="flex flex-col gap-0.5 pb-2.5 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saturday (Admin Only)</span>
                <span className="font-mono font-bold text-[#c99a3f] text-sm md:text-base">09:00 AM - 01:00 PM</span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sun & Public Holidays</span>
                <span className="font-mono font-bold text-red-400 text-sm md:text-base">Closed</span>
              </li>
            </ul>
          </Card>
        </motion.div>

      </motion.div>
    </section>
  );
}