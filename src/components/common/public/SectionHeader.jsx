import React from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable public-site section header: eyebrow label + heading + optional subtitle.
 * Used across About / Academics / Achievements / Admission / Contact sections.
 *
 * @param {string} eyebrow - small uppercase label above the heading
 * @param {string} title - main heading text
 * @param {string} [subtitle] - optional supporting copy under the heading
 * @param {"light"|"dark"} [theme="light"] - controls text colors for dark-background sections
 * @param {"center"|"left"} [align="center"]
 * @param {string} [accentClassName] - override eyebrow color (defaults per theme)
 * @param {string} [className] - extra classes on the wrapper
 * @param {string} [maxWidthClassName="max-w-2xl"] - wrapper max width
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  theme = "light",
  align = "center",
  accentClassName,
  className,
  maxWidthClassName = "max-w-2xl",
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        maxWidthClassName,
        align === "center" ? "text-center mx-auto" : "text-left",
        "mb-10 md:mb-12",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            accentClassName || (isDark ? "text-[#c99a3f]" : "text-[#3454d1]")
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-2xl sm:text-3xl font-extrabold mt-1",
          isDark ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-[11px] md:text-xs mt-2",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
