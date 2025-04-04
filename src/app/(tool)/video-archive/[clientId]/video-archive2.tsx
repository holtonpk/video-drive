"use client";
import React, {useEffect} from "react";
import {VideoData} from "@/config/data";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  orderBy,
  onSnapshot,
  doc,
  Timestamp,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {formatDayMonthDay, convertTimestampToDate} from "@/lib/utils";
import {clients, UploadedVideo} from "@/config/data";
import {Icons} from "@/components/icons";

type VideoDataSmall = {
  id: number;
  title: string;
  videoNumber: string;
  videoURL?: string;
  postIds?: string[];
  status: string;
  // script: ScriptData | string;
  caption?: string;
  postDate: Timestamp;
  uploadedVideos?: UploadedVideo[];
  posted?: boolean;
  scriptReviewed?: string[];
  videoReviewed?: string[];
};

const VideoArchive = ({clientId}: {clientId: string}) => {
  const [ClientData, setClientData] = React.useState<VideoDataSmall[] | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const clientDataQuery = query(
      collection(db, "videos"),
      where("clientId", "==", clientId)
    );
    const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
      const clientDataLocal: VideoDataSmall[] = [];
      querySnapshot.forEach((doc) => {
        const videoData = doc.data() as VideoData;
        clientDataLocal.push({
          id: videoData.id,
          title: videoData.title,
          videoNumber: videoData.videoNumber,
          videoURL: videoData.videoURL,
          postIds: videoData.postIds,
          status: videoData.status,
          postDate: videoData.postDate,
          uploadedVideos: videoData.uploadedVideos,
          posted: videoData.posted,
          scriptReviewed: videoData.scriptReviewed,
          videoReviewed: videoData.videoReviewed,
        } as VideoDataSmall);
      });
      setClientData(clientDataLocal);
      // Get the earliest and latest post date in UTC
    });
    return () => unsubscribe();
  }, [clientId]);

  const clientInfo = clients.find((c: any) => c.value === clientId);

  const getWeekNumber = (date: Date, firstVideoDate: Date) => {
    const diffTime = Math.abs(date.getTime() - firstVideoDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  // this should group the videos by week starting from the earliest post date. it should start with week 1. Weeks begin on monday and end on sunday.
  const videosByWeek = ClientData?.reduce((acc, video) => {
    if (!ClientData || ClientData.length === 0) return acc;

    // Find the earliest post date
    const firstVideoDate = ClientData.reduce((earliest, current) => {
      return convertTimestampToDate(current.postDate) <
        convertTimestampToDate(earliest.postDate)
        ? current
        : earliest;
    }, ClientData[0]).postDate;

    const postDate = convertTimestampToDate(video.postDate);
    const weekNumber = getWeekNumber(
      postDate,
      convertTimestampToDate(firstVideoDate)
    );
    acc[weekNumber] = [...(acc[weekNumber] || []), video];
    return acc;
  }, {} as {[key: number]: VideoDataSmall[]});

  console.log("videosByWeek", videosByWeek);

  const getWeekRange = (weekRange: VideoDataSmall[]) => {
    // Find the earliest post date
    const firstVideoDate = weekRange.reduce((earliest, current) => {
      return convertTimestampToDate(current.postDate) <
        convertTimestampToDate(earliest.postDate)
        ? current
        : earliest;
    }, weekRange[0]).postDate;

    const lastVideoDate = weekRange.reduce((latest, current) => {
      return convertTimestampToDate(current.postDate) >
        convertTimestampToDate(latest.postDate)
        ? current
        : latest;
    }, weekRange[0]).postDate;
    // format as Tuesday, March 12, 2024

    return {
      startDate: convertTimestampToDate(firstVideoDate),
      endDate: convertTimestampToDate(lastVideoDate),
    };

    console.log("firstVideoDate", firstVideoDate);
    console.log("weekRange", weekRange);

    // // Calculate start date (beginning of the week)
    // const startDate = new Date(firstVideoDate);
    // startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

    // // Calculate end date (end of the week)
    // const endDate = new Date(startDate);
    // endDate.setDate(endDate.getDate() + 6);

    // return {startDate, endDate};
  };

  return (
    <div className="dark  min-h-screen p-6 z-20 relative">
      {clientInfo && (
        <div className="flex items-center flex-col gap-3 container text-primary w-fit justify-center">
          {clientInfo.icon && (
            <clientInfo.icon className="h-14 w-14 rounded-lg" />
          )}
          <span className="font-bold text-6xl font1">
            {clientInfo?.label} Video Archive
          </span>
        </div>
      )}
      {!ClientData ? (
        <div className="flex h-[400px] w-screen items-center justify-center">
          <Icons.loader className="animate-spin h-10 w-10 text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-10 mt-4 container">
          {videosByWeek &&
            Object.keys(videosByWeek).map((week, i) => {
              const weekNumber = parseInt(week);
              const weekRange = videosByWeek[weekNumber];
              const {startDate, endDate} = getWeekRange(weekRange);
              console.log("startDate", startDate);
              console.log("endDate", endDate);
              return (
                <div key={i}>
                  <div className="flex flex-col gap-0 mb-2">
                    <h1 className="font-bold text-2xl text-[#34F4AF]">
                      Week {i + 1}
                    </h1>
                    <span className="text-lg text-primary font1">
                      {/* format as Tuesday, March 12, 2024 */}
                      {startDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {endDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 border rounded-lg bg-black p-4">
                    {weekRange.map((video) => {
                      return (
                        <VideoColumn key={video.id} video={video} index={i} />
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default VideoArchive;

const VideoColumn = ({
  video,
  index,
}: {
  video: VideoDataSmall;
  index: number;
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);

  // video is already posted
  const videoAlreadyPosted = video.postDate.seconds * 1000 < Date.now();

  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!video.postIds || (video?.postIds && video.postIds.length < 1)) {
        return;
      }

      const videoData = await getDoc(doc(db, "posts", video.postIds[0]));
      if (!videoData.exists()) {
        return;
      }
      setVideoUrl(videoData.data().videoURL);
    };
    fetchVideoUrl();
  }, [video]);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const setVideoRef = React.useCallback((node: HTMLVideoElement) => {
    if (node) {
      videoRef.current = node;

      const handleLoadedData = () => {
        console.log("loadeddata event triggered");
        console.log("loaded", node.readyState);
        if (node.readyState === 4) {
          setLoading(false);
        }
      };

      node.addEventListener("loadeddata", handleLoadedData);

      // Clean up the event listener on component unmount
      return () => {
        console.log("Removing event listener from video element");
        node.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, []);

  return (
    <div
      key={video.id}
      className={` p-2 flex-col flex justify-start px-2  relative w-full

`}
    >
      <div className="relative w-full  aspect-[9/16] ">
        {loading && (
          <div className="w-full h-full  absolute z-20 top-0 left-0  overflow-hidden rounded-md animate-pulse bg-primary/10"></div>
        )}

        <>
          {videoUrl ? (
            <div
              className={`w-full h-full  relative z-10 overflow-hidden rounded-md 
            ${loading ? "hidden" : "block"}
            `}
            >
              <video
                ref={setVideoRef}
                src={videoUrl}
                controls
                className="h-full relative z-20 "
              />
            </div>
          ) : (
            <h1 className="w-full h-full items-center justify-center flex text-white">
              In Production
            </h1>
          )}
        </>
      </div>
      <span className=" text-primary whitespace-pre-wrap overflow-hidden text-ellipsis relative z-20 pointer-events-none  font1 mt-1">
        {video.title}
      </span>
      <span className="font1 text-[#34F4AF]">
        Post Date:{" "}
        <span className="font-bold">{formatDayMonthDay(video.postDate)}</span>
      </span>
      <div className="flex items-center gap-2 text-sm font1 text-white">
        Posted:
        <span className="font1 text-primary">{video.posted ? "✅" : "❌"}</span>
      </div>
    </div>
  );
};
