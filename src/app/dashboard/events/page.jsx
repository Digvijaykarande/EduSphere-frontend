"use client";
import React, { useEffect, useMemo, useState } from "react";
import EventsHeader from "@/components/pages/dashboard/events/EventsHeader";
import CalendarToolbar from "@/components/pages/dashboard/events/CalendarToolbar";
import CalendarViews from "@/components/pages/dashboard/events/CalendarViews";
import EventPanels from "@/components/pages/dashboard/events/EventPanels";
import EventModal from "@/components/pages/dashboard/events/EventModal";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  CATEGORY_LIST,
  emptyDraft,
  toKey,
  addMonths,
  addDays,
  startOfWeek,
  buildMonthGrid,
} from "@/components/pages/dashboard/events/events.utils";

const MANAGE_ROLES = ["SCHOOL", "TEACHER"];

export default function EventsPage() {
  const today = new Date();

  const role = useAuthStore((s) => s.user?.role);
  const canManage = MANAGE_ROLES.includes(role);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategories] = useState(
    Object.fromEntries(CATEGORY_LIST.map((c) => [c, true])),
  );
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState("month");
  const [modalDate, setModalDate] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);

  // Normalize Mongo's _id to id so the rest of the UI doesn't have to care.
  const normalize = (ev) => ({ ...ev, id: ev.id || ev._id });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getEvents();
        const data = res.data || res;
        if (!cancelled) setEvents((data || []).map(normalize));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load events.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(
    () => events.filter((e) => activeCategories[e.category]),
    [events, activeCategories],
  );

  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  const upcoming = useMemo(() => {
    return filteredEvents
      .filter((e) => e.date >= toKey(today))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [filteredEvents]);

  const todaysEvents = useMemo(
    () =>
      (eventsByDate[toKey(today)] || []).sort((a, b) =>
        a.start.localeCompare(b.start),
      ),
    [eventsByDate],
  );

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  function shiftMonth(delta) {
    setViewDate((prev) => addMonths(prev, delta));
  }

  function shiftWeekOrDay(delta) {
    if (activeTab === "day") {
      setSelectedDate(addDays(selectedDate, delta));
    } else if (activeTab === "week") {
      setSelectedDate(addDays(selectedDate, delta * 7));
    } else {
      shiftMonth(delta);
    }
  }

  function goToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }

  function openModal(date) {
    setSelectedDate(date);
    setModalDate(date);
    setDraft(emptyDraft);
  }

  function closeModal() {
    setModalDate(null);
    setDraft(emptyDraft);
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    if (!canManage || !draft.title.trim() || !modalDate || saving) return;

    setSaving(true);
    setError(null);
    try {
      const res = await api.createEvent({
        title: draft.title.trim(),
        date: toKey(modalDate),
        start: draft.start || "All day",
        end: draft.end,
        location: draft.location || "TBD",
        category: draft.category,
        customCategoryLabel:
          draft.category === "Other" ? draft.customCategoryLabel : undefined,
      });
      const created = normalize(res.data || res);
      setEvents((prev) => [...prev, created]);
      setDraft(emptyDraft);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to create event.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!canManage) return;
    const prevEvents = events;
    // optimistic removal
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await api.deleteEvent(id);
    } catch (err) {
      // roll back on failure
      setEvents(prevEvents);
      setError(
        err instanceof ApiError ? err.message : "Failed to delete event.",
      );
    }
  }

  function exportEvents() {
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edusphere-events.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-4">
      <EventsHeader
        exportEvents={exportEvents}
        openModal={openModal}
        selectedDate={selectedDate}
        canManage={canManage}
      />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <CalendarToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          goToday={goToday}
          shiftWeekOrDay={shiftWeekOrDay}
        />

        {loading ? (
          <div className="py-24 text-center text-sm text-slate-400 dark:text-slate-500">
            Loading events…
          </div>
        ) : (
          <CalendarViews
            activeTab={activeTab}
            monthGrid={monthGrid}
            weekDays={weekDays}
            eventsByDate={eventsByDate}
            filteredEvents={filteredEvents}
            viewDate={viewDate}
            selectedDate={selectedDate}
            today={today}
            openModal={openModal}
            deleteEvent={deleteEvent}
            canManage={canManage}
          />
        )}
      </div>

      <EventPanels
        upcoming={upcoming}
        todaysEvents={todaysEvents}
        setActiveTab={setActiveTab}
        openModal={openModal}
        today={today}
      />

      <EventModal
        modalDate={modalDate}
        closeModal={closeModal}
        eventsByDate={eventsByDate}
        deleteEvent={deleteEvent}
        handleAddEvent={handleAddEvent}
        draft={draft}
        setDraft={setDraft}
        onSelectDate={setModalDate}
        canManage={canManage}
        saving={saving}
      />
    </div>
  );
}
