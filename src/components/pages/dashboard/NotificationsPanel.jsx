import React from "react";
import { BellOff } from "lucide-react";
import { NOTIFICATION_META } from "./notifications.utils";

export default function NotificationsPanel({ notifications, onMarkAllRead, onMarkRead, onClose }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 overflow-hidden cursor-pointer">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-bold text-foreground">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <BellOff className="h-6 w-6 text-slate-300 dark:text-slate-600 cursor-pointer" />
              <p className="text-xs text-slate-400 dark:text-slate-500">You're all caught up.</p>
            </div>
          )}
          {notifications.map((n) => {
            const meta = NOTIFICATION_META[n.type] || NOTIFICATION_META.system;
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${
                  !n.read ? "bg-primary/5 dark:bg-primary/10" : ""
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${meta.tone}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}