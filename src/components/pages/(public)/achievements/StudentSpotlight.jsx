import React from "react";
import { Quote, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StudentSpotlight() {
  const spotlights = [
    {
      name: "Aarav Sharma",
      batch: "Class of 2025",
      achievement: "State Topper in Board Examinations (99.4%)",
      quote: "The faculty at Everest didn't just teach me the syllabus; they taught me how to think critically and approach problems with confidence.",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Priya Desai",
      batch: "Class of 2026",
      achievement: "Gold Medalist - National Youth Athletics (100m Sprint)",
      quote: "Balancing rigorous training with academics was made possible entirely by the school's supportive sports complex and flexible scheduling.",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c99a3f]">Star Achievers</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Student Spotlights</h2>
          <p className="text-[11px] md:text-xs text-slate-500 mt-2">Meet the bright minds who bring glory to the Everest name on state and national platforms.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {spotlights.map((student, idx) => (
            <Card key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col sm:flex-row text-card-foreground">
              <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto relative bg-slate-200">
                <img src={student.img} alt={student.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full sm:w-3/5 p-5 md:p-6 flex flex-col justify-center">
                <Quote className="h-5 w-5 text-slate-200 mb-2 shrink-0" />
                <p className="text-xs text-slate-600 italic leading-relaxed mb-4">"{student.quote}"</p>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{student.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#c99a3f] mt-0.5">{student.batch}</p>
                  <div className="mt-3 inline-flex items-start gap-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-emerald-700 w-full sm:w-auto">
                    <Medal className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] md:text-xs font-semibold leading-snug">{student.achievement}</span>
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