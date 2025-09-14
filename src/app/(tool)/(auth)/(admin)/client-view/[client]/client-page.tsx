"use client";
import React from "react";
import {clients, VideoData} from "@/config/data";
import {CreateVideo} from "./components/create-videos/create-videos";
import {WeeksDisplay} from "./components/weeks-display2";
import {VideoDisplay} from "./components/video-display";
import {ScrollArea} from "@/components/ui/scroll-area";
import ExportData from "./components/export";
import {FeedPreview} from "./components/feed-preview";
import {UnPostedDisplay} from "./components/unPosted-display";
import {CalenderView} from "./components/calender-view";

const ClientPage = ({client}: {client: string}) => {
  const clientInfo = clients.find((c: any) => c.value === client);
  const [totalVideos, setTotalVideos] = React.useState<number>(1);

  const [currentVideoNumber, setCurrentVideoNumber] = React.useState<
    number | undefined
  >(undefined);

  const [displayedVideo, setDisplayedVideo] = React.useState<
    VideoData | undefined
  >();

  const [view, setView] = React.useState<
    "week" | "feed" | "unPosted" | "calender"
  >("week");

  return <>this is client page</>;
};

export default ClientPage;
