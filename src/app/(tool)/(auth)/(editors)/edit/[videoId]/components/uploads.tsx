import React from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {Timestamp} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import emailjs from "@emailjs/browser";
import {editorStatuses, clients, VideoData, Post} from "@/config/data";
import Link from "next/link";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn, convertToUserLocalTime} from "@/lib/utils";
import {format} from "date-fns";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {Progress} from "@/components/ui/progress";
import {db, app} from "@/config/firebase";
import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {useVideo} from "../data/video-context";
import {useAuth} from "@/context/user-auth";
import {setDoc, deleteDoc, doc, getDoc, collection} from "firebase/firestore";
import {convertTimestampToDate} from "@/lib/utils";
import Requirements from "./requirements";

const Uploads = () => {
  const {video, setVideo} = useVideo()!;
  const {currentUser} = useAuth()!;

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  // const [posts, setPosts] = React.useState<Post[] | undefined>();

  const getFileExtension = (fname: string) => {
    return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  async function saveFileToFirebase(file: File) {
    console.log("saving file to firebase");
    const storage = getStorage(app);
    const storageRef = ref(storage, `video/${file.name}`);
    // Start the file upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Return a promise that resolves with the download URL
    // after the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update the upload progress state
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            const newUploadedVideo = {
              id: video.uploadedVideos ? video?.uploadedVideos.length + 1 : 1,
              title: file.name,
              videoURL: fileUrl,
            };
            await setDoc(
              doc(db, "videos", video.videoNumber.toString()),
              {
                uploadedVideos: video.uploadedVideos
                  ? [...video.uploadedVideos, newUploadedVideo]
                  : [newUploadedVideo],
                updatedAt: {date: new Date(), user: currentUser?.firstName},
                status: "done",
              },
              {
                merge: true,
              }
            );
            setVideo(
              (prev) =>
                ({
                  ...prev,
                  uploadedVideos: video.uploadedVideos
                    ? [...video.uploadedVideos, newUploadedVideo]
                    : [newUploadedVideo],
                } as VideoData)
            );
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  const deleteUploadedVideo = async (uploadedVideoId: string) => {
    const updatedUploadedVideos = video.uploadedVideos?.filter(
      (video) => video.id !== uploadedVideoId
    );
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        uploadedVideos: updatedUploadedVideos,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
        status:
          updatedUploadedVideos?.length === 0 && video.status === "done"
            ? "todo"
            : video.status === "needs revision"
            ? "needs revision"
            : "done",
      },
      {
        merge: true,
      }
    );
    setVideo(
      (prev) =>
        ({
          ...prev,
          uploadedVideos: video.uploadedVideos?.filter(
            (video) => video.id !== uploadedVideoId
          ),
        } as VideoData)
    );
  };
  return (
    <div className="w-full  min-h-fit h-[400px]   flex flex-col gap-2  md:pl-3">
      <h1 className="text-primary text-2xl font-bold ">Completed Videos</h1>
      <div className="w-full border bg-foreground rounded-md p-2 flex flex-col gap-2 flex-grow">
        {(!video.uploadedVideos || video.uploadedVideos.length == 0) &&
          !isUploading && (
            <span className="text-muted-foreground text-center flex-grow justify-center items-center flex">
              No videos uploaded
            </span>
          )}
        <input
          multiple
          id="selectedFile2"
          type="file"
          accept=".mp4 , .mov"
          onChange={onFileChange}
          style={{display: "none"}}
        />

        {video.uploadedVideos && video.uploadedVideos?.length !== 0 && (
          <>
            {[...video.uploadedVideos].reverse().map((uploadedVideo) => {
              return (
                <div
                  key={uploadedVideo.id}
                  className={`w-full  text-foreground border rounded-md  flex-col   gap-4
                    ${
                      uploadedVideo.needsRevision
                        ? "border-destructive"
                        : "border-border"
                    }
                    `}
                >
                  <div className="flex w-full justify-between items-center p-4">
                    <h1 className="text-primary font-bold">
                      {uploadedVideo.title}
                    </h1>
                    <div className="flex gap-4 w-fit items-center">
                      <Link
                        href={uploadedVideo.videoURL}
                        target="_blank"
                        className={cn(
                          buttonVariants({variant: "outline"}),
                          "text-primary"
                        )}
                      >
                        Open
                      </Link>
                      <Button
                        className="w-fit"
                        variant={"ghost"}
                        onClick={() => deleteUploadedVideo(uploadedVideo.id)}
                      >
                        <Icons.trash className=" h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {uploadedVideo.needsRevision && (
                    <div className="grid gap-1 bg-muted/40 p-4">
                      <h1 className="text-primary">Revision Notes</h1>
                      <span className="text-muted-foreground">
                        {uploadedVideo.revisionNotes}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {isUploading && (
          <div className="w-full text-foreground border rounded-md p-4 flex  items-center justify-between gap-4">
            <h1 className="text-primary font-bold whitespace-nowrap">
              Uploading Video
            </h1>
            <Progress value={uploadProgress} className="bg-muted-foreground" />
            <span className="text-primary w-[80px] ">
              {Math.round(uploadProgress)}%
            </span>
          </div>
        )}

        <button
          onClick={() => document.getElementById("selectedFile2")?.click()}
          className="h-fit justify-center  p-2 mt-auto text-center rounded-md w-full bg-blue-500/20 hover:bg-blue-500/50 text-blue-500 flex items-center"
        >
          <Icons.add className="h-6 w-6 mr-1" />
          Click to Upload
        </button>
      </div>
    </div>
  );
};

export default Uploads;
