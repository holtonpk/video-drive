"use client";

import React, {useEffect} from "react";
import {db} from "@/config/firebase";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
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
  clients,
  VideoData,
  Post,
  VideoDataWithPosts,
  UploadedVideo,
} from "@/config/data";
import {formatDaynameMonthDay, convertTimestampToDate} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {PlusCircle} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/video-review/script/script-edit";
import Link from "next/link";
import {Textarea} from "@/components/ui/textarea";
// import {AiCaption} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/components/post-details";
import {useAuth} from "@/context/user-auth";
import {Label} from "@/components/ui/label";

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
import {Span, SpanStatus} from "next/dist/trace";
import {Switch} from "@/components/ui/switch";
import {statuses as videoStatuses} from "@/config/data";

import {set} from "date-fns";

const statuses = ["script done", "video uploaded", "video needs revision"];

const USERS_DATA = [
  {
    id: "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
    name: "Mohammed",
  },
  {
    id: "Mi4yipMXrlckU117edbYNiwrmI92",
    name: "Patrick",
  },
];

type ReviewData = {
  reviewType: "script" | "video";
  videoData: VideoData;
  id: string;
};

const VideoReview = () => {
  const {currentUser} = useAuth()!;
  const [loading, setLoading] = React.useState<boolean>(true);

  const [displayVideos, setDisplayVideos] = React.useState<
    VideoDataWithPosts[] | undefined
  >();

  useEffect(() => {
    const fetchPosts = async () => {
      // Set the time to the start of the day (00:00:00)

      const docsQuery = query(
        collection(db, "videos"),
        // posted is false
        where("posted", "==", false)
      );
      const querySnapshot = await getDocs(docsQuery);

      const filteredVideos = await Promise.all(
        querySnapshot.docs.map(async (docRef) => {
          const docData = docRef.data();
          console.log("docData", docData.videoNumber);

          const postData =
            docData.postIds &&
            (await Promise.all(
              docData.postIds.map(async (postId: string) => {
                const postDoc = doc(db, "posts", postId);
                const postRef = getDoc(postDoc);
                const postSnap = await postRef;
                if (postSnap.exists()) {
                  return postSnap.data();
                }
              })
            ));

          const data = {
            ...docData,
            posts:
              postData &&
              (postData.filter((post: any) => post !== undefined) as Post[]),
          };
          return data as VideoDataWithPosts;
        })
      );
      setDisplayVideos(filteredVideos);
    };
    setLoading(false);
    fetchPosts();
  }, []);

  const [selectedVideo, setSelectedVideo] = React.useState<
    ReviewData | undefined
  >();

  const orderedVideos = displayVideos?.sort((a: any, b: any) => {
    return a.postDate - b.postDate;
  });

  const scriptsToReview = orderedVideos
    ?.filter((video: any) => {
      return (
        !video.scriptReviewed ||
        !video.scriptReviewed.includes(currentUser?.uid)
      );
    })
    .map((video) => {
      return {
        reviewType: "script",
        videoData: video,
        id: "script-" + video.videoNumber,
      };
    });

  const videosToReview = orderedVideos
    ?.filter((video: any) => {
      return (
        (!video.videoReviewed ||
          !video.videoReviewed.includes(currentUser?.uid)) &&
        video.uploadedVideos &&
        video.uploadedVideos.length > 0
      );
    })
    .map((video) => {
      return {
        reviewType: "video",
        videoData: video,
        id: "video-" + video.videoNumber,
      };
    });

  const itemsToReview = [
    ...(scriptsToReview || []),
    ...(videosToReview || []),
  ] as unknown as ReviewData[];

  itemsToReview.sort((a: any, b: any) => {
    return a.videoData.postDate - b.videoData.postDate;
  }) as ReviewData[];

  console.log("itemsToReview", itemsToReview);

  return (
    <div>
      {/* <div className="h-[500px] flex flex-col gap-4 p-4">
        <h1 className="text-xl text-primary">
          These videos need your approval
        </h1>
        <div className="h-[300px] border bg-foreground/20 flex flex-col gap-2 p-4 rounded-md">
          <div className="border p-4 w-full bg-foreground/40 text-primary rounded-md hover:bg-foreground/50 ">
            <h1 className="text-primary">Review the script for video #1234</h1>
          </div>
          <div className="border p-4 w-full bg-foreground/40 text-primary rounded-md hover:bg-foreground/50 ">
            <h1 className="text-primary">
              Review the uplaoded video for video #1234
            </h1>
          </div>
          <div className="border p-4 w-full bg-foreground/40 text-primary rounded-md hover:bg-foreground/50 ">
            <h1 className="text-primary">Review the script for video #1234</h1>
          </div>
        </div>
      </div> */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`grid  h-[calc(100vh-64px)] pb-4 container gap-8  
        ${selectedVideo ? "grid-cols-[40%_1fr]" : "grid-cols-1"}
        
        `}
        >
          <div className="flex flex-col w-full h-[calc(100vh-64px)] pb-4 gap-4">
            <h1 className="text-xl text-primary">
              These ({itemsToReview.length}) items need your approval
            </h1>
            {/* <div className="h-fit">
              <FilterStatus
                selectedStatus={["video uploaded", "script done"]}
                setSelectedStatus={() => {}}
              />
            </div> */}
            <div className="flex flex-col gap-4 bg-foreground/20 border rounded-md h-full overflow-scroll">
              {/* <div className="p-4 px-6 w-full bg-foreground/40 text-primary flex justify-between ">
                <h1 className="w-[200px] ">Title</h1>
                <h1 className="w-[100px] ">video #</h1>
                <h1 className="w-[100px] text-center">Post date</h1>

                <h1 className="w-[100px] text-center">Script a</h1>
                <h1 className="w-[100px] text-center">Video a</h1>
              </div> */}
              <div className="flex flex-col gap-2 p-2 max-h-full overflow-scroll">
                {itemsToReview &&
                  itemsToReview.map((video) => (
                    <VideoRow
                      video={video}
                      key={video.videoData.id}
                      setSelectedVideo={setSelectedVideo}
                      selectedVideo={selectedVideo}
                    />
                  ))}
              </div>
            </div>
          </div>
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
      )}
    </div>
  );
};

