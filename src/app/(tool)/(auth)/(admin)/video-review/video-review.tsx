"use client";

import React, {useEffect} from "react";
import {db} from "@/config/firebase";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {AnimatePresence, motion} from "framer-motion";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  ALL_USERS,
  clients,
  VideoData,
  Post,
  VideoDataWithPosts,
  UploadedVideo,
  REVIEW_USERS_DATA,
} from "@/config/data";
import {
  formatDaynameMonthDay,
  formatAsUSD,
  formatTimeDifference2,
} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {PlusCircle} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/video-review/script/script-edit";
import Link from "next/link";
// import {AiCaption} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/components/post-details";
import {useAuth, UserData} from "@/context/user-auth";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {onSnapshot} from "firebase/firestore";
import edjsHTML from "editorjs-html";
import {OutputData} from "@editorjs/editorjs";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {statuses as videoStatuses} from "@/config/data";
import {ScrollArea} from "@/components/ui/scroll-area";
import VideoPlayer from "@/components/ui/video-player";
const statuses = ["script done", "video uploaded", "video needs revision"];

type ReviewData = {
  reviewType: "script" | "video" | "payout";
  videoData: VideoData;
  id: string;
};

const VideoReview = () => {
  const {currentUser} = useAuth()!;

  const [loading1, setLoading1] = React.useState<boolean>(true);
  const [loading2, setLoading2] = React.useState<boolean>(true);

  const [displayVideos, setDisplayVideos] = React.useState<
    VideoDataWithPosts[] | undefined
  >();

  const [selectedVideo, setSelectedVideo] = React.useState<
    ReviewData | undefined
  >();

  const [originalItemsToReview, setOriginalItemsToReview] = React.useState<
    ReviewData[]
  >([]);

  const [isOriginalSet, setIsOriginalSet] = React.useState<boolean>(false); // Flag for first fetch

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "videos"), where("posted", "==", false)),

      async (querySnapshot) => {
        try {
          const filteredVideos = await Promise.all(
            querySnapshot.docs.map(async (docRef) => {
              const docData = docRef.data();
              console.log("docData", docData.videoNumber);

              const postData =
                docData.postIds &&
                Array.isArray(docData.postIds) &&
                (await Promise.all(
                  docData.postIds.map(async (postId: string) => {
                    const postDoc = doc(db, "posts", postId);
                    const postSnap = await getDoc(postDoc);
                    return postSnap.exists() ? postSnap.data() : null;
                  })
                ));

              return {
                ...docData,
                posts: postData?.filter(Boolean) as Post[],
              } as VideoDataWithPosts;
            })
          );

          setDisplayVideos(filteredVideos);
          setLoading1(false);
        } catch (error) {
          console.error("Error processing snapshot data:", error);
        }
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const [displayVideos2, setDisplayVideos2] = React.useState<
    VideoDataWithPosts[] | undefined
  >();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "videos"), where("payoutChangeRequest", "!=", "")),
      async (querySnapshot) => {
        try {
          const filteredVideos = (
            await Promise.all(
              querySnapshot.docs.map(async (docRef) => {
                const docData = docRef.data();
                console.log("docData", docData.payoutChangeRequest);

                // Check if the payoutChangeRequest status is "pending"
                if (
                  docData.payoutChangeRequest &&
                  docData.payoutChangeRequest.status === "pending"
                ) {
                  // Fetch post data if postIds exist and is an array
                  const postData =
                    docData.postIds &&
                    Array.isArray(docData.postIds) &&
                    (await Promise.all(
                      docData.postIds.map(async (postId: string) => {
                        const postDoc = doc(db, "posts", postId);
                        const postSnap = await getDoc(postDoc);
                        return postSnap.exists() ? postSnap.data() : null;
                      })
                    ));

                  return {
                    ...docData,
                    posts: postData?.filter(Boolean) as Post[], // Filter out null posts
                  } as VideoDataWithPosts;
                }

                return null; // Skip video if status is not "pending"
              })
            )
          ).filter(Boolean) as VideoDataWithPosts[]; // Explicitly cast to VideoDataWithPosts[]

          // Set the filtered videos to state
          setDisplayVideos2(filteredVideos);
          setLoading2(false);
        } catch (error) {
          console.error("Error processing snapshot data:", error);
        }
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const orderedVideos = displayVideos?.length
    ? [...displayVideos].sort((a: any, b: any) => a.postDate - b.postDate)
    : [];

  const payoutsToReview =
    displayVideos2 &&
    displayVideos2?.map((video) => ({
      reviewType: "payout",
      videoData: video,
      id: "payout-" + video.videoNumber,
    }));

  const scriptsToReview = orderedVideos
    ?.filter((video: any) => {
      return (
        !video.scriptReviewed ||
        !video.scriptReviewed.includes(currentUser?.uid)
      );
    })
    .map((video) => ({
      reviewType: "script",
      videoData: video,
      id: "script-" + video.videoNumber,
    }));

  const videosToReview = orderedVideos
    ?.filter((video: any) => {
      return (
        (!video.videoReviewed ||
          !video.videoReviewed.includes(currentUser?.uid)) &&
        video.uploadedVideos &&
        video.uploadedVideos.length > 0
      );
    })
    .map((video) => ({
      reviewType: "video",
      videoData: video,
      id: "video-" + video.videoNumber,
    }));

  const itemsToReview: any[] = [
    ...(payoutsToReview || []),
    ...(scriptsToReview || [])
      .concat(videosToReview || [])
      .sort((a: any, b: any) => a.videoData.postDate - b.videoData.postDate),
  ];

  // Set originalItemsToReview on the first fetch
  useEffect(() => {
    if (
      itemsToReview &&
      !isOriginalSet &&
      itemsToReview.length > 0 &&
      !loading1 &&
      !loading2
    ) {
      setOriginalItemsToReview(itemsToReview);
      setIsOriginalSet(true); // Prevent future updates
    }
  }, [itemsToReview, isOriginalSet, loading1, loading2]);

  const videosWithMessages = displayVideos?.filter(
    (video) => video.messages && video.messages.length > 0
  );

  return (
    <div>
      {loading1 || loading2 ? (
        <div>Loading...</div>
      ) : (
        <>
          {originalItemsToReview.length > 0 ? (
            <div
              className={`grid  h-[calc(100vh-64px)] pb-4 container gap-8  
        ${selectedVideo ? "grid-cols-[40%_1fr]" : "grid-cols-1"}
        
        `}
            >
              <div className="flex flex-col w-full h-[calc(100vh-64px)] pb-4 gap-4">
                <h1 className="text-xl text-primary">
                  These ({itemsToReview.length}) items need your approval
                </h1>

                <div className="flex flex-col gap-4  h-full overflow-scroll">
                  <div className="flex flex-col gap-2  max-h-full overflow-scroll">
                    {originalItemsToReview &&
                      originalItemsToReview.map((video) => (
                        <ReviewRow
                          video={video}
                          key={video.videoData.id}
                          setSelectedVideo={setSelectedVideo}
                          selectedVideo={selectedVideo}
                        />
                      ))}
                  </div>
                </div>
              </div>
              {selectedVideo && selectedVideo.reviewType == "payout" && (
                <PayoutReview
                  key={selectedVideo.videoData.id}
                  video={selectedVideo}
                  setVideo={setSelectedVideo}
                />
              )}
              {selectedVideo && selectedVideo.reviewType == "script" && (
                <ScriptReview
                  key={selectedVideo.videoData.id}
                  video={selectedVideo}
                  setVideo={setSelectedVideo}
                />
              )}
              {selectedVideo && selectedVideo.reviewType == "video" && (
                <UploadedVideoReview
                  video={selectedVideo}
                  setVideo={setSelectedVideo}
                  key={selectedVideo.videoData.id}
                />
              )}
            </div>
          ) : (
            <h1 className="text-xl text-primary text-center mt-20">
              You are all caught up. no items to review 🎉
            </h1>
          )}
          {/* {videosWithMessages && (
            <VideoChats videosWithMessages={videosWithMessages} />
          )} */}
        </>
      )}
    </div>
  );
};

