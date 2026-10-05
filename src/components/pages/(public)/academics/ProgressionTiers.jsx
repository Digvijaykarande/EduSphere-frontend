import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ProgressionTiers() {
  const tiers = [
    { 
      level: "Primary School", 
      scope: "Grades 1 - 5", 
      title: "Building the Foundation",
      desc: "Focuses on fundamental language competencies, logical mathematics, creative arts, and initial scientific inquiries in a nurturing environment.",
      subjects: ["Language Arts & Phonics", "Foundational Mathematics", "Environmental Science", "Creative Arts & Crafts"]
    },
    { 
      level: "Middle School", 
      scope: "Grades 6 - 8", 
      title: "Exploration & Application",
      desc: "Expands critical analytical abilities through deep elective studies, advanced sciences, and interactive collaborative projects.",
      subjects: ["Advanced Mathematics", "Integrated Sciences", "Computer Science & Logic", "World History & Geography"]
    },
    { 
      level: "Senior Secondary", 
      scope: "Grades 9 - 12", 
      title: "Mastery & Specialization",
      desc: "Specialized tracks in Science, Commerce, and Humanities geared perfectly for board mastery, competitive exams, and university entries.",
      subjects: ["Physics, Chemistry, Biology", "Accountancy & Economics", "Computer Science (Core)", "Advanced Humanities"]
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Curriculum Tracks</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Educational Progression</h2>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <Card key={i} className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden text-card-foreground">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3454d1] to-indigo-300" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:pl-2">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#3454d1] flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{tier.level}</h3>
                      <Badge variant="secondary" className="bg-blue-50 text-[#3454d1] border-none text-[10px] font-mono font-bold mt-1 uppercase hover:bg-blue-50">
                        {tier.scope}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-2">{tier.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{tier.desc}</p>
                  
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Key Focus Areas</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tier.subjects.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}