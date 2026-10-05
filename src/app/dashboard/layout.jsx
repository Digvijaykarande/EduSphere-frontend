"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useThemeStore } from "@/store/use-theme-store";
import { useAuthStore } from "@/store/authStore";

/**
 * The Next.js middleware (src/middleware.js) is the authoritative auth
 * gate at the browser edge. By the time this layout renders, the cookie
 * has already been verified (or refreshed) and the user is definitely
 * authed. So this layout does NOT block render on a `/me` call — it just
 * hydrates the Zustand store in the background for the components that
 * read `user`.
 *
 * Belt-and-braces: if `/me` somehow 401s, we redirect to /login. This
 * should never happen under normal operation.
 */
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const hydrateTheme = useThemeStore((state) => state.hydrate);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchMe();
      if (cancelled) return;
      if (!res.success && res.status === 401) {
        router.push("/login");
        return;
      }
      setBootstrapped(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMe, router]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
          {/* Render shell always. If `hydrated` is false, the user object
              is still loading; child components fall back to "no user" and
              middleware has already verified the cookie. */}
          <div
            data-hydrated={hydrated ? "true" : "false"}
            data-bootstrapped={bootstrapped ? "true" : "false"}
            className="contents"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}