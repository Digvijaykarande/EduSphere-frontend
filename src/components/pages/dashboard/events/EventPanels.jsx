import React from "react";
import { MapPin } from "lucide-react";
import { CATEGORY_META, getCategoryLabel } from "./events.utils";

export default function EventPanels({
  upcoming,
  todaysEvents,
  setActiveTab,
  openModal,
  today,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-display font-semibold text-foreground">
            Upcoming Events
          </p>
          <button
            onClick={() => setActiveTab("agenda")}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Nothing on the calendar yet.
            </p>
          )}
          {upcoming.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <div
                className="h-11 w-11 rounded-lg flex flex-col items-center justify-center shrink-0"
                style={{ background: CATEGORY_META[ev.category].bg }}
              >
                <span
                  className="text-[9px] font-bold uppercase"
                  style={{ color: CATEGORY_META[ev.category].text }}
                >
                  {new Date(ev.date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
                <span
                  className="text-sm font-bold leading-none"
                  style={{ color: CATEGORY_META[ev.category].text }}
                >
                  {new Date(ev.date).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {ev.title}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <MapPin size={11} /> {ev.location}
                </p>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                style={{
                  background: CATEGORY_META[ev.category].bg,
                  color: CATEGORY_META[ev.category].text,
                }}
              >
                {getCategoryLabel(ev)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <p className="text-base font-display font-semibold text-foreground mb-4">
          Today's Events
        </p>
        {todaysEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No events scheduled for today.
            </p>
            <button
              onClick={() => openModal(today)}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              + Add one
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: CATEGORY_META[ev.category].dot }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {ev.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {ev.start}
                    {ev.end ? ` – ${ev.end}` : ""} • {ev.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
