"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const links = ["Product", "Services", "Clients", "Pricing", "Contact"];

export default function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-foreground">
          <Avatar className="h-8 w-8 bg-amber-500/10 border border-amber-500/30 text-gold">
            <AvatarFallback className="bg-transparent text-[#c99a3f]">
              <GraduationCap size={16} />
            </AvatarFallback>
          </Avatar>
          EduSphere
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/60 border border-slate-200/70 rounded-full px-1.5 py-1.5">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="px-4 py-1.5 rounded-full text-sm font-medium text-secondary hover:text-foreground hover:bg-white transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#login" className="text-sm font-semibold text-secondary hover:text-foreground transition-colors">Log in</a>
          <Button className="rounded-full py-2.5 px-5 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm" asChild>
            <a href="#demo">Book a demo</a>
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden glass-nav border-t border-slate-200 px-6 py-4 space-y-3"
        >
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm font-medium text-secondary">{l}</a>
          ))}
          <Button className="w-full text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm" asChild>
            <a href="#demo">Book a demo</a>
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}