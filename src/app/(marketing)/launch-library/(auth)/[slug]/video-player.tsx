"use client";

import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  LoaderCircleIcon,
} from "lucide-react";
import {useAuthGate} from "../auth-gate";

const videoPlayerVariants = cva(
  "relative w-full bg-black rounded-card overflow-hidden group",
  {
    variants: {
      size: {
        sm: "max-w-md",
        default: "max-w-2xl",
        lg: "max-w-4xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface VideoPlayerProps
  extends
    Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "onDurationChange">,
    VariantProps<typeof videoPlayerVariants> {
  src: string;
  poster?: string;
  showControls?: boolean;
  autoHide?: boolean;
  className?: string;
  name: string;
  setCurrentTime: (time: number) => void;
  currentTime: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSprite?: string | null;
  videoSpriteInterval?: number | null;
  videoSpriteColumns?: number | null;
  videoSpriteFrameWidth?: number | null;
  videoSpriteFrameHeight?: number | null;
  videoSpriteFrameCount?: number | null;
  /** Fired when media duration is known (e.g. after `loadedmetadata`). */
  onDurationChange?: (durationSeconds: number) => void;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      className,
      size,
      src,
      poster,
      name,
      videoSprite,
      videoSpriteInterval = 0.1,
      videoSpriteColumns = 10,
      videoSpriteFrameWidth,
      videoSpriteFrameHeight,
      videoSpriteFrameCount,
      showControls = true,
      autoHide = true,
      /** Muted by default so autoplay works under browser policies (user can unmute). */
      autoPlay = true,
      playsInline = true,
      muted = true,
      setCurrentTime,
      currentTime,
      videoRef,
      onDurationChange,
      ...props
    },
    ref,
  ) => {
    const {locked} = useAuthGate();

    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(muted);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const [showControlsState, setShowControlsState] = React.useState(false);
    const [showPlayPauseOverlay, setShowPlayPauseOverlay] =
      React.useState(false);
    const [isBuffering, setIsBuffering] = React.useState(false);

    const [isScrubbing, setIsScrubbing] = React.useState(false);
    const [hoverTime, setHoverTime] = React.useState<number | null>(null);
    const [hoverPercent, setHoverPercent] = React.useState(0);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const progressContainerRef = React.useRef<HTMLDivElement>(null);
    const animationFrameRef = React.useRef<number | null>(null);
    const playPauseOverlayTimeoutRef = React.useRef<NodeJS.Timeout | null>(
      null,
    );
    const hasUserInteractedRef = React.useRef(false);
    const wantsUnmutedRef = React.useRef(false);
    const lastReportedDurationRef = React.useRef<number>(0);
    const bufferingTimeoutRef = React.useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

    React.useImperativeHandle(ref, () => videoRef.current!, []);

    const formatTime = (time: number) => {
      const safeTime = Math.max(0, time || 0);
      const minutes = Math.floor(safeTime / 60);
      const seconds = Math.floor(safeTime % 60);
      const hundredths = Math.floor((safeTime % 1) * 100);

      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}:${hundredths.toString().padStart(2, "0")}`;
    };

    const showOverlayBriefly = React.useCallback(() => {
      setShowPlayPauseOverlay(true);

      if (playPauseOverlayTimeoutRef.current) {
        clearTimeout(playPauseOverlayTimeoutRef.current);
      }

      playPauseOverlayTimeoutRef.current = setTimeout(() => {
        setShowPlayPauseOverlay(false);
      }, 750);
    }, []);

    const stopProgressLoop = React.useCallback(() => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }, []);

    const startProgressLoop = React.useCallback(() => {
      stopProgressLoop();

      const tick = () => {
        const video = videoRef.current;
        if (!video) return;

        setCurrentTime(video.currentTime || 0);

        const actuallyPlaying =
          !video.paused && !video.ended && video.readyState > 1;

        if (actuallyPlaying) {
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    }, [videoRef, setCurrentTime, stopProgressLoop]);

    const syncUiFromVideo = React.useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      const actuallyPlaying =
        !video.paused && !video.ended && video.readyState > 1;

      setIsPlaying(actuallyPlaying);
      setCurrentTime(video.currentTime || 0);
      const d = video.duration;
      const nextDuration = Number.isFinite(d) && d > 0 ? d : 0;
      setDuration(nextDuration);
      if (
        Number.isFinite(d) &&
        d > 0 &&
        d !== lastReportedDurationRef.current
      ) {
        lastReportedDurationRef.current = d;
        onDurationChange?.(d);
      }
      setVolume(video.volume);
      setIsMuted(video.muted);
    }, [videoRef, setCurrentTime, onDurationChange]);

    const syncTimeFromVideo = React.useCallback(() => {
      const video = videoRef.current;
      if (!video) return;
      setCurrentTime(video.currentTime || 0);
    }, [videoRef, setCurrentTime]);

    const hardResync = React.useCallback(() => {
      syncUiFromVideo();
      const video = videoRef.current;
      if (!video) {
        stopProgressLoop();
        return;
      }
      const actuallyPlaying =
        !video.paused && !video.ended && video.readyState > 1;
      if (actuallyPlaying) {
        startProgressLoop();
      } else {
        stopProgressLoop();
      }
    }, [syncUiFromVideo, videoRef, startProgressLoop, stopProgressLoop]);

    const registerUserInteraction = React.useCallback(() => {
      hasUserInteractedRef.current = true;
    }, []);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        void video.play();
      } else {
        video.pause();
      }
    };

    const handleVideoClick = () => {
      registerUserInteraction();
      togglePlay();
    };

    const toggleMute = () => {
      const video = videoRef.current;
      if (!video) return;

      registerUserInteraction();

      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);

      wantsUnmutedRef.current = !nextMuted;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;

      registerUserInteraction();

      const newVolume = parseFloat(e.target.value);
      video.volume = newVolume;

      const nextMuted = newVolume === 0;
      video.muted = nextMuted;

      setVolume(newVolume);
      setIsMuted(nextMuted);

      wantsUnmutedRef.current = !nextMuted;
    };

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const seekToTime = (time: number) => {
      const nextTime = clamp(Math.round(time / 0.01) * 0.01, 0, duration);

      setCurrentTime(nextTime);
      if (videoRef.current) {
        videoRef.current.currentTime = nextTime;
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      registerUserInteraction();
      const newTime = parseFloat(e.target.value);
      seekToTime(newTime);
    };

    const getTimeFromClientX = (clientX: number) => {
      const el = progressContainerRef.current;
      if (!el || duration <= 0) {
        return {time: 0, percent: 0};
      }

      const rect = el.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const percent = rect.width > 0 ? x / rect.width : 0;

      const rawTime = percent * duration;
      const snappedTime = Math.round(rawTime / 0.01) * 0.01;

      return {
        time: clamp(snappedTime, 0, duration),
        percent: percent * 100,
      };
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
      const {time, percent} = getTimeFromClientX(e.clientX);
      setHoverTime(time);
      setHoverPercent(percent);
    };

    const handleProgressLeave = () => {
      setHoverTime(null);
      setIsScrubbing(false);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      registerUserInteraction();
      const {time} = getTimeFromClientX(e.clientX);
      seekToTime(time);
    };

    const skip = (seconds: number) => {
      registerUserInteraction();
      if (!videoRef.current) return;

      const nextTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seekToTime(nextTime);
    };

    const handleMouseEnter = () => {
      setShowControlsState(true);
    };

    const handleMouseMove = () => {
      setShowControlsState(true);
    };

    const handleMouseLeave = () => {
      if (autoHide) {
        setShowControlsState(false);
      }
    };

    const toggleFullscreen = async () => {
      const container = containerRef.current as
        | (HTMLDivElement & {
            webkitRequestFullscreen?: () => Promise<void> | void;
          })
        | null;

      const video = videoRef.current as
        | (HTMLVideoElement & {
            webkitEnterFullscreen?: () => void;
            webkitExitFullscreen?: () => void;
            webkitDisplayingFullscreen?: boolean;
          })
        | null;

      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => Promise<void> | void;
      };

      const isNativeFullscreen =
        !!document.fullscreenElement || !!doc.webkitFullscreenElement;

      const isVideoFullscreen = !!video?.webkitDisplayingFullscreen;

      try {
        if (isNativeFullscreen) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
          }
          setIsFullscreen(false);
          return;
        }

        if (isVideoFullscreen) {
          video?.webkitExitFullscreen?.();
          setIsFullscreen(false);
          return;
        }

        if (container?.requestFullscreen) {
          await container.requestFullscreen();
          setIsFullscreen(true);
          return;
        }

        if (container?.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
          setIsFullscreen(true);
          return;
        }

        if (video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.error("Fullscreen failed", error);
      }
    };

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const showBuffering = () => {
        if (bufferingTimeoutRef.current) return;
        bufferingTimeoutRef.current = setTimeout(() => {
          setIsBuffering(true);
          bufferingTimeoutRef.current = null;
        }, 120);
      };

      const hideBuffering = () => {
        if (bufferingTimeoutRef.current) {
          clearTimeout(bufferingTimeoutRef.current);
          bufferingTimeoutRef.current = null;
        }
        setIsBuffering(false);
      };

      const handlePlay = () => {
        showOverlayBriefly();
        hardResync();
      };

      const handlePause = () => {
        hideBuffering();
        setShowControlsState(true);
        showOverlayBriefly();
        hardResync();
      };

      const handleCanPlay = () => {
        hideBuffering();
        hardResync();
      };

      const handlePlaying = () => {
        hideBuffering();
        hardResync();
      };

      const handleWaiting = () => {
        showBuffering();
        hardResync();
      };

      const handleSeeking = () => {
        showBuffering();
        hardResync();
      };

      const syncEvents = [
        "loadedmetadata",
        "durationchange",
        "seeked",
        "ended",
        "ratechange",
        "volumechange",
      ] as const;

      syncEvents.forEach((eventName) => {
        video.addEventListener(eventName, hardResync);
      });

      video.addEventListener("timeupdate", syncTimeFromVideo);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("playing", handlePlaying);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("seeking", handleSeeking);

      hardResync();

      return () => {
        syncEvents.forEach((eventName) => {
          video.removeEventListener(eventName, hardResync);
        });
        video.removeEventListener("timeupdate", syncTimeFromVideo);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("seeking", handleSeeking);
        stopProgressLoop();
        hideBuffering();

        if (playPauseOverlayTimeoutRef.current) {
          clearTimeout(playPauseOverlayTimeoutRef.current);
        }
      };
    }, [
      videoRef,
      hardResync,
      showOverlayBriefly,
      stopProgressLoop,
      syncTimeFromVideo,
    ]);

    React.useEffect(() => {
      const handleVisibilityOrFocus = () => {
        hardResync();
      };

      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
      window.addEventListener("focus", handleVisibilityOrFocus);
      window.addEventListener("pageshow", handleVisibilityOrFocus);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityOrFocus,
        );
        window.removeEventListener("focus", handleVisibilityOrFocus);
        window.removeEventListener("pageshow", handleVisibilityOrFocus);
      };
    }, [hardResync]);

    React.useEffect(() => {
      setIsMuted(muted);
      wantsUnmutedRef.current = !muted;
    }, [muted]);

    React.useEffect(() => {
      lastReportedDurationRef.current = 0;
    }, [src]);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video || !autoPlay || locked) return;

      const tryPlay = () => {
        void video.play().catch(() => {});
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        tryPlay();
      } else {
        video.addEventListener("canplay", tryPlay, {once: true});
        return () => video.removeEventListener("canplay", tryPlay);
      }
    }, [src, autoPlay, locked, videoRef]);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      if (locked) {
        video.pause();
        return;
      }

      if (autoPlay) {
        void video.play().catch(() => {});
      }
    }, [locked, autoPlay, videoRef]);

    React.useEffect(() => {
      const video = videoRef.current as
        | (HTMLVideoElement & {webkitDisplayingFullscreen?: boolean})
        | null;

      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };

      const syncFullscreenState = () => {
        const nativeFullscreen =
          !!document.fullscreenElement || !!doc.webkitFullscreenElement;
        const videoFullscreen = !!video?.webkitDisplayingFullscreen;
        setIsFullscreen(nativeFullscreen || videoFullscreen);
      };

      document.addEventListener("fullscreenchange", syncFullscreenState);
      document.addEventListener(
        "webkitfullscreenchange",
        syncFullscreenState as EventListener,
      );
      video?.addEventListener(
        "webkitbeginfullscreen",
        syncFullscreenState as EventListener,
      );
      video?.addEventListener(
        "webkitendfullscreen",
        syncFullscreenState as EventListener,
      );

      return () => {
        document.removeEventListener("fullscreenchange", syncFullscreenState);
        document.removeEventListener(
          "webkitfullscreenchange",
          syncFullscreenState as EventListener,
        );
        video?.removeEventListener(
          "webkitbeginfullscreen",
          syncFullscreenState as EventListener,
        );
        video?.removeEventListener(
          "webkitendfullscreen",
          syncFullscreenState as EventListener,
        );
      };
    }, [videoRef]);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!containerRef.current?.contains(document.activeElement)) return;

        switch (e.key) {
          case " ":
          case "k":
            e.preventDefault();
            togglePlay();
            break;
          case "m":
            e.preventDefault();
            toggleMute();
            break;
          case "f":
            e.preventDefault();
            void toggleFullscreen();
            break;
          case "ArrowLeft":
            e.preventDefault();
            skip(-10);
            break;
          case "ArrowRight":
            e.preventDefault();
            skip(10);
            break;
          case "ArrowUp":
            e.preventDefault();
            if (videoRef.current) {
              const v = videoRef.current;
              const nextVolume = Math.min(1, v.volume + 0.1);
              v.volume = nextVolume;
              v.muted = nextVolume === 0;
              setVolume(nextVolume);
              setIsMuted(nextVolume === 0);
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            if (videoRef.current) {
              const v = videoRef.current;
              const nextVolume = Math.max(0, v.volume - 0.1);
              v.volume = nextVolume;
              v.muted = nextVolume === 0;
              setVolume(nextVolume);
              setIsMuted(nextVolume === 0);
            }
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentTime, duration, isPlaying]);

    const progressPercent =
      duration > 0
        ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
        : 0;

    const hoverSpriteData = React.useMemo(() => {
      if (
        hoverTime === null ||
        !videoSprite ||
        !videoSpriteFrameWidth ||
        !videoSpriteFrameHeight ||
        !videoSpriteColumns
      ) {
        return null;
      }

      const interval = videoSpriteInterval || 0.1;
      const rawFrameIndex = Math.floor(hoverTime / interval);

      const maxFrameIndex =
        typeof videoSpriteFrameCount === "number" && videoSpriteFrameCount > 0
          ? videoSpriteFrameCount - 1
          : rawFrameIndex;

      const frameIndex = Math.max(0, Math.min(rawFrameIndex, maxFrameIndex));

      const col = frameIndex % videoSpriteColumns;
      const row = Math.floor(frameIndex / videoSpriteColumns);

      return {
        frameIndex,
        x: col * videoSpriteFrameWidth,
        y: row * videoSpriteFrameHeight,
        width: videoSpriteFrameWidth,
        height: videoSpriteFrameHeight,
        backgroundSize: `${videoSpriteColumns * videoSpriteFrameWidth}px auto`,
      };
    }, [
      hoverTime,
      videoSprite,
      videoSpriteInterval,
      videoSpriteColumns,
      videoSpriteFrameWidth,
      videoSpriteFrameHeight,
      videoSpriteFrameCount,
    ]);

    const hoverPreviewLeftPx = React.useMemo(() => {
      const el = progressContainerRef.current;
      const previewWidth = hoverSpriteData?.width ?? 160;
      if (!el) return null;

      const trackWidth = el.clientWidth;
      const rawLeft = (hoverPercent / 100) * trackWidth;
      const clampedLeft = Math.max(
        previewWidth / 2,
        Math.min(trackWidth - previewWidth / 2, rawLeft),
      );

      return clampedLeft;
    }, [hoverPercent, hoverSpriteData]);

    return (
      <div
        ref={containerRef}
        className={cn(videoPlayerVariants({size}), className)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          playsInline={playsInline}
          muted={isMuted}
          className="w-full h-full object-cover lg:rounded-[12px]"
          onClick={handleVideoClick}
          crossOrigin="anonymous"
          {...props}
        />

        {isBuffering && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <LoaderCircleIcon
              className="w-20 h-20 animate-spin text-white"
              aria-hidden
            />
          </div>
        )}

        {showControls && (
          <>
            {/* Play/Pause overlay: only briefly on state change */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                showPlayPauseOverlay ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="w-28 h-28 rounded-full bg-black/40  flex items-center justify-center text-white">
                {isPlaying ? (
                  <Play className="w-16 h-16 fill-white" />
                ) : (
                  <Pause className="w-16 h-16 fill-white" />
                )}
              </div>
            </div>

            {/* Controls bar: hover in, hide on leave */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none",
                showControlsState ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="p-4 space-y-3 pointer-events-auto">
                <div className="flex items-center gap-2 text-white text-sm">
                  <div
                    ref={progressContainerRef}
                    className="flex-1 relative group/progress h-6 flex items-center"
                    onMouseMove={handleProgressHover}
                    onMouseLeave={handleProgressLeave}
                    onClick={handleProgressClick}
                  >
                    {hoverTime !== null && !isScrubbing && (
                      <>
                        <div
                          className="absolute bottom-full mb-2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2"
                          style={{left: hoverPreviewLeftPx ?? 0}}
                        >
                          {hoverSpriteData && (
                            <div
                              className="overflow-hidden   rounded-[12px]  shadow-lg"
                              style={{
                                width: hoverSpriteData.width,
                                height: hoverSpriteData.height,
                              }}
                            >
                              <div
                                style={{
                                  width: hoverSpriteData.width,
                                  height: hoverSpriteData.height,
                                  backgroundImage: `url(${videoSprite})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: `-${hoverSpriteData.x}px -${hoverSpriteData.y}px`,
                                  backgroundSize:
                                    hoverSpriteData.backgroundSize,
                                }}
                              />
                            </div>
                          )}

                          <div className="rounded bg-black/40 px-2 py-1 text-[11px] font-mono text-white whitespace-nowrap">
                            {formatTime(hoverTime)}
                          </div>
                        </div>

                        <div
                          className="absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none"
                          style={{left: `${hoverPercent}%`}}
                        />
                      </>
                    )}

                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.01}
                      value={currentTime}
                      onMouseDown={() => setIsScrubbing(true)}
                      onMouseUp={() => setIsScrubbing(false)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSeek(e);
                      }}
                      className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-sm
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-200
                        group-hover/progress:[&::-webkit-slider-thumb]:scale-125"
                      style={{
                        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%, rgba(255,255,255,0.3) 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        skip(-10);
                      }}
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        registerUserInteraction();
                        togglePlay();
                      }}
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 " />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        skip(10);
                      }}
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 group/volume">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <div className="w-0 mb-1 group-hover/volume:w-20 transition-all duration-200 overflow-hidden">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleVolumeChange(e);
                          }}
                          className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-2
                          [&::-webkit-slider-thumb]:h-2
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                              (isMuted ? 0 : volume) * 100
                            }%, rgba(255,255,255,0.3) ${
                              (isMuted ? 0 : volume) * 100
                            }%, rgba(255,255,255,0.3) 100%)`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="min-w-0 text-xs font-mono font-bold mt-1">
                        {formatTime(currentTime)}
                      </span>

                      <span className="min-w-0 text-xs font-mono mt-1">
                        / {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        registerUserInteraction();
                        void toggleFullscreen();
                      }}
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4" />
                      ) : (
                        <Maximize className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);

VideoPlayer.displayName = "VideoPlayer";

export {VideoPlayer, videoPlayerVariants};
