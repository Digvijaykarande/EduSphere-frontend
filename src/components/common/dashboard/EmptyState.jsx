"use client";
export function EmptyState({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`py-10 text-center ${className}`}>
      {Icon ? (
        <Icon className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
      ) : null}
      {title ? (
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </p>
      ) : null}
      {children ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {children}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyRow({ children }) {
  return (
    <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
      {children}
    </p>
  );
}

export default EmptyState;
