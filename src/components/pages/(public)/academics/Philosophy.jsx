import React from "react";
import { Activity, MonitorPlay, BrainCircuit } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Philosophy() {
  const philosophies = [
    {
      title: "Experiential Learning",
      desc: "Moving beyond rote memorization. We emphasize hands-on projects, field visits, and interactive lab sessions to build true conceptual understanding.",
      icon: Activity,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Technology Integrated",
      desc: "Digital fluency is built into our core. From smart interactive panels to dedicated AI and coding modules starting in middle school.",
      icon: MonitorPlay,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Holistic Development",
      desc: "Balancing rigorous STEM and humanities coursework with mandatory physical education, fine arts, and emotional intelligence training.",
      icon: BrainCircuit,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    }
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Pedagogy</span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our Learning Philosophy</h2>
        <p className="text-[11px] md:text-xs text-slate-500 mt-2">We believe education should be dynamic, interactive, and directly applicable to the real world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {philosophies.map((phil, idx) => {
          const Icon = phil.icon;
          return (
            <Card key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 text-card-foreground">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${phil.color} mb-5 transition-transform group-hover:scale-105`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg">{phil.title}</h3>
              <p className="text-xs md:text-sm text-slate-600 mt-3 leading-relaxed">{phil.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}