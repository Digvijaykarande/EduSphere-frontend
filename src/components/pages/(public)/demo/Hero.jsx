"use client";

import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Text Configurations */}
          <div className="lg:col-span-6 z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Nurturing Minds. Building Futures.
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl leading-[1.15]">
              Where Learning <br />
              Inspires <span className="text-primary relative inline-block">Excellence</span>
            </h1>
            <p className="mt-6 text-black max-w-xl leading-relaxed">
              Everest Global School is committed to providing a world-class education that empowers students to become confident, compassionate, and future-ready leaders.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="group bg-[#0f1a3a] text-white text-xs font-bold px-6 py-4 rounded-lg hover:bg-primary transition-all duration-200 shadow-lg shadow-[#0f1a3a]/10" asChild>
                <Link href="/about">
                  Discover Our School
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary text-xs font-bold px-6 py-4 rounded-lg transition-all duration-200 shadow-sm shadow-slate-200/50" asChild>
                <Link href="/campus-life">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Campus Tour
                </Link>
              </Button>
            </div>
          </div>

          {/* Graphical Image Assembly */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <img 
                  src="https://media.istockphoto.com/id/1163983986/photo/group-of-schoolboys-and-schoolgirls-at-school-campus.jpg?s=612x612&w=0&k=20&c=VycfYiXElvAwqoleIChLI5Z7R6ieZJZ-tYmM3pZkbNQ=" 
                  className="w-full h-full object-cover" 
                  alt="Students Smiling at Everest campus" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}