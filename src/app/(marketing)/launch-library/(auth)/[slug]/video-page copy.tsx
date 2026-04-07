"use client";
import React, {useEffect, useState} from "react";
import {Star} from "lucide-react";
import {VideoData} from "../../data/types";
import Link from "next/link";
import localFont from "next/font/local";
import {VideoPlayer} from "./video-player";
import {VideoCard} from "../../video-row";
import {getVideoTags} from "../../data/video-tags";

import {getLaunchLibraryVideos} from "../../data/get-launch-video";
import {
  LaunchLibraryFieldCategory,
  slugifyFieldValue,
} from "../../data/field-routing";

const h1Font = localFont({
  src: "../../../fonts/HeadingNow-56Bold.ttf",
});

const bodyFontLight = localFont({
  src: "../../../fonts/proximanova_light.otf",
});

const bodyFont = localFont({
  src: "../../../fonts/proximanova_regular.ttf",
});

const bodyBold = localFont({
  src: "../../../fonts/proximanova_bold.otf",
});

const RELATED_WEIGHTS = {
  cohort: 4,
  industry: 8,
  sector: 10,
  creativeFormat: 6,
  tone: 7,
  production: 6,
} as const;

const getSharedCount = (a?: string[] | null, b?: string[] | null) => {
  if (!a?.length || !b?.length) return 0;
  const setB = new Set(b);
  return a.filter((item) => setB.has(item)).length;
};

const getRelatedScore = (source: VideoData, candidate: VideoData) => {
  if (source.postId === candidate.postId) return -1;

  let score = 0;

  if (source.cohort && candidate.cohort && source.cohort === candidate.cohort) {
    score += RELATED_WEIGHTS.cohort;
  }

  score +=
    getSharedCount(source.industry, candidate.industry) *
    RELATED_WEIGHTS.industry;

  score +=
    getSharedCount(source.sector, candidate.sector) * RELATED_WEIGHTS.sector;

  score +=
    getSharedCount(source.creativeFormat, candidate.creativeFormat) *
    RELATED_WEIGHTS.creativeFormat;

  score += getSharedCount(source.tone, candidate.tone) * RELATED_WEIGHTS.tone;

  score +=
    getSharedCount(source.production, candidate.production) *
    RELATED_WEIGHTS.production;

  // tie breakers
  if (source.score && candidate.score) {
    score += Math.max(0, 3 - Math.abs(source.score - candidate.score));
  }

  score += Math.min(candidate.viewCount / 100000, 3);
  score += Math.min(candidate.likeCount / 1000, 2);

  return score;
};

