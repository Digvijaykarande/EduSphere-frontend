"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Small header for a panel/card inside a dashboard grid: a title, optional
// subtitle, and an optional "View all"-style link on the right. Moved here
// verbatim from dashboardpage/SharedUI.jsx.
export function PanelHeader({ title, subtitle, href, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-display font-semibold text-foreground">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all dash-focus rounded-md"
        >
          {action || "View"} <ArrowRight size={13} />
        </Link>
      ) : null}
    </div>
  );
}

export default PanelHeader;
