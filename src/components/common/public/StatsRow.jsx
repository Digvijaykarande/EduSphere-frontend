import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Reusable row of icon + big number + label stats, optionally wrapped in a Card.
 * Used for impact metrics / trust bars on public marketing pages.
 *
 * @param {{icon?: React.ComponentType, value: React.ReactNode, label: string, colorClassName?: string}[]} stats
 * @param {boolean} [asCard=true] - wrap the row in a shadcn <Card>
 * @param {string} [className]
 * @param {string} [gridClassName="grid-cols-2 md:grid-cols-4"]
 */
export function StatsRow({
  stats = [],
  asCard = true,
  className,
  gridClassName = "grid-cols-2 md:grid-cols-4",
}) {
  const content = (
    <div className={cn("grid gap-4 md:gap-6 px-4 md:px-6 py-2", gridClassName)}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="text-center p-2 md:p-4">
            {Icon && (
              <Icon
                className={cn(
                  "h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3",
                  stat.colorClassName || "text-[#3454d1]"
                )}
              />
            )}
            <h3 className="font-mono text-2xl md:text-3xl font-bold text-slate-900">
              {stat.value}
            </h3>
            <p className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );

  if (!asCard) return <div className={className}>{content}</div>;

  return (
    <Card className={cn("bg-white rounded-2xl shadow-xl border-none", className)}>
      {content}
    </Card>
  );
}

export default StatsRow;
