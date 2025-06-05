"use client";

import React, {useEffect} from "react";
import {statuses, clients, MANAGERS} from "@/config/data";
import {
  onSnapshot,
  query,
  collection,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {OutputData} from "@editorjs/editorjs";
import {useAuth, UserData} from "@/context/user-auth";

import {
  formatDateFromTimestamp,
  formatDateFromTimestampToTime,
  formatDayMonthDay,
  formatAsUSD,
  convertTimestampToDate,
} from "@/lib/utils";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {VideoData} from "@/config/data";
import {Input} from "@/components/ui/input";
import {GripVertical, Video} from "lucide-react";
import {set} from "date-fns";
import {REVIEW_USERS_DATA} from "@/config/data";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Editor} from "../../../client-library/[client]/description/description-edit";
import {EditorJsRender} from "../../../video-review/video-review";
import {Button} from "@/src/app/(marketing)/components/ui/button";
import {toast, useToast} from "@/components/ui/use-toast";
import {Switch} from "@/components/ui/switch";
type ClientDataByWeek = {
  weekRange: string;
  weekNumber: number;
  posts: VideoData[];
};

export const WeeksDisplay = ({
  clientInfo,
  setTotalVideos,
  setCurrentVideoNumber,
  displayedVideo,
  setDisplayedVideo,
}: {
  clientInfo: any;
  setTotalVideos: React.Dispatch<React.SetStateAction<number>>;
  setCurrentVideoNumber: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  displayedVideo: VideoData | undefined;
  setDisplayedVideo: React.Dispatch<
    React.SetStateAction<VideoData | undefined>
  >;
}) => {
  const [ClientData, setClientData] = React.useState<VideoData[] | null>(null);

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
      setClientData(clientDataLocal);
      const largestVideoNumber = Math.max(
        ...clientDataLocal.map((post: any) => post.videoNumber)
      );
      setTotalVideos(clientDataLocal.length);

      if (largestVideoNumber === -Infinity) {
        console.log("largestVideoNumber", Number(clientInfo.id + "000"));
        setCurrentVideoNumber(Number(clientInfo.id + "000"));
      } else {
        setCurrentVideoNumber(largestVideoNumber);
      }
    });
    return () => unsubscribe();
  }, [clientInfo, setTotalVideos]);

  const [userData, setUsersData] = React.useState<UserData[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Promise.all(
          MANAGERS.map(async (user) => {
            const userSnap = await getDoc(doc(db, "users", user.id));
            return userSnap.data() as UserData; // Ensure type casting if needed
          })
        );
        setUsersData(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
  }, {} as {[key: number]: VideoData[]});

  const getWeekRange = (weekRange: VideoData[]) => {
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
  };

  return (
    <>
      {ClientData ? (
        <div className="flex flex-col gap-6 z-10 relative container ">
          {videosByWeek &&
            Object.keys(videosByWeek)
              .reverse()
              .map((week, i) => {
                const weekNumber = parseInt(week);
                const weekRange = videosByWeek[weekNumber];
                const {startDate, endDate} = getWeekRange(weekRange);

                return (
                  <div
                    key={i}
                    className="border bg-card  shadow-lg rounded-md pt-3"
                  >
                    <span className="p-3 text-primary ">
                      <span className="font-bold text-lg ">
                        Week {weekNumber}
                      </span>{" "}
                      (
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
                      )
                    </span>
                    <div className="w-full p-2 bg-primary/5  dark:bg-muted/60 gap-4 justify-between flex border-y font-bold mt-3 text-primary text-sm">
                      {displayedVideo ? (
                        <>
                          <span className="w-[80px]">Video #</span>

                          <span className=" w-[250px]">Title</span>
                          <span className="w-[100px] text-center">Manager</span>
                          <span className="w-[150px] ">Status</span>

                          <span className="w-[80px] ">Posted</span>
                        </>
                      ) : (
                        <>
                          <span className="w-[80px]">Video #</span>
                          <span className=" w-[250px]">Title</span>

                          <span className="w-[60px]">Price</span>

                          <span className="w-[100px] text-center">Manager</span>

                          <span className="w-[80px]">Script Due</span>

                          <span className="w-[100px] text-center">
                            Script Done
                          </span>

                          <span className="w-[80px]">Editing Due</span>

                          <span className="w-[150px] ">Edit Status</span>

                          <span className="w-[80px]">Post Date</span>

                          <span className="w-[80px] ">Posted</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col  dark:bg-transparent">
                      {weekRange
                        .sort((a: any, b: any) => a.postDate - b.postDate)
                        .map((post: VideoData, index) => (
                          <VideoColumn
                            key={index}
                            post={post}
                            index={index}
                            userData={userData}
                            displayedVideo={displayedVideo}
                            setDisplayedVideo={setDisplayedVideo}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
        </div>
      ) : (
        <>
          <Icons.spinner className="text-primary h-10 w-10 animate-spin mx-auto mt-20 " />
        </>
      )}
    </>
  );
};

const VideoColumn = ({
  post,
  index,
  userData,
  displayedVideo,
  setDisplayedVideo,
}: {
  post: VideoData;
  index: number;
  userData: UserData[] | undefined;
  displayedVideo: VideoData | undefined;
  setDisplayedVideo: React.Dispatch<
    React.SetStateAction<VideoData | undefined>
  >;
}) => {
  const status = statuses.find((status) => status.value === post.status);

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
      ? post.script.length > 5
      : isOutputData(post.script) &&
        post.script.blocks.length > 0 &&
        post.script.blocks.length !== undefined;

  console.log(post.title, hasScript, isOutputData(post.script), post.script);

  const {currentUser} = useAuth()!;

  const [isSendingToEditor, setIsSendingToEditor] = React.useState(false);

  const sendToEditor = async () => {
    if (!post.editor) return;
    try {
      setIsSendingToEditor(true);
      await setDoc(
        doc(db, "videos", post.videoNumber),
        {scriptReviewed: [...REVIEW_USERS_DATA.map((user) => user.id)]},

        {merge: true}
      );
    } catch (error) {
      console.error("Error sending to editor:", error);
      toast({
        title: "Error sending to editor",
        description: "Please try again",
      });
      setIsSendingToEditor(false);
    }
  };

  const isManager = post.manager === currentUser?.uid;
  const managerInfo = userData?.find((u) => u.uid === post.manager);

  const [posted, setPosted] = React.useState(post.posted);

  useEffect(() => {
    setPosted(post.posted);
  }, [post.posted]);

  const changePosted = async () => {
    setPosted(!posted);
    await setDoc(
      doc(db, "videos", post.videoNumber),
      {posted: !posted},
      {merge: true}
    );
  };

  return (
    <div
      key={post.id}
      className={`gap-4 p-2 flex justify-between px-2 text-primary  relative`}
    >
      <button
        onClick={() => setDisplayedVideo(post)}
        className={`absolute w-full h-full top-0 left-0 z-10 cursor-pointer  transition-colors duration-200 
        ${
          displayedVideo?.videoNumber == post.videoNumber
            ? "bg-primary/15 dark:bg-muted/60"
            : "hover:bg-primary/10 hover:dark:bg-muted/40"
        }
          `}
      ></button>

      {displayedVideo ? (
        <>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis  relative z-20 pointer-events-none w-[80px]">
            #{post.videoNumber}
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis relative z-20 pointer-events-none w-[250px]">
            {post.title}
          </span>
          <span className="relative z-20 pointer-events-none w-[100px] flex justify-center">
            {post.manager ? (
              userData && userData.find((u) => u.uid === post.manager) ? (
                <img
                  src={userData.find((u) => u.uid === post.manager)?.photoURL}
                  alt={userData.find((u) => u.uid === post.manager)?.firstName}
                  className="h-6 min-w-6 w-6 aspect-square rounded-full"
                />
              ) : (
                <span>--</span>
              )
            ) : (
              <span>--</span>
            )}
          </span>
          <span className="flex items-center relative z-20 pointer-events-none w-[150px] whitespace-nowrap">
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

            {status?.value === "needs revision"
              ? "Needs Revision"
              : status?.value === "todo"
              ? "In Production"
              : status?.value === "draft" && !hasScript
              ? "Needs Script"
              : "Ready to edit"}
          </span>
          <span className="relative z-20 pointer-events-none w-[100px]  flex justify-center">
            {post.posted ? (
              <Icons.check className="h-4 w-4 text-green-500 " />
            ) : (
              <Icons.close className=" h-4 w-4 text-red-500" />
            )}
          </span>
        </>
      ) : (
        <>
          {/* {post.posted && (
            <div className="absolute w-[90%] h-[1px] bg-primary top-1/2 -translate-y-1/2 z-50 left-0 "></div>
          )} */}
          <span className="whitespace-nowrap overflow-hidden text-ellipsis  relative z-20 pointer-events-none w-[80px]">
            #{post.videoNumber}
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis relative z-20 pointer-events-none w-[250px]">
            {post.title}
          </span>
          <span className="relative z-20 pointer-events-none w-[60px]">
            {formatAsUSD(post.priceUSD)}
          </span>

          <span className="relative z-20 pointer-events-none w-[100px] flex justify-center">
            {post.manager ? (
              userData && userData.find((u) => u.uid === post.manager) ? (
                <img
                  src={userData.find((u) => u.uid === post.manager)?.photoURL}
                  alt={userData.find((u) => u.uid === post.manager)?.firstName}
                  className="h-6 min-w-6 w-6 aspect-square rounded-full"
                />
              ) : (
                <span>--</span>
              )
            ) : (
              <span>--</span>
            )}
          </span>

          <span className="relative z-20 pointer-events-none w-[80px]">
            {formatDayMonthDay(post.scriptDueDate)}
          </span>

          {!hasScript ? (
            <>
              {isManager ? (
                <span className="relative z-40  w-[595px] flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="z-40 relative text-xs bg-primary text-primary-foreground  py-1 rounded-md hover:bg-primary/80 px-8 flex items-center justify-center">
                        <Icons.add className="h-3 w-3 mr-2" />
                        Add Script
                      </button>
                    </DialogTrigger>
                    <DialogContent className="p-2">
                      <ScriptDialogBody video={post} />
                    </DialogContent>
                  </Dialog>
                  <div className="flex-grow h-[1px] border-t border-dashed border-primary pointer-events-none" />
                </span>
              ) : (
                <span className="relative z-20 pointer-events-none w-[595px] flex items-center justify-center gap-2">
                  {managerInfo?.firstName} needs to add a script
                  <div className="flex-grow h-[1px] border-t border-dashed border-primary" />
                </span>
              )}
            </>
          ) : (
            <>
              <span className="relative z-20 pointer-events-none w-[100px]  flex justify-center">
                {post.posted ? (
                  <Icons.check className="h-4 w-4 text-green-500 " />
                ) : (
                  <span className="font-bold">
                    {hasScript ? (
                      <Icons.check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icons.close className=" h-4 w-4 text-red-500" />
                    )}
                  </span>
                )}
              </span>

              {status?.value !== "draft" ? (
                <>
                  <span className="relative z-20 pointer-events-none w-[80px] ">
                    {formatDayMonthDay(post.dueDate)}
                  </span>

                  <span className="flex items-center relative z-20 pointer-events-none w-[150px] whitespace-nowrap">
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

                    {status?.value === "needs revision"
                      ? "Needs Revision"
                      : status?.value === "todo"
                      ? "In Production"
                      : status?.label}
                  </span>

                  <span className="relative z-20 pointer-events-none w-[60px]">
                    {formatDayMonthDay(post.postDate)}
                  </span>
                  <span className="w-[80px] z-20  flex items-center justify-center ">
                    <Switch checked={posted} onCheckedChange={changePosted} />
                  </span>
                </>
              ) : (
                <span className="relative z-20  w-[465px] flex items-center justify-center gap-2">
                  <button
                    onClick={sendToEditor}
                    className="z-40 relative text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80 px-8 flex items-center justify-center"
                  >
                    {isSendingToEditor ? (
                      <Icons.spinner className="h-3 w-3 mr-2 animate-spin" />
                    ) : (
                      <Icons.send className="h-3 w-3 mr-2" />
                    )}
                    Send to{" "}
                    {userData?.find((u) => u.uid === post.editor)?.firstName} to
                    edit
                  </button>
                  <div className="flex-grow h-[1px] border-t border-dashed border-primary pointer-events-none" />
                </span>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const ScriptDialogBody = ({video}: {video: VideoData}) => {
  const [script, setScript] = React.useState(video.script);
  const [scriptValue, setScriptValue] = React.useState(video.script);

  useEffect(() => {
    setScript(video.script);
    setScriptValue(video.script);
  }, [video]);

  const {toast} = useToast();

  const [loading, setLoading] = React.useState(false);

  const saveScript = async () => {
    if (!video) return;
    setLoading(true);
    setScriptValue(script);
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        script: script,
      },
      {merge: true}
    );
    console.log("Script saved", script);
    toast({
      title: "Script saved",
      description: "Script saved successfully",
    });
    setLoading(false);
  };

  return (
    <>
      <Editor
        post={scriptValue}
        setScript={setScript}
        placeholder="Add the Script here..."
      />
      <Button onClick={saveScript}>
        {loading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : "Save"}
      </Button>
    </>
  );
};
