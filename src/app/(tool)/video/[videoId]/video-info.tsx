"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format, set} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {VideoData} from "@/src/app/(tool)/video/[videoId]/data/data";
import {clients, statuses} from "@/src/app/(tool)/(video-sheet)/data/data";
import {VideoProvider, useVideo} from "./data/video-context";
import {formatDateFromTimestamp} from "@/lib/utils";
import {setDoc, doc} from "firebase/firestore";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {Progress} from "@/components/ui/progress";
import {AssetType} from "@/src/app/(tool)/new-video/new-video-context";
import {db, app} from "@/config/firebase";
import {Timestamp} from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const VideoInfo = ({video}: {video: VideoData}) => {
  return (
    <VideoProvider videoData={video}>
      <Header />
      <div className=" flex flex-col w-full gap-4  items-center p-8 container">
        <div className="flex gap-4 h-fit  justify-between   rounded-md items-center">
          <VideoDetails />
          <VideoPreview />
          <Caption />
        </div>
        <VideoScript />
        <VideoAssets />
      </div>
    </VideoProvider>
  );
};

export default VideoInfo;

const Header = () => {
  const {video} = useVideo()!;

  const [status, setStatus] = React.useState(video.status);

  useEffect(() => {
    async function changeStatus(status: string) {
      await setDoc(
        doc(db, "videos", video.videoNumber.toLocaleString()),
        {
          status: status,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );
    }
    changeStatus(status);
  }, [status, video.videoNumber]);

  return (
    <div
      className={`w-full flex  p-4 items-center justify-between
    ${
      status === "done"
        ? "bg-green-500/20"
        : status === "in progress"
        ? "bg-yellow-500/20"
        : status === "todo"
        ? "bg-blue-500/20"
        : "bg-red-500/20"
    }
    
    `}
    >
      <div className="flex items-center gap-2">
        <Link href={"/#"} className={buttonVariants({variant: "ghost"})}>
          <Icons.chevronLeft className="h-5 w-5" />
        </Link>

        <h1 className="font-bold text-2xl">{"Video #" + video.videoNumber} </h1>
      </div>
      <Select defaultValue={status} onValueChange={setStatus}>
        <SelectTrigger id="status" className=" w-[200px] truncate">
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
                      : option.value === "in progress"
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
    </div>
  );
};

const Caption = () => {
  const {video} = useVideo()!;

  const [caption, setCaption] = React.useState(video.caption || "");

  useEffect(() => {
    async function updateScript() {
      await setDoc(
        doc(db, "videos", video.videoNumber.toLocaleString()),
        {
          caption: caption,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );
    }
    updateScript();
  }, [caption, video.videoNumber]);

  const [copied, setCopied] = React.useState(false);
  const copyCaption = () => {
    setCopied(true);
    navigator.clipboard.writeText(caption);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className=" shadow-sm min-h-[200px] h-fit w-[300px] relative">
      <CardHeader>
        <CardTitle>Post Info</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-2 relative">
          <Button
            onClick={copyCaption}
            variant="ghost"
            className="absolute bottom-0 left-0 p-0 aspect-square"
          >
            {copied ? (
              <Icons.check className="h-3 w-3 " />
            ) : (
              <Icons.copy className="h-3 w-3" />
            )}
          </Button>
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            id="caption"
            className="min-h-[200px] w-full p-6"
            placeholder="The caption for the video goes here..."
          />
        </div>
        <div className="grid-gap-2">
          <Label htmlFor="post-date">Post Date</Label>
          <PostDatePicker />
        </div>
      </CardContent>
    </Card>
  );
};

export function PostDatePicker() {
  // const {postDate, setPostDate} = useNewVideo()!;
  const {video} = useVideo()!;

  const [postDate, setPostDate] = React.useState<Date | undefined>(
    video?.postDate ? convertTimestampToDate(video?.postDate) : undefined
  );

  useEffect(() => {
    async function updatePostDate() {
      await setDoc(
        doc(db, "videos", video.videoNumber.toLocaleString()),
        {
          postDate: postDate,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );
    }
    if (postDate) {
      updatePostDate();
    }
  }, [postDate, video.videoNumber]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="post-date"
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal  w-full rounded-t-none",
            !postDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {postDate ? (
            "Post date: " + format(postDate, "PPP")
          ) : (
            <span>Post Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={postDate}
          onSelect={setPostDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const VideoAssets = () => {
  const {video} = useVideo()!;

  const downloadFile = async (file: AssetType) => {
    console.log(file);
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const downloadAllAssets = () => {
    for (const asset of video.assets) {
      downloadFile(asset);
    }
  };

  return (
    <Card className="h-fit shadow-sm w-full relative">
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      {video.assets.length === 0 ? (
        <span className="flex w-full justify-center items-center mb-8 ">
          No assets for this video{" "}
        </span>
      ) : (
        <>
          <CardContent className="grid gap-6">
            {video.assets.map((asset) => (
              <div
                key={asset.title}
                className="w-full bg-muted border rounded-md p-4 flex items-center justify-between gap-4"
              >
                <Icons.close className=" h-5 w-5 text-muted-foreground" />
                <h1>{asset.title}</h1>
                <Button onClick={() => downloadFile(asset)} className="ml-auto">
                  <Icons.download className="ml-auto h-5 w-5 " />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button onClick={downloadAllAssets} className="ml-auto">
              Download all
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
const VideoScript = () => {
  const {video} = useVideo()!;

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(video.script);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const [script, setScript] = React.useState(video.script);

  useEffect(() => {
    async function updateScript() {
      await setDoc(
        doc(db, "videos", video.videoNumber.toLocaleString()),
        {
          script: script,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );
    }
    updateScript();
  }, [script, video.videoNumber]);

  return (
    <Card className="relative shadow-sm h-fit w-full ">
      <CardHeader>
        <CardTitle>Video Script</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Textarea
          className="h-[300px]"
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
      </CardContent>
      <Button onClick={copyToClipboard} className="absolute top-3 right-3">
        {copied ? (
          <>
            <Icons.check className="h-4 w-4 mr-2" />
            Copied to clipboard
          </>
        ) : (
          <>
            <Icons.copy className="h-4 w-4 mr-2" />
            Copy
          </>
        )}
      </Button>
    </Card>
  );
};

const VideoDetails = () => {
  const {video} = useVideo()!;

  const client = clients.find((c: any) => c.value === video.client)!;

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

  console.log("dd", dueDate);

  async function updateNotes(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toLocaleString()),
      {
        [field]: value,
        updatedAt: new Date(),
      },
      {
        merge: true,
      }
    );
  }
  useEffect(() => {
    updateNotes("notes", notes);
  }, [notes, video.videoNumber]);

  useEffect(() => {
    updateNotes("dueDate", dueDate);
  }, [dueDate, video.videoNumber]);

  useEffect(() => {
    updateNotes("title", title);
  }, [title, video.videoNumber]);

  return (
    <Card className="h-fit shadow-sm max-w-[400px]">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
        {/* <CardDescription>
          View and edit the details of the video.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            id="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-fit justify-start text-left font-normal",
                    !video.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Due Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="client">Client</Label>
          <div
            id="client"
            className="w-full border p-2 flex items-center rounded-md"
          >
            {client.icon && (
              <client.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm" />
            )}
            <span>{client.label}</span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            className="w-[350px] border p-2 flex items-center rounded-md text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const VideoPreview = () => {
  const {video} = useVideo()!;
  const [videoUrl, setVideoUrl] = React.useState(video.videoURL);
  const [loading, setLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0); // State to track upload progress

  async function saveFileToFirebase(file: any) {
    const storage = getStorage(app);
    const storageRef = ref(storage, `videos/${video.videoNumber}`);

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
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            await setDoc(
              doc(db, "videos", video.videoNumber.toLocaleString()),
              {
                videoURL: fileUrl,
                updatedAt: new Date(),
              },
              {
                merge: true,
              }
            );
            setVideoUrl(fileUrl);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async function onFileChange(e: any) {
    console.log(e.target.files);
    const file = e.target.files[0];
    setLoading(true);
    await saveFileToFirebase(file);
    setLoading(false);
  }
  return (
    <div className="border rounded-md h-[550px] w-[300px]  mx-10 bg-muted  shadow-sm ">
      {loading ? (
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-primary font-bold">Uploading Video</h1>
          <Progress value={uploadProgress} className="bg-muted-foreground" />
        </div>
      ) : (
        <>
          {videoUrl ? (
            <Carousel>
              <CarouselContent>
                <CarouselItem className="group h-[550px] w-[309px] rounded-lg  relative ">
                  <div className="absolute bg-background/60 flex-row items-center justify-between hidden group-hover:flex z-20 p-2 border  rounded-br-lg h-fit  w-fit gap-4">
                    <h1 className="font-bold text-primary">V1.0</h1>
                    <Button
                      variant={"secondary"}
                      className=" hover:bg-opacity-80 cursor-pointer z-20"
                    >
                      <Icons.add className="h-4 w-4 mr-2" />
                      new version
                    </Button>
                    <Button
                      variant="secondary"
                      className="  hover:bg-opacity-80   z-20"
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative z-10 h-[550px] w-[309px]  aspecst-[9/16] overflow-hidden ">
                    <video controls className="w-full  " src={videoUrl}></video>
                  </div>
                </CarouselItem>
                <CarouselItem className="group  h-[550px] w-[309px]  relative ">
                  <Button
                    variant="destructive"
                    className="absolute top-3 right-3 hidden group-hover:flex hover:bg-opacity-80   z-20"
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                  <Button className="absolute top-3 left-3 hidden group-hover:flex hover:bg-opacity-80 cursor-pointer z-20">
                    <Icons.add className="h-4 w-4 mr-2" />
                    new version
                  </Button>
                  <div className="relative z-10 h-[550px] w-[309px]  aspect-[9/16] overflow-hidden">
                    <video controls className="w-full  " src={videoUrl}></video>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <h1>Completed video goes here</h1>
              <Button
                onClick={() => document.getElementById("selectedFile")?.click()}
              >
                Click to upload{" "}
              </Button>
              <input
                multiple
                id="selectedFile"
                type="file"
                accept=".mp4 , .mov"
                onChange={onFileChange}
                style={{display: "none"}}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const convertTimestampToDate = (timestamp: Timestamp): Date => {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  return new Date(milliseconds);
};