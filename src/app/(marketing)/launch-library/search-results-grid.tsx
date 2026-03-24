"use client";

import React from "react";
import localFont from "next/font/local";
import {Loader2} from "lucide-react";
import type {VideoCardDisplay} from "./data/types";
import {VideoCard} from "./video-row";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

const SearchResultsGrid = ({
  title,
  videos,
  showNameOverlay = false,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: {
  title: string;
  videos: VideoCardDisplay[];
  showNameOverlay?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  console.log(videos);
  return (
    <div className="flex w-full flex-col gap-4 px-6 py-8">
      <h2 className={`text-lg uppercase text-white ${h1Font.className}`}>
        {title}
      </h2>

      {isLoading && videos.length === 0 && (
        <div className="flex justify-center py-12 text-white/60">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center">
        {videos.map((video, index) => (
          <VideoCard
            key={video.postId}
            video={video}
            index={index}
            showNameOverlay={showNameOverlay}
          />
        ))}
      </div>

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
