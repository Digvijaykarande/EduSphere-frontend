import React from "react";
import { FlaskConical, Calculator, Palette, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Streams() {
  const streams = [
    {
      name: "Science",
      icon: FlaskConical,
      tone: "text-blue-600 bg-blue-50 border-blue-100",
      desc: "For future engineers, doctors, and researchers. Deep-dives into Physics, Chemistry, Biology or Computer Science.",
      subjects: ["Physics & Chemistry", "Biology / CS", "Mathematics", "English Core"],
      outcomes: "Preferred for Engineering, Medicine & Research pathways"
    },
    {
      name: "Commerce",
      icon: Calculator,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-100",
      desc: "Builds a strong foundation in business, finance, and economics for tomorrow's entrepreneurs and analysts.",
      subjects: ["Accountancy", "Business Studies", "Economics", "Math / Informatics"],
      outcomes: "Preferred for Commerce, CA, CS & Management pathways"
    },
    {
      name: "Humanities",
      icon: Palette,
      tone: "text-amber-600 bg-amber-50 border-amber-100",
      desc: "Cultivates critical thinking on society, governance, and culture — ideal for law, media, and civil services.",
      subjects: ["Political Science", "History / Soc", "Psychology", "English Lit"],
      outcomes: "Preferred for Law, Design, Civil Services & Liberal Arts pathways"
    },
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Grades 9 - 12</span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Choose Your Specialization</h2>
        <p className="text-[11px] md:text-xs text-slate-500 mt-2">Guided stream selection backed by aptitude testing and personalized academic counseling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streams.map((stream, idx) => {
          const Icon = stream.icon;
          return (
            <Card key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden group text-card-foreground">
              <div className={`h-1 w-full bg-gradient-to-r ${idx === 0 ? "from-blue-500 to-blue-300" : idx === 1 ? "from-emerald-500 to-emerald-300" : "from-amber-500 to-amber-300"}`} />
              <div className="p-6 md:p-7">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${stream.tone} mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base md:text-lg font-bold text-slate-900">{stream.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{stream.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {stream.subjects.map((sub, i2) => (
                    <span key={i2} className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {sub}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#c99a3f] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{stream.outcomes}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}