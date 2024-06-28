"use client";

import React, {useEffect} from "react";
import {statuses, clients} from "@/config/data";
import {
  onSnapshot,
  query,
  collection,
  where,
  writeBatch,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar as CalendarIcon, Car} from "lucide-react";
import {cn} from "@/lib/utils";
import {addDays, format, set, subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {UserData} from "@/context/user-auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {Calendar} from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatDateFromTimestamp,
  formatDateFromTimestampToTime,
} from "@/lib/utils";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {VideoData, EDITORS} from "@/config/data";
import {Input} from "@/components/ui/input";
import {NewVideoProvider} from "../../../new-video/new-video-context";
import {Textarea} from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type NewVideo = {
  title: string;
  videoNumber: string;
  clientId: string;
  status: string;
  dueDate: Date;
  postDate: Date;
  scriptDueDate: Date;
  notes: string;
  script: string;
};

export const CreateVideo = ({
  clientInfo,
  totalVideos,
}: {
  clientInfo: any;
  totalVideos: number;
}) => {
  const [newVideos, setNewVideos] = React.useState<NewVideo[] | null>();

  const clientID = clients.find((c) => c.value === clientInfo.value)?.id;

  const generateVideoNumber = (sequenceNumber: number) => {
    const sequenceString = sequenceNumber.toString().padStart(3, "0");
    return `${clientID}${sequenceString}`;
  };

  const createNewVideo = () => {
    setNewVideos([
      {
        title: "",
        videoNumber: Number(generateVideoNumber(totalVideos + 1)).toString(),
        clientId: clientInfo.value,
        status: "draft",
        dueDate: new Date(),
        postDate: new Date(),
        scriptDueDate: new Date(),
        notes: "",
        script: "",
      },
    ]);
  };

  const addVideo = () => {
    setNewVideos([
      ...(newVideos || []),
      {
        title: "",
        videoNumber: newVideos
          ? Number(
              generateVideoNumber(totalVideos + newVideos.length + 1)
            ).toString()
          : "0",
        clientId: clientInfo.value,
        status: "draft",
        dueDate: new Date(),
        postDate: new Date(),
        scriptDueDate: new Date(),
        notes: "",
        script: "",
      },
    ]);
    // if()
  };

  const [showBulkSchedule, setShowBulkSchedule] =
    React.useState<boolean>(false);

  const [saving, setSaving] = React.useState<boolean>(false);

  const saveVideos = async () => {
    if (newVideos) {
      setSaving(true);
      const batch = writeBatch(db);
      newVideos.forEach((video) => {
        const videoRef = doc(db, "videos", video.videoNumber.toString());
        batch.set(videoRef, video);
      });
      await batch.commit();
      setSaving(false);
      setNewVideos([]);
    }
  };

  return (
    <div className="w-full  flex flex-col ">
      {newVideos && newVideos.length > 0 ? (
        <>
          <div className="relative ">
            <div className="flex flex-col gap-6">
              {newVideos.map((video) => (
                <VideoProvider
                  key={video.videoNumber}
                  newVideos={newVideos}
                  setNewVideos={setNewVideos}
                  video={video}
                >
                  <NewVideoDraft />
                </VideoProvider>
              ))}
            </div>
            <Button
              onClick={addVideo}
              className="mx-auto mt-4 w-full bg-transparent text-primary border-primary hover:bg-primary hover:text-white"
              variant={"outline"}
            >
              <Icons.add className="h-5 w-5 mr-2" />
              Video
            </Button>
          </div>
          <Button
            onClick={saveVideos}
            className="w-fit ml-auto absolute top-8 right-8"
          >
            {saving ? (
              <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Icons.uploadCloud className="h-5 w-5 mr-2" />
            )}
            Save all ({newVideos.length})
          </Button>
        </>
      ) : (
        <div className="flex gap-2  absolute top-8 right-8">
          <Button onClick={createNewVideo} className="w-fit ml-auto">
            <Icons.add className="h-5 w-5 mr-2" />
            New Video
          </Button>
          <Button
            onClick={() => setShowBulkSchedule(true)}
            className="w-fit ml-auto"
          >
            <Icons.calendar className="h-5 w-5 mr-2" />
            Bulk Schedule
          </Button>
        </div>
      )}
      {showBulkSchedule && (
        <BulkSchedule
          showModal={showBulkSchedule}
          setShowModal={setShowBulkSchedule}
          setNewVideos={setNewVideos}
          clientInfo={clientInfo}
          clientTotalVideos={totalVideos}
        />
      )}
    </div>
  );
};

