import React from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { STATUS_LIST, PRIORITY_LIST } from "./support.utils";

const TABS = ["All", ...STATUS_LIST];
const SORTS = ["Newest", "Oldest", "Priority"];

export default function SupportFilters({
  activeTab,
  setActiveTab,
  setPage,
  tabCounts,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filtersOpen,
  setFiltersOpen,
  activePriorities,
  togglePriority,
}) {
  function selectTab(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div className="border-b border-slate-100 dark:border-slate-800">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`shrink-0 px-3 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab} <span className="text-slate-300 dark:text-slate-600">{tabCounts[tab] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Search, sort, filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by ID, subject, or requester..."
            className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-xs placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dash-focus appearance-none bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                filtersOpen
                  ? "border-primary text-primary bg-primary/5"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal size={14} /> Priority
            </button>

            {filtersOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-100 dark:border-slate-800 shadow-lg p-2 z-20 bg-white dark:bg-slate-900">
                {PRIORITY_LIST.map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activePriorities[p]}
                      onChange={() => togglePriority(p)}
                      className="accent-primary h-3.5 w-3.5"
                    />
                    {p}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}