"use client";

import React, {useEffect} from "react";
import VideoPlayer from "@/components/ui/video-player";
import {VideoData, clients, UploadedVideo} from "@/config/data";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {VideoDetails} from "@/src/app/(tool)/(auth)/(admin)/client-view/[client]/components/video-details";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/video-review/script/script-edit";
import {EditorJsRender} from "@/src/app/(tool)/(auth)/(admin)/video-review/video-review";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {db} from "@/config/firebase";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {doc, getDoc, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {useAuth} from "@/context/user-auth";

import {OutputData} from "@editorjs/editorjs";
import {Input} from "@/components/ui/input";

import {useToast} from "@/components/ui/use-toast";

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
        <div className="h-16  items-center bg-background border-b p-4 py-2 w-full gap-1 justify-between grid grid-cols-[40px_1fr] ">
          <Button
            onClick={() => setDisplayedVideo(undefined)}
            size="icon"
            className="z-20"
            variant={"ghost"}
          >
            <Icons.close className="h-5 w-5" />
          </Button>
          <Link
            target="_blank"
            href={`/video/${video.videoNumber}`}
            className="font-bold text-2xl hover:opacity-80 hover:underline whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
          >
            #{video.videoNumber} - {video.title}
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-128px)]">
          <Tabs defaultValue="details" className="w-full  px-4">
            <TabsList
              className={`bg-muted grid
                ${video.uploadedVideos ? " grid-cols-4" : "grid-cols-3"}
            `}
            >
              <TabsTrigger value="details">Details</TabsTrigger>
              {video.uploadedVideos && (
                <TabsTrigger value="video">Video</TabsTrigger>
              )}
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="clientView">Client View</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <VideoDetails setDisplayedVideo={setDisplayedVideo} />
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
            <TabsContent value="clientView">
              <ClientView video={video} />
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
    setNotes(videoData.notes ?? "");

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
  const {video, setVideo} = useVideo()!;
  const [edit, setEdit] = React.useState(false);

  const [script, setScript] = React.useState(video.script);
  const [scriptValue, setScriptValue] = React.useState(video.script);

  // useEffect(() => {
  //   console.log("video.script", video.script);
  //   setScriptValue(video.script);
  // }, [video.script]);

  const {toast} = useToast();

  useEffect(() => {
    setScript(video.script);
    setScriptValue(video.script);
  }, [video]);

  const [isSaving, setIsSaving] = React.useState(false);
  const saveScript = async () => {
    if (!video) return;
    setScriptValue(script);
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "videos", video.videoNumber),
        {
          script: script,
        },
        {merge: true}
      );
      setVideo({...video, script: script});
      console.log("Script saved", script);
    } catch (error) {
      console.error("Error saving script:", error);
      toast({
        title: "Error saving script",
        description: "Please try again",
      });
    } finally {
      setIsSaving(false);
      setEdit(false);
    }
  };

  return (
    <>
      {edit || scriptValue === "" ? (
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
          if (edit || scriptValue === "") saveScript();
          setEdit(!edit);
        }}
      >
        {edit || scriptValue === "" ? "Save" : "Edit"} script
      </Button>
    </>
  );
};

type ClientVideoData = {
  videoNumber: string;
  title: string;
  videoURL?: string;
  postDate: Timestamp;
  hasAccess: boolean;
  views: number;
  likes: number;
  comments: number;
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
};

