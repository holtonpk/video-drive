"use client";
import React, {use, useEffect} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {useVideo} from "../data/video-context";
import {setDoc, doc, getDoc} from "firebase/firestore";
import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {db, app} from "@/config/firebase";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {convertTimestampToDate} from "@/lib/utils";
import {AssetType} from "@/src/app/(tool)/(auth)/(admin)/new-video/new-video-context";
import Link from "next/link";
import {Progress} from "@/components/ui/progress";
import {Editor} from "./editor";
import {useAuth} from "@/context/user-auth";
import {cn} from "@/lib/utils";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import DatePickerWithRange2 from "@/src/app/(tool)/(auth)/(admin)/client-view/[client]/components/date-picker-hour";
export const VideoScript = () => {
  const {video} = useVideo()!;

  const [copied, setCopied] = React.useState(false);

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(video.script);
  //   setCopied(true);
  //   setTimeout(() => {
  //     setCopied(false);
  //   }, 2000);
  // };

  const [script, setScript] = React.useState(video.script);

  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    video.scriptDueDate
      ? convertTimestampToDate(video.scriptDueDate)
      : undefined
  );

  const {currentUser} = useAuth()!;

  useEffect(() => {
    async function updateScript() {
      await setDoc(
        doc(db, "videos", video.videoNumber.toString()),
        {
          script: script,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
        },
        {
          merge: true,
        }
      );
    }
    updateScript();
  }, [script, video.videoNumber, currentUser]);

  async function updateField(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        [field]: value,
      },
      {
        merge: true,
      }
    );
  }

  // const [wordCount, setWordCount] = React.useState(0);

  // useEffect(() => {
  //   setWordCount(script.split(" ").length);
  // }, [script]);

  const [uploadName, setUploadName] = React.useState<string>("test.mp4"); // State to track the name of the file being uploaded
  const [assetUploading, setAssetUploading] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [voiceOver, setVoiceOver] = React.useState<AssetType[] | undefined>(
    video.voiceOver
  );

  const getFileExtension = (fname: string) => {
    return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  async function saveFileToFirebase(file: any) {
    if (!video) return;
    // const fileID = Math.random().toString(36).substring(7);
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `assets/${
        video.videoNumber + "_voiceOver" + "." + getFileExtension(file.name)
      }`
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
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            let newVoiceOver: AssetType[];
            if (!voiceOver) {
              newVoiceOver = [
                {title: video.videoNumber + "_voiceOver", url: fileUrl},
              ];
              // save assets to video in firebase

              await getDoc(doc(db, "videos", video.videoNumber.toString()));
              await setDoc(
                doc(db, "videos", video.videoNumber.toString()),
                {
                  voiceOver: newVoiceOver,
                },
                {merge: true}
              );
            } else {
              newVoiceOver = [
                ...voiceOver,
                {title: video.videoNumber + "_voiceOver", url: fileUrl},
              ];
              await getDoc(doc(db, "videos", video.videoNumber.toString()));
              await setDoc(
                doc(db, "videos", video.videoNumber.toString()),
                {
                  voiceOver: newVoiceOver,
                },
                {merge: true}
              );
            }

            setVoiceOver(newVoiceOver);
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
    setUploadName(file.name);
    setAssetUploading(true);
    await saveFileToFirebase(file);
    setAssetUploading(false);
  }

  const removeAsset = async (asset: AssetType) => {
    if (!voiceOver) return;
    const newAssets = voiceOver.filter((a) => a.title !== asset.title);
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        voiceOver: newAssets,
      },
      {merge: true}
    );
    setVoiceOver(newAssets);
  };

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

  console.log("video-script ============", video.script);

  const [openScriptDueDate, setOpenScriptDueDate] =
    React.useState<boolean>(false);

  return (
    <Card className="relative shadow-sm h-fit w-fit ">
      <CardHeader>
        <CardTitle className="flex justify-between items-center ">
          Video Script
          <Popover open={openScriptDueDate} onOpenChange={setOpenScriptDueDate}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal",
                  !video.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="mr-2">Script Due Date:</span>
                <span className="font-bold">
                  {dueDate ? (
                    format(dueDate, "PPP 'at' p")
                  ) : (
                    <span>Due Date</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              {/* <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(value) => {
                  setDueDate(value);
                  updateField("scriptDueDate", value);
                }}
                initialFocus
              /> */}
              <DatePickerWithRange2
                date={dueDate}
                setDate={setDueDate}
                onSave={(value) => {
                  setDueDate(value);
                  updateField("scriptDueDate", value);
                  setOpenScriptDueDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 ">
        {/* <Textarea
          className="h-[300px] "
          value={script}
          onChange={(e) => setScript(e.target.value)}
        /> */}
        {/* {video && (
        )} */}
        <Editor
          post={{
            id: "1",
            content: video.script,
          }}
          setScript={setScript}
        />
        {/* <h1 className="">Word count:{" " + wordCount}</h1> */}
        {assetUploading && (
          <div className="w-full bg-muted border rounded-md p-4 items-center grid grid-cols-2 gap-4">
            <h1 className=" font-bold whitespace-nowrap text-ellipsis overflow-hidden">
              {uploadName}
            </h1>
            <Progress value={uploadProgress} className="bg-muted-foreground" />
          </div>
        )}
        {!voiceOver || voiceOver?.length === 0 ? (
          <div className="flex flex-col items-center  gap-4 p-4 bg-muted">
            <span className="flex w-full justify-center items-center ">
              No audio for this video
            </span>
            <Button
              onClick={() => document.getElementById("uploadAsset")?.click()}
              className="w-fit"
            >
              <Icons.add className="h-4 w-4" />
              Add audio
            </Button>
            <input
              multiple
              id="uploadAsset"
              type="file"
              onChange={onFileChange}
              style={{display: "none"}}
            />
          </div>
        ) : (
          <div className="grid gap-6">
            {voiceOver.map((asset) => (
              <div
                key={asset.title}
                className="w-full bg-muted border rounded-md p-4 flex items-center justify-between gap-4"
              >
                <Button variant="ghost" onClick={() => removeAsset(asset)}>
                  <Icons.close className=" h-5 w-5 text-muted-foreground" />
                </Button>
                <h1>{asset.title}</h1>
                <div className="flex gap-4 items-center ml-auto">
                  <Link
                    href={asset.url}
                    target="_blank"
                    className={cn(buttonVariants({variant: "outline"}))}
                  >
                    View
                  </Link>

                  <Button onClick={() => downloadFile(asset)}>
                    <Icons.download className="ml-auto h-5 w-5 " />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {/* <Button onClick={copyToClipboard} className="absolute top-3 right-3">
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
      </Button> */}
    </Card>
  );
};
