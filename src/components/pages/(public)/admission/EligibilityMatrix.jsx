import React from "react";
import { GraduationCap, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EligibilityMatrix() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2 space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c99a3f]">Eligibility Matrix</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-snug">
            Who Can Apply?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            We seek curious, motivated students who are eager to learn and grow. Admission is granted regardless of race, religion, or national origin, provided the student meets the fundamental age and academic requirements.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              <span className="text-xs font-semibold">Grades 1 to 12</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-semibold">Co-Educational</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <Card className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md w-full text-white shadow-none">
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Age Cut-offs (As of Dec 31st)</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Grade 1</span>
                <span className="font-mono font-bold text-[#c99a3f]">6 Years</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Grade 5</span>
                <span className="font-mono font-bold text-[#c99a3f]">10 Years</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Grade 9</span>
                <span className="font-mono font-bold text-[#c99a3f]">14 Years</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Grade 11</span>
                <span className="font-mono font-bold text-[#c99a3f]">16 Years</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}