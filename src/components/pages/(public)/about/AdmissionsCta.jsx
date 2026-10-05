import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdmissionsCta() {
  return (
    <section className="py-12 md:py-16 bg-[#0f1a3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 text-center lg:text-left">
        <div>
          <h3 className="font-display text-xl md:text-2xl font-bold">Ready to Become Part of Our Legacy?</h3>
          <p className="text-[11px] md:text-xs text-slate-300 mt-2 max-w-xl mx-auto lg:mx-0">
            Admissions are open for the upcoming academic session. Schedule a campus tour or apply online through our digital portal.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0 justify-center">
          <Button asChild size="lg" className="bg-[#3454d1] hover:bg-blue-600 text-white text-xs font-bold w-full sm:w-auto shadow-md border-none">
            <Link href="/admissions">Apply for Admission</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white text-xs font-bold w-full sm:w-auto bg-transparent">
            <Link href="/contact">Contact Admissions Office</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
