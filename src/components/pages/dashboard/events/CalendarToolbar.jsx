import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarToolbar({
  activeTab,
  setActiveTab,
  goToday,
  shiftWeekOrDay,
}) {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {["month", "week", "day", "Events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== "Events" && (
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="btn-pill-outline !px-4 !py-1.5 text-xs dark:!border-slate-700 dark:!text-slate-300 dark:bg-slate-800 cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftWeekOrDay(-1)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => shiftWeekOrDay(1)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}