const getRelatedVideos = (video: VideoData, allVideos: VideoData[]) => {
  return allVideos
    .map((candidate) => ({
      video: candidate,
      score: getRelatedScore(video, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.video);
};

const VideoPage = ({video}: {video: VideoData}) => {
  // const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // async function fetchRelatedVideos(slug: string) {
  //   const allVideos = await getLaunchLibraryVideos();
  //   const relatedVideos = getRelatedVideos(video, allVideos).slice(0, 20);
  //   setRelatedVideos(relatedVideos);
  //   setIsLoading(false);
  // }

  // useEffect(() => {
  //   fetchRelatedVideos(video.slug ?? "");
  // }, [video.slug]);

  return (
    <main className="flex flex-1 flex-col md:px-6 pt-2 md:py-10 text-white">
      {/* <Link
        href="/launch-library"
        className="hidden sm:block absolute z-30 left-8 top-28  w-fit text-sm text-white/60 hover:text-white hover:underline"
      >
        ← Back to Launch Library
      </Link> */}
      <div className="grid gap-0 md:grid-cols-[65%_1fr] md:pl-4 items-center h-fit border-[1px] md:rounded-[12px] border-white/20 bg-[#1A1A1A]">
        <VideoPlayer
          src={video.videoUrl ?? ""}
          poster={video.thumbnail ?? undefined}
          size="full"
          className="md:rounded-[12px] h-fit  aspect-video shadow-lg shadow-black"
          name={video.name}
          setCurrentTime={() => {}}
          currentTime={0}
          videoRef={React.createRef<HTMLVideoElement>()}
        />
        <div className="px-4 md:px-0 ">
          <FeedBackCard video={video} />
        </div>
      </div>

      <h2
        className={`text-2xl text-center md:text-left font-bold mt-8 ${h1Font.className}`}
      >
        Related Videos
      </h2>

      {/* <div className="mt-4 grid grid-cols-1 file: md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center">
        {isLoading ? (
          <>
            {Array.from({length: 20}).map((_, index) => (
              <div
                key={index}
                className="animate-pulse shrink-0 relative cursor-pointer flex items-center justify-center overflow-hidden rounded-[12px] bg-muted w-[311px] md:w-[256px] h-[175px] md:h-36"
              />
            ))}
          </>
        ) : (
          <>
            {relatedVideos.map((relatedVideo, index) => (
              <VideoCard
                key={relatedVideo.postId}
                video={relatedVideo}
                index={index}
                showNameOverlay
              />
            ))}
          </>
        )}
      </div> */}
    </main>
  );
};

export default VideoPage;

const StarRating = ({score = 0}: {score?: number}) => {
  const safeScore = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({length: 5}).map((_, i) => {
        const filled = i < safeScore;

        return (
          <Star
            key={i}
            size={20}
            className={`transition-colors ${
              filled ? "fill-theme-color1 text-theme-color1" : "text-white/30"
            }`}
          />
        );
      })}
      <span className="ml-2 text-sm text-white/60">{safeScore}/5</span>
    </div>
  );
};

const FeedBackCard = ({video}: {video: VideoData}) => {
  const tags = getVideoTags(video);

  const getFaviconUrl = (url: string) => {
    try {
      // clean the url add https if it is not there
      const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

      const domain = new URL(cleanedUrl).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return "invalid";
    }
  };

  return (
    <div className="flex pt-6 md:pt-4 h-fit flex-col gap-3  rounded-b-[12px] border-[1px] min-h-[90%] border-t-0 md:border-0  p-4">
      <div className=" flex flex-row md:items-start items-center gap-1">
        <img
          src={video.logo ?? getFaviconUrl(video.website ?? "")}
          alt={video.name}
          className="h-12 w-12 md:h-10 md:w-10 mr-4 shrink-0 rounded-full ring-white/20 ring-[2px] ring-offset-[4px] ring-offset-black"
        />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-1">
          <h1 className={`text-4xl font-semibold ${h1Font.className}`}>
            {video.name}
          </h1>
          {/* <div
            className={` min-w-0  truncate md:text-xl text-sm text-white/70`}
          >
            • YC {video.cohort ?? "Cohort unknown"}
          </div> */}
        </div>
      </div>
      {/* <p className={`text-lg text-white/80 ${bodyFont.className}`}>
          Our team takes a close look at every launch and provides a detailed
          breakdown of the video.
        </p> */}

      <div className="flex flex-col gap-1">
        <h2 className={`text-xl font-bold ${h1Font.className}`}>Score</h2>
        <StarRating score={video.score ?? 0} />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className={`text-xl font-bold ${h1Font.className}`}>
          Our Commentary
        </h2>
        {video.commentary && (
          <>
            <p className={`text-lg ${bodyFont.className}`}>
              {video.commentary}
            </p>
            <p className={`text-lg ${bodyFont.className}`}>
              {video.commentary}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className={`text-xl font-bold ${h1Font.className}`}>Tags</h2>
        <div className="flex flex-wrap gap-2  max-w-4xl mx-auto">
          {tags.map((tag) => (
            <TagBadge
              key={`${tag.category}-${tag.label}`}
              tag={tag.label}
              fieldCategory={tag.category}
              className={`inline-flex items-center rounded-full text-lg border border-white/10 bg-white/10 px-4 py-2 leading-none text-white/90 backdrop-blur-sm transition-all hover:underline hover:bg-white/20 hover:border-white/20 ${bodyFont.className}`}
            />
          ))}
          {tags.map((tag) => (
            <TagBadge
              key={`${tag.category}-${tag.label}`}
              tag={tag.label}
              fieldCategory={tag.category}
              className={`inline-flex items-center rounded-full text-lg border border-white/10 bg-white/10 px-4 py-2 leading-none text-white/90 backdrop-blur-sm transition-all hover:underline hover:bg-white/20 hover:border-white/20 ${bodyFont.className}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const defaultRowClass =
  "inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs leading-none text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/20 hover:underline";

export const TagBadge = ({
  tag,
  fieldCategory,
  className,
}: {
  tag: string;
  fieldCategory: LaunchLibraryFieldCategory;
  className?: string;
}) => {
  return (
    <a
      href={`/launch-library/${fieldCategory}/${slugifyFieldValue(tag.replace(" hook", ""))}`}
      data-interactive="true"
      onClick={(e) => e.stopPropagation()}
      className={className ?? defaultRowClass}
    >
      {tag}
    </a>
  );
};
