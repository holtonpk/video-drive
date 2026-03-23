"use client";
import React from "react";
import {Star} from "lucide-react";
import {VideoData} from "../../data/types";
import Link from "next/link";
import localFont from "next/font/local";
import {VideoPlayer} from "./video-player";
import {VideoCard} from "../../video-row";
import {getVideoTags} from "../../data/video-tags";
import {TagBadge} from "../../tag-badge";

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

const VideoPage = ({
  video,
  allVideos,
}: {
  video: VideoData;
  allVideos: VideoData[];
}) => {
  const relatedVideos = getRelatedVideos(video, allVideos).slice(0, 20);

  return (
    <main className="flex flex-1 flex-col px-6 py-10 text-white">
      <Link
        href="/launch-library"
        className="mb-6 w-fit hover:underline text-sm text-white/60 hover:text-white"
      >
        ← Back to Launch Library
      </Link>

      <div className="grid grid-cols-[65%_1fr] items-center ">
        <VideoPlayer
          src={video.videoUrl ?? ""}
          poster={video.thumbnail ?? undefined}
          size="full"
          className="rounded-[12px] aspect-video shadow-lg shadow-black"
        />
        <FeedBackCard video={video} />
      </div>

      <h2 className={`text-2xl font-bold mt-8 ${h1Font.className}`}>
        Related Videos
      </h2>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center">
        {relatedVideos.map((relatedVideo, index) => (
          <VideoCard
            key={relatedVideo.postId}
            video={relatedVideo}
            index={index}
            showNameOverlay
          />
        ))}
      </div>
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
    <div className="flex h-fit flex-col gap-3 mt-4 rounded-r-[12px] border-[1px] min-h-[90%] border-l-0 border-white/20 bg-[#1A1A1A] p-4">
      <div className="p-2 flex items-center gap-1">
        <img
          src={getFaviconUrl(video.website ?? "")}
          alt={video.name}
          className="h-10 w-10 mr-4 shrink-0 rounded-full ring-white/20 ring-[2px] ring-offset-[4px] ring-offset-black"
        />
        <h1 className={`text-3xl font-semibold ${h1Font.className}`}>
          {video.name}
        </h1>
        <div className={`min-w-0 truncate text-xl text-white/70`}>
          • YC {video.cohort ?? "Cohort unknown"}
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
          <p className={`text-lg ${bodyFont.className}`}>{video.commentary}</p>
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
        </div>
      </div>
    </div>
  );
};
