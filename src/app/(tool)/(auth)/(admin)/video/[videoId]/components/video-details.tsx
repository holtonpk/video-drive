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
import {statuses, clients} from "@/config/data";

import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format, set} from "date-fns";

import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {useVideo} from "../data/video-context";
import {setDoc, getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {convertTimestampToDate} from "@/lib/utils";
import {EDITORS} from "@/config/data";
import {UserData} from "@/context/user-auth";
import {useAuth} from "@/context/user-auth";
import {Switch} from "@/components/ui/switch";
import DatePickerWithRange2 from "@/src/app/(tool)/(auth)/(admin)/client-view/[client]/components/date-picker-hour";
export const VideoDetails = () => {
  const {currentUser} = useAuth()!;
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

  async function updateField(field: string, value: any) {
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
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
        doc(db, "videos", video.videoNumber.toString()),
        {
          status: status,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
        },
        {
          merge: true,
        }
      );
    }
    changeStatus(status);
  }, [status, video.videoNumber, currentUser]);

  const [posted, setPosted] = React.useState<boolean>(video.posted || false);

  useEffect(() => {
    setPosted(video.posted || false);
  }, [video]);

  async function changePosted(value: boolean) {
    setPosted(value);
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        posted: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }

  return (
    <Card
      className={`h-fit shadow-sm w-full relative border-4
      ${
        status === "done"
          ? "border-green-500/20"
          : status === "todo"
          ? "border-blue-500/20"
          : status === "draft"
          ? "border-yellow-500/20"
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
      <CardContent className="grid gap-6 ">
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
                        : option.value === "draft"
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
        <div className="grid grid-cols-3 gap-6 ">
          <div className="grid gap-2 ">
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
            <Label htmlFor="editor">Editor</Label>
            <EditorSelector
              updateField={updateField}
              selectedEditor={video.editor}
            />
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
            <Label htmlFor="due-date">Editing Due Date</Label>
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
                  {dueDate ? (
                    format(dueDate, "PPP 'at' p")
                  ) : (
                    <span>Due Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(value) => {
                    setDueDate(value);
                    updateField("dueDate", value);
                  }}
                  initialFocus
                /> */}
                <DatePickerWithRange2
                  date={dueDate}
                  setDate={setDueDate}
                  onSelect={(value) => {
                    setDueDate(value);
                    updateField("dueDate", value);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-date">Post Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !video.postDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {postDate ? (
                    format(postDate, "PPP 'at' p")
                  ) : (
                    <span>Post Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* <Calendar
                  mode="single"
                  selected={postDate}
                  onSelect={(value) => {
                    setPostDate(value);
                    updateField("postDate", value);
                  }}
                  initialFocus
                /> */}
                <DatePickerWithRange2
                  date={postDate}
                  setDate={setPostDate}
                  onSelect={(value) => {
                    setPostDate(value);
                    updateField("postDate", value);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client">Posted</Label>
            <div className="flex gap-1 items-center">
              <Switch checked={posted} onCheckedChange={changePosted} />
              <span
                className={`whitespace-nowrap ${
                  posted ? "text-green-600" : "text-red-600"
                }`}
              >
                {posted ? "Posted" : "Not Posted"}
              </span>
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

const EditorSelector = ({
  updateField,
  selectedEditor,
}: {
  updateField: (field: string, value: any) => void;
  selectedEditor: string | undefined;
}) => {
  const [editor, setEditor] = React.useState<string | undefined>(
    selectedEditor
  );
  const [editors, setEditors] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const editorPromises = EDITORS.map(async (editor) => {
          const dataSnap = await getDoc(doc(db, "users", editor.id));
          return dataSnap.data() as UserData;
        });

        const editorData = await Promise.all(editorPromises);
        setEditors(editorData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchEditors();
  }, []);

  console.log("editors", editors);

  return (
    <>
      {editors && editors.length > 0 && (
        <Select
          value={editor}
          onValueChange={(value) => {
            setEditor(value);
            updateField("editor", value);
            // setNewVideos(
            //   newVideos.map((v) => {
            //     if (v.videoNumber === video.videoNumber) {
            //       return {...v, status: value};
            //     }
            //     return v;
            //   })
            // );
          }}
        >
          <SelectTrigger id="editor" className=" truncate w-full">
            <SelectValue placeholder="Select an editor" />
          </SelectTrigger>
          <SelectContent>
            {editors.map((option) => (
              <SelectItem
                key={option.uid}
                value={option.uid}
                className="flex flex-nowrap"
              >
                <div className="flex items-center">
                  <img
                    src={option.photoURL}
                    alt="editor"
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span>{option.firstName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
