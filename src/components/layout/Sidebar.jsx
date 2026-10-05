"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  FileText,
  CreditCard,
  HelpCircle,
  Calendar,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X,
  Database
} from "lucide-react";

// Add allowedRoles: ['admin', 'school', 'teacher', 'student']
const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Insert", 
    href: "/dashboard/insert", 
    icon: Database, 
    allowedRoles: ["admin", "school", "teacher"] // Hidden for student
  },
  { 
    label: "Attendance", 
    href: "/dashboard/attendance", 
    icon: CalendarCheck, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Academics", 
    href: "/dashboard/academics", 
    icon: GraduationCap, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Exams", 
    href: "/dashboard/exams", 
    icon: FileText, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Fees", 
    href: "/dashboard/fees", 
    icon: CreditCard, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Events", 
    href: "/dashboard/events", 
    icon: Calendar, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  },
  { 
    label: "Support", 
    href: "/dashboard/support", 
    icon: HelpCircle, 
    allowedRoles: ["admin", "school", "teacher", "student"] 
  }
];

function NavRow({ item, isActive, isOpen, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="block" onClick={onNavigate}>
      <div
        className={`sidebar-nav-item relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive 
            ? "text-white bg-indigo-600 shadow-md shadow-indigo-600/10 font-semibold" 
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
        } ${!isOpen ? "justify-center px-0 mx-auto w-10 h-10" : "mx-3"}`}
        style={{ color: "white" }}
      >
        {isActive && (
          <motion.div
            layoutId="activeNavPill"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-0 text-white bg-indigo-600 rounded-xl -z-10"
          />
        )}
        
        <Icon 
          size={18} 
          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
          }`} 
        />
        
        {isOpen && <span className="truncate">{item.label}</span>}
      </div>
    </Link>
  );
}

function NavList({ pathname, isOpen, onNavigate, items }) {
  return (
    <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden">
      {items.map((item) => (
        <NavRow
          key={item.href}
          item={item}
          isActive={pathname === item.href}
          isOpen={isOpen}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function SignOutButton({ isOpen, onSignOut }) {
  return (
    <>
      <span style={{ display: "flex", justifyContent: 'center', width: '100%', background: 'rgba(255,255,255,0.06)', height: "1px", marginBottom: "10px" }}></span>
      <button
        onClick={onSignOut}
        aria-label="Sign out"
        className={`flex items-center gap-3 mx-3 mb-5 px-3.5 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-sm font-medium shrink-0 cursor-pointer ${
          !isOpen ? "justify-center px-0 w-10 h-10 mx-auto" : ""
        }`}
      >
        <LogOut size={16} className="shrink-0" />
        {isOpen && <span className="truncate">Sign out</span>}
      </button>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Normalize role to lowercase
  const userRole = user?.role?.toLowerCase();

  // Filter items according to the user's role
  const visibleNavItems = useMemo(() => {
    if (!userRole) return [];
    return navItems.filter((item) => item.allowedRoles.includes(userRole));
  }, [userRole]);

  const handleSignOut = () => {
    logout?.();
    router.push("/login");
  };

  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") toggleSidebar();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Desktop rail (md and up) */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 84 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-screen bg-slate-950 text-slate-200 border-r border-slate-800/60 shrink-0 select-none overflow-hidden"
      >
        {/* Brand header */}
        <div className={`h-[76px] flex items-center gap-3 border-slate-850 shrink-0 ${isOpen ? "px-5" : "justify-center px-0"}`} style={{ borderBottom: "1px solid #565656" }}>
          <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <BookOpen size={18} />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="leading-tight overflow-hidden whitespace-nowrap flex-1"
              >
                <p className="font-semibold text-white text-[16px]">EduSphere</p>
                <p className="text-[11px] text-slate-500">School Management</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {!isOpen && (
          <button
            onClick={toggleSidebar}
            className="mx-auto mt-4 p-1.5 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}

        <NavList pathname={pathname} isOpen={isOpen} items={visibleNavItems} />
        <SignOutButton isOpen={isOpen} onSignOut={handleSignOut} />
      </motion.aside>

      {/* Mobile drawer (below md) */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden">
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[250px] flex flex-col h-screen bg-slate-950 text-slate-200 shrink-0 select-none overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="h-[76px] flex items-center gap-3 border-b border-slate-850 shrink-0 px-5">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <BookOpen size={18} />
                </div>
                <div className="leading-tight overflow-hidden whitespace-nowrap flex-1">
                  <p className="font-semibold text-white text-[16px]">EduSphere</p>
                  <p className="text-[11px] text-slate-500">School Management</p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              <NavList pathname={pathname} isOpen={true} onNavigate={toggleSidebar} items={visibleNavItems} />
              <SignOutButton isOpen={true} onSignOut={handleSignOut} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}