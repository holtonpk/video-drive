"use client";

import React, {useEffect, useMemo, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/config/firebase";
import {Loader2} from "lucide-react";
import VideoRowHeader from "./video-row-header";
import {TopTen} from "./top-ten";
import {LaunchLibraryContent} from "./launch-library-content";
import {
  VideoData,
  LAUNCH_LIBRARY_FILTER_FIELDS,
  type LaunchLibraryActiveFilters,
  type LaunchLibraryFilterField,
} from "./data/types";
import SearchResultsGrid from "./search-results-grid";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");

const levenshtein = (a: string, b: string): number => {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const dp = Array.from({length: aLen + 1}, () => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) dp[i][0] = i;
  for (let j = 0; j <= bLen; j++) dp[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[aLen][bLen];
};

const similarityScore = (a: string, b: string): number => {
  const na = normalize(a);
  const nb = normalize(b);

  if (!na || !nb) return 0;
  if (na === nb) return 1000;
  if (nb.startsWith(na)) return 900;
  if (nb.includes(na)) return 800;

  const distance = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length);

  const similarity = 1 - distance / maxLen;

  return Math.max(0, similarity * 700);
};

const tokenOverlapScore = (query: string, target: string): number => {
  const qTokens = normalize(query).split(" ").filter(Boolean);
  const tTokens = normalize(target).split(" ").filter(Boolean);

  if (!qTokens.length || !tTokens.length) return 0;

  let score = 0;

  for (const q of qTokens) {
    let best = 0;

    for (const t of tTokens) {
      if (q === t) {
        best = Math.max(best, 120);
      } else if (t.includes(q) || q.includes(t)) {
        best = Math.max(best, 90);
      } else {
        const dist = levenshtein(q, t);
        const maxLen = Math.max(q.length, t.length);
        const similarity = 1 - dist / maxLen;
        best = Math.max(best, similarity * 80);
      }
    }

    score += best;
  }

  return score;
};

const getSearchScore = (video: VideoData, query: string): number => {
  if (!query.trim()) return 0;

  const nameScore = similarityScore(query, video.name);
  const tokenScore = tokenOverlapScore(query, video.name);

  return nameScore + tokenScore;
};

const getRelevanceScore = (
  baseVideo: VideoData,
  candidate: VideoData,
): number => {
  let score = 0;

  if (baseVideo.postId === candidate.postId) return -1;

  const sharedArrayValues = (
    a: string[] | undefined | null,
    b: string[] | undefined | null,
    weight: number,
  ) => {
    if (!a?.length || !b?.length) return 0;
    const setB = new Set(b);
    return a.filter((item) => setB.has(item)).length * weight;
  };

  score += sharedArrayValues(baseVideo.industry, candidate.industry, 6);
  score += sharedArrayValues(baseVideo.sector, candidate.sector, 5);
  score += sharedArrayValues(
    baseVideo.creativeFormat,
    candidate.creativeFormat,
    5,
  );
  score += sharedArrayValues(baseVideo.tone, candidate.tone, 4);
  score += sharedArrayValues(baseVideo.production, candidate.production, 4);
  score += sharedArrayValues(baseVideo.hook, candidate.hook, 3);

  if (baseVideo.cohort && candidate.cohort === baseVideo.cohort) score += 3;
  if (baseVideo.score != null && candidate.score === baseVideo.score)
    score += 2;

  score += Math.min(candidate.viewCount / 100000, 5);
  score += Math.min(candidate.likeCount / 1000, 3);

  return score;
};

const matchesFilters = (
  video: VideoData,
  filters: LaunchLibraryActiveFilters,
) => {
  return LAUNCH_LIBRARY_FILTER_FIELDS.every((field) => {
    const selected = filters[field];
    if (!selected || selected.length === 0) return true;

    const value = video[field];

    if (value == null) return false;

    if (Array.isArray(value)) {
      return selected.some((item) => value.includes(item));
    }

    return selected.includes(String(value));
  });
};

const getFilterOptions = (videoList: VideoData[]) => {
  const options: Record<LaunchLibraryFilterField, string[]> = {
    cohort: [],
    industry: [],
    sector: [],
    creativeFormat: [],
    tone: [],
    production: [],
    hook: [],
    score: [],
  };

  for (const video of videoList) {
    for (const field of LAUNCH_LIBRARY_FILTER_FIELDS) {
      const value = video[field];
      if (value == null) continue;

      if (Array.isArray(value)) {
        options[field].push(...value);
      } else {
        options[field].push(String(value));
      }
    }
  }

  return Object.fromEntries(
    Object.entries(options).map(([field, values]) => [
      field,
      [...new Set(values)].sort((a, b) => a.localeCompare(b)),
    ]),
  ) as Record<LaunchLibraryFilterField, string[]>;
};

const getFilterOptionCounts = (
  videoList: VideoData[],
): Record<LaunchLibraryFilterField, Record<string, number>> => {
  const counts = {
    cohort: {},
    industry: {},
    sector: {},
    creativeFormat: {},
    tone: {},
    production: {},
    hook: {},
    score: {},
  } as Record<LaunchLibraryFilterField, Record<string, number>>;

  for (const video of videoList) {
    (Object.keys(counts) as LaunchLibraryFilterField[]).forEach((field) => {
      const value = video[field];
      if (value == null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          counts[field][item] = (counts[field][item] ?? 0) + 1;
        });
      } else {
        const key = String(value);
        counts[field][key] = (counts[field][key] ?? 0) + 1;
      }
    });
  }

  return counts;
};

