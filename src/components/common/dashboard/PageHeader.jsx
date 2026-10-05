"use client";

// Shared dashboard page header: title + optional subtitle/breadcrumb on the
// left, action buttons on the right. Reproduces the layout previously
// duplicated across SupportHeader, EventsHeader, FeesPageHeader, etc.
// Visual output is unchanged from those originals — this only removes the
// duplication, it does not restyle anything.
export function PageHeader({ title, subtitle, actions, className = "" }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

// Slightly denser variant used by modules whose original header used
// text-xl/lg spacing (e.g. FeesPageHeader) instead of the text-2xl
// dashboard-wide title. Kept separate rather than a prop so call sites stay
// simple and each module's exact prior sizing is preserved verbatim.
export function PageHeaderCompact({ title, subtitle, actions, className = "" }) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${className}`}
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default PageHeader;
