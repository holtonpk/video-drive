"use client";
import React from "react";
import {promises as fs} from "fs";
import path from "path";
import {Metadata} from "next";
import Image from "next/image";
import {z} from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import {statuses} from "./data/data";
export default function VideoSheetPage() {
  const [videos, setVideos] = React.useState<Video[]>([]);

  useEffect(() => {
    const docsQuery = query(
      collection(db, "videos"),
      orderBy("dueDate", "asc")
    );

    const unsubscribe = onSnapshot(docsQuery, (querySnapshot) => {
      const videos: Video[] = [];
      querySnapshot.forEach((doc) => {
        videos.push(doc.data() as Video);
      });

      // Custom sort function to order by status
      videos.sort((a, b) => {
        const statusOrder = ["needs revision", "todo", "draft", "done"];
        const indexA = statusOrder.indexOf(a.status.toLowerCase());
        const indexB = statusOrder.indexOf(b.status.toLowerCase());
        return indexA - indexB;
      });

      setVideos(videos);
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  console.log(videos);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-4 p-4 md:flex">
        <Card className="">
          <CardHeader>
            <CardTitle className="font-bold">Status Key</CardTitle>
            <CardDescription>What the statuses mean</CardDescription>
          </CardHeader>
          <CardContent>
            {statuses.map((status) => (
              <div key={status.value} className="flex items-center">
                {status.icon && (
                  <status.icon
                    className={`mr-2 h-4 w-4 text-muted-foreground rounded-sm
                        ${
                          status.value === "done"
                            ? "stroke-green-500 "
                            : status.value === "todo"
                            ? "stroke-blue-500"
                            : status.value === "draft"
                            ? "stroke-yellow-500"
                            : "stroke-red-500"
                        }
                        
                        `}
                  />
                )}
                <span className="font-bold">{status.label + " - "}</span>
                <span>{status.description}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {videos && videos.length > 0 ? (
          <div className="p-4 border rounded-md">
            <DataTable data={videos} columns={columns} />
          </div>
        ) : (
          <div className="w-full h-[400px] border rounded-md flex items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </>
  );
}
