import React from "react";
import { Clock, User, Tag, MessageSquare, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { STATUS_META, PRIORITY_META, formatAgo, STATUS_LIST } from "./support.utils";

export default function TicketList({
  pagedTickets,
  filteredTickets,
  page,
  setPage,
  pageSize,
  totalPages,
  selectedId,
  selectTicket,
  openMenuId,
  setOpenMenuId,
  updateTicketStatus,
  deleteTicket,
}) {
  return (
    <>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {pagedTickets.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500 py-14 text-center">
            No tickets match the current filters.
          </p>
        )}

        {pagedTickets.map((t) => {
          const isSelected = t.id === selectedId;
          return (
            <div
              key={t.id}
              onClick={() => selectTicket(t.id)}
              className={`px-5 py-3.5 cursor-pointer transition-colors border-l-2 cursor-pointer ${
                isSelected
                  ? "bg-primary/5 dark:bg-primary/10 border-l-primary"
                  : "border-l-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/40 "
              }`}
            >
              {/* Row 1: subject + id + time + actions */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                    {t.subject}
                  </p>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                    {t.id}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* <button
                    onClick={() => selectTicket(t.id)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button> */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {openMenuId === t.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 mt-1 w-36 rounded-lg border border-slate-100 dark:border-slate-800 shadow-lg p-1.5 z-20 bg-white dark:bg-slate-900"
                        >
                          {STATUS_LIST.filter((s) => s !== t.status).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateTicketStatus(t.id, s)}
                              className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                            >
                              Mark as {s}
                            </button>
                          ))}
                          <button
                            onClick={() => deleteTicket(t.id)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md mt-1 cursor-pointer"
                          >
                            Delete ticket
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Row 2: requester, category, priority, status, time */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" /> {t.requester.name} · {t.requester.role}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3" /> {t.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatAgo(t.minutesAgo)}
                </span>
                <span className={`ml-auto inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_META[t.priority].badge}`}>
                  {t.priority.toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_META[t.status].badge}`}>
                  {t.status.toUpperCase()}
                </span>
                <button
                    onClick={() => selectTicket(t.id)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {filteredTickets.length === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filteredTickets.length)} of {filteredTickets.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-7 w-7 rounded-md border text-xs font-bold transition-colors cursor-pointer ${
                n === page
                  ? "border-primary text-primary bg-primary/5"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}