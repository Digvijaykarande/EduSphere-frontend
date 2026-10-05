"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LifeAtEverest() {
  const galleries = [
    { label: "Smart Classrooms", slug: "smart-classrooms", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400&auto=format&fit=crop" },
    { label: "Sports & Fitness", slug: "sports-and-fitness", img: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=400&auto=format&fit=crop" },
    { label: "Art & Creativity", slug: "art-and-creativity", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop" },
    { label: "Music & Dance", slug: "music-and-dance", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop" },
    { label: "Clubs & Activities", slug: "clubs-and-activities", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop" },
    { label: "Community Service", slug: "community-service", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-slate-900">Life at Everest</h3>
            <p className="text-xs text-secondary mt-1">A place where learning goes beyond classrooms.</p>
          </div>
          <Button variant="link" className="text-xs font-bold text-primary p-0 h-auto">Explore More →</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleries.map((g, i) => (
            <Link key={i} href={`/life-at-everest/${g.slug}`} className="block">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group bg-slate-100 shadow-sm cursor-pointer">
                <img src={g.img} alt={g.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3 text-center">
                  <span className="text-[11px] font-bold tracking-wide text-white block truncate uppercase">{g.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Subscription Strip */}
        <div className="mt-20 bg-gradient-to-r from-primary to-[#1a36a3] p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/10">
          <div>
            <h4 className="font-display text-lg font-bold">Stay Updated with Our Latest News</h4>
            <p className="text-xs text-blue-100 mt-1">Subscribe to our newsletter and never miss an important update.</p>
          </div>
          <div className="flex w-full md:w-auto max-w-md items-center bg-white p-1.5 rounded-xl border border-white/10 shrink-0 gap-2">
            <Input type="email" placeholder="Enter your email address" className="w-full bg-transparent border-0 shadow-none px-3 py-2 text-xs text-slate-900 focus-visible:ring-0 placeholder:text-slate-400" />
            <Button className="bg-gold text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#b08432] transition-colors shrink-0 shadow-sm">
              Subscribe
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}