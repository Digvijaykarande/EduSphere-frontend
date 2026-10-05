"use client";

import React from "react";
import { ClipboardCheck, FileText, UserCheck, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  { 
    title: "Online Inquiry & Registration", 
    desc: "Fill out the preliminary digital registry data. Our admissions team will generate a unique application tracking ID for your ward.",
    icon: ClipboardCheck,
    color: "text-blue-600 bg-blue-50 border-blue-200"
  },
  { 
    title: "Digital Document Verification", 
    desc: "Securely upload birth certificates, previous academic term reports, and local identification criteria via our encrypted portal.",
    icon: FileText,
    color: "text-amber-600 bg-amber-50 border-amber-200"
  },
  { 
    title: "Interactive Assessment", 
    desc: "A brief baseline screening evaluation and a relaxed interaction session with our counseling faculties to understand the student's aptitude.",
    icon: UserCheck,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200"
  },
  { 
    title: "Fee Settlement & Finalization", 
    desc: "Upon selection, secure the allocated seat through term fee confirmation using our automated payment gateway.",
    icon: CreditCard,
    color: "text-purple-600 bg-purple-50 border-purple-200"
  },
];

export default function EnrollmentPipeline() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#c99a3f]">Step-by-Step</span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">Enrollment Pipeline</h2>
        <p className="text-xs text-slate-500 mt-2">A streamlined 4-step process powered by our automated digital portal.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#3454d1] before:to-[#c99a3f]">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.color}`}>
                  <span className="font-mono text-sm font-bold">{idx + 1}</span>
                </div>
              </div>
              
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)]">
                <Card className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-card-foreground">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-2.5 rounded-xl ${step.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{step.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}