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
import Uploads from "./components/uploads";
import Link from "next/link";

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
          <Link
            href="/dashboard"
            className="flex flex-row items-center text-primary px-4 hover:opacity-80"
          >
            <Icons.chevronLeft className="h-8 w-8 text-primary" />
            back to dashboard
          </Link>
          <div className=" grid gap-6 md:gap-0 md:grid-cols-[60%_40%] container   overflow-hidden p-6   w-screen h-fit  bg-transparent  pb-10">
            <div className="w-full  md:pr-3">
              <VideoDetails />
            </div>
            <Uploads />
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
