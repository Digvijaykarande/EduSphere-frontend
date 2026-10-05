"use client";

import { Search } from "lucide-react";

// Left-icon search box, matching the input used in SupportFilters and
// similar module toolbars — same padding, background, and focus classes,
// just parameterized instead of copy-pasted per module.
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative flex-1 min-w-0 ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-xs placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
      />
    </div>
  );
}

export default SearchInput;
