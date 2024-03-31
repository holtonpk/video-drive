"use client";
import React, {useEffect} from "react";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Post, clients} from "@/config/data";
import {Icons} from "@/components/icons";
import {VideoProvider, useVideo} from "./data/video-context";
import {VideoAssets} from "./components/video-assets";
import {VideoDetails} from "./components/video-details";
import {PostDetails} from "./components/post-details";
import {VideoScript} from "./components/script";

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
    <div className=" w-screen  flex flex-col space-y-4">
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
      let postsLocal: Post[] = [];
      video.postIds?.forEach(async (postId) => {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          postsLocal.push(postSnap.data() as Post);
        }
      });
      setPosts(postsLocal);

      setIsLoading(false);
    }

    if (video) {
      fetchPost();
    }
  }, [video]);

  const clientData = clients.find((client) => client.value === video.clientId);

  return (
    <div className="">
      <div className="h-fit bg-card p-2 flex flex-col">
        <h1 className="font-bold">{video.title}</h1>
        <div className="flex flex-row items-center gap-2">
          {clientData?.icon && (
            <clientData.icon className="h-5 w-5 rounded-md" />
          )}
          <span className="font-bold text-xl">{clientData?.label}</span>
        </div>
      </div>
      {isLoading ? (
        <>loading</>
      ) : (
        <div className="flex flex-col h-screen w-screen snap-y overflow-scroll">
          <div className=" flex flex-col h-fit ">
            {posts?.map((post, index) => (
              <div
                key={index}
                className=" z-10  w-screen snap-center  aspect-[9/16] overflow-hidden relative"
              >
                {post.videoURL && <VideoPlayer videoURL={post.videoURL} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayer = ({videoURL}: {videoURL: string}) => {
  return (
    <video
      controls
      className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-20"
      src={videoURL}
    />
  );
};
