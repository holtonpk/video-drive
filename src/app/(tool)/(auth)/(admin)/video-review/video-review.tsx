"use client";

import React, {useEffect} from "react";
import {db} from "@/config/firebase";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  clients,
  VideoData,
  Post,
  VideoDataWithPosts,
  statuses,
} from "@/config/data";
import {formatDaynameMonthDay} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {PlusCircle} from "lucide-react";
import {Editor} from "./script/script-edit";

const VideoReview = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const [displayVideos, setDisplayVideos] = React.useState<
    VideoDataWithPosts[] | undefined
  >();

  useEffect(() => {
    const fetchPosts = async () => {
      // Set the time to the start of the day (00:00:00)

      const docsQuery = query(
        collection(db, "videos"),
        where("status", "!=", "done")
      );
      const querySnapshot = await getDocs(docsQuery);

      const filteredVideos = await Promise.all(
        querySnapshot.docs.map(async (docRef) => {
          const docData = docRef.data();
          console.log("docData", docData);

          const postData =
            docData.postIds &&
            (await Promise.all(
              docData.postIds.map(async (postId: string) => {
                const postDoc = doc(db, "posts", postId);
                const postRef = getDoc(postDoc);
                const postSnap = await postRef;
                if (postSnap.exists()) {
                  return postSnap.data();
                }
              })
            ));

          const data = {
            ...docData,
            posts:
              postData &&
              (postData.filter((post: any) => post !== undefined) as Post[]),
          };
          return data as VideoDataWithPosts;
        })
      );
      setDisplayVideos(filteredVideos);
    };
    setLoading(false);

    fetchPosts();
  }, []);

  const [selectedVideo, setSelectedVideo] = React.useState<
    VideoDataWithPosts | undefined
  >(displayVideos && displayVideos[0]);

  type statuses = "script done" | "video done" | "video needs revision";

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-[60%_1fr] h-[calc(100vh-64px)] pb-4 container gap-8">
          <div className="flex flex-col w-full h-[calc(100vh-64px)] pb-4 gap-4">
            <div className="h-fit">
              <FilterStatus
                selectedStatus={["todo"]}
                setSelectedStatus={() => {}}
              />
            </div>
            <div className="flex flex-col gap-4 bg-foreground/20 p-2 border rounded-md h-full overflow-scroll">
              {displayVideos &&
                displayVideos.map((video) => (
                  <VideoRow
                    video={video}
                    key={video.id}
                    setSelectedVideo={setSelectedVideo}
                  />
                ))}
            </div>
          </div>
          {selectedVideo && (
            <SelectedVideo key={selectedVideo.id} video={selectedVideo} />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoReview;

export function FilterStatus({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className=" flex h-9  items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {statuses.map((status) => {
              return (
                <button
                  key={status.value}
                  className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
                  onClick={() => {
                    if (selectedStatus?.includes(status.value)) {
                      setSelectedStatus(
                        selectedStatus?.filter((u) => u != status.value)
                      );
                    } else {
                      setSelectedStatus([
                        ...(selectedStatus || []),
                        status.value,
                      ]);
                    }
                  }}
                >
                  {status.label === "todo" ? "Video Done" : status.label}
                  {selectedStatus?.includes(status.value) && (
                    <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                  )}
                </button>
              );
            })}
          </>
        </PopoverContent>
      </Popover>
      {selectedStatus?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedStatus.map((status) => (
              <div
                key={status}
                className="bg-foreground dark:bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status)
                    );
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {statuses.find((u) => u.value == status)?.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const VideoRow = ({
  video,
  setSelectedVideo,
}: {
  video: VideoDataWithPosts;
  setSelectedVideo: React.Dispatch<
    React.SetStateAction<VideoDataWithPosts | undefined>
  >;
}) => {
  const client = clients.find((c: any) => c.value === video.clientId)!;

  return (
    <button
      onClick={() => setSelectedVideo(video)}
      key={video.id}
      className="border p-4 w-full bg-foreground/40 text-primary rounded-md"
    >
      <h2>{video.title}</h2>
      <h2>{video.clientId}</h2>
      <h2>Post Date:{formatDaynameMonthDay(video.postDate)}</h2>
      <div className="flex gap-2">
        <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />
        <span className="relative z-20 pointer-events-none font-bold">
          {client.label}
        </span>
      </div>
    </button>
  );
};

const SelectedVideo = ({video}: {video: VideoDataWithPosts}) => {
  // console.log("video", JSON.stringify(video.script));

  const client = clients.find((c: any) => c.value === video.clientId)!;

  return (
    <div
      id={video.videoNumber}
      className="w-full h-full rounded-md flex flex-col border p-8 text-primary gap-4"
    >
      <h1 className="font-bold text-2xl">{video.title}</h1>
      <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm relative z-20 pointer-events-none" />

      <Editor post={video.script} setScript={() => {}} />
    </div>
  );
};
