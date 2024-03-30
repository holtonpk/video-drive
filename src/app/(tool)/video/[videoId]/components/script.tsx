"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {useVideo} from "../data/video-context";
import {setDoc, doc} from "firebase/firestore";

import {db, app} from "@/config/firebase";

export const VideoScript = () => {
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
        doc(db, "videos", video.videoNumber.toString()),
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
