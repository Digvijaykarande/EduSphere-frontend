import React from "react";
import { Target, Eye, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MissionVision() {
  const targets = {
    mission: [
      "Student-centered experiential learning models",
      "Continuous faculty development & digital training",
      "Strong parent-school collaborative ecosystem"
    ],
    vision: [
      "100% Board examination distinction targets",
      "State-of-the-art athletic & research facilities",
      "Sustainable campus & community outreach initiatives"
    ]
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          
          {/* Mission Card */}
          <Card className="group relative bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 transition-all duration-500 overflow-hidden text-card-foreground">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3454d1]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <div className="h-12 w-12 bg-blue-50 text-[#3454d1] rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-inner group-hover:scale-105 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Our Mission</h3>
              <p className="text-xs md:text-sm text-slate-600 mt-3 leading-relaxed">
                To nurture young minds into compassionate, self-driven, and intellectually curious global citizens by providing a balanced, technology-integrated educational environment that honors values and encourages discovery.
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <ul className="space-y-3 text-[11px] md:text-xs font-semibold text-slate-700">
                  {targets.mission.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-5 w-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Vision Card */}
          <Card className="group relative bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 transition-all duration-500 overflow-hidden text-card-foreground">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c99a3f]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <div className="h-12 w-12 bg-amber-50 text-[#c99a3f] rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-inner group-hover:scale-105 transition-transform">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Our Vision</h3>
              <p className="text-xs md:text-sm text-slate-600 mt-3 leading-relaxed">
                To be globally recognized as a benchmark institution of educational excellence, where students are empowered to excel academically, lead ethically, and contribute meaningfully to an evolving world.
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <ul className="space-y-3 text-[11px] md:text-xs font-semibold text-slate-700">
                  {targets.vision.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-5 w-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}