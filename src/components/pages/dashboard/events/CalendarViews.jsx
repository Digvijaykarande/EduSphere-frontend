import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Clock, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  WEEKDAYS,
  CATEGORY_META,
  toKey,
  sameDay,
  formatDayLabel,
  formatShort,
} from "./events.utils";

const AGENDA_PAGE_SIZE = 5;

export default function CalendarViews({
  activeTab,
  monthGrid,
  weekDays,
  eventsByDate,
  filteredEvents,
  viewDate,
  selectedDate,
  today,
  openModal,
  deleteEvent,
  canManage,
}) {
  const [agendaPage, setAgendaPage] = useState(1);

  const sortedAgendaEvents = useMemo(
    () =>
      filteredEvents
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)),
    [filteredEvents]
  );

  const agendaTotalPages = Math.max(
    1,
    Math.ceil(sortedAgendaEvents.length / AGENDA_PAGE_SIZE)
  );

  // Reset to page 1 whenever the underlying event list changes (new
  // events created/deleted, filters change) so we never land on an
  // empty trailing page.
  useEffect(() => {
    setAgendaPage(1);
  }, [sortedAgendaEvents.length]);

  const pagedAgendaEvents = sortedAgendaEvents.slice(
    (agendaPage - 1) * AGENDA_PAGE_SIZE,
    agendaPage * AGENDA_PAGE_SIZE
  );

  const agendaGroupedByDate = pagedAgendaEvents.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  return (
    <>
      {/* MONTH VIEW */}
      {activeTab === "month" && (
        <div className="w-full">
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 text-center">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthGrid.flat().map((d, i) => {
              const inMonth = d.getMonth() === viewDate.getMonth();
              const isToday = sameDay(d, today);
              const dayEvents = (eventsByDate[toKey(d)] || []).slice().sort((a, b) => a.start.localeCompare(b.start));
              const visible = dayEvents.slice(0, 2);
              const overflow = dayEvents.length - visible.length;
              const hasHighVolume = dayEvents.length > 2;

              return (
                <button
                  key={i}
                  onClick={() => openModal(d)}
                  className={`min-h-[100px] p-2 text-left border-b border-r border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col justify-between ${
                    !inMonth ? "bg-slate-50/40 dark:bg-slate-800/20" : "bg-white dark:bg-slate-900"
                  }`}
                >
                  {/* Top Day Bar: Aligning Date Indicator Left and Notification Badge Right */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday 
                          ? "bg-indigo-600 text-white shadow-sm" 
                          : inMonth 
                            ? "text-slate-700 dark:text-slate-300" 
                            : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {d.getDate()}
                    </span>

                    {/* Notification-like Count Badge */}
                    {hasHighVolume && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/40 animate-pulse">
                        {dayEvents.length} EV
                      </span>
                    )}
                  </div>

                  {/* Bottom View Area: Dynamic Visual Rendering Stack */}
                  <div className="space-y-1 w-full mt-auto">
                    {visible.map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] font-semibold rounded px-1.5 py-0.5 truncate w-full block"
                        style={{ background: CATEGORY_META[ev.category].bg, color: CATEGORY_META[ev.category].text }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {overflow > 0 && (
                      <p className="text-[9.5px] font-bold text-indigo-500 dark:text-indigo-400 px-1">
                        +{overflow} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {activeTab === "week" && (
        <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
          {weekDays.map((d, i) => {
            const isToday = sameDay(d, today);
            const dayEvents = (eventsByDate[toKey(d)] || []).slice().sort((a, b) => a.start.localeCompare(b.start));

            return (
              <div key={i} className="min-h-[380px] flex flex-col bg-white dark:bg-slate-900">
                <button
                  onClick={() => openModal(d)}
                  className="p-3 border-b border-slate-100 dark:border-slate-800 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{WEEKDAYS[i]}</p>
                  <p className={`text-sm font-bold mt-0.5 inline-block px-2 py-0.5 rounded-full ${isToday ? "bg-indigo-50 text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                    {d.getDate()}
                  </p>
                </button>
                <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[10.5px] font-semibold rounded-md px-2 py-1.5 shadow-sm"
                      style={{ background: CATEGORY_META[ev.category].bg, color: CATEGORY_META[ev.category].text }}
                    >
                      <p className="truncate font-bold">{ev.title}</p>
                      <p className="font-normal opacity-80 text-[9.5px] mt-0.5">{ev.start}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {activeTab === "day" && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-b-xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-base font-semibold text-slate-900 dark:text-white">{formatDayLabel(selectedDate)}</p>
            {canManage && (
              <button onClick={() => openModal(selectedDate)} className="btn-pill-primary !px-4 !py-2 text-xs gap-1.5">
                <Plus size={14} /> Add Event
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {(eventsByDate[toKey(selectedDate)] || []).length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">No events scheduled for this day.</p>
            )}
            {(eventsByDate[toKey(selectedDate)] || [])
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <span className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0" style={{ background: CATEGORY_META[ev.category].dot }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{ev.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {ev.start}{ev.end ? ` – ${ev.end}` : ""}</span>
                      {ev.location && <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>}
                    </div>
                  </div>
                  {canManage && (
                    <button onClick={() => deleteEvent(ev.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AGENDA / EVENTS VIEW */}
      {(activeTab === "agenda" || activeTab === "Events") && (
        <div className="bg-white dark:bg-slate-900 rounded-b-xl">
          <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredEvents.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-12 text-center">No events match the current filters.</p>
            )}
            {Object.entries(agendaGroupedByDate).map(([dateKey, evs]) => (
              <div key={dateKey} className="py-4 flex gap-6 first:pt-2">
                <div className="w-24 shrink-0 text-xs font-bold text-slate-400 dark:text-slate-500 pt-0.5">{formatShort(new Date(dateKey))}</div>
                <div className="flex-1 space-y-3">
                  {evs.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 group">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: CATEGORY_META[ev.category].dot }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{ev.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{ev.start}{ev.end ? ` – ${ev.end}` : ""} • {ev.location}</p>
                      </div>
                      {canManage && (
                        <button onClick={() => deleteEvent(ev.id)} className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {sortedAgendaEvents.length > AGENDA_PAGE_SIZE && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {(agendaPage - 1) * AGENDA_PAGE_SIZE + 1}–
                  {Math.min(agendaPage * AGENDA_PAGE_SIZE, sortedAgendaEvents.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {sortedAgendaEvents.length}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAgendaPage((p) => Math.max(1, p - 1))}
                  disabled={agendaPage === 1}
                  aria-label="Previous page"
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: agendaTotalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAgendaPage(p)}
                    className={`h-7 min-w-7 px-1.5 flex items-center justify-center rounded-lg text-[11px] font-semibold transition-colors ${
                      p === agendaPage
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAgendaPage((p) => Math.min(agendaTotalPages, p + 1))}
                  disabled={agendaPage === agendaTotalPages}
                  aria-label="Next page"
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}