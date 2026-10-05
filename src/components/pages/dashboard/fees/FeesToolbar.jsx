"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, FileText, FileSpreadsheet, Settings2 } from "lucide-react";
import { STATUS_TABS } from "./fees.utils";
import { PageHeaderCompact } from "@/components/common/dashboard/PageHeader";

// Title + Allocate Fees / Export actions. Actions are hidden entirely for
// the student view (showActions=false); Allocate Fees is further gated by
// canManageFees within the principal view.
export function FeesPageHeader({ showActions, canManageFees, onAllocateClick }) {
  return (
    <PageHeaderCompact
      title="Fees Dashboard"
      subtitle="Overview of all fee collections and student payments"
      actions={
        showActions ? (
          <>
            {canManageFees && (
              <Button
                onClick={onAllocateClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-4 py-2.5 text-xs font-bold text-white dark:text-slate-900 shadow-md transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 whitespace-nowrap"
              >
                <Settings2 className="h-3.5 w-3.5" /> Allocate Fees
              </Button>
            )}
            <ExportMenu />
          </>
        ) : null
      }
    />
  );
}

// Sticky status-tab pills + search input sitting above the fees table.
export function FeesFilterBar({ statusTab, setStatusTab, searchTerm, setSearchTerm }) {
  return (
    <div className="sticky top-0 z-30 pt-2 pb-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="dashboard-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const active = statusTab === tab;
            return (
              <Button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 h-auto text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm hover:bg-white dark:hover:bg-slate-700"
                    : "bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-transparent"
                }`}
              >
                {tab === "ALL" ? "All Students" : tab}
              </Button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64 focus-within:sm:w-80 xl:focus-within:w-96 transition-all duration-300 ease-out flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or admission no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs h-10 w-full focus:ring-2 focus:ring-primary/30 transition-all shadow-sm border-slate-200 dark:border-slate-700 hover:border-primary/50"
          />
        </div>
      </div>
    </div>
  );
}

function ExportMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 dash-focus whitespace-nowrap">
        Export Report <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
          <FileText className="h-3.5 w-3.5" /> Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}