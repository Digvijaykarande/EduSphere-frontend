"use client";

import { Users, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  classOptions as defaultClassOptions,
  feeCategoryOptions as defaultFeeCategoryOptions,
} from "./mockData";

export default function ClassSectionFilter({
  selectedClass,
  onClassChange,
  selectedFeeCategory,
  onFeeCategoryChange,
  classOptions = defaultClassOptions,
  feeCategoryOptions = defaultFeeCategoryOptions,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 sm:gap-5">
      <FilterField
        icon={Users}
        label="Class & Section"
        value={selectedClass}
        onChange={onClassChange}
        options={classOptions}
        placeholder="Select a class..."
      />
      <FilterField
        icon={Layers}
        label="Fee Category"
        value={selectedFeeCategory}
        onChange={onFeeCategoryChange}
        options={feeCategoryOptions}
        placeholder="Select a category..."
      />
    </div>
  );
}

function FilterField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div className="flex w-full sm:flex-1 sm:min-w-[240px] flex-col gap-2 group">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors duration-200">
        {label}
      </span>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full rounded-xl border border-input bg-background/50 hover:bg-accent/40 text-xs font-semibold text-foreground transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent className="z-50 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer rounded-lg py-2.5 text-xs font-semibold text-muted-foreground focus:bg-primary/10 focus:text-primary transition-colors"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
