"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {Loader2} from "lucide-react";
import VideoRowHeader from "./video-row-header";
import {TopTen} from "./top-ten";
import {LaunchLibraryContent} from "./launch-library-content";
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

export default function LaunchLibraryPageClient() {
  const [homepageVideos, setHomepageVideos] = useState<VideoData[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeFilters, setActiveFilters] =
    useState<LaunchLibraryActiveFilters>({});

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
      Object.values(activeFilters).some(
        (values) => (values?.length ?? 0) > 0,
      ),
    [activeFilters],
  );

  const hasSearchIntent = useMemo(() => {
    const trimmed = submittedQuery.trim().toLowerCase();
    return trimmed.length >= 1 || hasActiveFilters;
  }, [submittedQuery, hasActiveFilters]);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepage() {
      try {
        const res = await fetch("/api/launch-library/homepage");
        const data = (await res.json()) as {
          videos?: VideoData[];
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setHomeError(data.error ?? "Failed to load homepage");
          return;
        }
        setHomepageVideos(data.videos ?? []);
        setHomeError(null);
      } catch (e) {
        if (!cancelled) {
          setHomeError(
            e instanceof Error ? e.message : "Failed to load homepage",
          );
        }
      } finally {
        if (!cancelled) {
          setHomeLoading(false);
        }
      }
    }

    void loadHomepage();
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback(
    async (cursor: string | null, qOverride?: string) => {
      const isAppend = Boolean(cursor);
      const q = qOverride ?? submittedQuery;

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

  const lastSubmittedSearchKeyRef = useRef<string>("");

  const resetSubmittedSearchState = useCallback(() => {
    setSubmittedQuery("");
    setResults([]);
    setNextCursor(null);
    setSearchError(null);
    lastSubmittedSearchKeyRef.current = "";
    abortRef.current?.abort();
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (value.trim() !== "") return;
      resetSubmittedSearchState();
    },
    [resetSubmittedSearchState],
  );

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchValue.trim();
    if (!trimmed && !hasActiveFilters) return;

    const searchKey = JSON.stringify({
      q: trimmed,
      filters: activeFilters,
    });
    if (searchKey === lastSubmittedSearchKeyRef.current) return;

    lastSubmittedSearchKeyRef.current = searchKey;
    setSubmittedQuery(trimmed);
    setResults([]);
    setNextCursor(null);
    void runSearch(null, trimmed);
  }, [searchValue, hasActiveFilters, activeFilters, runSearch]);

  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoading || isLoadingMore) return;
    await runSearch(nextCursor);
  }, [nextCursor, isLoading, isLoadingMore, runSearch]);

  const trimmedQuery = submittedQuery.trim();
  const hasActiveSearch = trimmedQuery.length >= 1;

  const showSearchResults = hasSearchIntent;

  const pageError = homeError && !showSearchResults ? homeError : null;
  const combinedLoadingHome = homeLoading && !showSearchResults;

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
        {combinedLoadingHome && (
          <div className="px-6 py-8 text-muted-foreground min-h-screen">
            <Loader2 className="animate-spin mx-auto size-10 mt-8" />
          </div>
        )}

        {pageError && (
          <div className="px-6 py-8 text-destructive">{pageError}</div>
        )}

        {!combinedLoadingHome && !pageError && showSearchResults && (
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
        )}

        {!combinedLoadingHome && !pageError && !showSearchResults && (
          <>
            <TopTen videos={homepageVideos} />
            <LaunchLibraryContent videos={homepageVideos} />
          </>
        )}
      </div>
    </>
  );
}