const BulkSchedule = ({
  showModal,
  setShowModal,

  setNewVideos,
  clientInfo,
  clientTotalVideos,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;

  setNewVideos: (videos: NewVideo[]) => void;
  clientInfo: any;
  clientTotalVideos: number;
}) => {
  const [totalVideos, setTotalVideos] = React.useState<number>();
  const [date, setDate] = React.useState<DateRange | undefined>();

  const SUBDAYS_VIDEO_DUE = 2;
  const SUBDAYS_SCRIPT_DUE = 3;

  const clientID = clients.find((c) => c.value === clientInfo.value)?.id;

  const generateVideoNumber = (sequenceNumber: number) => {
    const sequenceString = sequenceNumber.toString().padStart(3, "0");
    return `${clientID}${sequenceString}`;
  };

  const CreateVideosTemp = () => {
    if (!readyToCreate) return;
    const postDates =
      date?.from && date?.to
        ? Array.from(
            {length: (date.to.getTime() - date.from.getTime()) / 86400000 + 1},
            (_, index) => addDays(date.from!, index)
          )
        : [];
    const baseVideosPerDay = Math.floor(totalVideos / postDates.length);
    const leftoverVideos = totalVideos % postDates.length;

    const videoSchedule = postDates.map((date, index) => {
      let videosForThisDay = baseVideosPerDay;
      if (index < leftoverVideos) {
        videosForThisDay += 1; // Distribute leftover videos one by one to the initial days
      }

      return {date, videosForThisDay};
    });

    if (videoSchedule.length > 0) {
      let videoCount: number = 0;
      let newVideos = videoSchedule.flatMap((day) => {
        return Array.from({length: day.videosForThisDay}).map(() => {
          videoCount++;
          const videoNumber = generateVideoNumber(
            clientTotalVideos + videoCount
          );
          return {
            title: "video - #" + videoNumber.toString(),
            videoNumber: videoNumber,
            clientId: clientInfo.value,
            status: "draft",
            dueDate: subDays(day.date, SUBDAYS_VIDEO_DUE),
            postDate: day.date,
            scriptDueDate: subDays(day.date, SUBDAYS_SCRIPT_DUE),
            notes: "",
            script: "",
          };
        });
      });
      setNewVideos(newVideos as NewVideo[]);
    }
    setShowModal(false);
  };

  const readyToCreate = totalVideos && date;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <div className="flex flex-col gap-4 text-primary rounded-md shadow-sm ">
          <div className="grid gap-2">
            <Label>Total Videos</Label>
            <Input
              type={"number"}
              value={totalVideos}
              onChange={(e) => setTotalVideos(Number(e.target.value))}
              placeholder="# of videos to create"
            />
          </div>

          <DatePickerWithRange date={date} setDate={setDate} />
          <Button disabled={!readyToCreate} onClick={CreateVideosTemp}>
            Create Videos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NewVideoDraft = () => {
  const {video, setNewVideos, newVideos} = React.useContext(NewVideoContext)!;

  const [status, setStatus] = React.useState<string>(video.status);

  const deleteVideo = () => {
    setNewVideos(newVideos.filter((v) => v.videoNumber !== video.videoNumber));
  };

  const [title, setTitle] = React.useState<string>(video.title);
  const [notes, setNotes] = React.useState<string>(video.notes);
  const [editorPayout, setEditorPayout] = React.useState<number>();

  const [saving, setSaving] = React.useState<boolean>(false);
  const [saved, setSaved] = React.useState<boolean>(false);
  const saveVideo = async () => {
    setSaving(true);
    const videoRef = doc(db, "videos", video.videoNumber.toString());
    await setDoc(videoRef, video);
    setSaving(false);
    setSaved(true);
  };

  useEffect(() => {
    setSaved(false);
  }, [video]);

  return (
    <Card className="w-full  border rounded-md bg-card relative ">
      <div className="bg-muted w-full p-4  flex items-center justify-between gap-4">
        <CardTitle className="font-bold">Video #{video.videoNumber}</CardTitle>

        <div className="gap-4 flex   w-fit">
          {!saved && (
            <Button onClick={deleteVideo} variant={"outline"}>
              <Icons.trash className="h-5 w-5 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={saveVideo} disabled={saved} className="ml-auto">
            {saved ? (
              <>
                <Icons.check className="h-5 w-5 mr-2" />
                Saved
              </>
            ) : (
              <>
                {saving ? (
                  <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Icons.upload className="h-5 w-5 mr-2" />
                )}
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent>
        <div className="grid grid-cols-2 p-4 gap-4">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="client">Title</Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setNewVideos(
                    newVideos.map((v) => {
                      if (v.videoNumber === video.videoNumber) {
                        return {...v, title: e.target.value};
                      }
                      return v;
                    })
                  );
                }}
                className="mt-2"
                placeholder="Title"
              />
            </div>
            <div className="grid-gap-1">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setNewVideos(
                    newVideos.map((v) => {
                      if (v.videoNumber === video.videoNumber) {
                        return {...v, status: value};
                      }
                      return v;
                    })
                  );
                }}
              >
                <SelectTrigger id="status" className=" truncate w-full">
                  <SelectValue placeholder="Select status" />
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
            </div>

            <div className="grid gap-1">
              <Label htmlFor="client">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setNewVideos(
                    newVideos.map((v) => {
                      if (v.videoNumber === video.videoNumber) {
                        return {...v, notes: e.target.value};
                      }
                      return v;
                    })
                  );
                }}
                className="mt-2"
                placeholder="Notes"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>Post Date</Label>
              <PostDatePicker />
            </div>
            <div className="grid gap-1">
              <Label>Script Due</Label>
              <ScriptDatePicker />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-1">
                <Label>Editor</Label>
                <EditorSelector
                  selectedEditor={undefined}
                  newVideos={newVideos}
                  video={video}
                  setNewVideos={setNewVideos}
                />
              </div>
              <div className="grid gap-1">
                <Label>Editor Payout</Label>
                <Input
                  type="number"
                  placeholder="$"
                  value={editorPayout}
                  onChange={(e) => {
                    setEditorPayout(Number(e.target.value));
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.videoNumber === video.videoNumber) {
                          return {...v, priceUSD: Number(e.target.value)};
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label>Editing Due</Label>
                <DueDatePicker />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PostDatePicker() {
  const {video, setNewVideos, newVideos} = React.useContext(NewVideoContext)!;
  const [postDate, setPostDate] = React.useState<Date | undefined>(
    video.postDate
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !postDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {postDate ? format(postDate, "PPP") : <span>Post Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={postDate}
          onSelect={(value) => {
            if (!value) return;
            setPostDate(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, postDate: value};
                }
                return v;
              })
            );
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function ScriptDatePicker() {
  const {video, setNewVideos, newVideos} = React.useContext(NewVideoContext)!;

  const [scriptDueDate, setScriptDueDate] = React.useState<Date | undefined>(
    video.scriptDueDate
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !scriptDueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {scriptDueDate ? (
            format(scriptDueDate, "PPP")
          ) : (
            <span>Post Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={scriptDueDate}
          onSelect={(value) => {
            if (!value) return;
            setScriptDueDate(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, scriptDueDate: value};
                }
                return v;
              })
            );
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function DueDatePicker() {
  const {video, setNewVideos, newVideos} = React.useContext(NewVideoContext)!;

  const [dueDate, setDueDate] = React.useState<Date | undefined>(video.dueDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
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
            if (!value) return;
            setDueDate(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, dueDate: value};
                }
                return v;
              })
            );
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function DatePickerWithRange({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type NewVideoContextType = {
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
};

const NewVideoContext = React.createContext<NewVideoContextType | null>(null);

interface VideoProviderProps {
  children: React.ReactNode;
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
}

// Provider component
export const VideoProvider = ({
  children,
  video,
  newVideos,
  setNewVideos,
}: VideoProviderProps) => {
  return (
    <NewVideoContext.Provider value={{video, newVideos, setNewVideos}}>
      {children}
    </NewVideoContext.Provider>
  );
};

const EditorSelector = ({
  selectedEditor,
  setNewVideos,
  newVideos,
  video,
}: {
  selectedEditor: string | undefined;
  setNewVideos: (videos: NewVideo[]) => void;
  newVideos: NewVideo[];
  video: NewVideo;
}) => {
  const [editor, setEditor] = React.useState<string | undefined>(
    selectedEditor
  );
  const [editors, setEditors] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const editorPromises = EDITORS.map(async (editor) => {
          const dataSnap = await getDoc(doc(db, "users", editor));
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

  return (
    <>
      {editors && editors.length > 0 && (
        <Select
          value={editor}
          onValueChange={(value) => {
            setEditor(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, editor: value};
                }
                return v;
              })
            );
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
