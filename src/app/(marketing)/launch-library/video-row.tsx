"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import localFont from "next/font/local";
import {ChevronLeft, ChevronRight, Volume2, VolumeX} from "lucide-react";
import {createPortal} from "react-dom";
import type {VideoCardDisplay} from "./data/types";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {baseSlugFromName} from "@/lib/slug";
import {getVideoTags} from "./data/video-tags";
import {TagBadge} from "./tag-badge";
import Link from "next/link";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_regular.ttf",
});

const CARD_WIDTH_DESKTOP = 256;
const CARD_WIDTH_MOBILE = 311;
const GAP = 16;
const EDGE_PEEK = 24;

const getCardWidth = () =>
  typeof window !== "undefined" && window.innerWidth < 768
    ? CARD_WIDTH_MOBILE
    : CARD_WIDTH_DESKTOP;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const HOVER_DELAY = 500;
const PREVIEW_EXIT_MS = 180;

export const VideoCard = ({
  video,
  index,
  showNameOverlay = false,
}: {
  video: VideoCardDisplay;
  index: number;
  showNameOverlay?: boolean;
}) => {
  const router = useRouter();

  const pathSlug = useMemo(
    () => video.slug ?? baseSlugFromName(video.name),
    [video.slug, video.name],
  );
  const href = `/launch-library/${pathSlug}`;

  const handleNavigate = (
    e?: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>,
  ) => {
    const target = e?.target;
    const el =
      target instanceof Element
        ? target
        : (target as Node | null)?.parentElement;
    if (el?.closest("[data-interactive='true']")) {
      return;
    }

    router.push(href);
  };

  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringCardRef = useRef(false);
  const isHoveringPreviewRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const [isPreviewMounted, setIsPreviewMounted] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({top: 0, left: 0});
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    isHoveringCardRef.current = false;
    isHoveringPreviewRef.current = false;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setIsHoveringCard(false);
    setIsHoveringPreview(false);
    setIsPreviewMounted(false);
    setIsPreviewVisible(false);
    setIsVideoReady(false);
  }, [isMobile]);

  useEffect(() => {
    setMounted(true);

    return () => {
      isHoveringCardRef.current = false;
      isHoveringPreviewRef.current = false;

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  const updatePreviewPosition = () => {
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
    updatePreviewPosition();
    setIsVideoReady(false);
    setIsMuted(false);
    setIsPreviewMounted(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPreviewVisible(true);
      });
    });
  };

  const closePreview = () => {
    setIsPreviewVisible(false);

    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(() => {
      isHoveringPreviewRef.current = false;
      setIsHoveringPreview(false);
      setIsPreviewMounted(false);
      setIsVideoReady(false);
    }, PREVIEW_EXIT_MS);
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
    if (isMobile) return;

    router.prefetch(href);

    isHoveringCardRef.current = true;
    setIsHoveringCard(true);
    updatePreviewPosition();
    clearExitTimeout();

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      openPreview();
    }, HOVER_DELAY);
  };

  const handleLeave = () => {
    if (isMobile) return;

    isHoveringCardRef.current = false;
    setIsHoveringCard(false);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    scheduleCloseIfNeeded();
  };

  const handlePreviewEnter = () => {
    router.prefetch(href);

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
    if (!isPreviewMounted) return;

    const handleUpdate = () => updatePreviewPosition();

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isPreviewMounted]);

  useEffect(() => {
    if (!isPreviewMounted || !videoRef.current) return;

    const el = videoRef.current;
    el.currentTime = 0;
    el.muted = isMuted;

    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [isPreviewMounted, isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

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

  const tags = getVideoTags(video);

  return (
    <>
      <Link
        href={href}
        ref={cardRef}
        prefetch
        className="shrink-0 relative cursor-pointer flex items-center justify-center overflow-hidden rounded-[12px] bg-muted w-[311px] md:w-[256px] h-[175px] md:h-36"
        onMouseEnter={!isMobile ? handleEnter : undefined}
        onMouseLeave={!isMobile ? handleLeave : undefined}
        onClick={
          isMobile
            ? (e) => {
                e.preventDefault();
                handleNavigate(e);
              }
            : undefined
        }
        onPointerDown={() => router.prefetch(href)}
      >
        <Image
          src={video.thumbnail ?? ""}
          alt={video.name}
          fill
          className="rounded-[12px] object-cover"
        />
        {(showNameOverlay || isMobile) && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-3 py-2">
            <div className={`truncate text-sm text-white ${h1Font.className}`}>
              {video.name}
            </div>
          </div>
        )}
      </Link>

      {!isMobile &&
        mounted &&
        isPreviewMounted &&
        createPortal(
          <div
            id="video-card-preview"
            className="fixed z-[9999] overflow-hidden flex w-[350px] cursor-pointer flex-col rounded-xl bg-black shadow-black shadow-2xl pointer-events-auto transition-[opacity,transform] duration-200 ease-out"
            style={{
              left: previewPos.left,
              top: previewPos.top,
              transform: isPreviewVisible
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.85)",
              opacity: isPreviewVisible ? 1 : 0,
              transformOrigin: "center center",
            }}
            onMouseEnter={handlePreviewEnter}
            onMouseLeave={handlePreviewLeave}
            onPointerDown={handleNavigate}
          >
            <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-muted">
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
                data-interactive="true"
                aria-label={isMuted ? "Unmute preview" : "Mute preview"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                }}
                className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex gap-2 items-center min-w-0">
                <img
                  src={getFaviconUrl(video.website ?? "")}
                  alt={video.name}
                  className="h-6 w-6 shrink-0 rounded-full ring-white/20 ring-[2px] ring-offset-[4px] ring-offset-black"
                />
                <div
                  className={` min-w-0 truncate text-xl w-fit text-white ${h1Font.className}`}
                >
                  {video.name}
                </div>
                <div className={` min-w-0 truncate text-sm text-white/70`}>
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
                  className={`text-sm leading-5 text-white/70 overflow-hidden ${bodyFont.className}`}
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
};

const VideoRow = ({
  videos,
  label,
  href,
}: {
  videos: VideoCardDisplay[];
  label: string;
  href: string;
}) => {
  const items = videos;
  const total = items.length;

  const viewportRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const repeated = useMemo(() => [...items, ...items, ...items], [items]);

  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [logicalStart, setLogicalStart] = useState(0);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);

  // this is the actual animated anchor inside the repeated track
  const [trackStart, setTrackStart] = useState(total);
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    setCardWidth(getCardWidth());
  }, []);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const cardW = getCardWidth();
      setCardWidth((prev) => (prev !== cardW ? cardW : prev));

      const width = viewport.clientWidth;
      const fullCardWidth = cardW + GAP;

      const nextItemsPerPage = Math.max(
        1,
        Math.floor((width - EDGE_PEEK) / fullCardWidth),
      );

      setItemsPerPage(nextItemsPerPage);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [total]);

  useEffect(() => {
    setTrackStart(total + logicalStart);
  }, [itemsPerPage, total]);

  const translateX = -(trackStart * (cardWidth + GAP)) + EDGE_PEEK;

  const move = (direction: "left" | "right") => {
    if (animatingRef.current || total === 0) return;

    animatingRef.current = true;
    setIsAnimating(true);

    const step = itemsPerPage;

    if (direction === "right") {
      setTrackStart((prev) => prev + step);
      setLogicalStart((prev) => mod(prev + step, total));
    } else {
      setTrackStart((prev) => prev - step);
      setLogicalStart((prev) => mod(prev - step, total));
    }
  };

  const handleTransitionEnd = () => {
    if (!animatingRef.current) return;

    setIsAnimating(false);

    setTrackStart((prev) => {
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

  const AMOUNT_OF_PAGES = Math.ceil(total / itemsPerPage);

  const currentPage = mod(
    Math.floor(logicalStart / itemsPerPage),
    AMOUNT_OF_PAGES,
  );

  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 items-start">
      <div className="flex sm:flex-row flex-col justify-between gap-1 items-start sm:items-center w-full pl-4 md:pl-0">
        <Link
          href={href}
          className={`group relative z-20 inline-flex items-center  sm:pl-6 text-2xl uppercase big-text ${h1Font.className}`}
        >
          <span className="group-hover:underline">{label}</span>

          <span className="absolute left-full ml-4 flex items-center gap-0 whitespace-nowrap">
            <span className="translate-x-[-8px] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
              <KeyboardDoubleArrowRightRoundedIcon className="h-4 w-4 text-white" />
            </span>

            <span
              className={`translate-x-[-8px] opacity-0 mt-1 transition-all delay-100 duration-300 text-sm ease-out group-hover:translate-x-0 group-hover:opacity-100 ${bodyFont.className}`}
            >
              view all
            </span>
          </span>

          {/* invisible hover buffer */}
          <span className="absolute left-full top-0 h-full w-32" />
        </Link>
        {/* a button that copies all the video ids as string in a list to the clipboard and keeps them in the same order */}
        {/* <button
          onClick={() => {
            setIsCopied(true);

            const text = items.map((video) => `"${video.postId}"`).join(",");

            void navigator.clipboard.writeText(text);

            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
        >
          Copy all
        </button> */}
        {/* indicates which page is currently active by changing the background color */}
        <div className="flex gap-1 md:gap-[1px] flex-wrap">
          {Array.from({length: AMOUNT_OF_PAGES}).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full md:rounded-none mb-2 md:mb-0 md:w-6 md:h-1 ${index === currentPage ? "bg-theme-color1" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="group relative w-full min-w-0">
        <button
          onClick={() => move("left")}
          className="
            group/arrow
            absolute left-0 top-1/2 z-20
            bg-[rgb(18,18,18,0)]
            hover:bg-[rgb(18,18,18,.5)]
            transition-colors duration-300 ease-in-out
            -translate-y-1/2
            h-full
            opacity-0 group-hover:opacity-100
            pointer-events-none group-hover:pointer-events-auto
          "
          aria-label="Previous"
        >
          <ChevronLeft
            className="
              h-16 w-16
              transition-transform duration-200 ease-out
              group-hover/arrow:scale-110
              group-hover/arrow:-translate-x-1
            "
          />
        </button>

        <button
          onClick={() => move("right")}
          className="
            group/arrow
            absolute right-0 top-1/2 z-20
            bg-[rgb(18,18,18,0)]
            hover:bg-[rgb(18,18,18,.5)]
            transition-colors duration-300 ease-in-out
            -translate-y-1/2
            h-full
            opacity-0 group-hover:opacity-100
            pointer-events-none group-hover:pointer-events-auto
          "
          aria-label="Next"
        >
          <ChevronRight
            className="
              h-16 w-16
              transition-transform duration-200 ease-out
              group-hover/arrow:scale-110
              group-hover/arrow:translate-x-1
            "
          />
        </button>

        <div ref={viewportRef} className="overflow-hidden">
          <div
            className="flex w-max gap-4 will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isAnimating
                ? "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
          >
            {repeated.map((video, index) => (
              <VideoCard
                key={`${video.postId}-${index}`}
                video={video}
                index={index % total}
              />
              // delete this div after testing
              // <div className="flex flex-col">
              //    <button
              //     className={`text-sm  hover:text-white transition-colors duration-200 ease-in-out ${isCopied ? "text-green-500" : "text-white/70 hover:text-white"}`}
              //     onClick={() => {
              //       setIsCopied(true);
              //       void navigator.clipboard.writeText(video.postId.toString());
              //       setTimeout(() => {
              //         setIsCopied(false);
              //       }, 3000);
              //     }}
              //   >
              //     {video.postId}
              //   </button>
              //   <VideoCard
              //     key={`${video.postId}-${index}`}
              //     video={video}
              //     index={index % total}
              //   />
              //  </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRow;
