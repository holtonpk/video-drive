import React from "react";
import {useVideo} from "../data/video-context";
import {Icons} from "@/components/icons";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {AssetType} from "@/src/app/(tool)/(auth)/(admin)/new-video/new-video-context";

const Requirements = () => {
  const {video} = useVideo()!;

  return (
    <div className="w-full border-4 rounded-md overflow-hidden p-6">
      <h1 className="font-bold text-2xl text-foreground w-full ">
        Video Assets
      </h1>
      <div className="flex flex-col gap-4 mt-4">
        {video.script?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {video.voiceOver && (
              <div className="flex flex-col gap-2">
                <div className="flex items-end text-foreground">
                  <Icons.audio className="mr-2 h-4 w-4" />
                  <Label htmlFor="voiceOver">Voice Over</Label>
                </div>
                {video.voiceOver.map((asset) => (
                  <AssetRow asset={asset} key={asset.title} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-4 bg-muted mt-2">
            <Icons.folder className="h-12 w-12 text-muted-foreground" />
            <span className="text-muted-foreground">No assets uploaded</span>
          </div>
        )}
        <div>
          {video.assets && video.assets.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-end text-foreground">
                <Icons.video className="mr-2 h-4 w-4" />
                <Label htmlFor="footage">Footage</Label>
              </div>

              {video.assets.map((asset) => (
                <AssetRow asset={asset} key={asset.title} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requirements;

const AssetRow = ({asset}: {asset: AssetType}) => {
  const downloadFile = async (file: AssetType) => {
    setIsDownloading(true);
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
    setIsDownloading(false);
  };

  const [isDownloading, setIsDownloading] = React.useState(false);

  return (
    <div
      key={asset.title}
      className="w-full text-foreground border rounded-md p-4 grid grid-cols-[1fr_150px]  items-center justify-between gap-4"
    >
      <h1 className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {asset.title + ".mp3"}
      </h1>
      <div className="flex gap-4 items-center  w-full">
        <Link
          href={asset.url}
          target="_blank"
          className={cn(buttonVariants({variant: "outline"}))}
        >
          Open
        </Link>

        <Button onClick={() => downloadFile(asset)}>
          {isDownloading ? (
            <Icons.loader className="ml-auto h-5 w-5 animate-spin" />
          ) : (
            <Icons.download className="ml-auto h-5 w-5 " />
          )}
        </Button>
      </div>
    </div>
  );
};
