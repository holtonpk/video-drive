"use client";
import {createPortal} from "react-dom";
import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import localFont from "next/font/local";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {baseSlugFromName} from "@/lib/slug";
import {ChevronLeft, ChevronRight, Volume2, VolumeX} from "lucide-react";
import {rankPaths} from "./assets";
import {VideoData} from "./data/types";
import {getVideoTags} from "./data/video-tags";
import {TagBadge} from "./tag-badge";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_regular.ttf",
});

const topTen: string[] = [
  "1978176112740950504",
  "1963310947470344353",
  "1978158867499331586",
  "1985391530090127424",
  "1988320904926130562",
  "1924948247618920780",
  "1985769015881715775",
  "1894447274756817044",
  "2018383922099630298",
  "2018799155871903814",
];

type RankPathItem = (typeof rankPaths)[number];
type RankedRankItem = RankPathItem & {video: VideoData};

function RankNumber({
  id,
  viewBox,
  path,
  width,
}: {
  id: string;
  viewBox: string;
  path: string;
  width: number;
}) {
  return (
    <svg
      id={id}
      viewBox={viewBox}
      className="h-40 shrink-0"
      style={{width}}
      fill="none"
      aria-hidden="true"
    >
      <path d={path} stroke="#C9F292" strokeWidth="4" />
    </svg>
  );
}

const HOVER_DELAY = 500;

