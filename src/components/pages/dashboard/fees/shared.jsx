"use client";

import { EntityAvatar } from "@/components/common/dashboard/EntityAvatar";
import { StatusBadge as CommonStatusBadge } from "@/components/common/dashboard/StatusBadge";
import { StatCard as CommonStatCard } from "@/components/common/dashboard/StatCard";

// ------------------------------------------------------------------
// 1. STUDENT AVATAR COMPONENT — now the shared EntityAvatar (identical
//    markup, kept exported under this name so existing imports work).
// ------------------------------------------------------------------
export function StudentAvatar({ name, src, className = "h-8 w-8" }) {
  return <EntityAvatar name={name} src={src} className={className} />;
}

// ------------------------------------------------------------------
// 2. STATUS BADGE COMPONENT — same fee-status palette, via the common
//    StatusBadge (which uses this exact palette as its default).
// ------------------------------------------------------------------
export function StatusBadge({ status }) {
  return <CommonStatusBadge status={status} />;
}

// ------------------------------------------------------------------
// 3. STAT CARD COMPONENT — "bar" variant of the common StatCard, matches
//    the previous left-accent-bar KPI style used on this dashboard.
// ------------------------------------------------------------------
export function StatCard({ label, value, change, icon, tone = "violet" }) {
  return (
    <CommonStatCard
      variant="bar"
      label={label}
      value={value}
      change={change}
      icon={icon}
      tone={tone}
    />
  );
}
