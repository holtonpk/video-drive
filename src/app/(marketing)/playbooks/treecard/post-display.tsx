import {formatNumber} from "./instagram/instagram";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {InstagramLogo, TiktokLogo} from "@/components/icons";
import {LinkButton} from "@/components/ui/link";
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

const PostDisplay = ({
  videoUrl,
  onClose,
  caption,
  likes,
  views,
  comments,
  shares,
  postDate,
  type,
  postUrl,
}: {
  videoUrl?: string;
  onClose: () => void;
  caption: string;
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  postDate: string;
  type: "instagram" | "tiktok";
  postUrl: string;
}) => {
  return (
    <div className="fixed inset-0  flex items-center justify-center z-40">
      <button
        className="w-screen h-screen left-0 top-0 bg-black/50 absolute z-20"
        onClick={onClose}
      ></button>
      <div className="bg-white rounded-md p-4 absolute top-1/2 left-1/2 max-h-full overflow-scroll w-[80%] md:max-w-[800px]  -translate-x-1/2 -translate-y-1/2 z-30 grid md:grid-cols-2 gap-4 items-center">
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}

        <div className="flex flex-col gap-2 text-black">
          <h1 className="text-sm text-gray-500">
            {/* format this as Jun 12th, 2024 20 days ago */}
            Posted:{" "}
            {new Date(postDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h1>
          <h1 className="max-h-[300px] overflow-y-scroll border rounded-md p-2">
            {caption}
          </h1>
          <div className="flex gap-2">
            {likes && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <HeartIcon className="w-4 h-4" />
                {formatNumber(likes)}
              </p>
            )}
            {views && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                {formatNumber(views)}
              </p>
            )}
            {comments && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MessageCircleIcon className="w-4 h-4" />
                {formatNumber(comments)}
              </p>
            )}
            {shares && (
              <p className="text-sm text-gray-500">
                {formatNumber(shares)} shares
              </p>
            )}
          </div>
        </div>
        <LinkButton
          variant="outline"
          className="w-full text-black"
          href={postUrl}
          target="_blank"
        >
          Open in{" "}
          {type === "instagram" ? (
            <InstagramLogo className="w-6 h-6" />
          ) : (
            <TiktokLogo className="w-6 h-6" />
          )}
        </LinkButton>
      </div>
    </div>
  );
};

export default PostDisplay;

const VideoPlayer = ({
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
      const url = video.src;
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      a.click();
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
        // Create a temporary video element that we can control
        const tempVideo = document.createElement("video");
        tempVideo.src = videoUrl;
        tempVideo.crossOrigin = "anonymous";

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
          link.download = `frame-${videoRef.current.currentTime}-screenshot.png`;
          link.href = dataURL;
          link.click();
        } catch (e) {
          // If canvas export fails, show instructions
          console.log("Canvas export failed, showing instructions");
          setShowScreenshotInstructions(true);
        }
      } catch (e) {
        console.error("Screenshot error:", e);
        setShowScreenshotInstructions(true);
      }
    }
  };

  return (
    <div className={cn("relative  group", isPlaying && "w-full", className)}>
      <div className="relative rounded-t-md overflow-hidden">
        {!isPlaying ? (
          <button
            className="absolute top-0 left-0 h-full w-full z-30 flex items-center justify-center bg-black/20  blurBack"
            onClick={handlePlay}
          >
            <PlayIcon className="w-16 h-16 fill-white" />
          </button>
        ) : (
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full z-30 "
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
                className="bg-white text-black px-4 py-2 rounded"
                onClick={() => window.open(videoUrl, "_blank")}
              >
                Open in New Tab
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
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
                  className=" p-2 rounded-full bg-black/20 blurBack hidden group-hover:block"
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
                  className=" p-2 rounded-full bg-black/20 blurBack hidden group-hover:block"
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
                  className=" p-2 rounded-full bg-black/20 blurBack hidden group-hover:block"
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
                  className=" p-2 rounded-full bg-black/20 blurBack hidden group-hover:block"
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
          className="w-full absolute top-0 left-0 z-20"
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
        className="relative w-full h-2 bg-gray-200 rounded-md cursor-pointer"
        onClick={handleSeek}
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="h-full bg-[#00AE70] rounded-r-full"
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
