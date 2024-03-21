"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Timestamp} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {statuses} from "@/src/app/(tool)/(video-sheet)/data/data";

import {Label} from "@/components/ui/label";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";

import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";

import {clients} from "@/src/app/(tool)/(video-sheet)/data/data";
import {useVideo} from "../data/video-context";

import {setDoc, doc} from "firebase/firestore";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

import {db} from "@/config/firebase";
import {convertTimestampToDate} from "@/lib/utils";

export const VideoDetails = () => {
  const {video} = useVideo()!;

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

  console.log("dd", dueDate);

  async function updateField(field: string, value: any) {
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
    <Card
      className={`h-fit shadow-sm w-full relative border-4
      ${
        status === "done"
          ? "border-green-500/20"
          : status === "todo"
          ? "border-blue-500/20"
          : "border-red-500/20"
      }
    `}
    >
      <CardHeader>
        <CardTitle>Video #{video.videoNumber} Details</CardTitle>
        {/* <CardDescription>
            View and edit the details of the video.
          </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-6">
        <Select
          defaultValue={status}
          onValueChange={(value) => {
            setStatus(value);
            updateField("status", value);
          }}
        >
          <SelectTrigger
            id="status"
            className=" w-[200px] truncate absolute top-4 right-4"
          >
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
        <div className="grid grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              value={title}
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
                updateField("title", e.target.value);
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
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
                    updateField("dueDate", value);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
        </div>

        <div className="grid gap-2 w-full">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              updateField("notes", e.target.value);
            }}
            className="w-full border p-2 flex items-center rounded-md text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};
