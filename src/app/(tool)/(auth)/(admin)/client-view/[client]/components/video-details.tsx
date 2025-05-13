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
import {VideoData, clients, REVIEW_USERS_DATA, MANAGERS} from "@/config/data";
import Link from "next/link";

import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format, set} from "date-fns";

import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {
  VideoProvider,
  useVideo,
} from "@/src/app/(tool)/(auth)/(admin)/video/[videoId]/data/video-context";
import {setDoc, getDoc, doc, deleteDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {convertTimestampToDate} from "@/lib/utils";
import {EDITORS} from "@/config/data";
import {UserData} from "@/context/user-auth";
import {useAuth} from "@/context/user-auth";
import {Switch} from "@/components/ui/switch";
import DatePickerWithRange2 from "./date-picker-hour";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export const VideoDetails = ({
  setDisplayedVideo,
}: {
  setDisplayedVideo: React.Dispatch<
    React.SetStateAction<VideoData | undefined>
  >;
}) => {
  const {currentUser} = useAuth()!;
  const {video} = useVideo()!;

  const client = clients.find((c: any) => c.value === video.clientId)!;

  interface Timestamp {
    nanoseconds: number;
    seconds: number;
  }

  // convert the timestamp to a date

  const [notes, setNotes] = React.useState(video.notes);
  const [price, setPrice] = React.useState<number | undefined>(video.priceUSD);

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

  const [posted, setPosted] = React.useState<boolean>(video.posted || false);

  useEffect(() => {
    setPosted(video.posted || false);
    setPostDate(
      video.postDate ? convertTimestampToDate(video.postDate) : undefined
    );
    setDueDate(convertTimestampToDate(video.dueDate));
    setPrice(video.priceUSD);
    setTitle(video.title);
    setNotes(video.notes);
    // setStatus(video.status);
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

  const [openDueDate, setOpenDueDate] = React.useState<boolean>(false);
  const [openPostDate, setOpenPostDate] = React.useState<boolean>(false);

  const updateDueDate = (date: Date) => {
    setDueDate(date);
    updateField("dueDate", date);
    setOpenDueDate(false);
  };

  const updatePostDate = (date: Date) => {
    setPostDate(date);
    updateField("postDate", date);
    setOpenPostDate(false);
  };

  const shareWithEditor = () => {
    updateField("scriptReviewed", [
      ...REVIEW_USERS_DATA.map((user) => user.id),
    ]);
  };

  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const deleteVideo = async () => {
    setDeleting(true);
    await deleteDoc(doc(db, "videos", video.videoNumber.toString()));
    setDeleting(false);
    setDisplayedVideo(undefined);
  };

  const [deleting, setDeleting] = React.useState<boolean>(false);

  return (
    <div
      className={`h-fit  w-full relative flex flex-col gap-2 rounded-md  z-[90]

    `}
    >
      <div className="grid  bg-foreground/40 p-4 rounded-b-md gap-2">
        <div className="grid grid-cols-2 gap-6 ">
          <div className="grid gap-2">
            <Label htmlFor="editor">Manager</Label>
            <ManagerSelector
              updateField={updateField}
              selectedManager={video.manager}
            />
          </div>
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
            <Label htmlFor="due-date">Post Date</Label>
            <Popover open={openPostDate} onOpenChange={setOpenPostDate}>
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
                <DatePickerWithRange2
                  date={postDate}
                  setDate={setPostDate}
                  onSave={updatePostDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-date">Editing Due Date</Label>
            <Popover open={openDueDate} onOpenChange={setOpenDueDate}>
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
                <DatePickerWithRange2
                  date={dueDate}
                  setDate={setDueDate}
                  onSave={updateDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2 ">
            <Label htmlFor="title">Price</Label>
            <Input
              placeholder="$"
              type="number"
              className="text-primary"
              value={price}
              onChange={(e) => {
                setPrice(e.target.valueAsNumber);
                updateField("priceUSD", e.target.valueAsNumber);
              }}
            />
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
      </div>
      {video.scriptReviewed?.length !== REVIEW_USERS_DATA.length && (
        <Button
          onClick={shareWithEditor}
          variant={"outline"}
          className="w-full"
        >
          Share with editor
        </Button>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"} className="w-full">
            Delete Video
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">
              {`Delete Video #${video.videoNumber}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the video from the database. All data
              associated with the video will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant={"outline"}
              className="text-primary"
              onClick={() => {
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                deleteVideo();
                setShowDeleteDialog(false);
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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

  useEffect(() => {
    setEditor(selectedEditor);
  }, [selectedEditor]);

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

const ManagerSelector = ({
  updateField,
  selectedManager,
}: {
  updateField: (field: string, value: any) => void;
  selectedManager: string | undefined;
}) => {
  const [manager, setManager] = React.useState<string | undefined>(
    selectedManager
  );
  const [managers, setManagers] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const managerPromises = MANAGERS.map(async (manager) => {
          const dataSnap = await getDoc(doc(db, "users", manager.id));
          return dataSnap.data() as UserData;
        });

        const managerData = await Promise.all(managerPromises);
        setManagers(managerData);
      } catch (error) {
        console.error("Error fetching manager data: ", error);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    setManager(selectedManager);
  }, [selectedManager]);

  console.log("manager", selectedManager);
  return (
    <>
      {managers && managers.length > 0 && (
        <Select
          key={manager}
          value={manager}
          onValueChange={(value) => {
            setManager(value);
            updateField("manager", value);
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
          <SelectTrigger id="manager" className=" truncate w-full">
            <SelectValue placeholder="Select a manager" />
          </SelectTrigger>
          <SelectContent>
            {managers.map((option) => (
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
