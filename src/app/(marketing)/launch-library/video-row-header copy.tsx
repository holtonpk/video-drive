"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import localFont from "next/font/local";
import {Filter, Search, X} from "lucide-react";
import {
  HARD_CODED_FIELD_LABELS,
  HARD_CODED_FILTER_OPTIONS,
  HARD_CODED_FILTER_OPTION_COUNTS,
} from "./data/header-data";
import {
  type LaunchLibraryActiveFilters,
  type LaunchLibraryFilterField,
} from "./data/types";
import {LAUNCH_LIBRARY_FILTERS_STORAGE_KEY} from "./launch-library-storage";
import {Icons} from "@/components/icons";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_regular.ttf",
});

const FILTER_ORDER: LaunchLibraryFilterField[] = [
  "score",
  ...(
    Object.keys(HARD_CODED_FIELD_LABELS) as LaunchLibraryFilterField[]
  ).filter((field) => field !== "score"),
];

function renderStarRow(activeCount: number, hoverCount = 0) {
  const filled = hoverCount || activeCount;

  return (
    <span className="flex items-center gap-1">
      {Array.from({length: 5}).map((_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= filled;

        return (
          <span
            key={starNumber}
            className={
              isFilled ? "text-theme-color1 drop-shadow-sm" : "text-white/20"
            }
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

function getActiveScoreValue(
  activeFilters: LaunchLibraryActiveFilters,
): number {
  const raw = activeFilters.score?.[0];
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 0;
}

const VideoRowHeader = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFilters,
  onFiltersChange,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  activeFilters: LaunchLibraryActiveFilters;
  onFiltersChange: (filters: LaunchLibraryActiveFilters) => void;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredScore, setHoveredScore] = useState(0);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const activeCount = useMemo(() => {
    return Object.values(activeFilters).reduce(
      (sum, values) => sum + (values?.length ?? 0),
      0,
    );
  }, [activeFilters]);

  console.log("activeFilters======", activeFilters);

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

  const setScoreFilter = (value: number) => {
    const current = activeFilters.score?.[0];
    const nextScore = current === String(value) ? [] : [String(value)];

    onFiltersChange({
      ...activeFilters,
      score: nextScore,
    });
  };

  const clearAll = () => {
    onSearchChange("");
    onFiltersChange({});
    try {
      localStorage.removeItem(LAUNCH_LIBRARY_FILTERS_STORAGE_KEY);
    } catch {
      /* ignore quota / private mode */
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="relative mx-auto mt-6 flex w-fit flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-[500px]">
          {/* <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" /> */}
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearchSubmit?.();
              }
            }}
            placeholder="Search for a company"
            className={`h-14 w-full rounded-full text-lg  transition-colors duration-200 ease-in-out border-[#1E1E1E] hover:border-theme-color1/10 focus:border-theme-color1/10 border-4 bg-[#1E1E1E] hover:bg-background focus:bg-background pl-4 pr-10 text-white outline-none placeholder:text-white/40  ${h2Font.className}`}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onSearchSubmit}
            className="absolute hover:bg-theme-color1/80 transition-colors duration-200 ease-in-out right-2 top-1/2 -translate-y-1/2 rounded-full inline-flex h-10 aspect-square shrink-0 items-center justify-center  bg-theme-color1 text-background dark"
          >
            <Icons.search className="h-4 w-4" />
          </button>
        </div>

        <div ref={filterMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`inline-flex h-14 items-center gap-2 rounded-full text-base border-4 border-[#1E1E1E] bg-[#1E1E1E] hover:border-theme-color3/10 focus:border-theme-color3/10 hover:bg-background focus:bg-background px-4  text-white transition-colors hover:sbg-white/10 ${bodyFont.className}`}
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
                {FILTER_ORDER.map((field) => (
                  <div key={field} className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-white/80">
                      {HARD_CODED_FIELD_LABELS[field]}
                    </div>

                    {field === "score" ? (
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div
                          className="flex items-center gap-1"
                          onMouseLeave={() => setHoveredScore(0)}
                        >
                          {Array.from({length: 5}).map((_, i) => {
                            const starValue = i + 1;
                            const activeScore =
                              getActiveScoreValue(activeFilters);
                            const filled = hoveredScore || activeScore;
                            const isFilled = starValue <= filled;

                            return (
                              <button
                                key={starValue}
                                type="button"
                                onMouseEnter={() => setHoveredScore(starValue)}
                                onFocus={() => setHoveredScore(starValue)}
                                onClick={() => setScoreFilter(starValue)}
                                className="text-2xl leading-none transition-transform hover:scale-110"
                                aria-label={`Filter by ${starValue} star${starValue > 1 ? "s" : ""}`}
                              >
                                <span
                                  className={
                                    isFilled
                                      ? "text-theme-color1 drop-shadow-sm"
                                      : "text-white/20"
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-xs text-white/60">
                          {getActiveScoreValue(activeFilters) > 0
                            ? `${HARD_CODED_FILTER_OPTION_COUNTS.score[String(getActiveScoreValue(activeFilters))] ?? 0} videos`
                            : "Select rating"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {HARD_CODED_FILTER_OPTIONS[field].map((option) => {
                          const isActive =
                            activeFilters[field]?.includes(option) ?? false;

                          return (
                            <button
                              key={`${field}-${option}`}
                              type="button"
                              onClick={() => toggleFilterValue(field, option)}
                              className={`rounded-full flex flex-col items-center justify-center border px-3 py-1 text-xs transition-colors ${
                                isActive
                                  ? "border-theme-color1 bg-theme-color1 text-black"
                                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                              }`}
                            >
                              {option} (
                              {HARD_CODED_FILTER_OPTION_COUNTS[field][option] ??
                                0}
                              )
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                  <span className="text-white/60">
                    {HARD_CODED_FIELD_LABELS[field]}:
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    {field === "score" ? renderStarRow(Number(value)) : value}
                  </span>
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
