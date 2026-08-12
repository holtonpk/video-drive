"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import VideoRowHeader from "./video-row-header";
import {LAUNCH_LIBRARY_FILTERS_STORAGE_KEY} from "./launch-library-storage";
import {
  LAUNCH_LIBRARY_FILTER_FIELDS,
  type LaunchLibraryActiveFilters,
  type LaunchLibraryFacetCounts,
  type LaunchLibraryFilterField,
  type VideoData,
} from "./data/types";
import SearchResultsGrid from "./search-results-grid";
import {
  searchHitToVideoData,
  type LaunchLibrarySearchHit,
} from "@/lib/launch-library/search-hit-to-video";

const MAX_SEARCH_CACHE = 48;

/**
 * If `next` differs from `prev` by exactly one filter field going from no
 * selection to some selection (every other field byte-identical), returns
 * that field. Anything else (a removal, a same-field change, or more than
 * one field changing) returns null so the caller falls back to a real fetch.
 */
function addedFilterField(
  prev: LaunchLibraryActiveFilters,
  next: LaunchLibraryActiveFilters,
): LaunchLibraryFilterField | null {
  let added: LaunchLibraryFilterField | null = null;

  for (const field of LAUNCH_LIBRARY_FILTER_FIELDS) {
    const prevValues = prev[field] ?? [];
    const nextValues = next[field] ?? [];

    const sameValues =
      prevValues.length === nextValues.length &&
      prevValues.every((v) => nextValues.includes(v));

    if (sameValues) continue;

    if (prevValues.length === 0 && nextValues.length > 0 && added === null) {
      added = field;
      continue;
    }

    return null;
  }

  return added;
}

function matchesFilterField(
  video: VideoData,
  field: LaunchLibraryFilterField,
  selected: string[],
): boolean {
  if (!selected.length) return true;

  if (field === "score") {
    return video.score != null && selected.includes(String(video.score));
  }

  return selected.some((item) => video[field].includes(item));
}

/**
 * Facet counts for fields with no active selection, tallied from whatever
 * videos are currently on screen. Used to keep facet pills live after the
 * instant client-side narrow (see `handleFiltersChange`) skips a real fetch.
 */
function computeFacetCounts(
  videos: VideoData[],
  filters: LaunchLibraryActiveFilters,
): LaunchLibraryFacetCounts {
  const facetFields = LAUNCH_LIBRARY_FILTER_FIELDS.filter(
    (field) => !(filters[field]?.length),
  );
  const facets: LaunchLibraryFacetCounts = {};
  for (const field of facetFields) {
    facets[field] = {};
  }

  for (const video of videos) {
    for (const field of facetFields) {
      const values =
        field === "score"
          ? video.score != null
            ? [String(video.score)]
            : []
          : video[field];

      const bucket = facets[field]!;
      for (const value of values) {
        bucket[value] = (bucket[value] ?? 0) + 1;
      }
    }
  }

  return facets;
}

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
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [facetCounts, setFacetCounts] = useState<LaunchLibraryFacetCounts | null>(
    null,
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchCacheRef = useRef(
    new Map<
      string,
      {
        results: LaunchLibrarySearchHit[];
        nextCursor: string | null;
        total?: number;
        facets?: LaunchLibraryFacetCounts;
      }
    >(),
  );
  const abortRef = useRef<AbortController | null>(null);
  const skipNextFetchRef = useRef(false);

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
          if (cached.total !== undefined) {
            setTotalCount(cached.total);
          }
          if (cached.facets !== undefined) {
            setFacetCounts(cached.facets);
          }
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
        setTotalCount(null);
        setFacetCounts(null);
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
          total?: number;
          facets?: LaunchLibraryFacetCounts;
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Search failed");
        }

        searchCacheRef.current.set(cacheKey, {
          results: data.results ?? [],
          nextCursor: data.nextCursor ?? null,
          total: data.total,
          facets: data.facets,
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
          if (typeof data.total === "number") {
            setTotalCount(data.total);
          }
          if (data.facets) {
            setFacetCounts(data.facets);
          }
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
          setTotalCount(null);
          setFacetCounts(null);
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

  const handleFiltersChange = useCallback(
    (next: LaunchLibraryActiveFilters) => {
      // Adding a filter on a field with no prior selection can be answered
      // instantly from the videos already on screen — they already satisfy
      // every other active filter, so narrowing by the new field's values
      // client-side is exact (no need to hit the backend for it). This only
      // applies when there was already a real fetched result set to narrow
      // (hasSearchIntent) — the very first filter ever applied still needs
      // a real fetch, since nothing has been loaded yet.
      const field = hasSearchIntent ? addedFilterField(activeFilters, next) : null;

      if (field) {
        const selected = next[field] ?? [];
        const narrowed = results.filter((video) =>
          matchesFilterField(video, field, selected),
        );

        skipNextFetchRef.current = true;
        setResults(narrowed);
        setTotalCount(narrowed.length);
        setFacetCounts(computeFacetCounts(narrowed, next));
        setNextCursor(null);
      }

      setActiveFilters(next);
    },
    [activeFilters, hasSearchIntent, results],
  );

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
      setTotalCount(null);
      setFacetCounts(null);
      setSearchError(null);
      abortRef.current?.abort();
      return;
    }

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
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
        onFiltersChange={handleFiltersChange}
        facetCounts={facetCounts}
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
              totalCount={totalCount}
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
