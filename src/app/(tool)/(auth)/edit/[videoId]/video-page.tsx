"use client";
import React, {useEffect, useRef} from "react";
import {doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Post, clients, statuses, ADMIN_USERS} from "@/config/data";
import {Icons} from "@/components/icons";
import {VideoProvider, useVideo} from "./data/video-context";
import {VideoDetails} from "./components/video-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Requirements from "./components/requirements";
import {Logo} from "@/components/icons";
import AuthModal from "@/components/auth/auth-modal";
import {useAuth} from "@/context/user-auth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

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

  const {currentUser} = useAuth()!;

  if (
    video &&
    currentUser &&
    currentUser.uid !== video.editor &&
    ADMIN_USERS.includes(currentUser.uid) === false
  ) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-foreground">
        Sorry you don&apos;t have access to this video
      </div>
    );
  }

  return (
    <>
      {video ? (
        <VideoProvider videoData={video}>
          <div className=" grid w-[600px] max-w-screen h-full  gap-10 items-center  pb-10">
            <VideoDetails />
            <Requirements />
          </div>
        </VideoProvider>
      ) : (
        <div
          className="  w-[600px] max-w-screen h-[400px] 
         rounded-md flex items-center justify-center"
        >
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}
