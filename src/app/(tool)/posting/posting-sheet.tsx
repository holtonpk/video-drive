"use client";
import React, {useEffect} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Icons} from "@/components/icons";
import {collection, query, getDocs, where} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData} from "@/src/app/(tool)/video/[videoId]/data/data";
import {clients} from "@/src/app/(tool)/video/[videoId]/data/data";
import {format} from "date-fns";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {AssetType} from "@/src/app/(tool)/new-video/new-video-context";

const PostingSheet = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [loading, setLoading] = React.useState<boolean>(true);

  const [displayVideos, setDisplayVideos] = React.useState<
    VideoData[] | undefined
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
        const filteredVideos = querySnapshot.docs.map(
          (doc) => doc.data() as VideoData
        );
        setDisplayVideos(filteredVideos);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [date]);

  return (
    <div className="flex flex-col gap-8 justify-center  items-center py-10 w-screen px-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className=" rounded-md shadow-md border w-fit h-fit"
      />

      {loading ? (
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      ) : (
        <Card className="w-full">
          {displayVideos && displayVideos.length > 0 ? (
            <div className="flex flex-col gap-2 p-8">
              <h1>Posts Scheduled for {date && format(date, "PPP")}</h1>
              {displayVideos.map((video: any) => (
                <PostRow video={video} key={video.id} />
              ))}
            </div>
          ) : (
            <h1 className="p-4">No posts scheduled for this date</h1>
          )}
        </Card>
      )}
    </div>
  );
};

export default PostingSheet;

const PostRow = ({video}: {video: VideoData}) => {
  const client = clients.find((c: any) => c.value === video.client)!;

  const [copied, setCopied] = React.useState<boolean>(false);

  const copyCaption = () => {
    navigator.clipboard.writeText(video?.caption as string);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const downloadVideo = async () => {
    console.log("Video URL:", video.videoURL);
    if (!video.videoURL) return;
    try {
      const response = await fetch(video.videoURL);
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      const blob = await response.blob();
      if (blob.size > 0) {
        const downloadUrl = window.URL.createObjectURL(blob);
        window.location.href = downloadUrl; // This might start the download directly
      } else {
        console.error("Received empty blob.");
      }
      console.log("Blob:", blob);
      const downloadUrl = window.URL.createObjectURL(blob);
      console.log("Download URL:", downloadUrl);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "test.mp4"; // Assuming the file is an MP4 video
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <div className="w-full rounded-md border p-3 flex items-center gap-2 relative justify-between overflow-hidden">
      <div className="grid grid-cols-[24px_1fr] gap-2">
        <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />
        <span className="relative z-20 pointer-events-none">{video.title}</span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={copyCaption}
          variant={"outline"}
          className="relative z-20 w-fit"
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
        <Button onClick={downloadVideo} className="relative z-20 w-fit">
          <Icons.download className="h-5 w-5  mr-2" />
          Download Video
        </Button>
      </div>
      <Link
        href={`/video/${video.videoNumber}`}
        className="w-full absolute h-full left-0 right-0 z-10 hover:bg-muted"
      ></Link>
    </div>
  );
};