export default VideoReview;

// const VideoChats = ({
//   videosWithMessages,
// }: {
//   videosWithMessages: VideoDataWithPosts[];
// }) => {
//   const [userData, setUserData] = React.useState<UserData[] | undefined>(
//     undefined
//   );

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDataPromises = ALL_USERS.map(async (userId) => {
//           console.log("userId", userId);
//           const userRef = doc(db, "users", userId);
//           const userDoc = await getDoc(userRef);
//           if (userDoc.exists()) {
//             return userDoc.data() as UserData;
//           }
//           return null;
//         });

//         // Wait for all promises to resolve
//         const resolvedUserData = await Promise.all(userDataPromises);
//         // Filter out any null values
//         setUserData(
//           resolvedUserData.filter((user) => user !== null) as UserData[]
//         );
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div className="flex flex-col container gap-2 md:w-[50%]">
//       <h1 className="text-primary font-bold text-2xl">Video Chats</h1>
//       <div className="w-full  flex flex-col overflow-scroll ">
//         {videosWithMessages.map((video) => (

//           <button
//             key={video.videoNumber}
//             className="w-full relative border rounded-md p-2 hover:border-primary bg-foreground/40 px-4"
//           >
//             <div className="flex flex-col items-start gap-1">
//               <h1 className="text-primary text-lg">
//                 Video #{video.videoNumber}
//               </h1>
//               <div className="flex text-muted-foreground">
//                 {
//                   userData?.find(
//                     (u) =>
//                       u.uid ==
//                       video.messages[video.messages?.length - 1].senderId
//                   )?.firstName
//                 }{" "}
//                 : {video.messages[video.messages?.length - 1].message}
//               </div>
//             </div>
//             <span className="text-xs text-gray-400 absolute top-2 right-2">
//               {formatTimeDifference2(
//                 video.messages[video.messages?.length - 1].timestamp
//               )}
//             </span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

export function FilterStatus({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className=" flex h-9  items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {statuses.map((status) => {
              return (
                <button
                  key={status}
                  className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
                  onClick={() => {
                    if (selectedStatus?.includes(status)) {
                      setSelectedStatus(
                        selectedStatus?.filter((u) => u != status)
                      );
                    } else {
                      setSelectedStatus([...(selectedStatus || []), status]);
                    }
                  }}
                >
                  {status}
                  {selectedStatus?.includes(status) && (
                    <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                  )}
                </button>
              );
            })}
          </>
        </PopoverContent>
      </Popover>
      {selectedStatus?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedStatus.map((status) => (
              <div
                key={status}
                className="bg-foreground dark:bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status)
                    );
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {statuses.find((u) => u == status)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const ReviewRow = ({
  video,
  setSelectedVideo,
  selectedVideo,
}: {
  video: ReviewData;
  setSelectedVideo: React.Dispatch<
    React.SetStateAction<ReviewData | undefined>
  >;
  selectedVideo: ReviewData | undefined;
}) => {
  const {currentUser} = useAuth()!;

  const [videoData, setVideoData] = React.useState<VideoData | undefined>(
    video.videoData
  );

  useEffect(() => {
    // create snapshot listener for the video data
    const unsubscribe = onSnapshot(
      doc(db, "videos", video.videoData.videoNumber),
      async (doc) => {
        const videoData = doc.data();
        setVideoData(videoData as VideoData);
      }
    );

    return () => unsubscribe();
  }, []);

  const isReviewed =
    videoData && video.reviewType == "payout"
      ? videoData.payoutChangeRequest &&
        videoData.payoutChangeRequest.status != "pending"
      : videoData && currentUser && video.reviewType == "script"
      ? videoData.scriptReviewed &&
        videoData.scriptReviewed.includes(currentUser?.uid)
      : videoData && currentUser && video.reviewType == "video"
      ? videoData.videoReviewed &&
        videoData.videoReviewed.includes(currentUser?.uid)
      : false;

  return (
    <>
      <button
        onClick={() => setSelectedVideo(video)}
        key={video.videoData.id}
        className={`border p-4 w-full bg-foreground/40 text-primary rounded-md hover:bg-foreground/50 relative
        ${
          selectedVideo && selectedVideo.id === video.id
            ? "border-primary"
            : "border-border"
        }
        `}
      >
        <AnimatePresence>
          {isReviewed && (
            <motion.div
              animate={{width: "calc(100% - 12px)"}}
              initial={{width: "0%"}}
              exit={{width: "0%"}}
              className="absolute top-1/2 -translate-y-1/2 left-[6px] pointer-events-none  h-[2px] bg-primary z-30 origin-left rounded-sm "
            ></motion.div>
          )}
        </AnimatePresence>
        <h1
          className={`w-full overflow-hidden text-ellipsis text-left text-lg
        ${isReviewed ? "opacity-50" : "opacity-100"}
        `}
        >
          {video.reviewType == "payout" &&
          video.videoData.payoutChangeRequest ? (
            <>
              {video.videoData.payoutChangeRequest?.createdAt.user} requested to
              be paid{" "}
              <span className="font-bold text-blue-800 dark:text-blue-200">
                {formatAsUSD(video.videoData.payoutChangeRequest?.value)}
              </span>{" "}
            </>
          ) : (
            <>
              Review the{" "}
              <span className="font-bold text-blue-800 dark:text-blue-200">
                {video.reviewType == "video" ? "uploaded video" : "script"}{" "}
              </span>
            </>
          )}
          for video #{video.videoData.videoNumber}
        </h1>
      </button>
    </>
  );
};

const PayoutReview = ({
  video,
  setVideo,
}: {
  video: ReviewData;
  setVideo: React.Dispatch<React.SetStateAction<ReviewData | undefined>>;
}) => {
  // console.log("video", JSON.stringify(video.script));

  const [videoData, setVideoData] = React.useState<VideoData | undefined>(
    video.videoData
  );

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("fetching video data=========", video);
      const videoRef = doc(db, "videos", video.videoData.videoNumber);
      const videoSnap = await getDoc(videoRef);
      if (videoSnap.exists()) {
        const videoData = videoSnap.data();
        console.log("videoData", videoData);
        setVideoData(videoData as VideoData);
      }
    };
    fetchVideoData();
  }, [video]);

  const {currentUser} = useAuth()!;

  const client = clients.find(
    (c: any) => c.value === video.videoData.clientId
  )!;

  const [status, setStatus] = React.useState(
    videoData?.payoutChangeRequest?.status || "pending"
  );

  useEffect(() => {
    if (!videoData) return;
    setStatus(videoData?.payoutChangeRequest?.status || "pending");
  }, [videoData]);

  const updateStatus = async (status: "approved" | "rejected") => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        payoutChangeRequest: {
          ...videoData?.payoutChangeRequest,
          status: status,
        },
        priceUSD:
          status == "approved"
            ? videoData?.payoutChangeRequest?.value
            : videoData?.priceUSD,
      },
      {merge: true}
    );
    setStatus(status);
  };

  return (
    <VideoProvider videoData={video.videoData}>
      {videoData?.payoutChangeRequest && (
        <div
          id={video.videoData.videoNumber}
          className="min-w-full w-[200px] h-full rounded-md flex flex-col border p-4 text-primary gap-4 bg-foreground/20 relative"
        >
          <Button
            onClick={() => setVideo(undefined)}
            className="absolute top-2 left-2"
            variant={"ghost"}
          >
            <Icons.close className="h-6 w-6" />
          </Button>

          <div className="h-full flex flex-col max-w-full overflow-hidden gap-4">
            <div className="grid gap-1">
              <h2 className=" text-2xl px-10 text-center">
                {videoData?.payoutChangeRequest?.createdAt.user} requested to be
                paid {formatAsUSD(videoData?.payoutChangeRequest?.value)}{" "}
                instead of {formatAsUSD(videoData?.priceUSD)} for{" "}
                <Link
                  target="_blank"
                  href={`/video/${video.videoData.videoNumber}`}
                  className="font-bold  hover:opacity-80 hover:underline"
                >
                  #{video.videoData.videoNumber} - {video.videoData.title}
                </Link>{" "}
              </h2>
              {/* <div className="flex flex-col items-center">
                <h1 className="font-bold text-lg">Reviewed by</h1>
               
              </div> */}
              <span className="font-bold ">Reason for change:</span>
              <div className=" rounded-md ">
                {videoData?.payoutChangeRequest?.reason}
              </div>
            </div>

            {status !== "pending" ? (
              <div className="w-full flex flex-col mt-10 items-center justify-center gap-1 relative">
                {status == "approved" ? (
                  <div className="rounded-full h-fit w-fit border border-green-600 p-2">
                    <Icons.check className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="rounded-full h-fit w-fit border border-red-600 p-2">
                    <Icons.close className="h-8 w-8 text-red-600" />
                  </div>
                )}
                <span className="text-xl mt-2 font-bold">
                  The request has been {status}
                </span>
                {status == "approved" ? (
                  <button
                    onClick={() => updateStatus("rejected")}
                    className="underline"
                  >
                    reject this request
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus("approved")}
                    className="underline"
                  >
                    Approve this request
                  </button>
                )}
              </div>
            ) : (
              <>
                <Button
                  className="bg-green-500 hover:bg-green-800 text-white"
                  onClick={() => updateStatus("approved")}
                >
                  Accept Request
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => updateStatus("rejected")}
                >
                  Decline Request
                </Button>
              </>
            )}
            {/* <div className="gap-4 flex w-full justify-between">
              {REVIEW_USERS_DATA.map((user) => (
                <div key={user.id} className="">
                  {currentUser?.uid == user.id ? (
                    <div className="w-fit justify-between items-center flex">
                      You{" "}
                      {!!(
                        currentUser &&
                        video.videoData.payoutChangeRequest?.reviewedBy.some(
                          (review) => review.id === user.id
                        )
                      )
                        ? `${
                            video.videoData.payoutChangeRequest?.reviewedBy.find(
                              (review) => review.id === user.id
                            )?.status
                          } this request`
                        : "has not reviewed"}
                    </div>
                  ) : (
                    <div className="w-fit justify-between items-center flex">
                      {user.name}{" "}
                      {!!(
                        currentUser &&
                        video.videoData.payoutChangeRequest?.reviewedBy.some(
                          (review) => review.id === user.id
                        )
                      )
                        ? `${
                            video.videoData.payoutChangeRequest?.reviewedBy.find(
                              (review) => review.id === user.id
                            )?.status
                          } this request`
                        : "has not reviewed"}
                    </div>
                  )}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      )}
    </VideoProvider>
  );
};

const ScriptReview = ({
  video,
  setVideo,
}: {
  video: ReviewData;
  setVideo: React.Dispatch<React.SetStateAction<ReviewData | undefined>>;
}) => {
  // console.log("video", JSON.stringify(video.script));

  const [videoData, setVideoData] = React.useState<VideoData | undefined>(
    video.videoData
  );

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("fetching video data=========", video);
      const videoRef = doc(db, "videos", video.videoData.videoNumber);
      const videoSnap = await getDoc(videoRef);
      if (videoSnap.exists()) {
        const videoData = videoSnap.data();
        console.log("videoData", videoData);
        setVideoData(videoData as VideoData);
      }
    };
    fetchVideoData();
  }, [video]);

  const {currentUser} = useAuth()!;

  const client = clients.find(
    (c: any) => c.value === video.videoData.clientId
  )!;

  const [isReviewed, setIsReviewed] = React.useState(
    (currentUser?.uid &&
      video.videoData.scriptReviewed?.includes(currentUser?.uid)) ||
      false
  );

  useEffect(() => {
    setIsReviewed(
      (videoData &&
        currentUser?.uid &&
        videoData.scriptReviewed?.includes(currentUser?.uid)) ||
        false
    );
  }, [videoData]);

  const markAsReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        scriptReviewed: [
          ...(video.videoData.scriptReviewed || []),
          currentUser?.uid,
        ],
      },
      {merge: true}
    );
    setIsReviewed(true);
  };

  const markAsNotReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        scriptReviewed: video.videoData.scriptReviewed
          ? video.videoData.scriptReviewed?.filter(
              (uid) => uid !== currentUser?.uid
            )
          : [],
      },
      {merge: true}
    );
    setIsReviewed(false);
  };

  const [edit, setEdit] = React.useState(false);

  return (
    <VideoProvider videoData={video.videoData}>
      <div
        id={video.videoData.videoNumber}
        className="min-w-full w-[200px] h-full rounded-md flex flex-col border p-4 text-primary gap-4 bg-foreground/20 relative"
      >
        <Button
          onClick={() => setVideo(undefined)}
          className="absolute top-2 left-2"
          variant={"ghost"}
        >
          <Icons.close className="h-6 w-6" />
        </Button>
        <div className="flex gap-2 items-center mx-auto">
          <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />
          <Link
            target="_blank"
            href={`/video/${video.videoData.videoNumber}`}
            className="font-bold text-2xl hover:opacity-80 hover:underline"
          >
            {video.videoData.title} - #{video.videoData.videoNumber}
          </Link>
          {/* <div className="ml-auto">
            {isReviewed ? (
              <Button variant={"destructive"} onClick={markAsNotReviewed}>
                Mark as not reviewed
              </Button>
            ) : (
              <Button onClick={markAsReviewed}>Mark as reviewed </Button>
            )}
          </div> */}
        </div>
        <div className="h-full flex flex-col max-w-full overflow-hidden gap-4">
          <div className="flex w-full justify-between">
            <div className="grid gap-1">
              <span className="font-bold text-lg">Post scheduled for</span>
              <h2 className="w-[100px] text-base">
                {formatDaynameMonthDay(video.videoData.postDate)}
              </h2>
            </div>
            <div className="grid gap-1">
              <h1 className="font-bold text-lg">Reviewed by</h1>
              <div className="gap-4 flex ">
                {REVIEW_USERS_DATA.map((user) => (
                  <div key={user.id} className="">
                    {currentUser?.uid == user.id ? (
                      <div className="w-full justify-between items-center flex">
                        {isReviewed ? " ✅ " : "❌ "}
                        You
                      </div>
                    ) : (
                      <div className="w-full justify-between items-center flex">
                        {video.videoData.scriptReviewed?.includes(user.id)
                          ? " ✅ "
                          : "❌ "}
                        {user.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {edit ? (
            <Editor post={video.videoData.script} setScript={() => {}} />
          ) : (
            <>
              {typeof video.videoData.script === "string" ? (
                <div className="h-fit  overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
                  {video.videoData.script}
                </div>
              ) : (
                <EditorJsRender
                  script={video.videoData.script ?? {blocks: []}}
                />
              )}
            </>
          )}
          {isReviewed ? (
            <Button variant={"destructive"} onClick={markAsNotReviewed}>
              Mark as not reviewed
            </Button>
          ) : (
            <Button onClick={markAsReviewed}>Mark as reviewed </Button>
          )}
        </div>
      </div>
    </VideoProvider>
  );
};

export const EditorJsRender = ({script}: {script: OutputData}) => {
  const edjsParser = edjsHTML();
  const htmlList = edjsParser.parse(script);

  const html = htmlList.join("");
  return (
    <div
      dangerouslySetInnerHTML={{__html: html}}
      className="h-fit overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 p-2 "
    />
  );
};

const ScriptTab = ({video}: {video: VideoData}) => {
  const {currentUser} = useAuth()!;

  const [isReviewed, setIsReviewed] = React.useState(
    (currentUser?.uid && video.scriptReviewed?.includes(currentUser?.uid)) ||
      false
  );

  useEffect(() => {
    setIsReviewed(
      (currentUser?.uid && video.scriptReviewed?.includes(currentUser?.uid)) ||
        false
    );
  }, [video]);

  const markAsReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        scriptReviewed: [...(video.scriptReviewed || []), currentUser?.uid],
      },
      {merge: true}
    );
    setIsReviewed(true);
  };

  const markAsNotReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        scriptReviewed: video.scriptReviewed?.filter(
          (uid) => uid !== currentUser?.uid
        ),
      },
      {merge: true}
    );
    setIsReviewed(false);
  };

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <Editor post={video.script} setScript={() => {}} />

      <h1>Reviewed by</h1>
      {REVIEW_USERS_DATA.map((user) => (
        <div key={user.id}>
          {video.scriptReviewed?.includes(user.id) ? "✅" : "❌"}{" "}
          {currentUser?.uid == user.id ? "You" : user.name}
        </div>
      ))}

      {isReviewed ? (
        <Button onClick={markAsNotReviewed}>Mark as not reviewed</Button>
      ) : (
        <Button onClick={markAsReviewed}>Mark as reviewed</Button>
      )}
    </div>
  );
};

