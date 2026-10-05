import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Reusable dark call-to-action band used at the end of public pages
 * (About, Achievements, Admissions, etc.).
 *
 * @param {React.ComponentType} [icon] - optional lucide icon shown above the title
 * @param {string} title
 * @param {string} [description]
 * @param {{label: string, href: string, icon?: React.ComponentType}} [primaryAction]
 * @param {{label: string, href: string, icon?: React.ComponentType}} [secondaryAction]
 * @param {string} [bgClassName="bg-[#0b1226]"]
 * @param {string} [primaryButtonClassName]
 * @param {string} [className]
 */
export function CtaSection({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  bgClassName = "bg-[#0b1226]",
  primaryButtonClassName = "bg-[#3454d1] hover:bg-blue-600 text-white",
  className,
}) {
  return (
    <section className={cn("py-16 md:py-20 text-white", bgClassName, className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {Icon && (
          <div className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Icon className="h-7 w-7 text-[#c99a3f]" />
          </div>
        )}
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
            {description}
          </p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {primaryAction && (
              <Button
                asChild
                size="lg"
                className={cn(
                  "font-bold text-xs w-full sm:w-auto shadow-md border-none px-6",
                  primaryButtonClassName
                )}
              >
                <Link href={primaryAction.href} className="inline-flex items-center gap-2">
                  {primaryAction.label}
                  {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                </Link>
              </Button>
            )}
            {secondaryAction && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white font-bold text-xs w-full sm:w-auto bg-transparent px-6"
              >
                <Link href={secondaryAction.href} className="inline-flex items-center gap-2">
                  {secondaryAction.label}
                  {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4" />}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CtaSection;
