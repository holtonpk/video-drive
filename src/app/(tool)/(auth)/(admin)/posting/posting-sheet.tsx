"use client";
import React, {useEffect} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Icons} from "@/components/icons";
import {
  collection,
  query,
  getDocs,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {cn} from "@/lib/utils";
import {
  clients,
  VideoData,
  Post,
  VideoDataWithPosts,
  platforms,
} from "@/config/data";
import {format} from "date-fns";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {AssetType} from "@/src/app/(tool)/(auth)/(admin)/new-video/new-video-context";
import {get} from "http";

const PostingSheet = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [loading, setLoading] = React.useState<boolean>(true);

  const [displayVideos, setDisplayVideos] = React.useState<
    VideoDataWithPosts[] | undefined
  >();

  useEffect(() => {
    const fetchPosts = async () => {
      if (date) {
        // Set the time to the start of the day (00:00:00)
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        // Create a new date object for the end of the day (23:59:59)
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const docsQuery = query(
          collection(db, "videos"),
          where("postDate", ">=", startOfDay),
          where("postDate", "<=", endOfDay)
        );
        const querySnapshot = await getDocs(docsQuery);

        const filteredVideos = await Promise.all(
          querySnapshot.docs.map(async (docRef) => {
            const docData = docRef.data();

            const postData = await Promise.all(
              docData.postIds.map(async (postId: string) => {
                const postDoc = doc(db, "posts", postId);
                const postRef = getDoc(postDoc);
                const postSnap = await postRef;
                if (postSnap.exists()) {
                  return postSnap.data();
                }
              })
            );

            const data = {
              ...docData,
              posts: postData.filter((post) => post !== undefined) as Post[],
            };
            return data as VideoDataWithPosts;
          })
        );
        setDisplayVideos(filteredVideos);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [date]);

  return (
    <div className="flex flex-col gap-8 justify-center  items-center py-10 w-screen md:px-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className=" rounded-md shadow-md border w-fit h-fit"
      />

      {loading ? (
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      ) : (
        <div className="w-full  ">
          {displayVideos && displayVideos.length > 0 ? (
            <div className="flex flex-col gap-2 p-2 md:p-8">
              <h1>Posts Scheduled for {date && format(date, "PPP")}</h1>
              {displayVideos.map((video: any) => (
                <PostRow video={video} key={video.id} />
              ))}
            </div>
          ) : (
            <h1 className="p-4">No posts scheduled for this date</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default PostingSheet;

const PostRow = ({video}: {video: VideoDataWithPosts}) => {
  const client = clients.find((c: any) => c.value === video.clientId)!;

  const [copied, setCopied] = React.useState<boolean>(false);

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);

  const downloadFile = async (videoUrl: string, title: string) => {
    setIsDownloading(true);

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = title + ".mp4";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
    setIsDownloading(false);
  };

  return (
    <div
      className={`w-full rounded-md border-4 p-3 flex  flex-col  gap-4 relative justify-between overflow-hidden
    ${
      video.status === "done"
        ? "border-green-500/20"
        : video.status === "todo"
        ? "border-blue-500/20"
        : video.status === "draft"
        ? "border-yellow-500/20"
        : "border-red-500/20"
    }
    
    `}
    >
      <Link
        href={`/video/${video.videoNumber}`}
        className="grid grid-cols-[24px_1fr] gap-2 hover:opacity-40s"
      >
        <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />
        <span className="relative z-20 pointer-events-none font-bold">
          {video.title}
        </span>
      </Link>
      {video.posts.map((post: Post) => (
        <>
          {post?.videoURL || post.caption ? (
            <div className="w-full flex flex-col md:flex-row border gap-4 rounded-md p-2 items-center justify-between ">
              {post.platforms ? (
                <div className="flex flex-row gap-2">
                  {post.platforms.map((platform) => {
                    const platformObj = platforms.find(
                      (p) => p.value === platform
                    );
                    if (!platformObj) return null;
                    return (
                      <platformObj.icon key={platform} className="h-10 w-10" />
                    );
                  })}
                </div>
              ) : (
                <span className="text-destructive">No platforms selected</span>
              )}
              <div className="flex flex-col w-full md:w-fit md:flex-row gap-2">
                {post.caption && (
                  <Button
                    onClick={() => copyCaption(post.caption as string)}
                    variant={"outline"}
                    className="relative z-20  w-full md:w-fit"
                  >
                    {copied ? (
                      <>Copied</>
                    ) : (
                      <>
                        <Icons.copy className="h-5 w-5 mr-2" />
                        Copy Caption
                      </>
                    )}
                  </Button>
                )}
                {post.videoURL && (
                  <Button
                    onClick={() =>
                      downloadFile(post.videoURL as string, video.title)
                    }
                    className="relative z-20 w-full md:w-fit"
                  >
                    {isDownloading ? (
                      <Icons.spinner className="h-5 w-5 animate-spin mr-2 " />
                    ) : (
                      <Icons.download className="h-5 w-5  mr-2" />
                    )}
                    Download Video
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 justify-center items-center p-2 ">
              <span className="text-destructive">Video not uploaded</span>
              <Link
                target="_blank"
                href={`/video/${video.videoNumber}`}
                className={cn(
                  buttonVariants({variant: "outline"}),
                  "relative w-fit"
                )}
              >
                View Video
              </Link>
            </div>
          )}
        </>
      ))}
    </div>
  );
};
