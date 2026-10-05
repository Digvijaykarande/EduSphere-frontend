"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Reusable single-open FAQ accordion for public marketing pages.
 *
 * @param {{q: string, a: string}[]} items
 * @param {number|null} [defaultOpenIndex=0] - index open by default, or null for none
 * @param {string} [accentClassName="text-[#3454d1]"] - accent color used while a question is open
 * @param {string} [className]
 */
export function FaqAccordion({
  items = [],
  defaultOpenIndex = 0,
  accentClassName = "text-[#3454d1]",
  className,
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <Card
            key={idx}
            className="bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-colors duration-200 text-card-foreground shadow-none"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left transition-colors cursor-pointer focus:outline-none"
            >
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold leading-snug",
                  isOpen ? accentClassName : "text-slate-900"
                )}
              >
                {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 md:px-5 md:pb-5 -mt-1">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
