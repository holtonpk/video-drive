"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {Button} from "@/components/ui/button";
import {Play, Pause, Volume2, Volume1, VolumeX} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {useRef, useState, useEffect} from "react";
import {cn} from "@/lib/utils";
import {VolumeOff} from "@/components/icons";
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

const VideoPlayer2 = ({
  videoUrl,
  className,
}: {
  videoUrl: string;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  const [progress, setProgress] = useState(0);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<string>("");

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const seekPercentage = clickPosition / rect.width;
      const newTime = videoRef.current.duration * seekPercentage;
      videoRef.current.currentTime = newTime;
      setProgress(seekPercentage * 100);
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const hoverPosition = e.clientX - rect.left;
      const hoverPercentage = hoverPosition / rect.width;
      const hoverTimeInSeconds = videoRef.current.duration * hoverPercentage;
      setHoverPosition(hoverPosition);
      setHoverTime(formatTime(hoverTimeInSeconds));
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime("");
  };

  useEffect(() => {
    videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const [isMuted, setIsMuted] = useState(false);

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleDownload = () => {
    const video = videoRef.current;
    if (video) {
      try {
        // Try to get the direct source URL
        const url = video.src;

        // Check if we have a valid URL
        if (!url || url === window.location.href) {
          // If no direct URL, try to get the video URL from the component props
          if (videoUrl) {
            // Create a download link with the video URL
            const a = document.createElement("a");
            a.href = videoUrl;
            a.download = "video.mp4";
            a.target = "_blank"; // Open in new tab as fallback
            a.click();
            return;
          }

          // If we still don't have a URL, show an error message
          alert(
            "Unable to download video. Please try opening the video in a new tab and download from there."
          );
          return;
        }

        // If we have a direct URL, try to download it
        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        a.target = "_blank"; // Open in new tab as fallback
        a.click();
      } catch (error) {
        console.error("Download error:", error);
        // Fallback: open in new tab
        window.open(videoUrl, "_blank");
      }
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const [showScreenshotInstructions, setShowScreenshotInstructions] =
    useState(false);

  const handleScreenshot = () => {
    if (videoRef.current) {
      try {
        // Check if the video has crossOrigin attribute set
        if (!videoRef.current.crossOrigin) {
          console.log(
            "Video doesn't have crossOrigin attribute set, showing instructions"
          );
          setShowScreenshotInstructions(true);
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
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the current frame to the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Try to get the data URL
        try {
          const dataURL = canvas.toDataURL("image/png");

          // Create a download link
          const link = document.createElement("a");
          link.download = `frame-${videoRef.current.currentTime.toFixed(
            2
          )}-screenshot.png`;
          link.href = dataURL;
          link.click();
        } catch (e) {
          // If canvas export fails, show instructions
          console.log(
            "Canvas export failed due to security restrictions. This happens when the video is from a different domain without proper CORS headers.",
            e
          );
          setShowScreenshotInstructions(true);
        }
      } catch (e) {
        console.error("Screenshot error:", e);
        setShowScreenshotInstructions(true);
      }
    }
  };

  //   when arrows are pressed, it will seek to the next or previous frame

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Assuming 30fps, each frame is 1/30th of a second
      const frameDuration = 1 / 30;

      if (e.key === "ArrowRight") {
        // Seek forward by one frame
        const newTime = Math.min(
          videoRef.current.currentTime + frameDuration,
          videoRef.current.duration
        );
        videoRef.current.currentTime = newTime;
        setProgress((newTime / videoRef.current.duration) * 100);
      }

      if (e.key === "ArrowLeft") {
        // Seek backward by one frame
        const newTime = Math.max(
          videoRef.current.currentTime - frameDuration,
          0
        );
        videoRef.current.currentTime = newTime;
        setProgress((newTime / videoRef.current.duration) * 100);
      }
    };

    // Add event listener for keyboard events
    window.addEventListener("keydown", handleArrowKeys);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative  group w-full h-full grid grid-rows-[1fr_8px]",
        className
      )}
    >
      <div className="relative rounded-t-md overflow-hidden">
        {!isPlaying ? (
          <button
            className="absolute top-0 left-0 h-full w-full z-30 flex items-center justify-center focus:outline-none"
            onClick={handlePlay}
          >
            <PlayIcon className="w-16 h-16 fill-white text-white" />
          </button>
        ) : (
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full z-30 focus:outline-none"
            onClick={handlePause}
          ></button>
        )}

        {/* Screenshot instructions overlay */}
        {showScreenshotInstructions && (
          <div className="absolute inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4 text-white">
            <h3 className="text-xl font-bold mb-4">Screenshot Instructions</h3>
            <p className="mb-4 text-center">
              Due to security restrictions, we can&apos;t take a screenshot
              directly. Please use your browser&apos;s screenshot tools:
            </p>
            <div className="flex gap-4 mb-6">
              <div className="text-center">
                <p className="font-bold">Mac</p>
                <p className="bg-gray-800 px-3 py-1 rounded">Cmd+Shift+4</p>
              </div>
              <div className="text-center">
                <p className="font-bold">Windows</p>
                <p className="bg-gray-800 px-3 py-1 rounded">Win+Shift+S</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-white text-black px-4 py-2 rounded focus:outline-none"
                onClick={() => window.open(videoUrl, "_blank")}
              >
                Open in New Tab
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded focus:outline-none"
                onClick={() => setShowScreenshotInstructions(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* add mute button */}
        <div className="flex gap-2 absolute top-2 right-2 z-40">
          {/* a button to download the video. add a tooltip to it */}
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <button
                  className=" p-2 rounded-full bg-black/20 text-white blurBack hidden group-hover:block focus:outline-none"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Download Video</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* a button to make the video full screen */}
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <button
                  className=" p-2 rounded-full bg-black/20 text-white blurBack hidden group-hover:block focus:outline-none"
                  onClick={handleFullScreen}
                >
                  <FullscreenIcon className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Full Screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* a button to take a screenshot of the current frame  */}
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <button
                  className=" p-2 rounded-full bg-black/20 text-white blurBack hidden group-hover:block focus:outline-none"
                  onClick={handleScreenshot}
                >
                  <Camera className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Screenshot Current Frame</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* a button to mute the video */}
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <button
                  className=" p-2 rounded-full bg-black/20 text-white blurBack hidden group-hover:block focus:outline-none"
                  onClick={handleMute}
                >
                  {isMuted ? (
                    <VolumeOff className="w-6 h-6" />
                  ) : (
                    <Volume2Icon className="w-6 h-6" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          crossOrigin="anonymous"
          className="w-full absolute top-0 left-0 z-20 border-none  "
          style={{
            objectFit: "cover",
          }}
        />
        <div className="w-full aspect-[9/16] animate-pulse bg-gray-200 flex items-center justify-center relative z-10">
          <Loader className="w-16 h-16 animate-spin" />
        </div>
      </div>
      {/* a bar that indicates the progress of the video. when i click on it, it will seek to the time. When i hover over it, it will show a tooltip with the frame of the specific time */}
      <div
        className="relative w-full h-2 py-[1px] bg-gray-200  cursor-pointer focus:outline-none"
        onClick={handleSeek}
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="h-full bg-green-500 rounded-r-full"
          style={{width: `${progress}%`}}
        />
        {hoverPosition !== null && (
          <div
            className="absolute bottom-full left-0 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded z-30"
            style={{left: `${hoverPosition}px`}}
          >
            {hoverTime}
          </div>
        )}
      </div>
    </div>
  );
};

// export default VideoPlayer;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{width: `${value}%`}}
        initial={{width: 0}}
        animate={{width: `${value}%`}}
        transition={{type: "spring", stiffness: 300, damping: 30}}
      />
    </motion.div>
  );
};

const VideoPlayer = ({videoUrl, title}: {videoUrl: string; title: string}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const video = videoRef.current;
    if (video) {
      try {
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = title + ".mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();
      } catch (error) {
        console.error("Download error:", error);
        // Fallback: open in new tab
        window.open(videoUrl, "_blank");
      }
    }
    setIsDownloading(false);
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const [showScreenshotInstructions, setShowScreenshotInstructions] =
    useState(false);

  const handleScreenshot = () => {
    if (videoRef.current) {
      try {
        // Check if the video has crossOrigin attribute set
        if (!videoRef.current.crossOrigin) {
          console.log(
            "Video doesn't have crossOrigin attribute set, showing instructions"
          );
          setShowScreenshotInstructions(true);
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
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the current frame to the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Try to get the data URL
        try {
          const dataURL = canvas.toDataURL("image/png");

          // Create a download link
          const link = document.createElement("a");
          link.download = `frame-${videoRef.current.currentTime.toFixed(
            2
          )}-screenshot.png`;
          link.href = dataURL;
          link.click();
        } catch (e) {
          // If canvas export fails, show instructions
          console.log(
            "Canvas export failed due to security restrictions. This happens when the video is from a different domain without proper CORS headers.",
            e
          );
          setShowScreenshotInstructions(true);
        }
      } catch (e) {
        console.error("Screenshot error:", e);
        setShowScreenshotInstructions(true);
      }
    }
  };

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Assuming 30fps, each frame is 1/30th of a second
      const frameDuration = 1 / 30;

      if (e.key === "ArrowRight") {
        // Seek forward by one frame
        const newTime = Math.min(
          videoRef.current.currentTime + frameDuration,
          videoRef.current.duration
        );
        videoRef.current.currentTime = newTime;
        setProgress((newTime / videoRef.current.duration) * 100);
      }

      if (e.key === "ArrowLeft") {
        // Seek backward by one frame
        const newTime = Math.max(
          videoRef.current.currentTime - frameDuration,
          0
        );
        videoRef.current.currentTime = newTime;
        setProgress((newTime / videoRef.current.duration) * 100);
      }
    };

    // Add event listener for keyboard events
    window.addEventListener("keydown", handleArrowKeys);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, []);

  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        src={videoUrl}
        onClick={togglePlay}
        loop
        crossOrigin="anonymous"
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="flex flex-col absolute bottom-0 mx-auto max-w-[calc(100%-40px)] left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
            initial={{y: 20, opacity: 0, filter: "blur(10px)"}}
            animate={{y: 0, opacity: 1, filter: "blur(0px)"}}
            exit={{y: 20, opacity: 0, filter: "blur(10px)"}}
            transition={{duration: 0.6, ease: "circInOut", type: "spring"}}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-sm">
                {formatTime(currentTime)}
              </span>
              <CustomSlider
                value={progress}
                onChange={handleSeek}
                className="flex-1"
              />
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
                <div className="flex items-center gap-x-1">
                  <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    <Button
                      onClick={toggleMute}
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#111111d1] hover:text-white"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : volume > 0.5 ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <Volume1 className="h-5 w-5" />
                      )}
                    </Button>
                  </motion.div>

                  <div className="w-20">
                    <CustomSlider
                      value={volume * 100}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <motion.div
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    key={speed}
                  >
                    <Button
                      onClick={() => setSpeed(speed)}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "text-white hover:bg-[#111111d1] hover:text-white",
                        playbackSpeed === speed && "bg-[#111111d1]"
                      )}
                    >
                      {speed}x
                    </Button>
                  </motion.div>
                ))}
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="flex  absolute top-0 mx-auto gap-0 w-fit left-0 right-0 p-2 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
            initial={{y: -20, opacity: 0, filter: "blur(10px)"}}
            animate={{y: 0, opacity: 1, filter: "blur(0px)"}}
            exit={{y: -20, opacity: 0, filter: "blur(10px)"}}
            transition={{duration: 0.6, ease: "circInOut", type: "spring"}}
          >
            {/* a button to download the video. add a tooltip to it */}
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white"
                    onClick={handleDownload}
                  >
                    {isDownloading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <DownloadIcon className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download Video</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* a button to make the video full screen */}
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white"
                    onClick={handleFullScreen}
                  >
                    <FullscreenIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Full Screen</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* a button to take a screenshot of the current frame  */}
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white"
                    onClick={handleScreenshot}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Screenshot Current Frame
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;
