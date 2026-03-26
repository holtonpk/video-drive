"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import VideoRowHeader from "./video-row-header";
import {LAUNCH_LIBRARY_FILTERS_STORAGE_KEY} from "./launch-library-storage";
import type {LaunchLibraryActiveFilters, VideoData} from "./data/types";
import SearchResultsGrid from "./search-results-grid";
import {
  searchHitToVideoData,
  type LaunchLibrarySearchHit,
} from "@/lib/launch-library/search-hit-to-video";

const MAX_SEARCH_CACHE = 48;

function searchCacheKey(input: {
  q: string;
  filters: LaunchLibraryActiveFilters;
  cursor: string | null;
}) {
  return JSON.stringify({
    q: input.q.trim().toLowerCase(),
    filters: input.filters,
    cursor: input.cursor,
  });
}

export default function LaunchLibrarySearchClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeFilters, setActiveFilters] =
    useState<LaunchLibraryActiveFilters>({});
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  const [results, setResults] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchCacheRef = useRef(
    new Map<
      string,
      {results: LaunchLibrarySearchHit[]; nextCursor: string | null}
    >(),
  );
  const abortRef = useRef<AbortController | null>(null);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(activeFilters).some((values) => (values?.length ?? 0) > 0),
    [activeFilters],
  );

  const hasSearchIntent = useMemo(() => {
    const trimmed = submittedQuery.trim().toLowerCase();
    return trimmed.length >= 1 || hasActiveFilters;
  }, [submittedQuery, hasActiveFilters]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAUNCH_LIBRARY_FILTERS_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as {
        searchValue?: unknown;
        activeFilters?: unknown;
      };

      if (typeof parsed.searchValue === "string") {
        setSearchValue(parsed.searchValue);
        setSubmittedQuery(parsed.searchValue.trim());
      }

      if (
        parsed.activeFilters != null &&
        typeof parsed.activeFilters === "object" &&
        !Array.isArray(parsed.activeFilters)
      ) {
        setActiveFilters(parsed.activeFilters as LaunchLibraryActiveFilters);
      }
    } catch (e) {
      console.warn("Failed to load filters from localStorage", e);
    } finally {
      setRestoredFromStorage(true);
    }
  }, []);

  const runSearch = useCallback(
    async (cursor: string | null) => {
      const isAppend = Boolean(cursor);
      const q = submittedQuery;

      const cacheKey = searchCacheKey({
        q,
        filters: activeFilters,
        cursor,
      });

      const cached = searchCacheRef.current.get(cacheKey);
      if (cached) {
        const mapped = cached.results.map(searchHitToVideoData);
        if (isAppend) {
          setResults((prev) => [...prev, ...mapped]);
        } else {
          setResults(mapped);
        }
        setNextCursor(cached.nextCursor ?? null);
        setSearchError(null);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isAppend) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setSearchError(null);

      try {
        const res = await fetch("/api/launch-library/search", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            q,
            filters: activeFilters,
            cursor: cursor ?? null,
            limit: 24,
          }),
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data = (await res.json()) as {
          results?: LaunchLibrarySearchHit[];
          nextCursor?: string | null;
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Search failed");
        }

        searchCacheRef.current.set(cacheKey, {
          results: data.results ?? [],
          nextCursor: data.nextCursor ?? null,
        });
        if (searchCacheRef.current.size > MAX_SEARCH_CACHE) {
          const first = searchCacheRef.current.keys().next().value;
          if (first !== undefined) {
            searchCacheRef.current.delete(first);
          }
        }

        const mapped: VideoData[] = (data.results ?? []).map(
          searchHitToVideoData,
        );

        if (isAppend) {
          setResults((prev) => [...prev, ...mapped]);
        } else {
          setResults(mapped);
        }

        setNextCursor(data.nextCursor ?? null);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }
        setSearchError(e instanceof Error ? e.message : "Search failed");
        if (!isAppend) {
          setResults([]);
          setNextCursor(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [submittedQuery, activeFilters],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    if (value === "") {
      setSubmittedQuery("");
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setSubmittedQuery(searchValue.trim());
  }, [searchValue]);

  useEffect(() => {
    if (!restoredFromStorage) return;
    try {
      localStorage.setItem(
        LAUNCH_LIBRARY_FILTERS_STORAGE_KEY,
        JSON.stringify({searchValue, activeFilters}),
      );
    } catch (e) {
      console.warn("Failed to save filters", e);
    }
  }, [searchValue, activeFilters, restoredFromStorage]);

  useEffect(() => {
    if (!restoredFromStorage) return;

    if (!hasSearchIntent) {
      setResults([]);
      setNextCursor(null);
      setSearchError(null);
      abortRef.current?.abort();
      return;
    }

    void runSearch(null);
  }, [
    submittedQuery,
    activeFilters,
    hasSearchIntent,
    runSearch,
    restoredFromStorage,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoading || isLoadingMore) return;
    await runSearch(nextCursor);
  }, [nextCursor, isLoading, isLoadingMore, runSearch]);

  const trimmedQuery = submittedQuery.trim();
  const hasActiveSearch = trimmedQuery.length >= 1;

  const showSearchResults = hasSearchIntent;

  console.log("results", results.length);

  return (
    <>
      <VideoRowHeader
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      <div className="flex flex-col">
        {showSearchResults ? (
          <>
            {searchError && (
              <div className="px-6 pt-4 text-destructive">{searchError}</div>
            )}
            <SearchResultsGrid
              title={
                hasActiveSearch
                  ? `Best matches for "${trimmedQuery}"`
                  : "Filtered results"
              }
              videos={results}
              showNameOverlay={hasActiveSearch}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={Boolean(nextCursor)}
              onLoadMore={handleLoadMore}
            />
          </>
        ) : (
          children
        )}
      </div>
    </>
  );
}