const UploadedVideoReview = ({
  video,
  setVideo,
}: {
  video: ReviewData;
  setVideo: React.Dispatch<React.SetStateAction<ReviewData | undefined>>;
}) => {
  // console.log("video", JSON.stringify(video.script));

  const {currentUser} = useAuth()!;

  const [uploadedVideos, setUploadedVideos] = React.useState<
    UploadedVideo[] | undefined
  >(
    video.videoData.uploadedVideos ? video.videoData.uploadedVideos : undefined
  );

  const [videoData, setVideoData] = React.useState<VideoData | undefined>(
    video.videoData
  );

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("fetching video data=========", video);
      const videoRef = doc(db, "videos", video.videoData.videoNumber);
      const videoSnap = await getDoc(videoRef);
      if (videoSnap.exists()) {
        const videoData = videoSnap.data();
        console.log("videoData", videoData);
        setVideoData(videoData as VideoData);
        setUploadedVideos(videoData.uploadedVideos);
        setSelectedVideo(
          videoData.uploadedVideos[videoData.uploadedVideos.length - 1]
        );
      }
    };
    fetchVideoData();
  }, [video]);

  const client = clients.find(
    (c: any) => c.value === video.videoData.clientId
  )!;

  const [isReviewed, setIsReviewed] = React.useState(
    (currentUser?.uid &&
      videoData &&
      videoData.videoReviewed?.includes(currentUser?.uid)) ||
      false
  );

  useEffect(() => {
    if (!videoData) return;
    setIsReviewed(
      (currentUser?.uid &&
        videoData.videoReviewed?.includes(currentUser?.uid)) ||
        false
    );
    setNotes(videoData.notes ?? "");
    setNeedsRevision(videoData.status == "needs revision");
    setVideoStatus(videoData.status);
  }, [videoData]);

  const markAsReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        videoReviewed: [
          ...(video.videoData.videoReviewed || []),
          currentUser?.uid,
        ],
      },
      {merge: true}
    );
    setIsReviewed(true);
  };

  const markAsNotReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        videoReviewed: video.videoData.videoReviewed
          ? video.videoData.videoReviewed?.filter(
              (uid) => uid !== currentUser?.uid
            )
          : [],
      },
      {merge: true}
    );
    setIsReviewed(false);
  };
  const [selectedVideo, setSelectedVideo] = React.useState<
    UploadedVideo | undefined
  >(
    video.videoData.uploadedVideos
      ? video.videoData.uploadedVideos[0]
      : undefined
  );

  const [notes, setNotes] = React.useState(
    (selectedVideo && selectedVideo.revisionNotes) || ""
  );

  const [videoStatus, setVideoStatus] = React.useState(
    videoData && videoData.status
  );

  const [needsRevision, setNeedsRevision] = React.useState(
    video.videoData.status == "needs revision"
  );

  const changeVideoStatusRevision = async (value: string) => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        status: value,
      },
      {merge: true}
    );
    setNeedsRevision(!needsRevision);
    setVideoStatus(value);

    // videoData &&
    //   setVideoData({
    //     ...videoData,
    //     status: value,
    //   });
  };

  const updateVideoField = async (updatedVideos: any[]) => {
    if (!selectedVideo || !uploadedVideos || !videoData) return;

    console.log("Updated Videos:", updatedVideos);

    try {
      if (videoData?.videoNumber) {
        // Update Firestore document
        try {
          await setDoc(
            doc(db, "videos", videoData?.videoNumber),
            {
              uploadedVideos: updatedVideos,
            },
            {merge: true}
          );
          console.log(
            "Firestore updated successfully with videos:",
            updatedVideos
          );
        } catch (e) {
          console.error("Error updating Firestore:", e);
        }
      }

      // Update local state
      setUploadedVideos(updatedVideos);

      const updatedSelectedVideo = updatedVideos.find(
        (video) => video.videoURL === selectedVideo.videoURL
      );
      if (updatedSelectedVideo) {
        setSelectedVideo(updatedSelectedVideo);
      }
    } catch (error) {
      console.error("Error updating video field:", error);
    }
  };

  const markAsReadyToPost = async () => {
    if (!currentUser || !uploadedVideos || !selectedVideo) return;

    try {
      // Prepare updatedVideos array
      const updatedVideos = uploadedVideos.map((videoData) => {
        if (videoData.videoURL === selectedVideo.videoURL) {
          return {
            ...videoData,
            needsRevision: false,
            isReadyToPost: true,
            // videoReviewed: [
            //   ...(video.videoData.scriptReviewed || []),
            //   currentUser?.uid,
            // ],
          };
        }
        return videoData;
      });

      // Call updateVideoField with the modified videos
      await updateVideoField(updatedVideos);
      await markAsReviewed();
      await changeVideoStatusRevision("done");

      // setNeedsRevision(false);

      // Optionally change video status revision
      await changeVideoStatusRevision("done");
    } catch (error) {
      console.error("Error marking video as ready to post:", error);
    }
  };

  const markAsNeedsRevision = async () => {
    if (!currentUser || !uploadedVideos || !selectedVideo) return;

    try {
      // Prepare updatedVideos array

      const updatedVideos = uploadedVideos.map((videoData) => {
        if (videoData.videoURL === selectedVideo.videoURL) {
          return {
            ...videoData,
            needsRevision: true,
            isReadyToPost: false,
          };
        } else {
          return videoData;
        }
      });

      // Pass the updated videos to updateVideoField
      await updateVideoField(updatedVideos);
      await markAsReviewed();

      // Change video status revision
      await changeVideoStatusRevision("needs revision");
    } catch (error) {
      console.error("Error marking video as needs revision:", error);
    }
  };

  useEffect(() => {
    if (selectedVideo)
      setNotes(selectedVideo.revisionNotes ? selectedVideo.revisionNotes : "");
  }, [selectedVideo]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [needsSave, setNeedsSave] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  useEffect(() => {
    console.log("notes============", notes);
  }, [notes]);

  const saveRevisionNotes = async () => {
    if (!uploadedVideos || !selectedVideo) return;
    setIsSaving(true);
    const updatedVideos = uploadedVideos.map((video) => {
      if (video.videoURL === selectedVideo.videoURL) {
        return {
          ...video,
          revisionNotes: notes,
        };
      }
      return video;
    });
    updateVideoField(updatedVideos);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNeedsSave(true);
    }, 1000);
  };

  useEffect(() => {
    setNeedsSave(notes === selectedVideo?.revisionNotes);
  }, [notes, selectedVideo]);

  return (
    <VideoProvider videoData={video.videoData}>
      <div
        id={video.videoData.videoNumber}
        className="min-w-full w-[200px] h-full rounded-md flex flex-col border p-4 text-primary gap-4 bg-foreground/20 relative"
      >
        <Button
          onClick={() => setVideo(undefined)}
          className="absolute top-2 left-2"
          variant={"ghost"}
        >
          <Icons.close className="h-6 w-6" />
        </Button>
        <div className="flex gap-2 items-center mx-auto">
          <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />
          <Link
            target="_blank"
            href={`/video/${video.videoData.videoNumber}`}
            className="font-bold text-2xl hover:opacity-80 hover:underline"
          >
            {video.videoData.title} - #{video.videoData.videoNumber}
          </Link>
        </div>
        <div className="h-full flex flex-col max-w-full overflow-hidden gap-4 ">
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col  ">
              <span className="font-bold">Post scheduled for</span>
              <h2 className="w-[100px] text-sm">
                {formatDaynameMonthDay(video.videoData.postDate)}
              </h2>
            </div>
            <div className="flex flex-col items-center text-sm">
              <h1 className="font-bold text-lg">Status</h1>
              <span className="text-base">
                {videoStatus && (
                  <div className="flex items-center gap-1">
                    {videoStatus == "needs revision" ? (
                      <Icons.warning className="h-6 w-6 text-red-600" />
                    ) : (
                      <Icons.check className="h-6 w-6 text-green-600" />
                    )}
                    {videoStatuses.find((s) => s.value == videoStatus)?.label}
                  </div>
                )}
              </span>
            </div>
            <div className="flex flex-col ">
              <h1 className="font-bold text-lg">Reviewed by</h1>
              <div className="gap-4 flex text-base">
                {REVIEW_USERS_DATA.map((user) => (
                  <div key={user.id} className="">
                    {currentUser?.uid == user.id ? (
                      <div className="w-full justify-between items-center flex">
                        {isReviewed ? " ✅ " : "❌ "}
                        You
                      </div>
                    ) : (
                      <div className="w-full justify-between items-center flex">
                        {video.videoData.videoReviewed?.includes(user.id)
                          ? " ✅ "
                          : "❌ "}
                        {user.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="flex w-full s">
              <div className="flex flex-col w-fit ">
                <div className="h-[550px] aspect-[9/16] relative rounded-md rounded-br-none overflow-hidden bg-foreground/40 p-4 ">
                  {/* <video
                    autoPlay
                    src={selectedVideo && selectedVideo.videoURL}
                    className="w-full h-full object-cover rounded-md"
                    controls
                  /> */}
                  {selectedVideo && selectedVideo.videoURL && (
                    <VideoPlayer
                      videoUrl={selectedVideo.videoURL}
                      title={selectedVideo.title}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-4  items-center">
                <div className=" flex flex-col p-4 gap-4  flex-grow border  rounded-md w-[90%] ">
                  {selectedVideo?.needsRevision && (
                    <div className="w-full  relative h-full  rounded-md  flex flex-col gap-2">
                      <div className="flex items-center w-full justify-between">
                        <Label className="text-xl font-bold" htmlFor="notes">
                          Revision Notes
                        </Label>
                        <Button
                          onClick={markAsReadyToPost}
                          size={"sm"}
                          className="w-fit "
                        >
                          Mark as ready to post
                        </Button>
                      </div>
                      <Textarea
                        id="notes"
                        placeholder="Add video notes here..."
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          if (!uploadedVideos) return;
                        }}
                        className="w-full border p-2 flex items-center rounded-md text-sm bg-foreground/40 flex-grow"
                      />
                      {!needsSave && (
                        <Button onClick={saveRevisionNotes} className="mt-2">
                          {isSaving ? "Saving..." : saved ? "Saved !" : "Save"}
                        </Button>
                      )}
                    </div>
                  )}
                  {isReviewed && selectedVideo?.isReadyToPost && (
                    <div className="w-full flex flex-col flex-grow items-center justify-center gap-1 relative">
                      <div className="rounded-full h-fit w-fit border border-green-600 p-2">
                        <Icons.check className="h-8 w-8 text-green-600" />
                      </div>
                      You marked this video as ready to post
                      <Button
                        size="sm"
                        variant={"destructive"}
                        className="absolute top-0 right-0 w-fit"
                        onClick={markAsNeedsRevision}
                      >
                        Mark as needs revision
                      </Button>
                    </div>
                  )}
                  {!isReviewed && !selectedVideo?.needsRevision && (
                    <div className="flex flex-col gap-2 w-full items-center justify-center  flex-grow">
                      <Button
                        onClick={markAsReadyToPost}
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                      >
                        Mark as ready to post
                      </Button>
                      <Button
                        className="w-full"
                        variant={"destructive"}
                        onClick={markAsNeedsRevision}
                      >
                        Video needs revision
                      </Button>
                    </div>
                  )}
                  {isReviewed &&
                    !selectedVideo?.isReadyToPost &&
                    !selectedVideo?.needsRevision && (
                      <div className="flex flex-col gap-2 w-full items-center justify-center  flex-grow ">
                        <Button
                          onClick={markAsReadyToPost}
                          className="bg-green-500 hover:bg-green-600 text-white w-full"
                        >
                          Mark as ready to post
                        </Button>
                        <Button
                          className="w-full"
                          variant={"destructive"}
                          onClick={markAsNeedsRevision}
                        >
                          Video needs revision
                        </Button>
                      </div>
                    )}
                  {!isReviewed && selectedVideo?.needsRevision && (
                    <div className="flex flex-col gap-2 w-full items-center justify-center  flex-grow">
                      <Button
                        onClick={markAsNeedsRevision}
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                      >
                        Agree with revision
                      </Button>
                    </div>
                  )}
                </div>

                {uploadedVideos && uploadedVideos.length > 0 ? (
                  <ScrollArea className="flex gap-1 flex-col w-full h-[200px] overflow-scroll mt-auto p-2 bg-foreground/40 rounded-r-md">
                    <h1 className="text-lg h-6 ">
                      Uploaded videos ({uploadedVideos.length})
                    </h1>
                    <div className="flex flex-col gap-2 flex-grow      rounded-md mt-2">
                      {[...uploadedVideos].reverse().map((video) => (
                        <button
                          key={video.videoURL}
                          onClick={() => setSelectedVideo(video)}
                          className={`p-2 w-full relative rounded-md overflow-hidden bg-foreground/40 flex border
                        ${
                          selectedVideo?.videoURL === video.videoURL
                            ? "border-primary"
                            : "border-border"
                        }
                          
                          `}
                        >
                          {video.title}
                          {!video.isReadyToPost && !video.needsRevision && (
                            <span className="text-yellow-600 ml-auto">
                              Needs review
                            </span>
                          )}
                          {video.needsRevision && (
                            <span className="text-red-600 ml-auto">
                              Needs revision
                            </span>
                          )}
                          {video.isReadyToPost && (
                            <span className="text-green-600 ml-auto">
                              Ready to post
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[350px] aspect-[9/16] relative mx-auto rounded-md overflow-hidden flex justify-center items-center bg-muted text-center">
                    Video not done
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </VideoProvider>
  );
};

const PostTab = ({postIds}: {postIds: string[]}) => {
  const [postData, setPostData] = React.useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postData = await Promise.all(
        postIds.map(async (postId: string) => {
          const postDoc = doc(db, "posts", postId);
          const postRef = await getDoc(postDoc);
          const postSnap = postRef;
          if (postSnap.exists()) {
            return postSnap.data() as Post;
          }
        })
      );
      setPostData(postData.filter((post) => post !== undefined) as Post[]);
    };
    fetchPosts();
  }, [postIds]);

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {postData.map((post) => (
        <PostDisplay post={post} key={post.id} />
      ))}
    </div>
  );
};

const PostDisplay = ({post}: {post: Post}) => {
  const [caption, setCaption] = React.useState(post.caption || "");
  const [copied, setCopied] = React.useState(false);

  const {currentUser} = useAuth()!;

  async function updateField(field: string, value: any) {
    if (!post) return;
    await setDoc(
      doc(db, "posts", post?.id),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }

  const copyCaption = () => {
    setCopied(true);
    navigator.clipboard.writeText(caption);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const {video} = useVideo()!;

  console.log("post", video);

  return (
    <div>
      {/* <div className="w-full">{post.id}</div> */}
      <div className="">
        {post.videoURL ? (
          <div className="h-[250px] aspect-[9/16] relative mx-auto rounded-md overflow-hidden">
            {/* <video
              src={post.videoURL}
              className="w-full h-full object-cover"
              controls
            /> */}
            <VideoPlayer videoUrl={post.videoURL} title={post.title} />
          </div>
        ) : (
          <div className="h-[250px] aspect-[9/16] relative mx-auto rounded-md overflow-hidden flex justify-center items-center bg-muted text-center">
            Video not selected
          </div>
        )}
      </div>
      <div className="grid gap-1">
        <h1>Caption</h1>
        <div className="">
          <div className="grid gap-2 relative">
            <div className="flex gap-2 absolute bottom-2 left-2">
              <AiCaption updateField={updateField} setCaption={setCaption} />

              <Button
                onClick={copyCaption}
                variant="ghost"
                className=" p-0 aspect-square"
              >
                {copied ? (
                  <Icons.check className="h-3 w-3 " />
                ) : (
                  <Icons.copy className="h-3 w-3" />
                )}
              </Button>
            </div>

            <Textarea
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                updateField("caption", e.target.value);
              }}
              id="caption"
              className="min-h-[200px] w-full p-2 pb-10"
              placeholder="The caption for the video goes here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AiCaption = ({
  updateField,
  setCaption,
}: {
  updateField: (field: string, value: any) => void;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [prompt, setPrompt] = React.useState(
    "Create short video description (instagram, tiktok, youtube style) for the following video script. The description should  use relevant keywords, phrases and hashtags. hashtags should be lowercase. don't use emojis or unicode characters."
  );

  const {video} = useVideo()!;

  const [loadingResponse, setLoadingResponse] = React.useState(false);

  const [response, setResponse] = React.useState("");

  const getAiCaption = async () => {
    setLoadingResponse(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({
        directions: prompt,
        videoScript:
          typeof video.script !== "string"
            ? video.script?.blocks.map((block) => block.data.text).join(" ") ||
              video.script?.blocks.map((block) => block.data.items).join(" ")
            : video.script,
      }),
    });
    const data = await response.json();
    setResponse(data.response);
    setLoadingResponse(false);
  };

  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="">Ai generated caption</Button>
      </DialogTrigger>
      <DialogContent className="text-primary">
        <DialogHeader>
          <DialogTitle>AI Generated Caption</DialogTitle>
          <DialogDescription>
            The caption for the video generated by the AI
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          placeholder="prompt"
          className="h-[100px]"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        {response && (
          <div className="grid gap-2">
            <Label>Response</Label>
            <Textarea
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
              }}
              className="h-[300px]"
            />
          </div>
        )}
        <DialogFooter>
          <Button onClick={getAiCaption}>
            {loadingResponse && (
              <Icons.spinner className="animate-spin h-5 w-5 mr-2" />
            )}
            {response ? "Regenerate" : "Generate"}
          </Button>
          {response && (
            <Button
              onClick={() => {
                updateField("caption", response);
                setCaption(response);
                setOpen(false);
              }}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
