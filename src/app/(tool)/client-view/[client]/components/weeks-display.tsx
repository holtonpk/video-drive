"use client";

import React, {useEffect} from "react";
import {statuses, clients} from "@/config/data";
import {onSnapshot, query, collection, where} from "firebase/firestore";
import {db} from "@/config/firebase";

import {
  formatDateFromTimestamp,
  formatDateFromTimestampToTime,
} from "@/lib/utils";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {VideoData} from "@/config/data";
import {Input} from "@/components/ui/input";
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

  //   useEffect(() => {
  //     const clientDataQuery = query(
  //       collection(db, "videos"),
  //       where("clientId", "==", clientInfo.value)
  //     );
  //     const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
  //       const clientDataLocal: VideoData[] = [];
  //       querySnapshot.forEach((doc) => {
  //         clientDataLocal.push(doc.data() as VideoData);
  //       });
  //       setTotalVideos(clientDataLocal.length);
  //       // Get the earliest and latest post date in UTC
  //       const earliestPostDateUTC = new Date(
  //         Math.min(...clientDataLocal.map((post) => post.postDate.seconds * 1000))
  //       ).toUTCString();

  //       // Group posts by week starting from Monday at 12:00 AM UTC
  //       const groupedByWeek: {[key: number]: VideoData[]} = {};
  //       clientDataLocal.forEach((post) => {
  //         const postWeek = getWeekNumber(
  //           new Date(post.postDate.seconds * 1000).toUTCString(),
  //           earliestPostDateUTC
  //         );
  //         console.log(
  //           "dd",
  //           post.videoNumber,
  //           postWeek,
  //           new Date(post.postDate.seconds * 1000).toDateString()
  //         );
  //         if (!groupedByWeek[postWeek]) {
  //           groupedByWeek[postWeek] = [];
  //         }
  //         groupedByWeek[postWeek].push(post);
  //       });

  //       const clientDataByWeek: ClientDataByWeek[] = Object.keys(groupedByWeek)
  //         .sort((a, b) => parseInt(a) - parseInt(b)) // Sort weeks in ascending order
  //         .map((week) => ({
  //           weekNumber: parseInt(week),
  //           weekRange: getWeekRange(
  //             new Date(earliestPostDateUTC),
  //             parseInt(week)
  //           ),
  //           posts: groupedByWeek[parseInt(week)],
  //         }));

  //       setClientData(clientDataByWeek);
  //     });
  //     return () => unsubscribe();
  //   }, [clientInfo]);

  // Helper function to get the week number starting from Monday at 12:00 AM UTC
  //   const getWeekNumber = (date: string, startDate: string) => {
  //     const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  //     const daysDifference = Math.floor(
  //       (new Date(date).getTime() - new Date(startDate).getTime()) /
  //         oneDayMilliseconds
  //     );
  //     return Math.ceil((daysDifference + 1) / 7); // Add 1 day to shift to Monday and divide by 7 for weeks
  //   };

  //   // Helper function to get the week range (start and finish date) in UTC
  //   const getWeekRange = (startDate: Date, weekNumber: number) => {
  //     const startOfWeek = new Date(startDate);
  //     const endOfWeek = new Date(startDate);
  //     startOfWeek.setDate(
  //       startOfWeek.getDate() + (weekNumber - 1) * 7 - startOfWeek.getDay()
  //     );
  //     endOfWeek.setDate(
  //       endOfWeek.getDate() + (weekNumber - 1) * 7 - startOfWeek.getDay() + 6
  //     );
  //     return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
  //   };
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
              <div className="flex flex-col  mt-3">
                {week.posts.map((post: VideoData, index) => {
                  const status = statuses.find(
                    (status) => status.value === post.status
                  );

                  return (
                    <div
                      key={post.id}
                      className={`gap-4 p-2 flex justify-between px-2  relative
              ${index % 2 === 0 ? "bg-gray-100" : ""}
              `}
                    >
                      <Link
                        href={`/video/${post.videoNumber}`}
                        className="absolute w-full h-full top-0 left-0 z-10 cursor-pointer hover:bg-gray-200 "
                      />
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis font-bold relative z-20 pointer-events-none">
                        #{post.videoNumber}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis relative z-20 pointer-events-none w-[250px]">
                        {post.title}
                      </span>

                      <span className="relative z-20 pointer-events-none">
                        Script Due:
                        <span className="font-bold">
                          {formatDateFromTimestamp(post.scriptDueDate)}
                        </span>
                      </span>
                      <span className="relative z-20 pointer-events-none">
                        Editing Due:
                        <span className="font-bold">
                          {formatDateFromTimestamp(post.dueDate)}
                        </span>
                      </span>
                      <span className="relative z-20 pointer-events-none">
                        Post Date:
                        <span className="font-bold">
                          {formatDateFromTimestamp(post.postDate)}
                        </span>
                      </span>
                      {/* <span className="relative z-20 pointer-events-none">
                        Script:
                        <span className="font-bold">
                          {post.script ? "✅" : "❌"}
                        </span>
                      </span> */}
                      <span className="flex items-center relative z-20 pointer-events-none ">
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
                })}
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