export default function LaunchLibraryPageClient() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] =
    useState<LaunchLibraryActiveFilters>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshot = await getDocs(collection(db, "launch-library"));
        const list = snapshot.docs.map(
          (docSnap) => docSnap.data() as VideoData,
        );
        if (!cancelled) {
          setVideos(list);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load videos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filterOptions = useMemo(() => getFilterOptions(videos), [videos]);

  const filterOptionCounts = useMemo(
    () => getFilterOptionCounts(videos),
    [videos],
  );

  const searchResults = useMemo(() => {
    const trimmedQuery = searchValue.trim();

    const videosMatchingFilters = videos.filter((video) =>
      matchesFilters(video, activeFilters),
    );

    if (!trimmedQuery) {
      return videosMatchingFilters;
    }

    const ranked = videosMatchingFilters
      .map((video) => ({
        video,
        score: getSearchScore(video, trimmedQuery),
      }))
      .sort((a, b) => b.score - a.score);

    const bestMatches = ranked.slice(0, 24).map((item) => item.video);

    const anchorVideos = bestMatches.slice(0, Math.min(3, bestMatches.length));
    const seen = new Set(bestMatches.map((video) => video.postId));

    const relatedMatches = videosMatchingFilters
      .filter((video) => !seen.has(video.postId))
      .map((video) => ({
        video,
        score: anchorVideos.reduce(
          (sum, anchor) => sum + getRelevanceScore(anchor, video),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(0, 24 - bestMatches.length))
      .map((item) => item.video);

    return [...bestMatches, ...relatedMatches];
  }, [videos, searchValue, activeFilters]);

  const hasActiveSearch = searchValue.trim().length > 0;
  const hasActiveFilters = Object.values(activeFilters).some(
    (values) => values && values.length > 0,
  );

  const isShowingResults = hasActiveSearch || hasActiveFilters;

  return (
    <>
      <VideoRowHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        filterOptions={filterOptions}
        filterOptionCounts={filterOptionCounts}
      />

      <div className="flex flex-col">
        {loading && (
          <div className="px-6 py-8 text-muted-foreground min-h-screen">
            <Loader2 className="animate-spin mx-auto size-10 mt-8" />
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-8 text-destructive">{error}</div>
        )}

        {!loading && !error && isShowingResults && (
          <SearchResultsGrid
            title={
              hasActiveSearch
                ? `Best matches for "${searchValue.trim()}"`
                : "Filtered results"
            }
            videos={searchResults}
            showNameOverlay={hasActiveSearch}
          />
        )}

        {!loading && !error && !isShowingResults && (
          <>
            <TopTen videos={videos} />
            <LaunchLibraryContent videos={videos} />
          </>
        )}
      </div>
    </>
  );
}
