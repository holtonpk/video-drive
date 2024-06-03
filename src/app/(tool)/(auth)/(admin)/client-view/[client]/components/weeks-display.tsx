"use client";

import React, {useEffect} from "react";
import {statuses, clients} from "@/config/data";
import {
  onSnapshot,
  query,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {OutputData} from "@editorjs/editorjs";

import {
  formatDateFromTimestamp,
  formatDateFromTimestampToTime,
  formatDayMonthDay,
} from "@/lib/utils";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {VideoData} from "@/config/data";
import {Input} from "@/components/ui/input";
import {Video} from "lucide-react";
import {set} from "date-fns";
type ClientDataByWeek = {
  weekRange: string;
  weekNumber: number;
  posts: VideoData[];
};

export const WeeksDisplay = ({
  clientInfo,
  setTotalVideos,
}: {
  clientInfo: any;
  setTotalVideos: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  const [ClientData, setClientData] = React.useState<ClientDataByWeek[] | null>(
    null
  );

  useEffect(() => {
    const clientDataQuery = query(
      collection(db, "videos"),
      where("clientId", "==", clientInfo.value)
    );
    const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
      const clientDataLocal: VideoData[] = [];
      querySnapshot.forEach((doc) => {
        clientDataLocal.push(doc.data() as VideoData);
      });

      setTotalVideos(clientDataLocal.length);

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

        console.log("dd", post.videoNumber, postWeek, post.postDate);
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
  }, [clientInfo, setTotalVideos]);

  // Helper function to get the week number starting from a specific date (Monday to Sunday)
  const getWeekNumber = (date: Date, startDate: Date) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(
      (date.getTime() - startDate.getTime()) / oneDayMilliseconds
    );
    console.log(daysDifference, date);
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

  return (
    <>
      {ClientData ? (
        <div className="flex flex-col gap-6 ">
          {[...ClientData].reverse().map((week: ClientDataByWeek, i) => (
            <div key={i} className="border  rounded-md pt-3">
              <span className="p-3">
                <span className="font-bold text-lg">
                  Week {week.weekNumber}
                </span>
                {" ("}
                {week.weekRange}
                {")"}
              </span>
              <div className="w-full p-2 bg-card gap-4 justify-between flex border-y font-bold mt-3">
                <span className="w-[80px]">Video #</span>
                <span className=" w-[250px]">Title</span>
                <span className="w-[60px]">Script</span>
                <span className="w-[60px]">Editing</span>
                <span className="w-[60px]">Post</span>
                <span className="w-[50px]">Script</span>
                <span className="w-[50px]">Caption</span>
                <span className="w-[150px] ">Status</span>
              </div>
              <div className="flex flex-col  ">
                {week.posts
                  .sort((a: any, b: any) => a.postDate - b.postDate)
                  .map((post: VideoData, index) => (
                    <VideoColumn key={index} post={post} index={index} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Icons.spinner className="text-primary h-10 w-10 animate-spin mx-auto mt-20 " />
        </>
      )}
    </>
  );
};

const VideoColumn = ({post, index}: {post: VideoData; index: number}) => {
  const status = statuses.find((status) => status.value === post.status);

  const [loadingCaption, setLoadingCaption] = React.useState<boolean>(false);
  const [hasCaption, setHasCaption] = React.useState<boolean>(false);

  useEffect(() => {
    setLoadingCaption(true);
    if (post?.postIds) {
      post?.postIds.forEach(async (postId) => {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const post = docSnap.data();
          if (post?.caption && post.caption.split(" ").length > 0) {
            setHasCaption(true);
          }
        }
      });
    }
    setLoadingCaption(false);
  }, [post]);

  // video is already posted
  const videoAlreadyPosted = post.postDate.seconds * 1000 < Date.now();

  function isOutputData(data: any): data is OutputData {
    return (
      typeof data === "object" &&
      data !== null &&
      "blocks" in data &&
      Array.isArray(data.blocks)
    );
  }

  const hasScript =
    typeof post.script === "string"
      ? post.script.length > 1
      : isOutputData(post.script) && post.script.blocks.length > 1;

  console.log(post.videoNumber, hasScript, post.script);

  return (
    <div
      key={post.id}
      className={`gap-4 p-2 flex justify-between px-2  relative
${index % 2 === 0 ? "bg-gray-100" : ""}
`}
    >
      <Link
        target="_blank"
        href={`/video/${post.videoNumber}`}
        className="absolute w-full h-full top-0 left-0 z-10 cursor-pointer hover:bg-gray-200 "
      />
      <span className="whitespace-nowrap overflow-hidden text-ellipsis  relative z-20 pointer-events-none w-[80px]">
        #{post.videoNumber}
      </span>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis relative z-20 pointer-events-none w-[250px]">
        {post.title}
      </span>

      <span className="relative z-20 pointer-events-none w-[60px]">
        {formatDayMonthDay(post.scriptDueDate)}
      </span>
      <span className="relative z-20 pointer-events-none w-[60px] ">
        {formatDayMonthDay(post.dueDate)}
      </span>
      <span className="relative z-20 pointer-events-none w-[60px]">
        {formatDayMonthDay(post.postDate)}
      </span>
      <span className="relative z-20 pointer-events-none w-[50px] flex justify-center">
        {videoAlreadyPosted ? (
          "✅"
        ) : (
          <span className="font-bold">{hasScript ? "✅" : "❌"}</span>
        )}
      </span>
      <span className="relative z-20 pointer-events-none w-[50px] flex justify-center">
        {videoAlreadyPosted ? (
          "✅"
        ) : (
          <>
            {" "}
            {loadingCaption ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <span className="font-bold">{hasCaption ? "✅" : "❌"}</span>
            )}
          </>
        )}
      </span>
      <span className="flex items-center relative z-20 pointer-events-none w-[150px]  ">
        {status?.icon && (
          <status.icon
            className={`h-4 w-4 mr-2
${
  status.value === "done"
    ? "stroke-green-500 "
    : status.value === "todo"
    ? "stroke-blue-500"
    : status.value === "draft"
    ? "stroke-yellow-500"
    : "stroke-red-500"
}
`}
          />
        )}

        {status?.label}
      </span>
    </div>
  );
};
