"use client";
import React, {Suspense, useEffect, useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {Checkbox} from "./checkbox";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
  Star,
} from "lucide-react";
import {VideoData} from "../../data/types";
import Link from "next/link";
import localFont from "next/font/local";
import {VideoPlayer} from "./video-player";
import {VideoCard} from "../../video-row";
import {getVideoTags} from "../../data/video-tags";
import {
  PlayIcon,
  Volume2Icon,
  Loader,
  DownloadIcon,
  FullscreenIcon,
  Camera,
  HeartIcon,
  EyeIcon,
  MessageCircleIcon,
  ShareIcon,
  Copy,
  Check,
  Linkedin,
  Mail,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

import {getLaunchLibraryVideos} from "../../data/get-launch-video";
import {
  LaunchLibraryFieldCategory,
  slugifyFieldValue,
} from "../../data/field-routing";
import {baseSlugFromName} from "@/lib/slug";

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

function dedupeVideos(videos: VideoData[]) {
  const seen = new Set<string>();

  return videos.filter((v) => {
    const key = v.postId || v.slug || v.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type RelatedVideoFilter =
  | {type: "all"; label: "All"}
  | {
      type: "tag";
      label: string;
      fieldCategory: LaunchLibraryFieldCategory;
      value: string;
    };

function getVideoFieldValuesByCategory(
  video: VideoData,
  fieldCategory: LaunchLibraryFieldCategory,
): string[] {
  switch (fieldCategory) {
    case "cohort":
      return video.cohort ? [video.cohort] : [];
    case "industry":
      return video.industry ?? [];
    case "sector":
      return video.sector ?? [];
    case "creative-format":
      return video.creativeFormat ?? [];
    case "tone":
      return video.tone ?? [];
    case "production":
      return video.production ?? [];
    case "hook":
      return video.hook ?? [];
    case "score":
      return video.score != null ? [String(video.score)] : [];
    default:
      return [];
  }
}

function getFilterBoost(
  candidate: VideoData,
  filter: RelatedVideoFilter,
): number {
  if (filter.type === "all") return 0;

  const values = getVideoFieldValuesByCategory(candidate, filter.fieldCategory);

  if (!values.includes(filter.value)) return Number.NEGATIVE_INFINITY;

  let boost = 100;

  switch (filter.fieldCategory) {
    case "sector":
      boost += 20;
      break;
    case "creative-format":
    case "tone":
    case "production":
      boost += 12;
      break;
    case "industry":
      boost += 10;
      break;
    case "cohort":
      boost += 8;
      break;
    case "hook":
      boost += 6;
      break;
    case "score":
      boost += 4;
      break;
    default:
      break;
  }

  return boost;
}

function getUniqueRelatedFilters(video: VideoData): RelatedVideoFilter[] {
  const tags = getVideoTags(video);
  const seen = new Set<string>();

  const dynamicFilters: RelatedVideoFilter[] = tags
    .map((tag) => {
      const normalizedValue = tag.label.replace(/ hook$/i, "");
      const key = `${tag.category}::${normalizedValue}`;

      if (seen.has(key)) return null;
      seen.add(key);

      return {
        type: "tag" as const,
        label: tag.label,
        fieldCategory: tag.category,
        value: normalizedValue,
      };
    })
    .filter(Boolean) as RelatedVideoFilter[];

  return [{type: "all", label: "All"}, ...dynamicFilters];
}

/**
 * Deep-link time from the URL query `?t=` (seconds, integer or decimal).
 * Example: `/launch-library/acme-launch?t=90` — use `?` before the first param (`&t=` only after other params).
 */
function parseLaunchLibraryTimeParam(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function buildLaunchLibraryShareUrls(currentTimeSeconds: number): {
  pageUrl: string;
  pageUrlAtCurrentTime: string;
} {
  if (typeof window === "undefined") {
    return {pageUrl: "", pageUrlAtCurrentTime: ""};
  }
  const href = window.location.href;
  const pageUrl = new URL(href);
  pageUrl.searchParams.delete("t");

  const pageUrlAtCurrentTime = new URL(href);
  const t = Math.floor(Math.max(0, currentTimeSeconds));
  if (t > 0) {
    pageUrlAtCurrentTime.searchParams.set("t", String(t));
  } else {
    pageUrlAtCurrentTime.searchParams.delete("t");
  }

  return {
    pageUrl: pageUrl.toString(),
    pageUrlAtCurrentTime: pageUrlAtCurrentTime.toString(),
  };
}

function formatVideoTimeMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const VideoPageInner = ({video}: {video: VideoData}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tQuery = searchParams.get("t");
  const secondsFromUrl = React.useMemo(
    () => parseLaunchLibraryTimeParam(tQuery),
    [tQuery],
  );

  const [allVideos, setAllVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRelatedFilter, setActiveRelatedFilter] =
    useState<RelatedVideoFilter>({type: "all", label: "All"});

  const [currentTime, setCurrentTime] = React.useState(0);
  const [videoDuration, setVideoDuration] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const appliedUrlSeekRef = React.useRef(false);

  // Same layout segment keeps scroll on client nav between videos; reset to the hero/player.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setVideoDuration(0);
  }, [video.postId, video.videoUrl]);

  useEffect(() => {
    appliedUrlSeekRef.current = false;
  }, [video.postId, video.videoUrl, tQuery]);

  useEffect(() => {
    if (secondsFromUrl == null) return;

    const el = videoRef.current;
    if (!el) return;

    const applySeek = () => {
      if (appliedUrlSeekRef.current) return;
      const duration = el.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      appliedUrlSeekRef.current = true;
      const target = Math.min(secondsFromUrl, Math.max(0, duration - 0.001));
      el.currentTime = target;
      setCurrentTime(target);
    };

    if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applySeek();
    }

    el.addEventListener("loadedmetadata", applySeek);
    return () => el.removeEventListener("loadedmetadata", applySeek);
  }, [secondsFromUrl, video.postId, video.videoUrl]);

  const filtersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateFilterScrollState = React.useCallback(() => {
    const el = filtersScrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScrollLeft - el.scrollLeft > 4);
  }, []);

  const scrollFiltersByPage = React.useCallback(
    (direction: "left" | "right") => {
      const el = filtersScrollRef.current;
      if (!el) return;

      const amount = Math.max(180, el.clientWidth * 0.8);

      el.scrollBy({
        left: direction === "right" ? amount : -amount,
        behavior: "smooth",
      });
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    setActiveRelatedFilter({type: "all", label: "All"});

    async function fetchAllVideos() {
      setIsLoading(true);

      try {
        const videos = await getLaunchLibraryVideos();
        if (cancelled) return;
        setAllVideos(videos);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchAllVideos();

    return () => {
      cancelled = true;
    };
  }, [video.slug]);

  const relatedVideoFilters = React.useMemo(
    () => getUniqueRelatedFilters(video),
    [video],
  );

  useEffect(() => {
    const el = filtersScrollRef.current;
    if (!el) return;

    el.scrollLeft = 0;
    updateFilterScrollState();
  }, [relatedVideoFilters, updateFilterScrollState]);

  useEffect(() => {
    const el = filtersScrollRef.current;
    if (!el) return;

    const handleScroll = () => updateFilterScrollState();
    const handleResize = () => updateFilterScrollState();

    el.addEventListener("scroll", handleScroll, {passive: true});
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      updateFilterScrollState();
    });

    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [updateFilterScrollState]);

  const displayedRelatedVideos = React.useMemo(() => {
    if (!allVideos.length) return [];

    const baseRelated = dedupeVideos(getRelatedVideos(video, allVideos));
    const allResults = baseRelated.slice(0, 20);

    if (activeRelatedFilter.type === "all") {
      return allResults;
    }

    type Ranked = {video: VideoData; score: number};

    const ranked: Ranked[] = baseRelated
      .map((candidate, index) => {
        const boost = getFilterBoost(candidate, activeRelatedFilter);

        if (boost === Number.NEGATIVE_INFINITY) return null;

        return {
          video: candidate,
          score: boost + (1000 - index),
        };
      })
      .filter((item): item is Ranked => item != null)
      .sort((a, b) => b.score - a.score);

    const filteredRanked = ranked.map((item) => item.video);
    const filteredResults = filteredRanked.slice(0, 20);

    const sameAsAll =
      filteredResults.length === allResults.length &&
      filteredResults.every(
        (item, index) => item.postId === allResults[index]?.postId,
      );

    if (sameAsAll) {
      const allIds = new Set(allResults.map((item) => item.postId));
      const uniqueToFilter = filteredRanked.filter(
        (item) => !allIds.has(item.postId),
      );

      if (uniqueToFilter.length > 0) {
        return uniqueToFilter.slice(0, 20);
      }
    }

    return filteredResults;
  }, [video, allVideos, activeRelatedFilter]);

  return (
    <main className="flex flex-1 flex-col lg:px-6 pt-2 lg:pb-10 text-white max-w-screen">
      <div className="grid w-full max-w-full min-w-0 gap-4 items-start h-fit lg:grid-cols-[minmax(0,1fr)_450px]">
        <div className="flex min-w-0 flex-col max-w-full gap-4">
          <VideoPlayer
            src={video.videoUrl ?? ""}
            poster={video.thumbnail ?? undefined}
            size="full"
            className="lg:rounded-[12px] h-fit aspect-video shadow-lg shadow-black"
            name={video.name}
            setCurrentTime={setCurrentTime}
            currentTime={currentTime}
            videoRef={videoRef}
            videoSprite={video.videoSprite}
            videoSpriteInterval={video.videoSpriteInterval}
            videoSpriteColumns={video.videoSpriteColumns}
            videoSpriteFrameWidth={video.videoSpriteFrameWidth}
            videoSpriteFrameHeight={video.videoSpriteFrameHeight}
            videoSpriteFrameCount={video.videoSpriteFrameCount}
            onDurationChange={setVideoDuration}
          />
          <div className="max-w-screen ">
            <VideoDetails
              video={video}
              videoRef={videoRef}
              currentTime={currentTime}
              videoDuration={videoDuration}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col max-w-full">
          <div className="mt-4 lg:mt-0 relative w-full max-w-full min-w-0 overflow-hidden">
            <div
              ref={filtersScrollRef}
              id="related-video-filters"
              className="
              w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-2
              scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]
              touch-pan-x
            "
            >
              <div
                className="
                flex min-w-max items-center gap-2 lg:gap-3
                pr-4 lg:pr-12
              "
              >
                {relatedVideoFilters.map((filter) => {
                  const isActive =
                    filter.type === "all"
                      ? activeRelatedFilter.type === "all"
                      : activeRelatedFilter.type === "tag" &&
                        activeRelatedFilter.fieldCategory ===
                          filter.fieldCategory &&
                        activeRelatedFilter.value === filter.value;

                  return (
                    <button
                      key={
                        filter.type === "all"
                          ? "all"
                          : `${filter.fieldCategory}-${filter.value}`
                      }
                      type="button"
                      onClick={() => setActiveRelatedFilter(filter)}
                      className={`
              shrink-0 whitespace-nowrap inline-flex items-center rounded-[10px]
              border px-3 py-2 text-sm lg:text-base leading-none backdrop-blur-sm transition-all
              min-h-[40px] lg:min-h-[44px]
              ${
                isActive
                  ? "border-theme-color1 bg-theme-color1 text-black"
                  : "border-white/10 bg-white/10 text-white/90 hover:border-white/20 hover:bg-white/20"
              }
            `}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {canScrollLeft && (
              <div
                id="filter-scroll-left"
                className="absolute top-0 left-0 z-40 hidden lg:flex h-full w-12 items-center justify-start"
              >
                <div
                  className="absolute inset-y-0 left-0 w-12 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, #121212 0%, rgba(18,18,18,0.85) 60%, transparent 100%)",
                  }}
                />
                <button
                  id="filter-scroll-left-button"
                  type="button"
                  onClick={() => scrollFiltersByPage("left")}
                  className="relative z-10 p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <ChevronLeftIcon className="w-7 h-7 text-white" />
                </button>
              </div>
            )}

            {canScrollRight && (
              <div
                id="filter-scroll-right"
                className="absolute top-0 right-0 z-40 hidden lg:flex h-full w-12 items-center justify-end"
              >
                <div
                  className="absolute inset-y-0 right-0 w-12 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to left, #121212 0%, rgba(18,18,18,0.85) 60%, transparent 100%)",
                  }}
                />
                <button
                  id="filter-scroll-right-button"
                  type="button"
                  onClick={() => scrollFiltersByPage("right")}
                  className="relative z-10 p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <ChevronRightIcon className="w-7 h-7 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col lg:grid min-w-0 w-full grid-cols-1 gap-8 lg:gap-0 place-items-center">
            {isLoading ? (
              <>
                {Array.from({length: 20}).map((_, i) => (
                  <VideoPreviewSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {displayedRelatedVideos.map((relatedVideo) => (
                  <VideoPreview
                    key={relatedVideo.postId}
                    video={relatedVideo}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

function VideoPageSuspenseFallback() {
  return (
    <main className="flex flex-1 flex-col lg:px-6 pt-2 lg:pb-10 text-white">
      <div className="aspect-video w-full max-w-full animate-pulse rounded-[12px] bg-white/10 shadow-lg shadow-black" />
    </main>
  );
}

export default function VideoPage({video}: {video: VideoData}) {
  return (
    <Suspense fallback={<VideoPageSuspenseFallback />}>
      <VideoPageInner video={video} />
    </Suspense>
  );
}

const StarRating = ({score = 0}: {score?: number}) => {
  const safeScore = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({length: 5}).map((_, i) => {
        const filled = i < safeScore;

        return (
          <Star
            key={i}
            className={` h-[20px] w-[20px] lg:h-[28px] lg:w-[28px] transition-colors ${
              filled ? "fill-theme-color1 text-theme-color1" : "text-white/30"
            }`}
          />
        );
      })}
      <span className="ml-1 text-sm text-white/60">{safeScore}/5</span>
    </div>
  );
};

const VideoDetails = ({
  video,
  videoRef,
  currentTime,
  videoDuration,
}: {
  video: VideoData;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  videoDuration: number;
}) => {
  const tags = getVideoTags(video);

  const [commentaryExpanded, setCommentaryExpanded] = React.useState(false);
  const [commentaryOverflows, setCommentaryOverflows] = React.useState(false);
  const commentaryRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    setCommentaryExpanded(false);
  }, [video.postId]);

  React.useLayoutEffect(() => {
    const el = commentaryRef.current;
    if (!el || !video.commentary) {
      setCommentaryOverflows(false);
      return;
    }

    const measure = () => {
      if (commentaryExpanded) return;
      setCommentaryOverflows(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [video.commentary, commentaryExpanded, video.postId]);

  const formatName = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const formatTimestamp = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}m${seconds
      .toString()
      .padStart(2, "0")}s`;
  };

  const handleScreenshot = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      // Check if the video has crossOrigin attribute set
      if (!videoElement.crossOrigin) {
        console.log(
          "Video doesn't have crossOrigin attribute set, showing instructions",
        );
        // setShowScreenshotInstructions(true);
        return;
      }

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw the current frame to the canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Try to get the data URL
      try {
        const dataURL = canvas.toDataURL("image/png");

        // Create a download link
        const link = document.createElement("a");
        const cleanName = formatName(video.name ?? "");
        const timestamp = formatTimestamp(videoElement.currentTime);
        link.download = `${cleanName}-frame-${timestamp}.png`;
        link.href = dataURL;
        link.click();
      } catch (e) {
        // If canvas export fails, show instructions
        console.log(
          "Canvas export failed due to security restrictions. This happens when the video is from a different domain without proper CORS headers.",
          e,
        );
        // setShowScreenshotInstructions(true);
      }
    } catch (e) {
      console.error("Screenshot error:", e);
      // setShowScreenshotInstructions(true);
    }
  };

  const [isDownloading, setIsDownloading] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareIncludeTimestamp, setShareIncludeTimestamp] =
    React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);

  const {pageUrl, pageUrlAtCurrentTime} = React.useMemo(
    () => buildLaunchLibraryShareUrls(currentTime),
    [currentTime],
  );

  const effectiveShareUrl = React.useMemo(
    () => (shareIncludeTimestamp ? pageUrlAtCurrentTime : pageUrl),
    [shareIncludeTimestamp, pageUrl, pageUrlAtCurrentTime],
  );

  const shareTitle = `${video.name} — Launch Library`;

  const handleCopyLink = async () => {
    if (!effectiveShareUrl) return;
    try {
      await navigator.clipboard.writeText(effectiveShareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  };

  const handleNativeShare = async () => {
    if (!effectiveShareUrl || !navigator.share) return;
    try {
      await navigator.share({
        title: shareTitle,
        text: `Check out this launch video: ${video.name}`,
        url: effectiveShareUrl,
      });
      setShareOpen(false);
    } catch {
      /* user cancelled or share failed */
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(video.videoUrl ?? "");
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`,
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const cleanName = formatName(video.name);
      a.download = `${cleanName}-launch-video.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: open in new tab
      window.open(video.videoUrl ?? "", "_blank");
    }
    setIsDownloading(false);
  };

  return (
    <div className="flex h-fit flex-col gap-3 lg:p-4">
      <div className="px-4 pt-2 lg:p-0 flex flex-col xl:flex-row items-start  justify-between w-full gap-4">
        <div className="flex flex-row items-center gap-1 flex-wrap w-full lg:w-fit">
          <img
            src={video.logo ?? getFaviconUrl(video.website ?? "")}
            alt={video.name}
            className="h-8 w-8 lg:h-10 lg:w-10 ml-[6px] mr-2 shrink-0 rounded-full ring-white/20 ring-[2px] ring-offset-[4px] ring-offset-black"
          />
          <Link
            href={video.website ?? ""}
            className={`text-2xl lg:text-4xl font-semibold mr-4 hover:underline ${h1Font.className}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.name}
          </Link>
          <div className="ml-auto lg:ml-0">
            <StarRating score={video.score ?? 0} />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-fit lg:flex-row items-start justify-between lg:items-center gap-4 ">
          <div className="flex gap-4 flex-wrap">
            <button
              className={`text-lg border rounded-full border-white/10 bg-white/10 px-4 py-2 flex items-center gap-2  leading-none text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/20  ${bodyFont.className}`}
              onClick={handleScreenshot}
            >
              <Camera className="w-4 h-4" />
              Screenshot
            </button>
            <button
              className={`text-lg border rounded-full border-white/10 bg-white/10 px-4 py-2 flex items-center gap-2  leading-none text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/20  ${bodyFont.className}`}
              onClick={handleDownload}
            >
              {isDownloading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <DownloadIcon className="w-4 h-4" />
              )}
              Download
            </button>

            <button
              type="button"
              className={`text-lg border rounded-full border-white/10 bg-white/10 px-4 py-2 flex items-center gap-2  leading-none text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/20  ${bodyFont.className}`}
              onClick={() => setShareOpen(true)}
            >
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => !commentaryExpanded && setCommentaryExpanded(true)}
        className={`flex flex-col gap-3 lg:mt-3 text-left relative group bg-[#1e1e1e] p-4 lg:rounded-[12px]
          ${!commentaryExpanded ? "hover:bg-theme-color1/10 cursor-pointer" : "cursor-text select-text"}
          
          `}
      >
        <div className="flex flex-col gap-1 ">
          <h2 className={`text-xl font-bold ${h1Font.className}`}>
            Our Commentary
          </h2>
          {video.commentary && (
            <p
              ref={commentaryRef}
              className={`relative z-10 text-lg ${bodyFont.className} ${
                !commentaryExpanded ? "line-clamp-5" : ""
              }`}
            >
              {video.commentary}
            </p>
          )}
          {commentaryOverflows && !commentaryExpanded && (
            <div
              className={`
                pl-6
                z-20
                absolute bottom-[18px] right-[22px]
                w-fit text-base font-medium
                text-theme-color1 hover:underline

                ${bodyBold.className}
            
                bg-[linear-gradient(to_right,transparent_0%,#1e1e1e_20%)]
                group-hover:bg-[linear-gradient(to_right,transparent_0%,#24281F_20%)]
              `}
            >
              ...read more
            </div>
          )}
          {commentaryOverflows && commentaryExpanded && (
            <button
              onClick={() => setCommentaryExpanded(false)}
              className={`
                cursor-pointer
                z-20
                w-fit text-base font-medium
                text-theme-color1 hover:underline

                ${bodyBold.className}
            
               
              `}
            >
              Show less
            </button>
          )}
        </div>
      </button>
      <div className="flex flex-col gap-3 lg:mt-3 bg-white/5 p-4 lg:rounded-[12px]">
        <div className="flex flex-col gap-1">
          <h2 className={`text-xl font-bold ${h1Font.className}`}>Tags</h2>
          <div className="flex flex-wrap gap-2">
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

      <Dialog
        open={shareOpen}
        onOpenChange={(open) => {
          setShareOpen(open);
          if (!open) {
            setLinkCopied(false);
          } else {
            setShareIncludeTimestamp(false);
            setLinkCopied(false);
          }
        }}
      >
        <DialogContent
          className="border border-white/10 bg-[#1a1a1a] text-white sm:max-w-md rounded-[12px]"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className={`text-white ${h1Font.className}`}>
              Share
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Copy the link or share via the options below. Turn on the checkbox
              to add the current playback time to every link.
            </DialogDescription>
          </DialogHeader>

          <div className={`flex flex-col gap-2 pt-1 ${bodyFont.className}`}>
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!effectiveShareUrl}
              className="flex w-full items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-left text-white/90 transition-colors hover:border-white/20 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
            >
              {linkCopied ? (
                <Check className="h-5 w-5 shrink-0 text-theme-color1" />
              ) : (
                <Copy className="h-5 w-5 shrink-0" />
              )}
              <span>{linkCopied ? "Link copied" : "Copy link"}</span>
            </button>

            {typeof navigator !== "undefined" &&
              "share" in navigator &&
              typeof navigator.share === "function" && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  disabled={!effectiveShareUrl}
                  className="flex w-full items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-left text-white/90 transition-colors hover:border-white/20 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ShareIcon className="h-5 w-5 shrink-0" />
                  <span>Share via device…</span>
                </button>
              )}

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(effectiveShareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-white/90 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xs font-bold">
                X
              </span>
              <span>Share on X</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(effectiveShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-white/90 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5 shrink-0" />
              <span>Share on LinkedIn</span>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareTitle}\n\n${effectiveShareUrl}`)}`}
              className="flex w-full items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-white/90 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <Mail className="h-5 w-5 shrink-0" />
              <span>Email</span>
            </a>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-[10px]   px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/10 ${bodyFont.className}`}
            >
              <Checkbox
                checked={shareIncludeTimestamp}
                onCheckedChange={(checked: boolean) =>
                  setShareIncludeTimestamp(checked)
                }
                className="mt-1 size-4 shrink-0 bg-transparent border-white/30  rounded-[4px] "
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                <span className="leading-snug text-white/90">
                  Include with timestamp of current playback
                </span>
                <span className="text-xs text-theme-color1 tabular-nums">
                  <span className="font-bold">
                    {formatVideoTimeMmSs(currentTime)}
                  </span>{" "}
                  {videoDuration > 0 && Number.isFinite(videoDuration)
                    ? ` / ${formatVideoTimeMmSs(videoDuration)}`
                    : ""}
                </span>
              </span>
            </label>
          </div>
        </DialogContent>
      </Dialog>
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

const PREVIEW_WIDTH = 150;
const PREVIEW_HEIGHT = 90;
const HOVER_FRAME_MS = 140;

function buildHoverPreviewSequence(
  frameCount: number,
  interval: number,
): number[] {
  if (frameCount <= 0) return [];

  const approxDuration = frameCount * interval;
  const framesPerSecond = 1 / interval;

  const sampleWindow = (startSec: number, endSec: number, samples: number) => {
    const startFrame = Math.max(0, Math.floor(startSec * framesPerSecond));
    const endFrame = Math.min(
      frameCount - 1,
      Math.floor(endSec * framesPerSecond),
    );

    if (endFrame <= startFrame) {
      return [startFrame];
    }

    const result: number[] = [];
    for (let i = 0; i < samples; i += 1) {
      const t = samples === 1 ? 0 : i / (samples - 1);
      const frame = Math.round(startFrame + (endFrame - startFrame) * t);
      result.push(Math.max(0, Math.min(frameCount - 1, frame)));
    }
    return result;
  };

  const startFrames = sampleWindow(0, Math.min(2, approxDuration), 5);

  const midStart = Math.max(0, approxDuration / 2 - 1);
  const midEnd = Math.min(approxDuration, approxDuration / 2 + 1);
  const middleFrames = sampleWindow(midStart, midEnd, 5);

  const endFrames = sampleWindow(
    Math.max(0, approxDuration - 2),
    approxDuration,
    5,
  );

  return [...startFrames, ...middleFrames, ...endFrames];
}

const VideoPreviewSkeleton = () => {
  return (
    <div
      className="
      flex w-full min-w-0 max-w-full flex-col gap-3 transition-all
      lg:grid lg:grid-cols-[150px_1fr] lg:rounded-[12px] lg:p-2
    "
    >
      <div className="relative aspect-video w-full h-auto overflow-hidden bg-black lg:h-[90px] lg:w-[150px] lg:rounded-[12px]">
        <div className="absolute inset-0 rounded-none bg-white/10 animate-pulse lg:rounded-[12px]" />
      </div>

      <div className="flex min-w-0 flex-col gap-2 overflow-hidden px-2 lg:max-h-[90px] lg:gap-1 lg:px-0">
        <div className="flex min-w-0 items-center gap-2 pl-[3px]">
          <div className="h-6 w-6 shrink-0 rounded-full bg-white/10 animate-pulse lg:h-4 lg:w-4" />
          <div className="h-6 min-w-0 flex-1 rounded-full bg-white/10 animate-pulse lg:h-4 lg:max-w-[10rem]" />
          <div className="ml-auto block h-5 w-[4.5rem] shrink-0 rounded-full bg-white/10 animate-pulse lg:hidden" />
        </div>

        <div className="hidden lg:block">
          <div className="h-4 w-16 rounded-full bg-white/10 animate-pulse" />
        </div>

        <div className="h-3 w-full rounded-full bg-white/10 animate-pulse lg:h-4" />
        <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse lg:h-4" />
      </div>
    </div>
  );
};

const VideoPreview = ({video}: {video: VideoData}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [spriteReady, setSpriteReady] = React.useState(false);
  const [frameCursor, setFrameCursor] = React.useState(0);

  const href = `/launch-library/${video.slug ?? baseSlugFromName(video.name)}`;

  const spriteUrl = video.videoSprite ?? null;
  const frameWidth = video.videoSpriteFrameWidth ?? PREVIEW_WIDTH;
  const frameHeight = video.videoSpriteFrameHeight ?? PREVIEW_HEIGHT;
  const columns = video.videoSpriteColumns ?? 10;
  const interval = video.videoSpriteInterval ?? 0.1;
  const frameCount = video.videoSpriteFrameCount ?? 0;

  const previewSequence = React.useMemo(() => {
    return buildHoverPreviewSequence(frameCount, interval);
  }, [frameCount, interval]);

  // Preload sprite once
  React.useEffect(() => {
    if (!spriteUrl) {
      setSpriteReady(false);
      return;
    }

    let cancelled = false;
    const img = new window.Image();

    img.onload = () => {
      if (!cancelled) {
        setSpriteReady(true);
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        setSpriteReady(false);
      }
    };

    img.src = spriteUrl;

    return () => {
      cancelled = true;
    };
  }, [spriteUrl]);

  // Set first valid frame immediately on hover
  React.useEffect(() => {
    if (!isHovered) {
      setFrameCursor(0);
      return;
    }

    if (!spriteReady || previewSequence.length === 0) {
      return;
    }

    setFrameCursor(0);
  }, [isHovered, spriteReady, previewSequence]);

  // Animate frames only when hovered and sprite is ready
  React.useEffect(() => {
    if (!isHovered || !spriteReady || previewSequence.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setFrameCursor((prev) => {
        const next = prev + 1;
        return next >= previewSequence.length ? 0 : next;
      });
    }, HOVER_FRAME_MS);

    return () => window.clearInterval(id);
  }, [isHovered, spriteReady, previewSequence]);

  const activeFrameIndex = React.useMemo(() => {
    if (previewSequence.length === 0) return 0;
    const frame = previewSequence[frameCursor] ?? previewSequence[0] ?? 0;
    return Math.max(
      0,
      Math.min(frameCount > 0 ? frameCount - 1 : frame, frame),
    );
  }, [previewSequence, frameCursor, frameCount]);

  const spriteCol = activeFrameIndex % columns;
  const spriteRow = Math.floor(activeFrameIndex / columns);

  const backgroundSize = `${columns * frameWidth}px auto`;
  const backgroundPosition = `-${spriteCol * frameWidth}px -${spriteRow * frameHeight}px`;

  const showSprite = isHovered && spriteReady && !!spriteUrl && frameCount > 0;

  return (
    <Link
      href={href}
      scroll
      className="
      flex flex-col w-full min-w-0 max-w-full gap-3 lg:rounded-[12px] lg:p-2 transition-all
      hover:bg-white/5
     lg:grid lg:grid-cols-[150px_1fr]
    "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-auto aspect-video overflow-hidden lg:rounded-[12px] bg-black lg:h-[90px] lg:w-[150px]">
        <img
          src={video.thumbnail ?? ""}
          alt={video.name}
          className={`absolute inset-0 h-full w-full rounded-none lg:rounded-[12px] object-cover transition-opacity duration-100 ${
            showSprite ? "opacity-0" : "opacity-100"
          }`}
        />

        {spriteUrl && frameCount > 0 && (
          <div
            className={`absolute inset-0 transition-opacity duration-100 ${
              showSprite ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${spriteUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition,
              backgroundSize,
              willChange: "background-position",
            }}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2 lg:gap-1 overflow-hidden lg:max-h-[90px] px-2 lg:px-0">
        <div className="flex min-w-0 items-center gap-2 pl-[3px]">
          <img
            src={video.logo ?? getFaviconUrl(video.website ?? "")}
            alt={video.name}
            className="h-6 w-6 lg:h-4 lg:w-4 shrink-0 rounded-full ring-[1px] ring-white/20 ring-offset-[2px] ring-offset-black"
          />
          <h3
            className={`min-w-0 truncate text-2xl lg:text-base font-bold ${h1Font.className}`}
          >
            {video.name}
          </h3>
          <div className="block lg:hidden ml-auto">
            <StarRatingSmall score={video.score ?? 0} />
          </div>
        </div>

        <div className="hidden lg:block">
          <StarRatingSmall score={video.score ?? 0} />
        </div>

        <p
          className={`line-clamp-2 text-xs text-white/70 lg:text-sm ${bodyFont.className}`}
        >
          {video.commentary}
        </p>
      </div>
    </Link>
  );
};

const StarRatingSmall = ({score = 0}: {score?: number}) => {
  const safeScore = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <div className="flex items-center ">
      {/* <span className="mr-1 text-sm text-white/60">{safeScore}/5</span> */}
      {Array.from({length: 5}).map((_, i) => {
        const filled = i < safeScore;

        return (
          <Star
            key={i}
            size={12}
            className={` transition-colors ${
              filled ? "fill-theme-color1 text-theme-color1" : "text-white/30"
            }`}
          />
        );
      })}
    </div>
  );
};
