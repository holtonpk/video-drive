"use client";
import React, {useEffect, useRef} from "react";
import {doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Post, clients, statuses} from "@/config/data";
import {Icons} from "@/components/icons";
import {VideoProvider, useVideo} from "./data/video-context";
import {VideoAssets} from "./components/video-assets";
import {VideoDetails} from "./components/video-details";
import {PostDetails} from "./components/post-details";
import {VideoScript} from "./components/script";
import {formatDaynameMonthDay} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {set} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useAuth} from "@/context/user-auth";
export default function VideoPage({videoId}: {videoId: string}) {
  const [video, setVideo] = React.useState<VideoData | null>(null);

  console.log("video", video);

  useEffect(() => {
    const videoRef = doc(db, "videos", videoId);

    const unsubscribe = onSnapshot(videoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setVideo(docSnapshot.data() as VideoData);
      } else {
        setVideo(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [videoId]);

  return (
    <div className=" w-screen max-h-screen sm:max-h-none overflow-hidden sm:overflow-visible  flex flex-col space-y-4">
      {video ? (
        <VideoProvider videoData={video}>
          <div className=" flex-col w-full gap-10 items-center p-8 container hidden sm:flex">
            <VideoDetails />
            <PostDetails />
            <VideoScript />
            <VideoAssets />
          </div>
          <MobileVideoView />
        </VideoProvider>
      ) : (
        <div
          className="w-full h-[400px] 
        border rounded-md flex items-center justify-center"
        >
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

const MobileVideoView = () => {
  const {video} = useVideo()!;
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    async function fetchPost() {
      if (!video) return;

      const postIds = video.postIds ?? [];
      const postsLocal = await Promise.all(
        postIds.map(async (postId: string) => {
          const postRef = doc(db, "posts", postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            return postSnap.data();
          }
          return null;
        })
      );

      const filteredPosts = postsLocal.filter(
        (post) => post !== null
      ) as Post[];
      setPosts(filteredPosts);
      setIsLoading(false);
    }

    fetchPost();
  }, [video]);

  const {currentUser} = useAuth()!;

  const [notes, setNotes] = React.useState<string>(video.notes ?? "");
  const [status, setStatus] = React.useState<string>(video.status);

  async function updateField(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }

  const clientData = clients.find((client) => client.value === video.clientId);

  console.log("posts", posts);
  return (
    <div className=" md:hidden">
      {isLoading ? (
        <>loading</>
      ) : (
        <div className="flex flex-col h-screen w-screen  overflow-scroll ">
          <div className=" flex flex-col h-fit items-center">
            <div
              className={`h-[95vh] w-[90%] relative justify-center items-center  p-2 flex flex-col snap-center border-4 rounded-md mb-8
            ${
              status === "done"
                ? "border-green-500/20 bg-green-500/10"
                : status === "todo"
                ? "border-blue-500/20 bg-blue-500/10"
                : status === "draft"
                ? "border-yellow-500/20 bg-yellow-500/10"
                : "border-red-500/20 bg-red-500/10"
            }
            
            `}
            >
              <h1 className="font-bold text-2xl">{"#" + video.videoNumber}</h1>

              <h1 className="font-bold text-2xl">{video.title}</h1>
              <div className="flex flex-row items-center gap-2">
                {clientData?.icon && (
                  <clientData.icon className="h-5 w-5 rounded-md" />
                )}
                <span className="font-bold text-xl">{clientData?.label}</span>
              </div>
              <Select
                defaultValue={status}
                onValueChange={(value) => {
                  setStatus(value);
                  updateField("status", value);
                }}
              >
                <SelectTrigger
                  id="status"
                  className=" w-[200px] truncate absolute top-4 right-4"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex flex-nowrap"
                    >
                      <div className="flex items-center">
                        {option.icon && (
                          <option.icon
                            className={`mr-2 h-4 w-4 text-muted-foreground rounded-sm
                    ${
                      option.value === "done"
                        ? "stroke-green-500 "
                        : option.value === "todo"
                        ? "stroke-blue-500"
                        : option.value === "draft"
                        ? "stroke-yellow-500"
                        : "stroke-red-500"
                    }
                    `}
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex">
                <span className="font-bold">Post Date:</span>
                <span>{formatDaynameMonthDay(video.postDate)}</span>
              </div>
              <div className="flex">
                <span className="font-bold">Script Due:</span>
                <span>{formatDaynameMonthDay(video.scriptDueDate)}</span>
              </div>
              <div className="flex">
                <span className="font-bold">Editing Due:</span>
                <span>{formatDaynameMonthDay(video.dueDate)}</span>
              </div>
              <div className="grid gap-1 mt-3 w-[90%]">
                <span className="font-bold">Notes</span>

                <Textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    updateField("notes", e.target.value);
                  }}
                  className="w-full h-24"
                />
              </div>
              <div className="mt-20 flex flex-col items-center absolute bottom-4 left-1/2 -translate-x-1/2">
                Scroll down to see video
                <br />
                <Icons.chevronDown className="h-5 w-5 animate-bounce" />
              </div>
            </div>
            {[...(posts || [])]?.reverse().map((post, index) => (
              <div
                key={index}
                className=" z-10  w-screen  aspect-[9/16] overflow-hidden relative"
              >
                {post.videoURL && (
                  <VideoPlayer videoURL={post.videoURL} post={post} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayer = ({videoURL, post}: {videoURL: string; post: Post}) => {
  // const [play, setPlay] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="w-full h-screen relative  border rounded-md">
      <div className="w-full p-2 font-bold">
        <h1>{post.title}</h1>
      </div>
      <button
        onClick={togglePlay}
        className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-30 "
      >
        {!isPlaying && (
          <Icons.play className="h-20 w-20 text-white fill-white" />
        )}
      </button>
      <video
        webkit-playsinline
        playsInline
        ref={videoRef}
        loop
        className="w-full aspect-[9/16]   z-20 mobileVideo"
        src={videoURL}
      />
    </div>
  );
};
