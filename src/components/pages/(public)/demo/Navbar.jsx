"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, GraduationCap, ArrowRight, UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AUTH_ME_ENDPOINT =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5000";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const searchInputRef = useRef(null);

  // Hide the admin/dashboard affordance for unauthed visitors. The
  // request is best-effort: if it fails (no cookie, 401, network) we
  // hide the admin button rather than show it.
  useEffect(() => {
    let cancelled = false;
    fetch(`${AUTH_ME_ENDPOINT}/api/auth/me`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => {
        if (!cancelled) setIsAuthed(res.ok);
      })
      .catch(() => {
        if (!cancelled) setIsAuthed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Demo", href: "/demo" },
    { label: "About Us", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Campus", href: "/campus-life" },
    { label: "Achievements", href: "/achievements" },
    { label: "Contact", href: "/contact" },
  ];

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  return (
    <header className="relative w-full border-b border-slate-200/80 bg-white shadow-sm shadow-slate-100/50 z-50">
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-[#1d3bb5] text-white shadow-md transition-transform duration-300 group-hover:scale-105">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="block font-display text-base sm:text-xl font-extrabold tracking-tight text-slate-900">
              Everest
            </span>
            <span className="block text-[9px] sm:text-[10px] font-bold tracking-widest text-[#c99a3f] uppercase -mt-1">
              Global School
            </span>
          </div>
        </Link>

        {/* Desktop Interface Area */}
        <div className="hidden lg:flex items-center justify-end flex-1 h-12 relative">
          
          <nav 
            className={`flex items-center p-1.5 bg-slate-100/50 rounded-full border border-slate-200/60 transition-all duration-300 ease-in-out mr-4 ${
              isSearchActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
            }`}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 xl:px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-blue-600 bg-white shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Smooth Expanding Search Bar Box */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 h-11 bg-slate-100 border border-slate-200/80 rounded-full flex items-center px-4 gap-3 transition-all duration-300 ease-in-out z-20 ${
              isSearchActive 
                ? "right-[260px] w-[calc(100%-420px)] max-w-3xl opacity-100 scale-100" 
                : "right-[260px] w-0 opacity-0 scale-95 pointer-events-none p-0 border-none"
            }`}
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <Input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search courses, admissions criteria, academic resources..." 
              className="w-full bg-transparent border-0 shadow-none text-xs font-medium text-slate-800 focus-visible:ring-0 placeholder-slate-400 h-auto p-0"
            />
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchActive(false)}
              className="h-6 w-6 p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Control Group */}
          <div className="flex items-center gap-3 shrink-0">
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchActive(!isSearchActive)}
              className={`rounded-full transition-all duration-300 h-10 w-10 ${
                isSearchActive 
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all gap-2" asChild>
              <Link href={isAuthed ? "/dashboard" : "/login"}>
                <UserCircle className="h-4 w-4 text-slate-300 group-hover:text-blue-200" />
                <span>{isAuthed ? "Dashboard" : "Portal Login"}</span>
              </Link>
            </Button>

            {isAuthed && (
              <Button variant="outline" className="group bg-white border border-slate-200 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold px-4 py-2.5 rounded-full transition-all gap-1.5" asChild>
                <Link href="/dashboard">
                  <span>Admin</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </Button>
            )}
          </div>

        </div>

        {/* Mobile Menu Action Hamburger Control */}
        <div className="flex items-center lg:hidden gap-3">
          <Button variant="ghost" size="icon" className="text-slate-700 hover:text-blue-600" asChild>
            <Link href={isAuthed ? "/dashboard" : "/login"}>
              <UserCircle className="h-6 w-6" />
            </Link>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Dropdown Mobile Navigation Panel Sheet */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 w-full">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 rounded-l-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              {isAuthed && (
                <Button variant="outline" className="w-full py-3 text-xs font-bold text-slate-700 rounded-xl bg-slate-50" onClick={closeMenu} asChild>
                  <Link href="/dashboard">
                    Admin Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}