const ClientView = ({video}: {video: VideoData}) => {
  const [clientHasAccess, setClientHasAccess] = React.useState(false);
  const [clientVideoData, setClientVideoData] = React.useState<
    ClientVideoData | undefined
  >(undefined);

  useEffect(() => {
    const checkClientAccess = async () => {
      const clientRef = doc(
        db,
        `client-access/${video.clientId}/videos`,
        video.videoNumber
      );
      const clientSnap = await getDoc(clientRef);
      if (clientSnap.exists() && clientSnap.data()?.hasAccess) {
        const clientData = clientSnap.data();
        setClientHasAccess(clientData.hasAccess);
        setClientVideoData(clientData as ClientVideoData);
        setTiktokLink(clientData?.tiktok);
        setInstagramLink(clientData?.instagram);
        setFacebookLink(clientData?.facebook);
        setXLink(clientData?.x);
        setLinkedinLink(clientData?.linkedin);
        setYoutubeLink(clientData?.youtube);
      } else {
        setClientVideoData(undefined);
        setClientHasAccess(false);
        setTiktokLink(undefined);
        setInstagramLink(undefined);
        setFacebookLink(undefined);
        setXLink(undefined);
        setLinkedinLink(undefined);
        setYoutubeLink(undefined);
      }
    };
    checkClientAccess();
  }, [video.clientId, video.videoNumber]);

  const [isGrantingAccess, setIsGrantingAccess] = React.useState(false);
  const grantAccess = async () => {
    setIsGrantingAccess(true);
    const clientRef = doc(
      db,
      `client-access/${video.clientId}/videos`,
      video.videoNumber
    );
    await setDoc(clientRef, {
      videoNumber: video.videoNumber,
      title: video.title,
      postDate: video.postDate,
      hasAccess: true,
    });
    setClientHasAccess(true);
    setIsGrantingAccess(false);
  };

  const onFieldChange = async (field: string, value: string) => {
    // update the video
    await updateDoc(
      doc(db, `client-access/${video.clientId}/videos`, video.videoNumber),
      {
        [field]: value,
      }
    );
  };

  const addVideoUrl = async (videoURL: string) => {
    const clientRef = doc(
      db,
      `client-access/${video.clientId}/videos`,
      video.videoNumber
    );
    await updateDoc(clientRef, {
      videoURL: videoURL,
    });
    setClientVideoData({
      ...clientVideoData,
      videoURL: videoURL,
    } as ClientVideoData);
  };

  console.log("cvd", clientVideoData);

  const OpenFeed = async (
    platform: "tiktok" | "instagram" | "facebook" | "x" | "linkedin" | "youtube"
  ) => {
    const clientRef = doc(db, `client-access/${video.clientId}/info/links`);
    const clientSnap = await getDoc(clientRef);
    if (clientSnap.exists()) {
      const links = clientSnap.data();
      console.log("clientData", links);
      if (links[platform]) {
        window.open(links[platform], "_blank");
      }
    }
  };

  const [tiktokLink, setTiktokLink] = React.useState(clientVideoData?.tiktok);
  const [instagramLink, setInstagramLink] = React.useState(
    clientVideoData?.instagram
  );
  const [facebookLink, setFacebookLink] = React.useState(
    clientVideoData?.facebook
  );
  const [xLink, setXLink] = React.useState(clientVideoData?.x);
  const [linkedinLink, setLinkedinLink] = React.useState(
    clientVideoData?.linkedin
  );
  const [youtubeLink, setYoutubeLink] = React.useState(
    clientVideoData?.youtube
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">Client View</h1>
          <p className="text-sm text-muted-foreground">
            This is the client view for the video {video.videoNumber}
          </p>
        </div>
        {clientHasAccess ? (
          <>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              {clientVideoData?.videoURL ? (
                <div className="h-[400px] aspect-[9/16]  relative">
                  <VideoPlayer
                    videoUrl={clientVideoData.videoURL}
                    title={clientVideoData.title}
                  />
                </div>
              ) : (
                <div className="h-[400px] aspect-[9/16]  relative bg-muted rounded-md">
                  video not set
                </div>
              )}
              <div className="flex border rounded-md  flex-col">
                {video.uploadedVideos?.map((uploadedVideo) => (
                  <button
                    onClick={() => addVideoUrl(uploadedVideo.videoURL)}
                    key={uploadedVideo.videoURL}
                    className="h-fit relative border hover:opacity-80 flex items-center p-2"
                  >
                    {uploadedVideo.title}
                    {uploadedVideo.videoURL === clientVideoData?.videoURL && (
                      <div className="ml-auto text-green-500">
                        <Icons.check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* create and input for the links  */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tiktok">TikTok Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  value={tiktokLink}
                  id="tiktok"
                  onChange={(e) => {
                    setTiktokLink(e.target.value);
                    onFieldChange("tiktok", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("tiktok")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="instagram">Instagram Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  id="instagram"
                  value={instagramLink}
                  onChange={(e) => {
                    setInstagramLink(e.target.value);
                    onFieldChange("instagram", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("instagram")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="facebook">Facebook Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  id="facebook"
                  value={facebookLink}
                  onChange={(e) => {
                    setFacebookLink(e.target.value);
                    onFieldChange("facebook", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("facebook")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="x">X Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  id="x"
                  value={xLink}
                  onChange={(e) => {
                    setXLink(e.target.value);
                    onFieldChange("x", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("x")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedin">LinkedIn Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  id="linkedin"
                  value={linkedinLink}
                  onChange={(e) => {
                    setLinkedinLink(e.target.value);
                    onFieldChange("linkedin", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("linkedin")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="youtube">YouTube Link</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  id="youtube"
                  value={youtubeLink}
                  onChange={(e) => {
                    setYoutubeLink(e.target.value);
                    onFieldChange("youtube", e.target.value);
                  }}
                />
                <Button onClick={() => OpenFeed("youtube")}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Button onClick={grantAccess} disabled={isGrantingAccess}>
              {isGrantingAccess ? "Granting access..." : "Grant Access"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
