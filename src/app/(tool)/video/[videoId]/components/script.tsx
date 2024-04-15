"use client";
import React, {use, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {useVideo} from "../data/video-context";
import {setDoc, doc} from "firebase/firestore";
import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {db, app} from "@/config/firebase";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {convertTimestampToDate} from "@/lib/utils";
import {cn} from "@/lib/utils";

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

  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    video.scriptDueDate
      ? convertTimestampToDate(video.scriptDueDate)
      : undefined
  );

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

  const [wordCount, setWordCount] = React.useState(0);

  useEffect(() => {
    setWordCount(script.split(" ").length);
  }, [script]);

  return (
    <Card className="relative shadow-sm h-fit w-full ">
      <CardHeader>
        <CardTitle>Video Script</CardTitle>
        <div className="grid gap-2">
          <Label htmlFor="due-date">Script Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
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
                onSelect={(value) => {
                  setDueDate(value);
                  updateField("scriptDueDate", value);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Textarea
          className="h-[300px] "
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
        <h1 className="">Word count:{" " + wordCount}</h1>
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
