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
import VideoPlayer from "@/components/ui/video-player";
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
        {videoUrl && <VideoPlayer videoUrl={videoUrl} title={"teecard"} />}

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
