"use client";

import React, {useEffect} from "react";
import {statuses, clients, MANAGERS} from "@/config/data";
import {
  onSnapshot,
  query,
  collection,
  where,
  writeBatch,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import DatePickerWithRange2 from "./date-picker-hour";
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
  dueDate: Date | undefined;
  postDate: Date | undefined;
  scriptDueDate: Date | undefined;
  notes: string;
  script: string;
  posted: boolean;
};

export const CreateVideo = ({
  clientInfo,
  currentVideoNumber,
}: {
  clientInfo: any;
  currentVideoNumber: number;
}) => {
  const [newVideos, setNewVideos] = React.useState<NewVideo[] | null>();

  const clientID = clients.find((c) => c.value === clientInfo.value)?.id;

  const generateVideoNumber = (sequenceNumber: number) => {
    const sequenceString = sequenceNumber.toString().padStart(3, "0");
    return `${clientID}${sequenceString}`;
  };

  console.log("tv", currentVideoNumber);

  const createNewVideo = () => {
    setNewVideos([
      {
        title: "",
        videoNumber: Number(currentVideoNumber + 1).toString(),
        clientId: clientInfo.value,
        status: "draft",
        dueDate: undefined,
        postDate: undefined,
        scriptDueDate: undefined,
        notes: "",
        script: "",
        posted: false,
      },
    ]);
  };

  const addVideo = () => {
    setNewVideos([
      ...(newVideos || []),
      {
        title: "",
        videoNumber: newVideos
          ? Number(currentVideoNumber + newVideos.length + 1).toString()
          : "0",
        clientId: clientInfo.value,
        status: "draft",
        dueDate: new Date(),
        postDate: new Date(),
        scriptDueDate: new Date(),
        notes: "",
        script: "",
        posted: false,
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

  const [openVideoCreator, setOpenVideoCreator] =
    React.useState<boolean>(false);

  useEffect(() => {
    console.log(newVideos);
    setOpenVideoCreator(newVideos && newVideos.length > 0 ? true : false);
  }, [newVideos]);

  return (
    <div className="w-fit flex flex-col ">
      <Dialog
        open={openVideoCreator}
        onOpenChange={(value) => {
          if (value === false) {
            setNewVideos([]);
          }
        }}
      >
        <DialogContent className="max-w-[1200px] overflow-hiddens bg-muted/20 blurBack">
          {newVideos && newVideos.length > 0 && (
            <div className="max-h-[80vh] overflow-scroll">
              <div className="flex flex-col gap-6 pt-16 ">
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
              <div className="left-0 gap-4 absolute top-0 h-16 items-center flex justify-between bg-popover w-full p-4">
                <h1 className="text-primary text-xl font-bold">
                  Video Creator
                </h1>
                <div className="flex gap-2 pr-10">
                  <Button
                    onClick={() => setNewVideos([])}
                    variant={"ghost"}
                    className="text-primary"
                  >
                    <Icons.close className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={saveVideos} className="w-fit ">
                    {saving ? (
                      <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Icons.uploadCloud className="h-5 w-5 mr-2" />
                    )}
                    Save all ({newVideos.length})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex gap-2 w-fit ">
        <Button onClick={createNewVideo} className="w-fit ">
          <Icons.add className="h-5 w-5 mr-2" />
          New Video
        </Button>
        <Button onClick={() => setShowBulkSchedule(true)} className="w-fit ">
          <Icons.calendar className="h-5 w-5 mr-2" />
          Bulk Schedule
        </Button>
      </div>

      {showBulkSchedule && (
        <BulkSchedule
          showModal={showBulkSchedule}
          setShowModal={setShowBulkSchedule}
          setNewVideos={setNewVideos}
          clientInfo={clientInfo}
          clientTotalVideos={currentVideoNumber}
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
          const videoNumber = Number(clientTotalVideos + videoCount).toString();

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
            posted: false,
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
      <DialogContent className="min-w-fit ">
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

  // const [status, setStatus] = React.useState<string>(video.status);

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
            <div className="grid gap-1 h-fit">
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
            <div className="grid gap-1">
              <Label>Manager</Label>
              <ManagerSelector
                selectedManager={undefined}
                newVideos={newVideos}
                video={video}
                setNewVideos={setNewVideos}
              />
            </div>

            <div className="grid gap-1 h-fit">
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
            <div className="grid gap-1">
              <Label>Editing Due</Label>
              <DueDatePicker />
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

  const [openPostDate, setOpenPostDate] = React.useState<boolean>(false);

  const updatePostDate = (date: Date) => {
    setPostDate(date);
    setNewVideos(
      newVideos.map((v) =>
        v.videoNumber === video.videoNumber ? {...v, postDate: date} : v
      )
    );
    setOpenPostDate(false);
  };

  console.log("postDate==================", postDate);
  return (
    <Popover open={openPostDate} onOpenChange={setOpenPostDate}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !postDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {postDate ? format(postDate, "PPP 'at' p") : <span>Post Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* <Calendar
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
        /> */}
        <DatePickerWithRange2
          date={postDate}
          setDate={setPostDate}
          onSave={updatePostDate}
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

  const [openScriptDueDate, setOpenScriptDueDate] =
    React.useState<boolean>(false);

  const updateScriptDueDate = (date: Date) => {
    setScriptDueDate(date);
    setNewVideos(
      newVideos.map((v) =>
        v.videoNumber === video.videoNumber ? {...v, scriptDueDate: date} : v
      )
    );
    setOpenScriptDueDate(false);
  };

  return (
    <Popover open={openScriptDueDate} onOpenChange={setOpenScriptDueDate}>
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
            format(scriptDueDate, "PPP 'at' p")
          ) : (
            <span>Script Due</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePickerWithRange2
          date={scriptDueDate}
          setDate={setScriptDueDate}
          onSave={updateScriptDueDate}
        />
      </PopoverContent>
    </Popover>
  );
}

export function DueDatePicker() {
  const {video, setNewVideos, newVideos} = React.useContext(NewVideoContext)!;

  const [dueDate, setDueDate] = React.useState<Date | undefined>(video.dueDate);
  const [openDueDate, setOpenDueDate] = React.useState<boolean>(false);

  const updateDueDate = (date: Date) => {
    setDueDate(date);
    setNewVideos(
      newVideos.map((v) =>
        v.videoNumber === video.videoNumber ? {...v, dueDate: date} : v
      )
    );
    setOpenDueDate(false);
  };

  return (
    <Popover open={openDueDate} onOpenChange={setOpenDueDate}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dueDate ? format(dueDate, "PPP 'at' p") : <span>Editing Due</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* <Calendar
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
        /> */}
        <DatePickerWithRange2
          date={dueDate}
          setDate={setDueDate}
          onSave={updateDueDate}
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
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Select a date range below</span>
        )}
      </div>

      <Calendar
        className="bg-muted/40  rounded-md"
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
      />
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

const ManagerSelector = ({
  selectedManager,
  setNewVideos,
  newVideos,
  video,
}: {
  selectedManager: string | undefined;
  setNewVideos: (videos: NewVideo[]) => void;
  newVideos: NewVideo[];
  video: NewVideo;
}) => {
  const [manager, setManager] = React.useState<string | undefined>(
    selectedManager
  );
  const [managers, setManagers] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const managerPromises = MANAGERS.map(async (manager) => {
          const dataSnap = await getDoc(doc(db, "users", manager.id));
          return dataSnap.data() as UserData;
        });

        const managerData = await Promise.all(managerPromises);
        setManagers(managerData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchEditors();
  }, []);

  return (
    <>
      {managers && managers.length > 0 && (
        <Select
          value={manager}
          onValueChange={(value) => {
            setManager(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, manager: value};
                }
                return v;
              })
            );
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
