"use client";
import React, {useEffect} from "react";
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

export default function VideoPage({videoId}: {videoId: string}) {
  const [video, setVideo] = React.useState<VideoData | null>(null);

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
    <div className=" w-screen max-h-screen sm:max-h-none  flex flex-col space-y-4">
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

  const [notes, setNotes] = React.useState<string>(video.notes);

  async function updateField(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        [field]: value,
        updatedAt: new Date(),
      },
      {
        merge: true,
      }
    );
  }

  const clientData = clients.find((client) => client.value === video.clientId);
  const status = statuses.find((status) => status.value === video.status);

  console.log("posts", posts);
  return (
    <div className="">
      {isLoading ? (
        <>loading</>
      ) : (
        <div className="flex flex-col h-screen w-screen snap-y overflow-scroll ">
          <div className=" flex flex-col h-fit ">
            <div className="h-screen relative justify-center items-center bg-card p-2 flex flex-col snap-center">
              <h1 className="font-bold text-2xl">{"#" + video.videoNumber}</h1>

              <h1 className="font-bold text-2xl">{video.title}</h1>
              <div className="flex flex-row items-center gap-2">
                {clientData?.icon && (
                  <clientData.icon className="h-5 w-5 rounded-md" />
                )}
                <span className="font-bold text-xl">{clientData?.label}</span>
              </div>
              {status && (
                <div className="flex items-center ">
                  <span className="font-bold mr-2">Status:</span>
                  {status.icon && (
                    <status.icon
                      className={`mr-2 h-4 w-4 
          ${
            status.value === "done"
              ? "text-green-500"
              : status.value === "todo"
              ? "text-blue-500"
              : status.value === "draft"
              ? "text-yellow-500"
              : "text-red-500"
          }
          `}
                    />
                  )}
                  <span>{status.label}</span>
                </div>
              )}
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
                className=" z-10  w-screen snap-center  aspect-[9/16] overflow-hidden relative"
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
  const [play, setPlay] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPlay(true); // Play video when it's visible
        } else {
          setPlay(false); // Pause video when it's not visible
        }
      });
    };

    // Create an Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the viewport
      threshold: 0.5, // Trigger when at least 50% of the video is visible
    });

    if (videoElement) {
      observer.observe(videoElement); // Start observing the video
    }

    // Cleanup function
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement); // Stop observing when component unmounts
      }
    };
  }, [videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      if (play) videoRef.current.play();
      if (!play) videoRef.current.pause();
    }
  }, [play, videoRef]);

  console.log("play", videoURL);

  return (
    <div className="w-full h-screen relative bg-muted">
      <div className="w-full p-2">
        <h1>{post.title}</h1>
      </div>
      <button
        onClick={() => setPlay(!play)}
        className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-30 "
      >
        {!play && <Icons.play className="h-20 w-20 text-white fill-white" />}
      </button>
      <video
        webkit-playsinline
        playsInline
        ref={videoRef}
        autoPlay
        loop
        autoPlay={play}
        className="w-full aspect-[9/16]   z-20 mobileVideo"
        src={videoURL}
      />
    </div>
  );
};
