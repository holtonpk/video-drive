import {promises as fs} from "fs";
import path from "path";
import {Metadata} from "next";
import Image from "next/image";
import {z} from "zod";

import {columns} from "./components/columns";
import {DataTable} from "./components/data-table";
import {Video} from "./data/schema";
import {db} from "@/config/firebase";
import {doc, getDocs, collection, query, orderBy} from "firebase/firestore";

import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Icons} from "@/components/icons";
export const metadata: Metadata = {
  title: "Video Sheet",
  description: "A list of videos for this month",
};

const url = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

async function getVideos() {
  console.log("url", `${url}/api/videos`);
  const videos = await fetch(`${url}/api/videos`, {
    cache: "no-store",
  });

  const videoData = await videos.json();

  return videoData as Video[];
}

export default async function VideoSheetPage() {
  const videos = await getVideos();

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
        <div className="p-4 border rounded-md">
          <DataTable data={videos} columns={columns} />
        </div>
      </div>
    </>
  );
}
