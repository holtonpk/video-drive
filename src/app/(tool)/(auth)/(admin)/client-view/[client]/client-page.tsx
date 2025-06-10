"use client";

import React, {useEffect} from "react";
import {clients} from "@/config/data";
import {ADMIN_USERS, EDITORS, Post, VideoData} from "@/config/data";

import {CreateVideo} from "./components/create-videos/create-videos";
import {WeeksDisplay} from "./components/weeks-display2";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {VideoDisplay} from "./components/video-display";
import {ScrollArea} from "@/components/ui/scroll-area";
import ExportData from "./components/export";
import VectorizeData from "./components/vectorize-data";
import {Button} from "@/components/ui/button";
import {FeedPreview} from "./components/feed-preview";

const ClientPage = ({client}: {client: string}) => {
  const clientInfo = clients.find((c: any) => c.value === client);
  const [totalVideos, setTotalVideos] = React.useState<number>(1);

  const [currentVideoNumber, setCurrentVideoNumber] = React.useState<
    number | undefined
  >(undefined);

  const [displayedVideo, setDisplayedVideo] = React.useState<
    VideoData | undefined
  >();

  const [view, setView] = React.useState<"week" | "feed">("week");

  return (
    <>
      {clientInfo ? (
        <div className={displayedVideo ? `grid md:grid-cols-[60%_1fr]` : ""}>
          <ScrollArea className=" flex flex-col w-full gap-4  relative h-[calc(100vh-64px)]  overflow-scroll pt-20 ">
            <div className="max-w-full w-full absolute top-0 h-16  z-20 flex justify-between container">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 text-primary  w-fit justify-center ">
                  {clientInfo.icon && (
                    <clientInfo.icon className="h-10 w-10 rounded-lg" />
                  )}
                  <span
                    className={`font-bold transition-all duration-300
                    ${displayedVideo ? "text-xl" : "text-4xl"}
                    `}
                  >
                    {clientInfo?.label}
                  </span>
                </div>
                {!displayedVideo && (
                  <span className="text-primary mt-2">
                    Total Videos: {totalVideos.toString()}
                  </span>
                )}
              </div>
              {/* <VectorizeData clientInfo={clientInfo} />
              <ExportData clientInfo={clientInfo} /> */}
              <div className="flex w-fit bg-card p-1 rounded-md border h-fit ml-auto mr-4">
                <button
                  onClick={() => setView("week")}
                  className={`text-primary px-4 py-1 rounded-md h-fit ${
                    view === "week"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                >
                  Week View
                </button>
                <button
                  onClick={() => setView("feed")}
                  className={`text-primary px-4 py-1 rounded-md h-fit ${
                    view === "feed"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                >
                  Feed Preview
                </button>
              </div>
              {currentVideoNumber && (
                <CreateVideo
                  clientInfo={clientInfo}
                  currentVideoNumber={currentVideoNumber}
                />
              )}
            </div>

            {view === "week" && (
              <WeeksDisplay
                clientInfo={clientInfo}
                setTotalVideos={setTotalVideos}
                setCurrentVideoNumber={setCurrentVideoNumber}
                setDisplayedVideo={setDisplayedVideo}
                displayedVideo={displayedVideo}
              />
            )}

            {view === "feed" && (
              <FeedPreview
                clientInfo={clientInfo}
                displayedVideo={displayedVideo}
                setDisplayedVideo={setDisplayedVideo}
              />
            )}
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
