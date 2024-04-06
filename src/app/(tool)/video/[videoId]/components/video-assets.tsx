"use client";
import React, {useEffect} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {AssetType} from "@/src/app/(tool)/new-video/new-video-context";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {Icons} from "@/components/icons";
import {db, app} from "@/config/firebase";
import {useVideo} from "../data/video-context";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import {cn} from "@/lib/utils";

export const VideoAssets = () => {
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

  const [assetUploading, setAssetUploading] = React.useState<boolean>(false);
  const [uploadName, setUploadName] = React.useState<string>("test.mp4"); // State to track the name of the file being uploaded
  const [uploadProgress, setUploadProgress] = React.useState(0); // State to track upload progress
  const [assets, setAssets] = React.useState<AssetType[] | undefined>(
    video.assets
  );

  const getFileExtension = (fname: string) => {
    return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  async function saveFileToFirebase(file: any) {
    if (!video) return;
    const fileID = Math.random().toString(36).substring(7);
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `assets/${fileID + "." + getFileExtension(file.name)}`
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
            let newAssets: AssetType[];
            if (!assets) {
              newAssets = [{title: file.name, url: fileUrl}];
              // save assets to video in firebase

              await getDoc(doc(db, "videos", video.videoNumber.toString()));
              await setDoc(
                doc(db, "videos", video.videoNumber.toString()),
                {
                  assets: newAssets,
                },
                {merge: true}
              );
            } else {
              newAssets = [...assets, {title: file.name, url: fileUrl}];
              await getDoc(doc(db, "videos", video.videoNumber.toString()));
              await setDoc(
                doc(db, "videos", video.videoNumber.toString()),
                {
                  assets: newAssets,
                },
                {merge: true}
              );
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
    setUploadName(file.name);
    setAssetUploading(true);
    await saveFileToFirebase(file);
    setAssetUploading(false);
  }

  const removeAsset = async (asset: AssetType) => {
    if (!assets) return;
    const newAssets = assets.filter((a) => a.title !== asset.title);
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        assets: newAssets,
      },
      {merge: true}
    );
    setAssets(newAssets);
  };

  return (
    <Card className="h-fit shadow-sm w-full relative">
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {assetUploading && (
          <div className="w-full bg-muted border rounded-md p-4 items-center grid grid-cols-2 gap-4">
            <h1 className=" font-bold whitespace-nowrap text-ellipsis overflow-hidden">
              {uploadName}
            </h1>
            <Progress value={uploadProgress} className="bg-muted-foreground" />
          </div>
        )}
      </CardContent>
      {!assets || assets?.length === 0 ? (
        <div className="flex flex-col items-center  gap-4 p-4 bg-muted">
          <span className="flex w-full justify-center items-center ">
            No assets for this video{" "}
          </span>
          <Button
            onClick={() => document.getElementById("uploadAsset")?.click()}
            className="w-fit"
          >
            <Icons.add className="h-4 w-4" />
            Add assets
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
        <>
          <CardContent className="grid gap-6">
            {assets.map((asset) => (
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