export default VideoReview;

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

const VideoRow = ({
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
  return (
    <button
      onClick={() => setSelectedVideo(video)}
      key={video.videoData.id}
      className={`border p-4 w-full bg-foreground/40 text-primary rounded-md hover:bg-foreground/50 
        ${
          selectedVideo && selectedVideo.id === video.id
            ? "border-primary"
            : "border-border"
        }
        `}
    >
      <h1 className="w-full overflow-hidden text-ellipsis text-left text-lg">
        Review the{" "}
        <span className="font-bold text-blue-800 dark:text-blue-200">
          {video.reviewType == "video" ? "uploaded video" : "script"}{" "}
        </span>
        for video #{video.videoData.videoNumber}
      </h1>
    </button>
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
  console.log("video", video);
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
      (currentUser?.uid &&
        video.videoData.scriptReviewed?.includes(currentUser?.uid)) ||
        false
    );
  }, [video]);

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
                {USERS_DATA.map((user) => (
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
          <Editor post={video.videoData.script} setScript={() => {}} />
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
      {USERS_DATA.map((user) => (
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
    setNotes(videoData.notes);
    setNeedsRevision(videoData.status == "needs revision");
  }, [videoData]);

  const markAsReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoData.videoNumber),
      {
        videoReviewed: [
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
        videoReviewed: video.videoData.scriptReviewed
          ? video.videoData.scriptReviewed?.filter(
              (uid) => uid !== currentUser?.uid
            )
          : [],
      },
      {merge: true}
    );
    setIsReviewed(false);
  };

  const [notes, setNotes] = React.useState(video.videoData.notes);

  // async function updateField(field: string, value: any) {

  //   const updatedVideoData = {
  //     ...videoData,
  //     [field]: value,
  //     updatedAt: {date: new Date(), user: currentUser?.firstName},
  //   };
  //   await setDoc(
  //     doc(db, "videos", video.videoData.videoNumber),
  //     {
  //       [field]: value,
  //       updatedAt: {date: new Date(), user: currentUser?.firstName},
  //     },
  //     {
  //       merge: true,
  //     }
  //   );

  // }

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
    videoData &&
      setVideoData({
        ...videoData,
        status: value,
      });
  };

  const [selectedVideo, setSelectedVideo] = React.useState<
    UploadedVideo | undefined
  >(
    video.videoData.uploadedVideos
      ? video.videoData.uploadedVideos[0]
      : undefined
  );

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
    console.log("Marking as ready to post...", [
      ...(video.videoData.scriptReviewed || []),
      currentUser?.uid,
    ]);
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
        return video;
      });

      console.log("Updated Videos:", updatedVideos);

      // Call updateVideoField with the modified videos
      await updateVideoField(updatedVideos);
      await markAsReviewed();
      // setNeedsRevision(false);

      // Optionally change video status revision
      // await changeVideoStatusRevision("done");
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
        }
        return video;
      });

      // Pass the updated videos to updateVideoField
      await updateVideoField(updatedVideos);
      await markAsNotReviewed();

      // Change video status revision
      await changeVideoStatusRevision("needs revision");
    } catch (error) {
      console.error("Error marking video as needs revision:", error);
    }
  };

  useEffect(() => {
    if (selectedVideo && selectedVideo?.revisionNotes)
      setNotes(selectedVideo.revisionNotes);
  }, [selectedVideo]);

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
                {videoData && videoData.status && (
                  <div className="flex items-center gap-1">
                    {videoData.status == "needs revision" ? (
                      <Icons.warning className="h-6 w-6 text-red-600" />
                    ) : (
                      <Icons.check className="h-6 w-6 text-green-600" />
                    )}
                    {
                      videoStatuses.find((s) => s.value == videoData.status)
                        ?.label
                    }
                  </div>
                )}
              </span>
            </div>
            <div className="flex flex-col ">
              <h1 className="font-bold text-lg">Reviewed by</h1>
              <div className="gap-4 flex text-base">
                {USERS_DATA.map((user) => (
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
          <div className="flex flex-col gap-4 ">
            <div className="flex w-full s">
              <div className="flex flex-col w-fit ">
                <div className="h-[550px] aspect-[9/16] relative rounded-md rounded-br-none overflow-hidden bg-foreground/40 p-4 ">
                  <video
                    autoPlay
                    src={selectedVideo && selectedVideo.videoURL}
                    className="w-full h-full object-cover rounded-md"
                    controls
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-4  items-center">
                <div className=" flex flex-col p-4 gap-4  flex-grow border  rounded-md w-[90%] ">
                  {currentUser &&
                    videoData &&
                    videoData.videoReviewed?.includes(currentUser.uid) &&
                    selectedVideo?.needsRevision && (
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
                          value={selectedVideo?.revisionNotes}
                          onChange={(e) => {
                            setNotes(e.target.value);
                            if (!uploadedVideos) return;
                            const updatedVideos = uploadedVideos.map(
                              (video) => {
                                if (video.videoURL === selectedVideo.videoURL) {
                                  return {
                                    ...video,
                                    revisionNotes: e.target.value,
                                  };
                                }
                                return video;
                              }
                            );
                            updateVideoField(updatedVideos);
                          }}
                          className="w-full border p-2 flex items-center rounded-md text-sm bg-foreground/40 flex-grow"
                        />
                      </div>
                    )}
                  {currentUser &&
                    videoData &&
                    videoData.videoReviewed?.includes(currentUser.uid) &&
                    selectedVideo?.isReadyToPost && (
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
                  {currentUser &&
                    videoData &&
                    !videoData.videoReviewed?.includes(currentUser.uid) && (
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
                </div>
                {/* <div className="flex flex-col gap-2 w-full">
              {needsRevision && (
                <>
                  <Label className="text-lg" htmlFor="notes">
                    Revision Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add video notes here..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      updateField("notes", e.target.value);
                    }}
                    className="w-full border p-2 flex items-center rounded-md text-sm h-full"
                  />
                </>
              )}
              <div className="flex items-center gap-2">
                {needsRevision ? (
                  <Button onClick={toggleNeedsRevision}>
                    Video doesn&apos;t need revision
                  </Button>
                ) : (
                  <Button onClick={toggleNeedsRevision}>
                    Video needs revision
                  </Button>
                )}
              </div>
            </div> */}
                {uploadedVideos && uploadedVideos.length > 0 ? (
                  <div className="flex gap-1 flex-col w-full h-[200px] mt-auto p-2 bg-foreground/40 rounded-r-md">
                    <h1 className="text-lg">
                      Uploaded videos ({uploadedVideos.length})
                    </h1>
                    <div className="flex flex-col gap-2 flex-grow   rounded-md">
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
                  </div>
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
            <video
              src={post.videoURL}
              className="w-full h-full object-cover"
              controls
            />
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
            ? video.script.blocks.map((block) => block.data.text).join(" ") ||
              video.script.blocks.map((block) => block.data.items).join(" ")
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
