import React from "react";
import { Microscope, Layers } from "lucide-react";

export function InnovationLabs() {
  const hubs = [
    { title: "Robotics & AI Lab", desc: "Hands-on coding, circuitry, and machine learning modules starting Grade 6." },
    { title: "Digital Language Lab", desc: "Interactive linguistic software to perfect pronunciation and global communication skills." },
    { title: "Advanced Computer Centers", desc: "High-speed networks and programming environments for software development training." }
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-100/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-200 w-full">
          <img 
            src="https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=800&auto=format&fit=crop" 
            alt="Students in a modern science laboratory" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1226]/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
              <Microscope className="h-5 w-5 text-[#c99a3f] mb-1.5" />
              <h4 className="font-bold text-xs md:text-sm">State-of-the-Art Labs</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Equipped with industry-standard apparatus for Physics, Chemistry, and Biology.</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-4 md:space-y-5 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Innovation Centers</span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
            Moving Beyond the Textbook
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Everest Global School provides dedicated innovation hubs designed to prepare students for the demands of the 21st century. Our curriculum seamlessly integrates practical application with theoretical knowledge.
          </p>
          
          <ul className="space-y-4 pt-4 text-left max-w-xl mx-auto lg:mx-0">
            {hubs.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="h-4 w-4 text-[#3454d1]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}