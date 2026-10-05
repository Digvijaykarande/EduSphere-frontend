import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Reusable icon + title + description card for public marketing sections
 * (core values, accolades, milestones, info cards, etc.). Built on shadcn <Card>.
 *
 * @param {React.ComponentType} [icon] - lucide-react icon component
 * @param {string} [iconWrapperClassName] - classes for the icon's colored box (bg + text color)
 * @param {string} [eyebrow] - optional small label rendered above/right of the icon (e.g. a year or badge text)
 * @param {string} [eyebrowClassName] - override eyebrow chip styling (e.g. render a plain large year instead of a pill)
 * @param {string} title
 * @param {string} [titleClassName]
 * @param {string} [description]
 * @param {string} [descriptionClassName]
 * @param {string} [className] - extra classes on the Card
 * @param {React.ReactNode} [children] - optional extra content rendered below the description
 */
export function IconFeatureCard({
  icon: Icon,
  iconWrapperClassName = "text-[#3454d1] bg-blue-50",
  eyebrow,
  eyebrowClassName = "text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200",
  title,
  titleClassName,
  description,
  descriptionClassName,
  className,
  children,
}) {
  return (
    <Card
      className={cn(
        "bg-white p-5 md:p-6 rounded-xl border border-slate-200/80 shadow-sm text-card-foreground transition-colors",
        className
      )}
    >
      {(Icon || eyebrow) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          {Icon && (
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                iconWrapperClassName
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          {eyebrow && <span className={eyebrowClassName}>{eyebrow}</span>}
        </div>
      )}

      <h4 className={cn("font-bold text-slate-900 text-sm md:text-base", titleClassName)}>
        {title}
      </h4>
      {description && (
        <p className={cn("text-[11px] md:text-xs text-slate-500 mt-2 leading-relaxed", descriptionClassName)}>
          {description}
        </p>
      )}
      {children}
    </Card>
  );
}

export default IconFeatureCard;
