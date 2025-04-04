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
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {formatDayMonthDay} from "@/lib/utils";
import {clients} from "@/config/data";
import {Icons} from "@/components/icons";

const VideoArchive = ({clientId}: {clientId: string}) => {
  const [ClientData, setClientData] = React.useState<ClientDataByWeek[] | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const clientDataQuery = query(
      collection(db, "videos"),
      where("clientId", "==", clientId)
    );
    const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
      const clientDataLocal: VideoData[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().postIds) {
          clientDataLocal.push(doc.data() as VideoData);
        }
      });

      // Get the earliest and latest post date in UTC
      const earliestPostDate = new Date(
        Math.min(...clientDataLocal.map((post) => post.postDate.seconds * 1000))
      );
      earliestPostDate.setUTCHours(0, 0, 0, 0);

      // Group posts by week starting from the earliest post's week (Monday to Sunday)
      const groupedByWeek: {[key: number]: VideoData[]} = {};
      clientDataLocal.forEach((post) => {
        const postDateUTC = new Date(post.postDate.seconds * 1000);
        postDateUTC.setUTCHours(0, 0, 0, 0);
        const postWeek = getWeekNumber(postDateUTC, earliestPostDate);

        if (!groupedByWeek[postWeek]) {
          groupedByWeek[postWeek] = [];
        }
        groupedByWeek[postWeek].push(post);
      });

      const clientDataByWeek: ClientDataByWeek[] = Object.keys(groupedByWeek)
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort weeks in ascending order
        .map((week) => ({
          weekNumber: parseInt(week),
          weekRange: getWeekRange(new Date(earliestPostDate), parseInt(week)),
          posts: groupedByWeek[parseInt(week)],
        }));

      setClientData(clientDataByWeek);
    });
    return () => unsubscribe();
  }, [clientId]);
  // Helper function to get the week number starting from a specific date (Monday to Sunday)
  const getWeekNumber = (date: Date, startDate: Date) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(
      (date.getTime() - startDate.getTime()) / oneDayMilliseconds
    );
    const daysOffset = (startDate.getUTCDay() + 6) % 7; // Adjust for Monday being the first day of the week
    return Math.ceil((daysDifference - daysOffset + 1) / 7);
  };

  // Helper function to get the week range (start and finish date)
  const getWeekRange = (startDate: Date, weekNumber: number) => {
    const startOfWeek = new Date(startDate);
    const endOfWeek = new Date(startDate);
    startOfWeek.setUTCDate(
      startOfWeek.getUTCDate() +
        (weekNumber - 1) * 7 -
        startOfWeek.getUTCDay() +
        2
    );
    endOfWeek.setUTCDate(
      endOfWeek.getUTCDate() +
        (weekNumber - 1) * 7 -
        startOfWeek.getUTCDay() +
        9
    );
    return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
  };
  type ClientDataByWeek = {
    weekRange: string;
    weekNumber: number;
    posts: VideoData[];
  };

  const clientInfo = clients.find((c: any) => c.value === clientId);

  console.log("CDDDD", ClientData);

  return (
    <div className="dark  min-h-screen p-6 z-20 relative">
      {clientInfo && (
        <div className="flex items-center gap-4 container text-primary w-fit justify-center">
          {clientInfo.icon && (
            <clientInfo.icon className="h-10 w-10 rounded-lg" />
          )}
          <span className="font-bold text-4xl">
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
          {[...ClientData].reverse().map((week: ClientDataByWeek, i) => (
            <div
              key={i}
              className="border bg-foreground/20 blurBack flex flex-col rounded-md pt-3 p-4"
            >
              <span className="p-3 font-bold font1 text-2xl text-center text-primary">
                {week.weekRange}
              </span>
              <div className="grid md:grid-cols-5 gap-8 w-fit  ">
                {week.posts
                  .sort((a: any, b: any) => a.postDate - b.postDate)
                  .map((post: VideoData, index) => (
                    <VideoColumn key={index} video={post} index={index} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoArchive;

const VideoColumn = ({video, index}: {video: VideoData; index: number}) => {
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
      className={` p-2 flex-col flex justify-between px-2  relative w-full

`}
    >
      <div className="relative w-full  aspect-[9/16] ">
        {loading && (
          <div className="w-full h-full  absolute z-20 top-0 left-0  overflow-hidden rounded-md animate-pulse bg-primary/10"></div>
        )}

        <>
          {videoUrl && (
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
          )}
        </>
      </div>

      <span className="whitespace-nowrap text-primary overflow-hidden text-ellipsis relative z-20 pointer-events-none w-[250px] font1 mt-1">
        {video.title}
      </span>
      <span className="font1 text-primary">
        Post Date:{" "}
        <span className="font-bold">{formatDayMonthDay(video.postDate)}</span>
      </span>
    </div>
  );
};
