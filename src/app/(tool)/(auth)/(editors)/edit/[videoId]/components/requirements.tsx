import React from "react";
import {useVideo} from "../data/video-context";
import {Icons} from "@/components/icons";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {AssetType} from "@/src/app/(tool)/(auth)/(admin)/new-video/new-video-context";
import edjsHTML from "editorjs-html";
import {OutputData} from "@editorjs/editorjs";

const Requirements = () => {
  const {video} = useVideo()!;

  const [scriptCopied, setScriptCopied] = React.useState(false);

  const copyScript = () => {
    if (!video.script) return;
    if (typeof video.script !== "string") {
      const edjsParser = edjsHTML();
      const htmlList = edjsParser.parse(video.script);
      const html = htmlList.join("");
      const rawText = html.replace(/<[^>]*>?/g, "");
      navigator.clipboard.writeText(rawText);
    } else {
      navigator.clipboard.writeText(video.script);
    }

    setScriptCopied(true);
    setTimeout(() => {
      setScriptCopied(false);
    }, 2000);
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-0 h-full flex-grow border rounded-md">
      <div className="flex items-center text-primary  bg-muted/50  p-2 rounded-t-md ">
        <Icons.script className="mr-2 h-4 w-4" />
        <Label>Script</Label>
        <Button
          size="sm"
          onClick={copyScript}
          className="ml-auto"
          variant="outline"
        >
          {scriptCopied ? (
            <>
              <Icons.check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Icons.copy className="mr-2 h-4 w-4" />
              Copy to clipboard
            </>
          )}
        </Button>
      </div>
      {typeof video.script === "string" ? (
        <div className="h-full  bg-foreground/40 blurBack overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
          {video.script}
        </div>
      ) : (
        <EditorJsRender script={video.script!} />
      )}
    </div>
    // <div className="w-full h-full  ">
    //   <div className="flex flex-col gap-4  ">
    //     {video.script && (
    //       <>
    //         {video.voiceOver && video.voiceOver.length > 0 && (
    //           <div className="flex flex-col gap-2">
    //             <div className="flex flex-col gap-2">
    //               <div className="flex items-end text-primary">
    //                 <Icons.audio className="mr-2 h-4 w-4" />
    //                 <Label htmlFor="voiceOver">Voice Over</Label>
    //               </div>
    //               {video.voiceOver.map((asset) => (
    //                 <AssetRow asset={asset} key={asset.title} />
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //         <div className="grid gap-2 h-full flex-grow b-r">
    //           <div className="flex items-end text-primary ">
    //             <Icons.script className="mr-2 h-4 w-4" />
    //             <Label>Script</Label>
    //           </div>
    //           {typeof video.script === "string" ? (
    //             <div className="flex-grow max-h-full  bg-foreground/40 blurBack overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
    //               {video.script}
    //             </div>
    //           ) : (
    //             <EditorJsRender script={video.script} />
    //           )}
    //         </div>
    //       </>
    //     )}

    //     {video.assets && video.assets.length > 0 && (
    //       <div className="flex flex-col gap-2">
    //         <div className="flex items-end text-primary">
    //           <Icons.video className="mr-2 h-4 w-4" />
    //           <Label htmlFor="footage">Footage</Label>
    //         </div>

    //         {video.assets.map((asset) => (
    //           <AssetRow asset={asset} key={asset.title} />
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

const EditorJsRender = ({script}: {script: OutputData}) => {
  const edjsParser = edjsHTML();
  const htmlList = edjsParser.parse(script);

  const html = htmlList.join("");

  return (
    <div className="relative h-full ">
      <div
        dangerouslySetInnerHTML={{__html: html}}
        className="h-fit overflow-scroll w-full  max-h-[300px]  text-primary bg-muted/20 blurBack p-4 rounded-b-md  editor-js-view flex flex-col gap-4 pb-10"
      />
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
      className="w-full text-primary border rounded-md p-4 grid grid-cols-[1fr_150px]  items-center justify-between gap-4"
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
