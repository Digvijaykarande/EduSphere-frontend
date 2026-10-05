"use client";

import React from "react";
import { BookOpen, Users, School, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Pillars() {
  const characteristics = [
    { icon: BookOpen, title: "Holistic Education", desc: "Academic excellence paired with life skills." },
    { icon: Users, title: "Experienced Faculty", desc: "Passionate educators shaping young minds." },
    { icon: School, title: "Modern Campus", desc: "State-of-the-art facilities for future leaders." },
    { icon: Globe, title: "Global Exposure", desc: "Preparing students for a global tomorrow." },
  ];

  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-xl shadow-slate-100 border border-slate-100">
        {characteristics.map((pill, i) => {
          const Icon = pill.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{pill.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">{pill.desc}</p>
              </div>
            </div>
          );
        })}
      </Card>
    </section>
  );
}