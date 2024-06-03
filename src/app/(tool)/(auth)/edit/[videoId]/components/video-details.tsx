"use client";
import React, {useEffect} from "react";
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

export const VideoDetails = () => {
  const {video, setVideo} = useVideo()!;
  const {currentUser} = useAuth()!;

  const client = clients.find((c: any) => c.value === video.clientId)!;

  interface Timestamp {
    nanoseconds: number;
    seconds: number;
  }

  // convert the timestamp to a date

  const [notes, setNotes] = React.useState(video.notes);
  const [title, setTitle] = React.useState(video.title);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    convertTimestampToDate(video.dueDate)
  );

  const [postDate, setPostDate] = React.useState<Date | undefined>(
    video.postDate ? convertTimestampToDate(video.postDate) : undefined
  );

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

  const [status, setStatus] = React.useState(video.status);

  useEffect(() => {
    async function changeStatus(status: string) {
      await setDoc(
        doc(db, "videos", video.videoNumber.toString()),
        {
          status: status,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
        },
        {
          merge: true,
        }
      );
    }
    changeStatus(status);
  }, [status, video.videoNumber, currentUser]);

  const createdPost = React.useRef(false);

  const [posts, setPosts] = React.useState<Post[] | undefined>();

  useEffect(() => {
    // fetch all posts for the video
    const fetchPosts = async () => {
      if (video.postIds) {
        // get all the post data from the post ids
        const postsData = await Promise.all(
          video.postIds.map(async (postId: any) => {
            const post = await getDoc(doc(db, "posts", postId));
            return post.data() as Post;
          })
        );
        setPosts(postsData);
      } else {
        // create a new post
        const newPostRef = doc(collection(db, `posts`));
        const newPost = {
          id: newPostRef.id,
          title: "v 1.0",
          clientId: video.clientId,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
          postDate: video.postDate,
        };

        await setDoc(newPostRef, newPost);
        //  add new post id to the video
        await setDoc(
          doc(db, "videos", video.videoNumber.toString()),
          {
            postIds: [newPostRef.id],
            updatedAt: {date: new Date(), user: currentUser?.firstName},
          },
          {
            merge: true,
          }
        );
      }
    };
    if (video) {
      if (!posts) {
        console.log("fetching posts", createdPost.current);
        if (!createdPost.current) {
          createdPost.current = true;
          fetchPosts();
        }
      }
    }
  }, [video, posts, currentUser]);

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const getFileExtension = (fname: string) => {
    return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  async function saveFileToFirebase(file: File) {
    if (!posts) return;
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `video/${posts[0].id}  + "." + getFileExtension(file.name)}`
    );
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
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          if (!posts) return;
          const postId: string = posts[0].id;

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
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        uploadedVideos: video.uploadedVideos?.filter(
          (video) => video.id !== uploadedVideoId
        ),
        updatedAt: {date: new Date(), user: currentUser?.firstName},
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
    <Card
      className={` shadow-sm w-full relative border-4 h-full
     ${
       status === "done"
         ? "border-green-500/20"
         : status === "todo"
         ? "border-primary/20"
         : "border-red-500/20"
     }
    `}
    >
      <CardHeader>
        <CardTitle>Video #{video.videoNumber} Details</CardTitle>
        {/* <CardDescription>
            View and edit the details of the video.
          </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-6 ">
        <Select
          defaultValue={status}
          onValueChange={(value) => {
            setStatus(value);
            updateField("status", value);
          }}
        >
          <SelectTrigger
            id="status"
            className=" w-[200px] truncate md:absolute md:top-4 md:right-4"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark">
            {editorStatuses.map((option) => (
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
                        ? "stroke-primary"
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
        <div className="grid grid-cols-2 gap-6 ">
          {/* <div className="grid gap-2 ">
            <div className="flex items-end">
              <Icons.profile className="mr-2 h-4 w-4" />
              <Label htmlFor="title">Video Title</Label>
            </div>
            <div id="title" className="font-bold">
              {title}
            </div>
          </div> */}
          <div className="grid gap-2">
            <div className="flex items-end">
              <Icons.profile className="mr-2 h-4 w-4" />
              <Label htmlFor="client">Client</Label>
            </div>
            <div id="client" className="w-full  flex items-center rounded-md">
              {client.icon && (
                <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm" />
              )}
              <span>{client.label}</span>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-end">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <Label htmlFor="due-date">Due Date</Label>
            </div>
            <div
              className={cn(
                "w-full justify-start text-left  flex  items-center font-bold ",
                !video.dueDate && "text-muted-foreground"
              )}
            >
              {dueDate ? (
                convertToUserLocalTime(video.dueDate)
              ) : (
                <span>Due Date</span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-end">
              <Icons.money className="mr-2 h-4 w-4" />
              <Label htmlFor="due-date">Payout</Label>
            </div>
            <div className="w-full justify-start text-left  flex mx-auto items-center font-bold ">
              $50.00 usd
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-end">
              <Icons.clock className="mr-2 h-4 w-4" />
              <Label htmlFor="due-date">Duration</Label>
            </div>
            <div className="w-full justify-start text-left font-bold flex  items-center mx-auto  ">
              30-60s
            </div>
          </div>
        </div>
        {video.notes && (
          <div className="grid gap-2 w-full">
            <div className="flex items-end">
              <Icons.info className="mr-2 h-4 w-4" />
              <Label htmlFor="notes">Details</Label>
            </div>
            <span className="w-full  flex items-center rounded-md text-sm">
              {video.notes}
            </span>
          </div>
        )}
        {(!video.uploadedVideos || video.uploadedVideos.length == 0) &&
          !isUploading && (
            <div className="w-full border border-dashed border-primary rounded-md p-4 flex items-center justify-center flex-col">
              <h1>Upload completed video here </h1>
              <Button
                className="mt-2"
                onClick={() =>
                  document.getElementById("selectedFile2")?.click()
                }
              >
                Click to upload{" "}
              </Button>
            </div>
          )}
        <input
          multiple
          id="selectedFile2"
          type="file"
          accept=".mp4 , .mov"
          onChange={onFileChange}
          style={{display: "none"}}
        />
        {isUploading && (
          <div className="w-full text-foreground border rounded-md p-4 flex  items-center justify-between gap-4">
            <Icons.spinner className="animate-spin h-6 w-6 text-primary" />
            <h1 className="text-primary font-bold">Uploading Video</h1>
            <Progress value={uploadProgress} className="bg-muted-foreground" />
          </div>
        )}

        {video.uploadedVideos && video.uploadedVideos?.length !== 0 && (
          <>
            {video.uploadedVideos.map((uploadedVideo) => {
              return (
                <div
                  key={uploadedVideo.id}
                  className="w-full justify-between text-foreground border rounded-md p-4 flex  items-center gap-4"
                >
                  <h1 className="text-primary font-bold">
                    {uploadedVideo.title}
                  </h1>
                  <div className="flex gap-4 w-fit items-center">
                    <Link
                      href={uploadedVideo.videoURL}
                      target="_blank"
                      className={cn(buttonVariants({variant: "outline"}))}
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
              );
            })}
          </>
        )}
        {video.uploadedVideos && video.uploadedVideos?.length !== 0 && (
          <Button
            variant={"outline"}
            onClick={() => {
              document.getElementById("selectedFile2")?.click();
            }}
          >
            <Icons.add className=" h-5 w-5 text-foreground mr-2" />
            Upload new version
          </Button>
        )}
        <div className="grid gap-2">
          <div className="flex items-end">
            <Icons.note className="mr-2 h-4 w-4" />
            <Label>Editor Notes</Label>
          </div>
          <Textarea
            value={video.editorNotes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateField("editorNotes", notes)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
