"use client";

import React from "react";
import localFont from "next/font/local";
import {VideoData} from "./data/types";
import {VideoCard} from "./video-row";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

const SearchResultsGrid = ({
  title,
  videos,
  showNameOverlay = false,
}: {
  title: string;
  videos: VideoData[];
  /** When true (e.g. active search), show title on thumbnail for browseability */
  showNameOverlay?: boolean;
}) => {
  return (
    <div className="flex w-full flex-col gap-4 px-6 py-8">
      <h2 className={`text-lg uppercase text-white ${h1Font.className}`}>
        {title}
      </h2>

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
    </div>
  );
};

export default SearchResultsGrid;
