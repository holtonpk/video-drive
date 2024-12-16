"use client";

import React, {useEffect} from "react";
import {clients} from "@/config/data";
import {ADMIN_USERS, EDITORS, Post, VideoData} from "@/config/data";

import {CreateVideo} from "./components/create-videos";
import {WeeksDisplay} from "./components/weeks-display";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {VideoDisplay} from "./components/video-display";
import {ScrollArea} from "@/components/ui/scroll-area";

const ClientPage = ({client}: {client: string}) => {
  const clientInfo = clients.find((c: any) => c.value === client);
  const [totalVideos, setTotalVideos] = React.useState<number>(0);

  const [currentVideoNumber, setCurrentVideoNumber] = React.useState<number>(0);

  const [displayedVideo, setDisplayedVideo] = React.useState<
    VideoData | undefined
  >();

  return (
    <>
      {clientInfo ? (
        <div className={displayedVideo ? `grid grid-cols-[60%_1fr]` : ""}>
          <ScrollArea className=" flex flex-col w-full gap-4  relative h-[calc(100vh-64px)]  overflow-scroll pt-20 ">
            <div className="max-w-full w-full absolute top-0 h-16  z-20 flex justify-between container">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 text-primary  w-fit justify-center ">
                  {clientInfo.icon && (
                    <clientInfo.icon className="h-10 w-10 rounded-lg" />
                  )}
                  <span className="font-bold text-4xl">
                    {clientInfo?.label}
                  </span>
                </div>
                <span className="text-primary mt-2">
                  Total Videos: {totalVideos.toString()}
                </span>
              </div>
              <CreateVideo
                clientInfo={clientInfo}
                totalVideos={currentVideoNumber}
              />
            </div>
            <WeeksDisplay
              clientInfo={clientInfo}
              setTotalVideos={setTotalVideos}
              setCurrentVideoNumber={setCurrentVideoNumber}
              setDisplayedVideo={setDisplayedVideo}
              displayedVideo={displayedVideo}
            />
          </ScrollArea>
          {displayedVideo && (
            <VideoDisplay
              video={displayedVideo}
              setDisplayedVideo={setDisplayedVideo}
            />
          )}
        </div>
      ) : (
        <>Not found</>
      )}
    </>
  );
};

export default ClientPage;
