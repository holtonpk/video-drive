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
import {AssetType} from "@/src/app/(tool)/new-video/new-video-context";

import {Icons} from "@/components/icons";

import {useVideo} from "../data/video-context";

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

  return (
    <Card className="h-fit shadow-sm w-full relative">
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      {!video.assets || video.assets?.length === 0 ? (
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
