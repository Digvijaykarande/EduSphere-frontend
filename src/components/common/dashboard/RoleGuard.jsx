"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RoleGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { user, hydrated, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!hydrated) {
      fetchMe?.();
    }
  }, [hydrated, fetchMe]);

  const userRole = user?.role?.toLowerCase();
  const isAuthorized = user && allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

  useEffect(() => {
    // Only redirect once state is hydrated and user is NOT authorized
    if (hydrated && (!user || !isAuthorized)) {
      router.replace("/dashboard");
    }
  }, [hydrated, user, isAuthorized, router]);

  // Block rendering until auth state is confirmed and verified
  if (!hydrated || !isAuthorized) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}