"use client";
import React, {useEffect} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {DialogTitle, DialogTrigger} from "@radix-ui/react-dialog";

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

  function formatAsUSD(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const [openPayoutChangeDialog, setOpenPayoutChangeDialog] =
    React.useState(false);

  const [payoutChangeValue, setPayoutChangeValue] = React.useState<
    number | undefined
  >(
    video.payoutChangeRequest ? video.payoutChangeRequest.value : video.priceUSD
  );
  const [payoutChangeReason, setPayoutChangeReason] = React.useState(
    video.payoutChangeRequest ? video.payoutChangeRequest.reason : ""
  );
  const [payoutChangeRequest, setPayoutChangeRequest] = React.useState(
    video.payoutChangeRequest
  );

  const [savingPayoutChange, setSavingPayoutChange] = React.useState(false);

  const createPayoutChangeRequest = async () => {
    setSavingPayoutChange(true);
    // create a new payout change request
    const newPayoutChangeRequest = {
      value: payoutChangeValue,
      reason: payoutChangeReason,
      status: "pending",
      createdAt: {date: new Date(), user: currentUser?.firstName},
    };
    await setDoc(doc(db, "videos", video.videoNumber), {
      ...video,
      payoutChangeRequest: newPayoutChangeRequest,
    });
    setSavingPayoutChange(false);
    setOpenPayoutChangeDialog(false);
    setPayoutChangeRequest(newPayoutChangeRequest as any);
  };
  const [price, setPrice] = React.useState<number | undefined>(video.priceUSD);

  return (
    <div className="flex flex-col gap-2 relative z-20">
      <Card
        className={` shadow-sm w-full relative border h-full bg-foreground/40 blurBack pt-4 
        `}
      >
        <CardContent className="grid gap-6 ">
          <div className="grid grid-cols-2 items-start gap-6 ">
            <h1 className="text-primary text-2xl font-bold ">
              Video #{video.videoNumber}
            </h1>
            <div className="grid gap-2 c">
              <div className="flex items-end">
                <Icons.bookmark className="mr-1 h-4 w-4" />
                <Label htmlFor="title">Title</Label>
              </div>
              <div id="title" className="font-bold">
                {title}
              </div>
            </div>

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

              <Dialog
                open={openPayoutChangeDialog}
                onOpenChange={setOpenPayoutChangeDialog}
              >
                <DialogTrigger>
                  <button className="w-full justify-start text-left  flex mx-auto items-center font-bold underline hover:opacity-75">
                    {payoutChangeRequest
                      ? payoutChangeRequest.value == video.priceUSD
                        ? formatAsUSD(video.priceUSD) + " usd"
                        : payoutChangeRequest.status === "pending"
                        ? `${formatAsUSD(
                            video.priceUSD
                          )}(requested  ${formatAsUSD(
                            payoutChangeRequest.value
                          )})`
                        : `${formatAsUSD(
                            video.priceUSD
                          )}(rejected  ${formatAsUSD(
                            payoutChangeRequest.value
                          )})`
                      : video.priceUSD > 0
                      ? formatAsUSD(video.priceUSD) + " usd"
                      : "Unpaid"}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-primary text-xl font-bold">
                      Request Payout Change
                    </DialogTitle>
                    <DialogDescription className="text-primary">
                      Request a change to the payout amount for this video.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2">
                    <div className="flex items-center text-primary">
                      <Label htmlFor="due-date">Change payout to</Label>
                    </div>
                    <div className="w-full relative h-fit">
                      <Icons.money className="h-3 w-3 absolute text-primary left-2 top-1/2 -translate-y-1/2" />

                      <Input
                        placeholder="new payout"
                        type="number"
                        className="text-primary pl-[20px]"
                        value={payoutChangeValue}
                        onChange={(e) => {
                          setPayoutChangeValue(e.target.valueAsNumber);
                        }}
                      />
                      {/* <Input
                        placeholder="$"
                        type="number"
                        className="text-primary"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.valueAsNumber);
                        }}
                      /> */}
                    </div>
                  </div>
                  <Textarea
                    className="text-primary"
                    placeholder="Reason for payout change..."
                    value={payoutChangeReason}
                    onChange={(e) => setPayoutChangeReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        createPayoutChangeRequest();
                      }}
                    >
                      {savingPayoutChange ? "Saving..." : "Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                <Label htmlFor="notes">Notes</Label>
              </div>
              <span className="w-full  flex items-center rounded-md text-sm">
                {video.notes}
              </span>
            </div>
          )}

          <Requirements />
        </CardContent>
      </Card>
    </div>
  );
};
