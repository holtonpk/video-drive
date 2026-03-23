"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import localFont from "next/font/local";
import {Filter, Search, X} from "lucide-react";
import {FIELD_CATEGORY_MAP, slugifyFieldValue} from "./data/field-routing";
import {
  type LaunchLibraryActiveFilters,
  type LaunchLibraryFilterField,
} from "./data/types";

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const FIELD_LABELS: Record<LaunchLibraryFilterField, string> = {
  cohort: "Cohort",
  industry: "Industry",
  sector: "Sector",
  creativeFormat: "Creative Format",
  tone: "Tone",
  production: "Production",
  hook: "Hook",
  score: "Score",
};

const VideoRowHeader = ({
  searchValue,
  onSearchChange,
  activeFilters,
  onFiltersChange,
  filterOptions,
  filterOptionCounts,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilters: LaunchLibraryActiveFilters;
  onFiltersChange: (filters: LaunchLibraryActiveFilters) => void;
  filterOptions: Record<LaunchLibraryFilterField, string[]>;
  filterOptionCounts: Record<LaunchLibraryFilterField, Record<string, number>>;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const activeCount = useMemo(() => {
    return Object.values(activeFilters).reduce(
      (sum, values) => sum + (values?.length ?? 0),
      0,
    );
  }, [activeFilters]);

  useEffect(() => {
    if (!isFilterOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterMenuRef.current) return;

      const target = event.target as Node;
      if (!filterMenuRef.current.contains(target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isFilterOpen]);

  const toggleFilterValue = (
    field: LaunchLibraryFilterField,
    value: string,
  ) => {
    const current = activeFilters[field] ?? [];
    const exists = current.includes(value);

    const nextValues = exists
      ? current.filter((item) => item !== value)
      : [...current, value];

    onFiltersChange({
      ...activeFilters,
      [field]: nextValues,
    });
  };

  const clearAll = () => {
    onSearchChange("");
    onFiltersChange({});
    setIsFilterOpen(false);
  };

  const handleExportFieldDescriptions = () => {
    const exportData: Record<
      string,
      Record<string, {label: string; description: string}>
    > = {};

    (
      Object.entries(FIELD_CATEGORY_MAP) as [
        keyof typeof FIELD_CATEGORY_MAP,
        LaunchLibraryFilterField,
      ][]
    ).forEach(([fieldCategory, field]) => {
      exportData[fieldCategory] = {};

      filterOptions[field].forEach((value) => {
        const slug = slugifyFieldValue(value);

        exportData[fieldCategory][slug] = {
          label: String(value),
          description: "",
        };
      });
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "field-descriptions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative mx-auto mt-6 flex  w-fit flex-col gap-3 ">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-[500px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for a company"
            className={`h-11 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-10 text-white outline-none placeholder:text-white/40 focus:border-white/20 ${h2Font.className}`}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div ref={filterMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white transition-colors hover:bg-white/10"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-theme-color1 px-2 py-0.5 text-xs text-black">
                {activeCount}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] w-[420px] overflow-auto rounded-2xl border border-white/10 bg-black p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className={`text-lg text-white ${h2Font.className}`}>
                  Filter videos
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm text-white/60 hover:text-white"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {(Object.keys(FIELD_LABELS) as LaunchLibraryFilterField[]).map(
                  (field) => (
                    <div key={field} className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-white/80">
                        {FIELD_LABELS[field]}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions[field].map((option) => {
                          const isActive =
                            activeFilters[field]?.includes(option) ?? false;

                          return (
                            <button
                              key={`${field}-${option}`}
                              type="button"
                              onClick={() => toggleFilterValue(field, option)}
                              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                isActive
                                  ? "border-theme-color1 bg-theme-color1 text-black"
                                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                              }`}
                            >
                              {option} ({filterOptionCounts[field][option] ?? 0}
                              )
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
{/* 
              <div className="mt-5 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleExportFieldDescriptions}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
                >
                  Export field description JSON
                </button>
              </div> */}
            </div>
          )}
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {(
            Object.entries(activeFilters) as [
              LaunchLibraryFilterField,
              string[],
            ][]
          )
            .filter(([, values]) => values?.length)
            .flatMap(([field, values]) =>
              values.map((value) => (
                <button
                  key={`${field}-${value}`}
                  type="button"
                  onClick={() => toggleFilterValue(field, value)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                >
                  <span className="text-white/60">{FIELD_LABELS[field]}:</span>
                  <span>{value}</span>
                  <X className="h-3 w-3" />
                </button>
              )),
            )}
        </div>
      )}
    </div>
  );
};

export default VideoRowHeader;
