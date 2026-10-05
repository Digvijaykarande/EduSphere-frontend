"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/use-theme-store";
import NotificationsPanel from "@/components/pages/dashboard/NotificationsPanel";
import { seedNotifications } from "@/components/pages/dashboard/notifications.utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  // Grab user, hydrated status, and logout method
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Synchronize Multi-Tab Logout cleanly
  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  const displayName = user?.name || "Loading…";
  const displayRole = user?.role
    ? user.role.toLowerCase().replace("_", " ")
    : "user";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const requestSignOut = () => {
    setDropdownOpen(false);
    setLogoutModalOpen(true);
  };

  const cancelSignOut = () => {
    if (signingOut) return;
    setLogoutModalOpen(false);
  };

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setSigningOut(false);
      setLogoutModalOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <header className="h-[76px] shrink-0 border-b border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-between gap-4 px-6 md:px-8 z-10 select-none">
      {/* Left: mobile menu toggle + search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </Button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search students, classes, fees…"
            className="pl-10 py-2.5 bg-[#f5f6fb] dark:bg-slate-800/60 rounded-xl"
          />
        </div>
      </div>

      {/* Right: utilities */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </Button>

          {notifOpen && (
            <NotificationsPanel
              notifications={notifications}
              onMarkAllRead={markAllRead}
              onMarkRead={markRead}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1.5" />

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <Avatar className="h-9 w-9 ring-2 ring-amber-500/25">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={displayName} />}
              <AvatarFallback className="bg-slate-800 text-amber-400 font-display font-semibold">
                {avatarInitial || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-slate-400 font-normal leading-tight capitalize">
                {displayRole}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 hidden md:block transition-transform duration-150 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-30 overflow-hidden">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserIcon size={16} />
                  <span>My profile</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <hr className="border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={requestSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={logoutModalOpen} onClose={cancelSignOut}>
        <ModalContent maxWidth="max-w-sm">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <LogOut size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <ModalTitle>Sign out</ModalTitle>
                <ModalDescription>
                  Are you sure you want to sign out of your account?
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={cancelSignOut}
              disabled={signingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1.5" />
                  Signing out...
                </>
              ) : (
                "Sign out"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </header>
  );
}