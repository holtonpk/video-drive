"use client";

import React from "react";
import localFont from "next/font/local";
import {VideoPlayer} from "./video-player";

const h2Font = localFont({src: "../fonts/HeadingNowTrial-55Medium.ttf"});
const bodyFont = localFont({src: "../fonts/proximanova_light.otf"});
const bodyBoldFont = localFont({src: "../fonts/proximanova_bold.otf"});

const accentMap: Record<string, string> = {
  color1: "bg-theme-color1",
  color2: "bg-theme-color2",
  color3: "bg-theme-color3",
};

type PortfolioItem = {
  title: string;
  subtitle: string;
  videoSrc: string;
  thumbnail?: string;
  accent: string;
};

export const PortfolioCard = ({item}: {item: PortfolioItem}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = React.useState(0);

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "-")}-thumbnail.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative aspect-video">
        {item.videoSrc ? (
          <VideoPlayer
            src={item.videoSrc}
            poster={item.thumbnail}
            name={item.title}
            videoRef={videoRef}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            size="full"
            autoPlay={false}
            muted={false}
            className="absolute inset-0 h-full rounded-[12px] shadow-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-2xl bg-[#f0f0f0]">
            <span className={`text-sm text-[#121212]/30 ${bodyFont.className}`}>
              Video coming soon
            </span>
          </div>
        )}
        <div
          className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs text-[#121212] ${accentMap[item.accent]} ${bodyBoldFont.className}`}
        >
          {item.subtitle}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <h2
              className={`text-2xl sm:text-3xl uppercase text-[#121212] ${h2Font.className}`}
            >
              {item.title}
            </h2>
          </div>
          <div
            className={`w-8 h-0.5 rounded-full ${accentMap[item.accent]} mt-1`}
          />
        </div>

        {/* <button
          onClick={captureFrame}
          className={`text-xs px-3 py-1.5 rounded-[8px] border border-[#121212]/20 text-[#121212]/50 hover:border-[#121212]/40 hover:text-[#121212]/80 transition-colors whitespace-nowrap ${bodyFont.className}`}
        >
          Capture frame
        </button> */}
      </div>
    </div>
  );
};
