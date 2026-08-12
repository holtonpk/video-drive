"use client";

import React, {useEffect, useState} from "react";
import localFont from "next/font/local";
import {Loader2} from "lucide-react";
import type {VideoCardDisplay} from "./data/types";
import {VideoCard} from "./video-row";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

const SearchResultsGrid = ({
  title,
  totalCount = null,
  videos,
  showNameOverlay = false,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: {
  title: string;
  totalCount?: number | null;
  videos: VideoCardDisplay[];
  showNameOverlay?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  const [gridEl, setGridEl] = useState<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(0);

  useEffect(() => {
    if (!gridEl) return;

    const updateColumns = () => {
      const template = window.getComputedStyle(gridEl).gridTemplateColumns;
      setColumns(template.split(" ").filter(Boolean).length);
    };

    updateColumns();

    const observer = new ResizeObserver(updateColumns);
    observer.observe(gridEl);

    return () => observer.disconnect();
  }, [gridEl]);

  // While more videos are still loadable, hold back whatever trails off the
  // last full row instead of showing a partial one — it'll reappear (padded
  // out by the next fetch) once "Load more" completes another row. Only do
  // this if a full row actually survives the trim; otherwise (e.g. a very
  // wide screen where a single fetch is narrower than one row) fall back to
  // showing everything fetched so far rather than hiding it all.
  const fullRowCount =
    columns > 0 ? Math.floor(videos.length / columns) * columns : 0;
  const displayedVideos =
    hasMore && fullRowCount > 0 ? videos.slice(0, fullRowCount) : videos;

  return (
    <div className="flex w-full flex-col gap-4 px-6 py-8">
      <h2
        className={`flex items-center gap-2 text-lg uppercase text-white ${h1Font.className}`}
      >
        {title}
        {isLoading ? (
          <Loader2
            className="h-4 w-4 shrink-0 animate-spin text-theme-color1"
            aria-label="Loading results"
          />
        ) : totalCount !== null ? (
          <span className="text-sm normal-case text-white/50">
            ({totalCount.toLocaleString()})
          </span>
        ) : null}
      </h2>

      {isLoading && videos.length === 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center">
          {Array.from({length: 20}).map((_, index) => (
            <div
              key={index}
              className="animate-pulse shrink-0 relative cursor-pointer flex items-center justify-center overflow-hidden rounded-[12px] bg-muted w-[311px] md:w-[256px] h-[175px] md:h-36"
            />
          ))}
        </div>
      )}

      {!isLoading && videos.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-16 text-center">
          <p className="text-base text-white">No videos matched</p>
          <p className="text-sm text-white/55">
            Try adjusting your search or filters to see more results.
          </p>
        </div>
      ) : (
        <div
          ref={setGridEl}
          className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center"
        >
          {displayedVideos.map((video, index) => (
            <VideoCard
              key={video.postId}
              video={video}
              index={index}
              showNameOverlay={showNameOverlay}
            />
          ))}
        </div>
      )}

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {isLoadingMore && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            )}
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsGrid;