function RankCard({
  id,
  viewBox,
  path,
  width,
  video,
}: {
  id: string;
  viewBox: string;
  path: string;
  width: number;
  video: VideoData;
}) {
  const router = useRouter();

  const handleNavigate = () => {
    const pathSlug = video.slug ?? baseSlugFromName(video.name);
    router.push(`/launch-library/${pathSlug}`);
  };

  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringCardRef = useRef(false);
  const isHoveringPreviewRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({top: 0, left: 0});
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tags = getVideoTags(video);

  useEffect(() => {
    setMounted(true);

    return () => {
      isHoveringCardRef.current = false;
      isHoveringPreviewRef.current = false;

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  const updatePosition = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    setPreviewPos({
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
    });
  };

  const clearExitTimeout = () => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  };

  const openPreview = () => {
    updatePosition();
    setIsVideoReady(false);
    setIsMuted(false);
    setPreviewMounted(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPreviewVisible(true);
      });
    });
  };

  const closePreview = () => {
    setPreviewVisible(false);

    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(() => {
      isHoveringPreviewRef.current = false;
      setIsHoveringPreview(false);
      setPreviewMounted(false);
      setIsVideoReady(false);
    }, 180);
  };

  const scheduleCloseIfNeeded = () => {
    clearExitTimeout();

    exitTimeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current && !isHoveringPreviewRef.current) {
        closePreview();
      }
    }, 30);
  };

  const handleEnter = () => {
    isHoveringCardRef.current = true;
    setIsHoveringCard(true);
    updatePosition();
    clearExitTimeout();

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      openPreview();
    }, HOVER_DELAY);
  };

  const handleLeave = () => {
    isHoveringCardRef.current = false;
    setIsHoveringCard(false);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    scheduleCloseIfNeeded();
  };

  const handlePreviewEnter = () => {
    isHoveringPreviewRef.current = true;
    setIsHoveringPreview(true);
    clearExitTimeout();
  };

  const handlePreviewLeave = () => {
    isHoveringPreviewRef.current = false;
    setIsHoveringPreview(false);
    scheduleCloseIfNeeded();
  };

  useEffect(() => {
    if (!previewMounted) return;

    const handleUpdate = () => updatePosition();

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [previewMounted]);

  useEffect(() => {
    if (!previewMounted || !videoRef.current) return;

    const el = videoRef.current;
    el.currentTime = 0;
    el.muted = isMuted;

    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [previewMounted, isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  const getFaviconUrl = (url: string) => {
    try {
      const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;
      const domain = new URL(cleanedUrl).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return "invalid";
    }
  };

  return (
    <>
      <div
        className="flex shrink-0 items-center"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <RankNumber id={id} viewBox={viewBox} path={path} width={width} />

        <div
          ref={cardRef}
          id="rank-video-card-preview"
          className="-ml-px relative aspect-video w-[256px] shrink-0 cursor-pointer overflow-hidden rounded-r-[6px] bg-muted"
          onClick={handleNavigate}
        >
          <Image
            src={video.thumbnail ?? ""}
            alt={video.name}
            fill
            className="object-cover"
          />

          {/* <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-3 py-2">
            <div className={`truncate text-sm text-white ${h1Font.className}`}>
              {video.name}
            </div>
          </div> */}
        </div>
      </div>

      {mounted &&
        previewMounted &&
        createPortal(
          <div
            id="video-card-preview"
            className="fixed z-[9999] flex w-[350px] cursor-pointer flex-col overflow-hidden rounded-xl bg-black shadow-black shadow-2xl pointer-events-auto transition-[opacity,transform] duration-200 ease-out"
            style={{
              left: previewPos.left,
              top: previewPos.top,
              transform: previewVisible
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.85)",
              opacity: previewVisible ? 1 : 0,
              transformOrigin: "center center",
            }}
            onMouseEnter={handlePreviewEnter}
            onMouseLeave={handlePreviewLeave}
            onClick={handleNavigate}
          >
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
              {video.thumbnail && (
                <Image
                  src={video.thumbnail}
                  alt={video.name}
                  fill
                  className={`object-cover object-center transition-opacity duration-200 ${
                    isVideoReady ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}

              <video
                ref={videoRef}
                src={video.videoUrl ?? ""}
                autoPlay
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200 ${
                  isVideoReady ? "opacity-100" : "opacity-0"
                }`}
                onLoadedData={() => setIsVideoReady(true)}
                onCanPlay={() => setIsVideoReady(true)}
              />

              <button
                type="button"
                aria-label={isMuted ? "Unmute preview" : "Mute preview"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                }}
                className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <img
                  src={getFaviconUrl(video.website ?? "")}
                  alt={video.name}
                  className="h-6 w-6 shrink-0 rounded-full ring-2 ring-white/20 ring-offset-4 ring-offset-black"
                />
                <div
                  className={`min-w-0 w-fit truncate text-xl text-white ${h1Font.className}`}
                >
                  {video.name}
                </div>
                <div className="min-w-0 truncate text-sm text-white/70">
                  • {video.cohort ?? "Cohort unknown"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagBadge
                    key={`${tag.category}-${tag.label}`}
                    tag={tag.label}
                    fieldCategory={tag.category}
                  />
                ))}
              </div>

              {video.commentary && (
                <p
                  className={`overflow-hidden text-sm leading-5 text-white/70 ${bodyFont.className}`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {video.commentary}
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export const TopTen = ({videos}: {videos: VideoData[]}) => {
  const rankedItems = useMemo((): RankedRankItem[] => {
    const videoMap = new Map(videos.map((video) => [video.postId, video]));
    return rankPaths
      .map((rank, index) => {
        const postId = topTen[index];
        const video = videoMap.get(postId);
        if (!video) return null;
        return {...rank, video};
      })
      .filter((item): item is RankedRankItem => Boolean(item));
  }, [videos]);

  const total = rankedItems.length;

  const repeated = useMemo(
    () => [...rankedItems, ...rankedItems, ...rankedItems],
    [rankedItems],
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatingRef = useRef(false);

  const [positions, setPositions] = useState<number[]>([]);
  const [, setItemsPerPage] = useState(4);
  const [pageStarts, setPageStarts] = useState<number[]>([0, 3, 6]);
  const [anchorIndex, setAnchorIndex] = useState(() => total || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const EDGE_PEEK = 32;

  useEffect(() => {
    setAnchorIndex((prev) => {
      if (total === 0) return 0;
      if (prev < total) return total;
      if (prev >= total * 2) return total * 2 - 1;
      return prev;
    });
  }, [total]);

  useLayoutEffect(() => {
    const measure = () => {
      const nextPositions = cardRefs.current.map((el) => el?.offsetLeft ?? 0);
      setPositions(nextPositions);

      const viewportWidth = viewportRef.current?.clientWidth ?? 0;

      if (viewportWidth === 0 || nextPositions.length < total * 2) return;

      const middleStart = total;
      const middleEnd = total * 2 - 1;

      const strides: number[] = [];
      for (let i = middleStart; i < middleEnd; i++) {
        const stride = nextPositions[i + 1] - nextPositions[i];
        if (stride > 0) strides.push(stride);
      }

      const averageStride =
        strides.length > 0
          ? strides.reduce((sum, value) => sum + value, 0) / strides.length
          : 320;

      const nextItemsPerPage = Math.max(
        1,
        Math.floor((viewportWidth - EDGE_PEEK) / averageStride),
      );

      setItemsPerPage(nextItemsPerPage);

      const step = Math.max(1, nextItemsPerPage - 1);
      const lastStart = Math.max(0, total - nextItemsPerPage);

      const nextPageStarts: number[] = [];
      for (let start = 0; start < lastStart; start += step) {
        nextPageStarts.push(start);
      }

      if (!nextPageStarts.includes(lastStart)) {
        nextPageStarts.push(lastStart);
      }

      setPageStarts(nextPageStarts);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    cardRefs.current.forEach((el) => {
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [repeated, total]);

  if (total === 0) {
    return null;
  }

  const logicalStart = ((anchorIndex % total) + total) % total;

  const currentPageIndex = Math.max(
    0,
    pageStarts.findIndex((start) => start === logicalStart),
  );

  const translateX = positions.length ? -positions[anchorIndex] + EDGE_PEEK : 0;

  const move = (direction: "left" | "right") => {
    if (
      animatingRef.current ||
      positions.length === 0 ||
      pageStarts.length === 0
    )
      return;

    animatingRef.current = true;
    setIsAnimating(true);

    const nextPageIndex =
      direction === "right"
        ? (currentPageIndex + 1) % pageStarts.length
        : (currentPageIndex - 1 + pageStarts.length) % pageStarts.length;

    const currentStart = pageStarts[currentPageIndex];
    const nextStart = pageStarts[nextPageIndex];

    let delta = nextStart - currentStart;

    if (direction === "right" && delta <= 0) {
      delta += total;
    }

    if (direction === "left" && delta >= 0) {
      delta -= total;
    }

    setAnchorIndex((prev) => prev + delta);
  };

  const handleTransitionEnd = () => {
    if (!animatingRef.current) return;

    setIsAnimating(false);

    setAnchorIndex((prev) => {
      let normalized = prev;

      while (normalized < total) normalized += total;
      while (normalized >= total * 2) normalized -= total;

      return normalized;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animatingRef.current = false;
      });
    });
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-2">
      <div className="flex w-full flex-row items-center justify-between px-6">
        <h1
          className={`relative z-20 text-center text-2xl pl-6 uppercase big-text ${h1Font.className}`}
        >
          Top 10 Launch Videos
        </h1>

        <div className="flex gap-[1px]">
          {pageStarts.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 ${
                index === currentPageIndex ? "bg-theme-color1" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="group relative w-full min-w-0">
        <button
          type="button"
          onClick={() => move("left")}
          className="
            group/arrow
            pointer-events-none absolute left-0 top-1/2 z-20
            h-full -translate-y-1/2
            bg-[rgb(18,18,18,0)]
            opacity-0 transition-colors duration-300 ease-in-out
            hover:bg-[rgb(18,18,18,.5)]
            group-hover:pointer-events-auto group-hover:opacity-100
          "
          aria-label="Previous"
        >
          <ChevronLeft
            className="
              h-16 w-16
              transition-transform duration-200 ease-out
              group-hover/arrow:translate-x-1 group-hover/arrow:scale-110
            "
          />
        </button>

        <button
          type="button"
          onClick={() => move("right")}
          className="
            group/arrow
            pointer-events-none absolute right-0 top-1/2 z-20
            h-full -translate-y-1/2
            bg-[rgb(18,18,18,0)]
            opacity-0 transition-colors duration-300 ease-in-out
            hover:bg-[rgb(18,18,18,.5)]
            group-hover:pointer-events-auto group-hover:opacity-100
          "
          aria-label="Next"
        >
          <ChevronRight
            className="
              h-16 w-16
              transition-transform duration-200 ease-out
              group-hover/arrow:translate-x-1 group-hover/arrow:scale-110
            "
          />
        </button>

        <div ref={viewportRef} className="overflow-hidden pr-8">
          <div
            className="flex w-max items-center gap-6 will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isAnimating
                ? "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
          >
            {repeated.map((rank, index) => (
              <div
                key={`${rank.id}-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="shrink-0"
              >
                <RankCard {...rank} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
