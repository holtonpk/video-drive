"use client";
import React from "react";
import {clients, VideoData} from "@/config/data";

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
