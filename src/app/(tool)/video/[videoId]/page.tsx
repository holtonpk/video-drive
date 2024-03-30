"use client";
import React, {useEffect} from "react";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData} from "@/config/data";
import {Icons} from "@/components/icons";
import {VideoProvider} from "./data/video-context";
import {VideoAssets} from "./components/video-assets";
import {VideoDetails} from "./components/video-details";
import {PostDetails} from "./components/post-details";
import {VideoScript} from "./components/script";

export default function Page({params}: {params: {videoId: string}}) {
  const [video, setVideo] = React.useState<VideoData | null>(null);

  useEffect(() => {
    const videoRef = doc(db, "videos", params.videoId);

    const unsubscribe = onSnapshot(videoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setVideo(docSnapshot.data() as VideoData);
      } else {
        setVideo(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [params.videoId]);

  return (
    <div className=" w-screen  flex flex-col space-y-4">
      {video ? (
        <VideoProvider videoData={video}>
          <div className=" flex flex-col w-full gap-10 items-center p-8 container">
            <VideoDetails />
            <PostDetails />
            <VideoScript />
            <VideoAssets />
          </div>
        </VideoProvider>
      ) : (
        <div className="w-full h-[400px] border rounded-md flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
