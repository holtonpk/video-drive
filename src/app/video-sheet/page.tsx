"use client";
import React from "react";
import {promises as fs} from "fs";
import path from "path";
import {Metadata} from "next";
import Image from "next/image";
import {z} from "zod";

import {columns} from "./components/columns";
import {DataTable} from "./components/data-table";
import {Video} from "./data/schema";
import {db} from "@/config/firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {use, useEffect} from "react";

const url = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

// async function getVideos() {
//   const videos = await fetch(`${url}/api/videos`, {
//     cache: "no-store",
//   });

//   const videoData = await videos.json();

//   return videoData as Video[];
// }

export default function VideoSheetPage() {
  const [videos, setVideos] = React.useState<Video[]>([]);

  useEffect(() => {
    const docsQuery = query(
      collection(db, "videos"),
      orderBy("dueDate", "desc")
    );

    const unsubscribe = onSnapshot(docsQuery, (querySnapshot) => {
      const videos: Video[] = [];
      querySnapshot.forEach((doc) => {
        videos.push(doc.data() as Video);
      });

      // Custom sort function to order by status
      videos.sort((a, b) => {
        const statusOrder = ["needs revision", "in progress", "todo", "done"];
        const indexA = statusOrder.indexOf(a.status.toLowerCase());
        const indexB = statusOrder.indexOf(b.status.toLowerCase());
        return indexA - indexB;
      });

      setVideos(videos);
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-4 p-4 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Video Sheet</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of videos for this month
            </p>
          </div>
          <Link
            href={"/new-video"}
            className={buttonVariants({variant: "default"})}
          >
            <Icons.add className="h-5 w-5 mr-2" />
            New Video
          </Link>
        </div>
        {videos && videos.length > 0 ? (
          <div className="p-4 border rounded-md">
            <DataTable data={videos} columns={columns} />
          </div>
        ) : (
          <>loading ...</>
        )}
      </div>
    </>
  );
}
