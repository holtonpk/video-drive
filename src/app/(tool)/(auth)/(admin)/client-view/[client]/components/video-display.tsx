"use client";

import React, {useEffect} from "react";
import VideoPlayer from "@/components/ui/video-player";
import {
  ADMIN_USERS,
  EDITORS,
  Post,
  VideoData,
  clients,
  UploadedVideo,
  statuses,
} from "@/config/data";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {VideoDetails} from "./video-details";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/video-review/script/script-edit";
import {EditorJsRender} from "@/src/app/(tool)/(auth)/(admin)/video-review/video-review";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {db} from "@/config/firebase";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {useAuth} from "@/context/user-auth";

import {VideoDataWithPosts, REVIEW_USERS_DATA} from "@/config/data";
import {formatDaynameMonthDay, formatAsUSD} from "@/lib/utils";
import {statuses as videoStatuses} from "@/config/data";
import {OutputData} from "@editorjs/editorjs";

type ReviewData = {
  reviewType: "script" | "video" | "payout";
  videoData: VideoData;
  id: string;
};

export const VideoDisplay = ({
  video,
  setDisplayedVideo,
}: {
  video: VideoData;
  setDisplayedVideo: React.Dispatch<
    React.SetStateAction<VideoData | undefined>
  >;
}) => {
  const [selectedVideo, setSelectedVideo] = React.useState<
    UploadedVideo | undefined
  >(video.uploadedVideos ? video.uploadedVideos[0] : undefined);

  const [uploadedVideos, setUploadedVideos] = React.useState<
    UploadedVideo[] | undefined
  >(video.uploadedVideos ? video.uploadedVideos : undefined);

  const {currentUser} = useAuth()!;

  const [isReviewed, setIsReviewed] = React.useState(
    (currentUser?.uid &&
      video &&
      video.videoReviewed?.includes(currentUser?.uid)) ||
      false
  );

  const [status, setStatus] = React.useState(video.status);
  async function updateField(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }

  useEffect(() => {
    setStatus(video.status);
  }, [video]);

  return (
    <VideoProvider videoData={video}>
      <div
        id={video.videoNumber}
        className="min-w-fulls top-[64px] right-0 w-[40vw] fixed h-[calc(100vh-64px)] overflow-hidden rounded-md rounded-r-none flex flex-col border  text-primary gap-2 bg-foreground/40 dark:bg-foreground/20 z-[99]"
      >
        <div className="h-16  items-center bg-background border-b p-4 py-2 gap-4 w-full justify-between flex ">
          <Link
            target="_blank"
            href={`/video/${video.videoNumber}`}
            className="font-bold text-2xl hover:opacity-80 hover:underline"
          >
            #{video.videoNumber} - {video.title}
          </Link>
          <Button
            onClick={() => setDisplayedVideo(undefined)}
            className="   z-20 w-fit  "
            variant={"ghost"}
          >
            <Icons.close className="h-5 w-5" />
          </Button>
        </div>
        {/* <div className="grid gap-2 px-4">

          <Select
            defaultValue={status}
            onValueChange={(value) => {
              setStatus(value);
              updateField("status", value);
            }}
          >
            <SelectTrigger id="status" className="  truncate ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="flex flex-nowrap"
                >
                  <div className="flex items-center">
                    {option.icon && (
                      <option.icon
                        className={`mr-2 h-4 w-4 text-muted-foreground rounded-sm
                    ${
                      option.value === "done"
                        ? "stroke-green-500 "
                        : option.value === "todo"
                        ? "stroke-blue-500"
                        : option.value === "draft"
                        ? "stroke-yellow-500"
                        : "stroke-red-500"
                    }
                    `}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <ScrollArea className="h-[calc(100vh-128px)]">
          <Tabs defaultValue="details" className="w-full  px-4">
            <TabsList
              className={`bg-muted grid
                ${video.uploadedVideos ? " grid-cols-3" : "grid-cols-2"}
            `}
            >
              <TabsTrigger value="details">Details</TabsTrigger>
              {video.uploadedVideos && (
                <TabsTrigger value="video">Video</TabsTrigger>
              )}
              <TabsTrigger value="script">Script</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <VideoDetails />
            </TabsContent>
            {video.uploadedVideos && (
              <TabsContent value="video">
                <UploadedVideoReview
                  video={video}
                  setVideo={setDisplayedVideo}
                />
              </TabsContent>
            )}
            <TabsContent value="script">
              <VideoScript />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </VideoProvider>
  );
};

const UploadedVideoReview = ({
  video,
  setVideo,
}: {
  video: VideoData;
  setVideo: React.Dispatch<React.SetStateAction<VideoData | undefined>>;
}) => {
  // console.log("video", JSON.stringify(video.script));

  const {currentUser} = useAuth()!;

  const [uploadedVideos, setUploadedVideos] = React.useState<
    UploadedVideo[] | undefined
  >(video.uploadedVideos ? video.uploadedVideos : undefined);

  const [videoData, setVideoData] = React.useState<VideoData | undefined>(
    video
  );

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("fetching video data=========", video);
      const videoRef = doc(db, "videos", video.videoNumber);
      const videoSnap = await getDoc(videoRef);
      if (videoSnap.exists()) {
        const videoData = videoSnap.data();
        console.log("videoData", videoData);
        setVideoData(videoData as VideoData);
        setUploadedVideos(videoData.uploadedVideos);
        setSelectedVideo(
          videoData.uploadedVideos[videoData.uploadedVideos.length - 1]
        );
      }
    };
    fetchVideoData();
  }, [video]);

  const client = clients.find((c: any) => c.value === video.clientId)!;

  const [isReviewed, setIsReviewed] = React.useState(
    (currentUser?.uid &&
      videoData &&
      videoData.videoReviewed?.includes(currentUser?.uid)) ||
      false
  );

  useEffect(() => {
    if (!videoData) return;
    console.log("setttting 111s", videoData.status);
    setIsReviewed(
      (currentUser?.uid &&
        videoData.videoReviewed?.includes(currentUser?.uid)) ||
        false
    );
    setNotes(videoData.notes);
    setNeedsRevision(videoData.status == "needs revision");
    setVideoStatus(videoData.status);
  }, [videoData]);

  const markAsReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        videoReviewed: [...(video.videoReviewed || []), currentUser?.uid],
      },
      {merge: true}
    );
    setIsReviewed(true);
  };

  const markAsNotReviewed = async () => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        videoReviewed: video.videoReviewed
          ? video.videoReviewed?.filter((uid) => uid !== currentUser?.uid)
          : [],
      },
      {merge: true}
    );
    setIsReviewed(false);
  };
  const [selectedVideo, setSelectedVideo] = React.useState<
    UploadedVideo | undefined
  >(video.uploadedVideos ? video.uploadedVideos[0] : undefined);

  const [notes, setNotes] = React.useState(
    (selectedVideo && selectedVideo.revisionNotes) || ""
  );

  const [videoStatus, setVideoStatus] = React.useState(
    videoData && videoData.status
  );

  const [needsRevision, setNeedsRevision] = React.useState(
    video.status == "needs revision"
  );

  const changeVideoStatusRevision = async (value: string) => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        status: value,
      },
      {merge: true}
    );
    setNeedsRevision(!needsRevision);
    setVideoStatus(value);

    // videoData &&
    //   setVideoData({
    //     ...videoData,
    //     status: value,
    //   });
  };

  const updateVideoField = async (updatedVideos: any[]) => {
    if (!selectedVideo || !uploadedVideos || !videoData) return;

    console.log("Updated Videos:", updatedVideos);

    try {
      if (videoData?.videoNumber) {
        // Update Firestore document
        try {
          await setDoc(
            doc(db, "videos", videoData?.videoNumber),
            {
              uploadedVideos: updatedVideos,
            },
            {merge: true}
          );
          console.log(
            "Firestore updated successfully with videos:",
            updatedVideos
          );
        } catch (e) {
          console.error("Error updating Firestore:", e);
        }
      }

      // Update local state
      setUploadedVideos(updatedVideos);

      const updatedSelectedVideo = updatedVideos.find(
        (video) => video.videoURL === selectedVideo.videoURL
      );
      if (updatedSelectedVideo) {
        setSelectedVideo(updatedSelectedVideo);
      }
    } catch (error) {
      console.error("Error updating video field:", error);
    }
  };

  const markAsReadyToPost = async () => {
    if (!currentUser || !uploadedVideos || !selectedVideo) return;

    try {
      // Prepare updatedVideos array
      const updatedVideos = uploadedVideos.map((videoData) => {
        if (videoData.videoURL === selectedVideo.videoURL) {
          return {
            ...videoData,
            needsRevision: false,
            isReadyToPost: true,
            // videoReviewed: [
            //   ...(video.scriptReviewed || []),
            //   currentUser?.uid,
            // ],
          };
        }
        return videoData;
      });

      // Call updateVideoField with the modified videos
      await updateVideoField(updatedVideos);
      await markAsReviewed();
      await changeVideoStatusRevision("done");

      // setNeedsRevision(false);

      // Optionally change video status revision
      await changeVideoStatusRevision("done");
    } catch (error) {
      console.error("Error marking video as ready to post:", error);
    }
  };

  const markAsNeedsRevision = async () => {
    if (!currentUser || !uploadedVideos || !selectedVideo) return;

    try {
      // Prepare updatedVideos array

      const updatedVideos = uploadedVideos.map((videoData) => {
        if (videoData.videoURL === selectedVideo.videoURL) {
          return {
            ...videoData,
            needsRevision: true,
            isReadyToPost: false,
          };
        } else {
          return videoData;
        }
      });

      // Pass the updated videos to updateVideoField
      await updateVideoField(updatedVideos);
      await markAsReviewed();

      // Change video status revision
      await changeVideoStatusRevision("needs revision");
    } catch (error) {
      console.error("Error marking video as needs revision:", error);
    }
  };

  useEffect(() => {
    if (selectedVideo)
      setNotes(selectedVideo.revisionNotes ? selectedVideo.revisionNotes : "");
  }, [selectedVideo]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [needsSave, setNeedsSave] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  useEffect(() => {
    console.log("notes============", notes);
  }, [notes]);

  const saveRevisionNotes = async () => {
    if (!uploadedVideos || !selectedVideo) return;
    setIsSaving(true);
    const updatedVideos = uploadedVideos.map((video) => {
      if (video.videoURL === selectedVideo.videoURL) {
        return {
          ...video,
          revisionNotes: notes,
        };
      }
      return video;
    });
    updateVideoField(updatedVideos);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNeedsSave(true);
    }, 1000);
  };

  useEffect(() => {
    setNeedsSave(notes === selectedVideo?.revisionNotes);
  }, [notes, selectedVideo]);

  return (
    <VideoProvider videoData={video}>
      <div
        id={video.videoNumber}
        className="min-w-full w-[200px] h-full rounded-md flex flex-col   text-primary gap-4  relative"
      >
        <div className="h-full flex flex-col max-w-full overflow-hidden gap-4 ">
          {/* <div className="flex gap-4 justify-between">
            <div className="flex flex-col ">
              <h1 className="font-bold text-lg">Reviewed by</h1>
              <div className="gap-4 flex text-base">
                {REVIEW_USERS_DATA.map((user) => (
                  <div key={user.id} className="">
                    {currentUser?.uid == user.id ? (
                      <div className="w-full justify-between items-center flex">
                        {isReviewed ? " ✅ " : "❌ "}
                        You
                      </div>
                    ) : (
                      <div className="w-full justify-between items-center flex">
                        {video.videoReviewed?.includes(user.id)
                          ? " ✅ "
                          : "❌ "}
                        {user.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div> */}
          <div className="flex flex-col gap-4 ">
            <div className="flex  w-full s">
              <div className="flex flex-col w-fit ">
                <div className="h-[450px] aspect-[9/16] relative rounded-l-md rounded-br-none overflow-hidden bg-foreground/40  ">
                  {/* <video
                    autoPlay
                    src={selectedVideo && selectedVideo.videoURL}
                    className="w-full h-full object-cover rounded-l-md"
                    controls
                  /> */}
                  {selectedVideo && (
                    <VideoPlayer
                      videoUrl={selectedVideo?.videoURL}
                      title={selectedVideo?.title}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-4  items-center">
                <div className=" flex flex-col  gap-4  flex-grow border  rounded-r-md  w-full ">
                  {isReviewed && selectedVideo?.needsRevision && (
                    <div className="w-full  relative h-full  rounded-md  flex flex-col gap-1 p-2">
                      {/* <div className="flex flex-col items-center w-full justify-between">
                        <Label className="text-center my-2" htmlFor="notes">
                          You marked this video as needs revision
                        </Label>
                        <Button
                          onClick={markAsReadyToPost}
                          size={"sm"}
                          className="w-fit "
                        >
                          Mark as ready to post
                        </Button>
                      </div> */}
                      <span className="text-sm font-bold pl-2">
                        Revision notes:
                      </span>
                      <Textarea
                        id="notes"
                        placeholder="Add video notes here..."
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          if (!uploadedVideos) return;
                        }}
                        className="w-full border-t p-2 max-w-full flex items-center rounded-none text-sm bg-foreground/40 flex-grow"
                      />
                      {!needsSave && (
                        <Button onClick={saveRevisionNotes} className="mt-2">
                          {isSaving ? "Saving..." : saved ? "Saved !" : "Save"}
                        </Button>
                      )}
                    </div>
                  )}
                  {isReviewed && selectedVideo?.isReadyToPost && (
                    <div className="w-full flex flex-col flex-grow items-center justify-center gap-1 px-4 relative text-center">
                      <div className="rounded-full h-fit w-fit border border-green-600 p-2">
                        <Icons.check className="h-8 w-8 text-green-600" />
                      </div>
                      You marked this video as ready to post
                      <Button
                        size="sm"
                        variant={"destructive"}
                        className="w-full mt-2"
                        onClick={markAsNeedsRevision}
                      >
                        Mark as needs revision
                      </Button>
                    </div>
                  )}
                  {!isReviewed && (
                    <div className="flex flex-col gap-2 w-full items-center justify-center  flex-grow">
                      <Button
                        onClick={markAsReadyToPost}
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                      >
                        Mark as ready to post
                      </Button>
                      <Button
                        className="w-full"
                        variant={"destructive"}
                        onClick={markAsNeedsRevision}
                      >
                        Video needs revision
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {uploadedVideos && uploadedVideos.length > 0 ? (
              <ScrollArea className="flex gap-1 flex-col w-full h-fit max-h-[200px] overflow-scroll mt-auto p-2 bg-foreground/40 rounded-md">
                <h1 className="text-lg h-6 ">
                  Uploaded videos ({uploadedVideos.length})
                </h1>
                <div className="flex flex-col gap-2 flex-grow      rounded-md mt-2">
                  {[...uploadedVideos].reverse().map((video) => (
                    <button
                      key={video.videoURL}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-2 w-full relative rounded-md overflow-hidden bg-foreground/40 flex border
                          ${
                            selectedVideo?.videoURL === video.videoURL
                              ? "border-primary"
                              : "border-border"
                          }
                            
                            `}
                    >
                      {video.title}
                      {!video.isReadyToPost && !video.needsRevision && (
                        <span className="text-yellow-600 ml-auto">
                          Needs review
                        </span>
                      )}
                      {video.needsRevision && (
                        <span className="text-red-600 ml-auto">
                          Needs revision
                        </span>
                      )}
                      {video.isReadyToPost && (
                        <span className="text-green-600 ml-auto">
                          Ready to post
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[350px] aspect-[9/16] relative mx-auto rounded-md overflow-hidden flex justify-center items-center bg-muted text-center">
                Video not done
              </div>
            )}
          </div>
        </div>
      </div>
    </VideoProvider>
  );
};

const VideoScript = () => {
  const {video} = useVideo()!;
  const [edit, setEdit] = React.useState(false);

  const [script, setScript] = React.useState(video.script);
  const [scriptValue, setScriptValue] = React.useState(video.script);

  useEffect(() => {
    setScript(video.script);
    setScriptValue(video.script);
  }, [video]);

  const saveScript = async () => {
    if (!video) return;
    setScriptValue(script);
    await setDoc(
      doc(db, "videos", video.videoNumber),
      {
        script: script,
      },
      {merge: true}
    );
    console.log("Script saved", script);
  };

  return (
    <>
      {edit ? (
        <Editor post={scriptValue} setScript={setScript} />
      ) : (
        <>
          {typeof scriptValue === "string" ? (
            <div className="h-fit  overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
              {scriptValue}
            </div>
          ) : (
            <EditorJsRender script={scriptValue as OutputData} />
          )}
        </>
      )}
      <Button
        className="w-full mt-3"
        onClick={() => {
          if (edit) saveScript();
          setEdit(!edit);
        }}
      >
        {edit ? "Save" : "Edit"} script
      </Button>
    </>
  );
};
