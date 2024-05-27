"use client";
import React, {useEffect} from "react";
import Cards from "./components/stat-cards";
import {Icons} from "@/components/icons";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData} from "@/config/data";
import {formatDaynameMonthDay} from "@/lib/utils";
import {clients} from "@/config/data";
import Link from "next/link";

const EditDashboard = () => {
  const videoIds = [
    "1051",
    "1052",
    "1053",
    "1054",
    "1055",
    "1056",
    "1057",
    "1058",
    "1059",
    "1060",
    "1061",
    "1062",
    "1063",
    "1064",
    "1065",
    "1066",
    "1067",
    "1068",
    "1070",
    "1071",
    "1072",
    "1073",
  ];

  const [videoData, setVideoData] = React.useState<VideoData[] | undefined>();

  useEffect(() => {
    const fetchVideos = async () => {
      // get docs from firestore /videos/videoId

      const videos = await Promise.all(
        videoIds.map(async (videoId) => {
          const docRef = await getDoc(doc(db, `videos`, videoId));
          const docData = docRef.data();
          return docData;
        })
      );

      setVideoData(videos as VideoData[]);
    };

    fetchVideos();
  }, []);

  return (
    <div className="container h-screen overflow-hidden flex flex-col pb-10">
      {/* <Cards /> */}
      {videoData && <VideoSheet videoData={videoData} />}
    </div>
  );
};

export default EditDashboard;

const VideoSheet = ({videoData}: {videoData: VideoData[]}) => {
  const needsRevision = videoData.filter(
    (video) => video.status === "needs revision"
  );
  const todo = videoData.filter((video) => video.status === "todo");
  const completed = videoData.filter((video) => video.status === "done");

  return (
    <div className="w-full flex-grow overflow-hidden grid grid-cols-3 items-start gap-8 dark mt-6 ">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-fit w-fit p-1 bg-blue-500/20 rounded-md">
            <Icons.todo className="h-4 w-4 text-blue-500" />
          </div>
          <h1 className="text-foreground font-bold text-xl">Todo</h1>
        </div>
        <div className="border p-2 rounded-md h-full overflow-scroll">
          {todo.length && todo.length > 0 ? (
            <div className="flex flex-col gap-4">
              {todo.map((video) => {
                const client = clients.find(
                  (c: any) => c.value === video.clientId
                )!;

                return (
                  <Link
                    href={`/edit/${video.videoNumber}`}
                    key={video.videoNumber}
                    className="w-full border border-blue-500/40 p-6 rounded-md hover:bg-muted/40 cursor-pointer flex justify-between"
                  >
                    <h1 className="text-xl text-foreground">
                      #{video.videoNumber}
                    </h1>
                    <h1 className="text-lg text-foreground">
                      Due date: {formatDaynameMonthDay(video.dueDate)}
                    </h1>
                    <div
                      id="client"
                      className="w-fit flex items-center rounded-md"
                    >
                      {client.icon && (
                        <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm" />
                      )}
                      <span className="text-foreground">{client.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <h1 className="text-xl text-muted-foreground text-center h-full w-full flex justify-center items-center">
              No videos todo <br />
              you are all caught up
            </h1>
          )}
        </div>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-2 mb-2 ">
          <div className="h-fit w-fit p-1 bg-green-500/20 rounded-md">
            <Icons.todo className="h-4 w-4 text-green-500" />
          </div>
          <h1 className="text-foreground font-bold text-xl">Complete</h1>
        </div>
        <div className="border p-2 rounded-md h-full flex-grow overflow-scroll">
          {completed && completed.length > 0 ? (
            <div className="flex flex-col gap-4">
              {completed.map((video) => (
                <div
                  key={video.videoNumber}
                  className="w-full border border-green-500/40 p-6 rounded-md hover:bg-muted/40 cursor-pointer"
                >
                  <h1 className="text-xl text-foreground">
                    #{video.videoNumber}
                  </h1>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-xl text-muted-foreground text-center h-full w-full flex justify-center items-center">
              No videos completed
            </h1>
          )}
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2 ">
          <div className="h-fit w-fit p-1 bg-red-500/20 rounded-md">
            <Icons.xCircle className="h-4 w-4 text-red-500" />
          </div>
          <h1 className="text-foreground font-bold text-xl">Needs revision</h1>
        </div>
        <div className="border p-2 rounded-md h-full ">
          {needsRevision && needsRevision.length > 0 ? (
            <div className="flex flex-col gap-4">
              {needsRevision.map((video) => (
                <div
                  key={video.videoNumber}
                  className="w-full border border-red-500/40 p-6 rounded-md hover:bg-muted/40 cursor-pointer"
                >
                  <h1 className="text-xl text-foreground">
                    #{video.videoNumber}
                  </h1>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-xl text-muted-foreground text-center h-full w-full flex justify-center items-center">
              No videos need revision
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
