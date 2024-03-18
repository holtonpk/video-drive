"use client";
import React, {useEffect} from "react";
import VideoInfo from "./video-info";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData} from "@/src/app/(tool)/[videoId]/data/data";
import {Icons} from "@/components/icons";

// Simulate a database read for tasks.
// async function getVideos(videoId: string) {
//   try {
//     const docSnapshot = await getDoc(doc(db, "videos", videoId));
//     if (docSnapshot.exists()) {
//       console.log("Document data:", docSnapshot.data());
//       return docSnapshot.data() as VideoData; // Return the document data
//     } else {
//       console.log("No such document!");
//       return null; // Return null if the document doesn't exist
//     }
//   } catch (error) {
//     console.log("Error getting document:", error);
//     return null; // Return null in case of an error
//   }
// }

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
        <VideoInfo video={video} />
      ) : (
        <div className="w-full h-[400px] border rounded-md flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
