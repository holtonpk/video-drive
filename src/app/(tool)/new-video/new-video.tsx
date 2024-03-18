"use client";
import React from "react";
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
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";
import {Icons} from "@/components/icons";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {setDoc, doc} from "firebase/firestore";

import {useNewVideo} from "./new-video-context";
import {clients, statuses} from "@/src/app/(tool)/(video-sheet)/data/data";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {Progress} from "@/components/ui/progress";

import {db, app} from "@/config/firebase";
const NewVideo = () => {
  return (
    <>
      <Header />
      <div className=" flex flex-col w-full gap-4  items-center p-8 container ">
        <div className="flex gap-4 h-fit  justify-between w-full   rounded-md items-start">
          <VideoDetails />
          <VideoAssets />
        </div>
        <VideoScript />
      </div>
    </>
  );
};

export default NewVideo;

const Header = () => {
  const {loading, saveVideo} = useNewVideo()!;
  return (
    <div className="w-full flex bg-muted p-4">
      <h1 className="font-bold text-2xl">Create a New Video</h1>
      <Button onClick={saveVideo} className="ml-auto">
        {loading && <Icons.spinner className="animate-spin h-5 w-5 mr-2" />}
        Save Video
      </Button>
    </div>
  );
};

const VideoAssets = () => {
  type AssetType = {
    title: string;
    url: string;
  };

  const {assets, setAssets} = useNewVideo()!;
  const [loading, setLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0); // State to track upload progress

  async function saveFileToFirebase(file: any) {
    const fileID = Math.random().toString(36).substring(7);
    const storage = getStorage(app);
    const storageRef = ref(storage, `assets/${fileID}`);

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
            let newAssets: AssetType[];
            if (!assets) {
              newAssets = [{title: file.name, url: fileUrl}];
            } else {
              newAssets = [...assets, {title: file.name, url: fileUrl}];
            }
            setAssets(newAssets);
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

  return (
    <Card className=" shadow-sm flex-grow relative h-full">
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>
          Upload the video assets for the video.
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-primary font-bold">Uploading Asset</h1>
          <Progress value={uploadProgress} className="bg-muted-foreground" />
        </div>
      ) : (
        <>
          <CardContent className="grid gap-6">
            {assets ? (
              <>
                {assets.map((file) => (
                  <div
                    key={file.title}
                    className="w-full bg-muted border rounded-md p-4 flex items-center justify-between gap-4"
                  >
                    <Icons.close className=" h-5 w-5 text-muted-foreground" />
                    <h1>{file.title}</h1>
                    <button
                      onClick={() => downloadFile(file)}
                      className="ml-auto"
                    >
                      <Icons.download className=" h-5 w-5 text-primary" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    document.getElementById("selectedFile")?.click()
                  }
                  className="w-full border rounded-md text-primary border-primary border-dashed flex items-center p-8 justify-center"
                >
                  Click to add assets
                </button>
                <input
                  multiple
                  id="selectedFile"
                  type="file"
                  onChange={onFileChange}
                  style={{display: "none"}}
                />
              </>
            )}
          </CardContent>
          {assets && (
            <CardFooter className="justify-between space-x-2">
              <Button
                onClick={() => document.getElementById("selectedFile")?.click()}
              >
                Add Assets
              </Button>
              <input
                multiple
                id="selectedFile"
                type="file"
                onChange={onFileChange}
                style={{display: "none"}}
              />
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
};
const VideoScript = () => {
  const {script, setScript} = useNewVideo()!;
  return (
    <Card className="relative shadow-sm h-fit w-full ">
      <CardHeader>
        <CardTitle>Script</CardTitle>
        <CardDescription>
          Upload & download the video assets for the video.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="h-[400px]"
            id="script"
            placeholder="The script for the video goes here..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

const VideoDetails = () => {
  const {
    title,
    setTitle,

    notes,
    setNotes,
    status,
    setStatus,
    client,
    setClient,
    videoNumber,
    setVideoNumber,
  } = useNewVideo()!;

  return (
    <Card className="h-fit shadow-sm">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
        <CardDescription>
          View and edit the details of the video.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            placeholder="Video title goes here..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="videoNumber">Video #</Label>
            <Input
              value={videoNumber}
              onChange={(e) => setVideoNumber(e.target.value)}
              id="videoNumber"
              type={"number"}
              placeholder="#"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="video-id">Due Date</Label>
              <DueDatePicker />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video-id">Post Date</Label>
              <PostDatePicker />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger id="client" className=" w-full truncate">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="flex flex-nowrap"
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground rounded-sm" />
                      )}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className=" w-full truncate">
                <SelectValue placeholder="Select status" />
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
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground rounded-sm" />
                      )}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="client">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              id="notes"
              placeholder="Any notes for the video go here..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PostDatePicker() {
  const {postDate, setPostDate} = useNewVideo()!;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !postDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {postDate ? format(postDate, "PPP") : <span>Post Date</span>}
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

export function DueDatePicker() {
  const {dueDate, setDueDate} = useNewVideo()!;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
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
  );
}

const VideoPreview = () => {
  return (
    <div className="border rounded-md h-[550px] min-h-full s aspect-[9/16] bg-muted flex justify-center items-center overflow-hidden shadow-sm">
      <Button>Click to upload a video</Button>
    </div>
  );
};
