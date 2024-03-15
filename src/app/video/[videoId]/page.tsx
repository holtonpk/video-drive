import React from "react";
import VideoInfo from "./video-info";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData} from "@/src/app/video/[videoId]/data/data";

// Simulate a database read for tasks.
async function getVideos(videoId: string) {
  try {
    const docSnapshot = await getDoc(doc(db, "videos", videoId));
    if (docSnapshot.exists()) {
      console.log("Document data:", docSnapshot.data());
      return docSnapshot.data() as VideoData; // Return the document data
    } else {
      console.log("No such document!");
      return null; // Return null if the document doesn't exist
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return null; // Return null in case of an error
  }
}

export default async function Page({params}: {params: {videoId: string}}) {
  const video = await getVideos(params.videoId);

  if (!video) {
    // Handle the case where video is null, maybe show an error message or a different component
    return <div>No video found</div>;
  }
  return (
    <div className=" w-screen  flex flex-col space-y-4">
      <VideoInfo video={video} />
    </div>
  );
}
