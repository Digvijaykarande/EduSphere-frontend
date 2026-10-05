"use client";

import React from "react";
import { Trophy, Award, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsAchievements() {
  const events = [
    { day: "24", month: "MAY", title: "Annual Sports Meet 2025", time: "24 May, 2025 • 9:00 AM Onwards", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&auto=format&fit=crop" },
    { day: "02", month: "JUN", title: "Science Exhibition", time: "02 June, 2025 • 10:00 AM Onwards", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=200&auto=format&fit=crop" },
    { day: "15", month: "JUN", title: "Parents Orientation Program", time: "15 June, 2025 • 11:00 AM Onwards", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=200&auto=format&fit=crop" },
  ];

  const achievements = [
    { title: "State Topper in Board Exams 2024", context: "3 Students", icon: Trophy, color: "text-gold bg-amber-50" },
    { title: "National Level Science Award", context: "2nd Position", icon: Medal, color: "text-blue-600 bg-blue-50" },
    { title: "National Basketball Champions 2024", context: "Winners", icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
    { title: "Excellence in Education Award 2024", context: "Awarded", icon: Award, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Upcoming Events Container */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-slate-900">Upcoming Events</h3>
              <Button variant="link" className="text-xs font-semibold text-primary p-0 h-auto">View All Events →</Button>
            </div>
            <div className="space-y-4">
              {events.map((ev, i) => (
                <Card key={i} className="bg-white p-3 border border-slate-200/60 shadow-none flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg w-16 h-16 flex flex-col items-center justify-center shrink-0">
                    <span className="block text-lg font-mono font-bold text-primary leading-none">{ev.day}</span>
                    <span className="block text-[10px] font-bold text-slate-400 mt-1">{ev.month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{ev.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{ev.time}</p>
                  </div>
                  <img src={ev.img} alt="" className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 hidden sm:block" />
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Container */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-slate-900">Our Achievements</h3>
              <Button variant="link" className="text-xs font-semibold text-primary p-0 h-auto">View All →</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ac, i) => {
                const Icon = ac.icon;
                return (
                  <Card key={i} className="bg-white p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className={`h-10 w-10 ${ac.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{ac.title}</h4>
                      <p className="text-xs text-black mt-1 font-semibold">{ac.context}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}