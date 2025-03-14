"use client";
import {VideoData} from "@/config/data";

import React, {useContext, createContext, useEffect, useState} from "react";

const VideoContext = createContext<VideoContextType | null>(null);

export function useVideo() {
  return useContext(VideoContext);
}

interface Props {
  children?: React.ReactNode;
  videoData: VideoData;
}

interface VideoContextType {
  video: VideoData;
  setVideo: React.Dispatch<React.SetStateAction<VideoData>>;
}

export const VideoProvider = ({children, videoData}: Props) => {
  const [video, setVideo] = useState<VideoData>(videoData);

  useEffect(() => {
    setVideo(videoData);
  }, [videoData]);

  const values = {
    video,
    setVideo,
  };

  return (
    <VideoContext.Provider value={values}>{children}</VideoContext.Provider>
  );
};

export default VideoContext;
