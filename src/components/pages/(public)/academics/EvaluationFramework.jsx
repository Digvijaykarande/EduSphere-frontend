import React from "react";
import { Award, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EvaluationFramework() {
  return (
    <section className="py-12 md:py-16 bg-[#0b1226] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        <div className="text-center md:text-left">
          <h3 className="font-display text-xl md:text-2xl font-bold mb-3">Continuous Evaluation Framework</h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">
            Our grading system powered by <span className="text-[#c99a3f] font-semibold">EduSphere ERP</span> goes beyond traditional marks. We provide deep analytics, bell-curve performance charts, and skill-based assessments to parents in real-time.
          </p>
          <div className="flex flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] md:text-xs font-bold">Formative Assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-[11px] md:text-xs font-bold">Summative Boards</span>
            </div>
          </div>
        </div>

        <Card className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md text-center text-white border-none shadow-none">
          <h4 className="text-base md:text-lg font-bold text-white mb-1.5">Detailed Academic Brochure</h4>
          <p className="text-[11px] md:text-xs text-slate-400 mb-5 max-w-md mx-auto">
            Download our comprehensive 2026-2027 curriculum guide including subject breakdowns and elective choices.
          </p>
          <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#3454d1] to-indigo-500 hover:opacity-95 text-white text-xs font-bold px-6 shadow-md border-none">
            <Download className="h-4 w-4" /> Download PDF Brochure
          </Button>
        </Card>

      </div>
    </section>
  );
}