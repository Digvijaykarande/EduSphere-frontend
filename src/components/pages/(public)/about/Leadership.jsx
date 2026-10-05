import React from "react";
import { Quote, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Leadership() {
  const leadershipTeam = [
    {
      name: "Dr. Rajeshwar Patil",
      role: "Director & Principal",
      desc: "The true purpose of education is to replace an empty mind with an open one, fostering a community of critical thinkers.",
      badge: "Ph.D. in Educational Leadership (22+ Yrs)",
      img: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGJvc3N8ZW58MHx8MHx8fDA%3D"
    },
    {
      name: "Prof. Sunita Deshmukh",
      role: "Dean of Academics",
      desc: "We integrate adaptive learning frameworks to ensure every student learns at their exact optimal pace and depth.",
      badge: "Specialist in STEM Curriculum Design",
      img: "https://media.istockphoto.com/id/1355693407/photo/attractive-businesswoman-sitting-at-the-desk-indoors-in-office-working-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=qZQe4cTNGiRkBgvsyGKw4U7l1fwSqkpy_gDyDLcyD0M="
    },
    {
      name: "Vikramaditya Shinde",
      role: "Head of Student Welfare",
      desc: "Mental and physical well-being are the bedrock of academic excellence. We build resilient, well-rounded individuals.",
      badge: "Pioneer in Holistic Counseling",
      img: "https://images.unsplash.com/photo-1548964095-b9a292144866?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RGlyZWN0b3IlMjAlMjYlMjBQcmluY2lwYWx8ZW58MHx8MHx8fDA%3D"
    },
    {
      name: "Dr. Anil Sharma",
      role: "Head of Innovation",
      desc: "Innovation isn't just about technology; it's a mindset of continuous curiosity that we instill in our students daily.",
      badge: "Former ISRO Scientist & Tech Lead",
      img: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100/50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Institutional Governance</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Meet Our Academic Leaders</h2>
          <p className="text-[11px] md:text-xs text-slate-500 mt-2">Seasoned educators and administrators dedicated to institutional growth and student well-being.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {leadershipTeam.map((member, idx) => (
            <Card key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow text-card-foreground">
              <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto relative bg-slate-200">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full sm:w-3/5 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                <Quote className="h-6 w-6 text-slate-200 mb-2 shrink-0" />
                <p className="text-xs md:text-sm text-slate-600 italic leading-relaxed mb-4">
                  "{member.desc}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-base md:text-lg">{member.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#c99a3f] mt-0.5">
                    {member.role}
                  </p>
                  
                  <div className="mt-3 inline-flex items-start gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg text-emerald-700 w-full sm:w-auto">
                    <Medal className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] md:text-xs font-semibold leading-snug">{member.badge}</span>
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