import React from "react";
import { Quote } from "lucide-react";

export function Testimonial() {
  return (
    <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Quote className="h-7 w-7 text-[#3454d1]/30 mx-auto mb-5 shrink-0" />
      <p className="font-display text-base sm:text-xl md:text-2xl font-semibold text-slate-800 leading-snug max-w-2xl mx-auto">
        "The stream counseling process gave us real clarity — my daughter felt genuinely supported choosing Commerce, and the teachers still check in on her progress every term."
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#3454d1]/10 flex items-center justify-center text-[#3454d1] font-bold text-xs">
          R
        </div>
        <div className="text-left">
          <p className="text-xs sm:text-sm font-bold text-slate-900">Riya Malhotra</p>
          <p className="text-[10px] sm:text-xs text-slate-500">Parent, Grade 11</p>
        </div>
      </div>
    </section>
  );
}