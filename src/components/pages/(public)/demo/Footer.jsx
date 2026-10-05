"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialMedias = [
    { name: "Facebook", href: "https://facebook.com", svgPath: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
    { name: "Instagram", href: "https://instagram.com", svgPath: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" },
    { name: "Youtube", href: "https://youtube.com", svgPath: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l5 3z" },
    { name: "Linkedin", href: "https://linkedin.com", svgPath: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  ];

  return (
    <footer className="bg-[#0b1226] text-slate-400 text-xs pt-16 pb-8 border-t border-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Intro Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-display text-base font-bold text-white tracking-tight">Everest</span>
                <span className="block text-[10px] tracking-widest text-gold uppercase font-bold -mt-0.5">Global School</span>
              </div>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400 max-w-sm">
              Empowering students with knowledge, values, and skills to thrive in a dynamic, globally interconnected world.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              {socialMedias.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="h-7 w-7 rounded-full bg-slate-800 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={social.svgPath} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links columns */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2.5 font-medium">
              {[
                { name: "About Us", path: "/about" },
                { name: "Academics", path: "/academics" },
                { name: "Admissions", path: "/admissions" },
                { name: "Campus Life", path: "/campus-life" },
                { name: "Contact Us", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4">Information</h5>
            <ul className="space-y-2.5 font-medium">
              {[
                { name: "News & Events", path: "/events" },
                { name: "Gallery", path: "/campus-life" },
                { name: "Careers", path: "/about" },
                { name: "Privacy Policy", path: "#" },
                { name: "Terms & Conditions", path: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Maps Column */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4">Contact Us</h5>
            <div className="space-y-3 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>123 Education Street, Knowledge City, SG0001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                {/* Fixed: Wrapped in anchor tel: protocol tag */}
                <a href="tel:+919876543210" className="hover:text-white hover:underline transition-all">
                  <span>+91 98765 43210</span>
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                {/* Fixed: Wrapped in anchor mailto: protocol tag */}
                <a href="mailto:info@everestschool.edu.in" className="truncate hover:text-white hover:underline transition-all">
                  <span>info@everestschool.edu.in</span>
                </a>
              </div>
            </div>

            <div className="mt-4 w-full h-28 rounded-xl overflow-hidden border border-slate-800 relative group bg-slate-950">
              <iframe
                title="Everest Global School Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.7643538419615!2d74.1682855!3d17.2789101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc173bb46aa27df%3A0xa64b38d01d4a0ea2!2sSGM%20College%20Karad!5e0!3m2!1sen!2sin!4v1715600000000!5m2!1sen!2sin"
                className="w-full h-full border-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300 invert hue-rotate-180 contrast-[0.9] saturate-75"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="text-[9px] text-slate-400 font-mono tracking-wide uppercase bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded shadow-sm">
                  Interactive View
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Base Layer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
          <span>© 2026 Everest Global School. All Rights Reserved.</span>
          <Button size="icon" variant="secondary" onClick={scrollToTop} className="h-8 w-8 bg-slate-800 hover:bg-primary text-slate-300 hover:text-white rounded-full transition-colors shadow-md">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </footer>
  );
}