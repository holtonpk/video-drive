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
  Settings,
} from "lucide-react";
import {useAuthGate} from "../auth-gate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
} from "lucide-react";

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

export interface VideoPlayerProps
  extends
    React.VideoHTMLAttributes<HTMLVideoElement>,
    VariantProps<typeof videoPlayerVariants> {
  src: string;
  poster?: string;
  showControls?: boolean;
  autoHide?: boolean;
  className?: string;
  name: string;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      className,
      size,
      src,
      poster,
      name,
      showControls = true,
      autoHide = true,
      /** Muted by default so autoplay works under browser policies (user can unmute). */
      autoPlay = true,
      playsInline = true,
      muted = false,

      ...props
    },
    ref,
  ) => {
    const {locked} = useAuthGate();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(muted);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [showControlsState, setShowControlsState] = React.useState(true);

    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hideControlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = React.useRef<number | null>(null);

    React.useImperativeHandle(ref, () => videoRef.current!, []);

    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      setCurrentTime(newTime);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
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
        // Exit fullscreen first
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

        // Enter fullscreen
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

        // iPhone Safari fallback: fullscreen the <video> itself
        if (video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
          setIsFullscreen(true);
          return;
        }
      } catch (error) {
        console.error("Fullscreen failed", error);
      }
    };

    const skip = (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(
          0,
          Math.min(duration, currentTime + seconds),
        );
      }
    };

    const resetHideControlsTimeout = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }

      if (autoHide && isPlaying) {
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControlsState(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => {
      setShowControlsState(true);
      resetHideControlsTimeout();
    };

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        resetHideControlsTimeout();
      };

      const handlePause = () => {
        setIsPlaying(false);
        setShowControlsState(true);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      };

      const handleVolumeChange = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("volumechange", handleVolumeChange);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("volumechange", handleVolumeChange);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      };
    }, [autoHide, isPlaying]);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const updateProgress = () => {
        setCurrentTime(video.currentTime);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      };

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [isPlaying]);

    React.useEffect(() => {
      setIsMuted(muted);
    }, [muted]);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video || !autoPlay || locked) return;

      const tryPlay = () => {
        void video.play().catch(() => {
          /* Blocked by policy or not ready yet */
        });
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        tryPlay();
      } else {
        video.addEventListener("canplay", tryPlay, {once: true});
        return () => video.removeEventListener("canplay", tryPlay);
      }
    }, [src, autoPlay, locked]);

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
    }, [locked, autoPlay]);

    React.useEffect(() => {
      const video = videoRef.current as
        | (HTMLVideoElement & {
            webkitDisplayingFullscreen?: boolean;
          })
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
    }, []);

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
            toggleFullscreen();
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
    }, [currentTime, duration]);

    const progressPercent =
      duration > 0
        ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
        : 0;

    const handleScreenshot = () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        // Check if the video has crossOrigin attribute set
        if (!video.crossOrigin) {
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Try to get the data URL
        try {
          const dataURL = canvas.toDataURL("image/png");

          // Create a download link
          const link = document.createElement("a");
          const cleanName = formatName(name);
          const timestamp = formatTimestamp(video.currentTime);
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

    const handleDownload = async () => {
      setIsDownloading(true);
      const video = videoRef.current;
      if (video) {
        try {
          const response = await fetch(src);
          if (!response.ok) {
            throw new Error(
              `Network response was not ok, status: ${response.status}`,
            );
          }
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          const cleanName = formatName(name);
          a.download = `${cleanName}-launch-video.mp4`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
          a.remove();
        } catch (error) {
          console.error("Download error:", error);
          // Fallback: open in new tab
          window.open(src, "_blank");
        }
      }
      setIsDownloading(false);
    };

    return (
      <div
        ref={containerRef}
        className={cn(videoPlayerVariants({size}), className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() =>
          autoHide && isPlaying && setShowControlsState(false)
        }
        tabIndex={0}
      >
        {" "}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          playsInline={playsInline}
          muted={isMuted}
          className="w-full h-full object-cover rounded-[12px]"
          onClick={togglePlay}
          crossOrigin="anonymous"
          {...props}
        />
        {showControls && (
          <>
            {/* Play/Pause Overlay - Only visible when not playing or on hover */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                !isPlaying || showControlsState ? "opacity-100" : "opacity-0",
              )}
            >
              {" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 pointer-events-auto"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 ml-0.5" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
            </div>

            {/* Controls Bar */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                "transition-opacity duration-300 pointer-events-none",
                showControlsState ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="p-4 space-y-3 pointer-events-auto">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <span className="min-w-0 text-xs font-mono mt-1">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 relative group/progress ">
                    {" "}
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSeek(e);
                      }}
                      className="w-full h-1  bg-white/30 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                        group-hover/progress:[&::-webkit-slider-thumb]:scale-125"
                      style={{
                        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%, rgba(255,255,255,0.3) 100%)`,
                      }}
                    />
                  </div>
                  <span className="min-w-0 text-xs font-mono mt-1">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {" "}
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
                        togglePlay();
                      }}
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>{" "}
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
                      {" "}
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
                      <div className="w-0 group-hover/volume:w-20 transition-all duration-200 overflow-hidden">
                        {" "}
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
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
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
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                      onClick={handleScreenshot}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-white hover:bg-white/20 rounded-[8px] transition-colors"
                      onClick={handleDownload}
                    >
                      {isDownloading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <DownloadIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
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
