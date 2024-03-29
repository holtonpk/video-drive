"use client";

import * as React from "react";
import {addDays, format, set, subDays} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";
import {DateRange} from "react-day-picker";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {clients, statuses} from "@/src/app/(tool)/(video-sheet)/data/data";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {db} from "@/config/firebase";
import {setDoc, doc} from "firebase/firestore";

const SUBDAYS_VIDEO_DUE = 2;
const SUBDAYS_SCRIPT_DUE = 3;

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

const VideoPlanner = () => {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [totalVideos, setTotalVideos] = React.useState<number>();
  const [client, setClient] = React.useState<string | undefined>();

  const [newVideos, setNewVideos] = React.useState<NewVideo[]>([]);

  const clientID = clients.find((c) => c.value === client)?.id;
  const currentClientTotalVideo = 100;

  const generateVideoNumber = (sequenceNumber: number) => {
    const sequenceString = sequenceNumber.toString().padStart(3, "0");
    return `${clientID}${sequenceString}`;
  };

  // Usage example
  let videoCount = currentClientTotalVideo;

  const [createIsLoading, setCreateIsLoading] = React.useState(false);

  async function CreateVideos() {
    setCreateIsLoading(true);
    console.log("newVideos===", newVideos);
    // create videos in firebase
    await Promise.all(
      newVideos.map(async (video) => {
        await setDoc(doc(db, "videos", video.videoNumber.toString()), {
          ...video,
          updatedAt: new Date(),
        });
      })
    );

    setCreateIsLoading(false);
  }

  //   const [newVideos, setNewVideos] = React.useState<any[]>([]);

  console.log("newVideos===", newVideos);

  const Reset = () => {
    setNewVideos([]);
    setTotalVideos(undefined);
    setClient("");
    setDate(undefined);
  };

  const readyToCreate = totalVideos && client && date;

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
      let videoCount = 0;
      let newVideos = videoSchedule.flatMap((day) => {
        return Array.from({length: day.videosForThisDay}).map(() => {
          videoCount++;
          const videoNumber = generateVideoNumber(videoCount);
          return {
            title: "video - #" + videoNumber.toString(),
            videoNumber: videoNumber.toString(),
            clientId: client,
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
  };

  return (
    <div className="container flex flex-col items-center  p-8 ">
      {newVideos && newVideos.length > 0 ? (
        <div className="flex flex-col items-center gap-4 w-full mt-4 relative">
          {newVideos.map((video, index) => (
            <VideoLine
              key={index}
              video={video}
              newVideos={newVideos}
              setNewVideos={setNewVideos}
            />
          ))}
          <Button onClick={CreateVideos} className="w-full">
            {createIsLoading ? (
              <Icons.spinner className="animate-spin mr-2" />
            ) : (
              "Save Videos"
            )}
          </Button>
          <Button
            onClick={Reset}
            variant={"ghost"}
            className="w-fit text-destructive"
          >
            Reset
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 border p-4 rounded-md shadow-sm mt-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Total Videos</Label>
              <Input
                type={"number"}
                value={totalVideos}
                onChange={(e) => setTotalVideos(Number(e.target.value))}
                placeholder="# of videos to create"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger id="client" className=" w-full truncate">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex flex-nowrap"
                    >
                      <div className="flex items-center">
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground rounded-sm" />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button disabled={!readyToCreate} onClick={CreateVideosTemp}>
            Create Videos
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPlanner;

const VideoLine = ({
  video,
  newVideos,
  setNewVideos,
}: {
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
}) => {
  const date = new Date();

  const [title, setTitle] = React.useState(video.title);
  const [notes, setNotes] = React.useState(video.notes);
  const [status, setStatus] = React.useState(video.status);
  return (
    <VideoProvider
      video={video}
      setNewVideos={setNewVideos}
      newVideos={newVideos}
    >
      <div className="w-full p-6  relative rounded-md border h-fit shadow-md flex items-start  gap-4">
        <h1 className="mr-6">
          <span className="font-bold">#{video.videoNumber}</span>
        </h1>
        <div className="grid gap-4">
          <div className="grid gap-2 h-fit ">
            <Label htmlFor="video-id">Title</Label>

            <Input
              placeholder="title"
              className="w-[250px]"
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client">Status</Label>
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
              <SelectTrigger id="status" className=" w-full truncate">
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2 h-fit">
            <Label htmlFor="video-id">Video Due </Label>
            <DueDatePicker />
          </div>
          <div className="grid gap-2 h-fit">
            <Label htmlFor="video-id">Script Due</Label>
            <ScriptDatePicker />
          </div>
          <div className="grid gap-2 h-fit">
            <Label htmlFor="video-id">Post Date</Label>
            <PostDatePicker />
          </div>
        </div>

        <div className="grid gap-2 col-span-2 flex-grow">
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
            className="flex-grow"
            id="notes"
            placeholder="Any notes for the video go here..."
          />
        </div>
      </div>
    </VideoProvider>
  );
};

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

const MortyData = [
  {
    title: "Urban Legends from every US State; Colorado",
    videoNumber: "2001",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-03T05:00:00.000Z"),
    postDate: new Date("2024-03-04T05:00:00.000Z"),
    scriptDueDate: new Date("2024-03-01T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Story ",
    videoNumber: "2002",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-03T05:00:00.000Z"),
    postDate: new Date("2024-03-05T05:00:00.000Z"),
    scriptDueDate: new Date("2024-03-01T05:00:00.000Z"),
    notes: "Escape",
    script: "",
  },
  {
    title:
      "Story Behind Picture: 3 Photos that look normal until you find out the story behind them",
    videoNumber: "2003",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-04T05:00:00.000Z"),
    postDate: new Date("2024-03-06T05:00:00.000Z"),
    scriptDueDate: new Date("2024-03-01T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title:
      "Puzzle Solving - Get from TikTok, add hook, narrate it same as the og video, in the middle of the video ask viewer to comment the solution before we reveal it. ",
    videoNumber: "2004",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-04T05:00:00.000Z"),
    postDate: new Date("2024-03-07T05:00:00.000Z"),
    scriptDueDate: new Date("2024-03-01T05:00:00.000Z"),
    notes: "Escpape",
    script: "",
  },
  {
    title:
      "Morty Educational: Maximise style video explaing principle of IRL entertainment + then CTA to go outside + Top 3 immersive experiences we found this week",
    videoNumber: "2005",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-04T05:00:00.000Z"),
    postDate: new Date("2024-03-08T05:00:00.000Z"),
    scriptDueDate: new Date("2024-03-01T05:00:00.000Z"),
    notes: "Educational",
    script: "",
  },
  {
    title: "Urban Legends from every US State",
    videoNumber: "2006",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-07T05:00:00.000Z"),
    postDate: new Date("2024-03-11T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-05T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Story 1",
    videoNumber: "2007",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-07T05:00:00.000Z"),
    postDate: new Date("2024-03-12T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-05T05:00:00.000Z"),
    notes: "Escape Room Story 1",
    script: "",
  },
  {
    title: "Creepiest places to see if you are a thrill seeker",
    videoNumber: "2008",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-07T05:00:00.000Z"),
    postDate: new Date("2024-03-13T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-05T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Story 2",
    videoNumber: "2009",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-07T05:00:00.000Z"),
    postDate: new Date("2024-03-14T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-05T05:00:00.000Z"),
    notes: "Escpape",
    script: "",
  },
  {
    title:
      "Morty Educational: Maximise style video explaing principle of IRL entertainment + then CTA to go outside + Top 3 immersive experiences we found this week",
    videoNumber: "2010",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-07T05:00:00.000Z"),
    postDate: new Date("2024-03-15T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-05T05:00:00.000Z"),
    notes: "Educational",
    script: "",
  },
  {
    title: "Urban Legends - Illinois ",
    videoNumber: "2011",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-13T04:00:00.000Z"),
    postDate: new Date("2024-03-18T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-08T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Story 1",
    videoNumber: "2012",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-13T04:00:00.000Z"),
    postDate: new Date("2024-03-19T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-08T05:00:00.000Z"),
    notes: "Escape",
    script: "",
  },
  {
    title:
      "Story Behind Picture: 3 Photos that look normal until you find out the story behind them",
    videoNumber: "2013",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-13T04:00:00.000Z"),
    postDate: new Date("2024-03-20T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-08T05:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Tips",
    videoNumber: "2014",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-13T04:00:00.000Z"),
    postDate: new Date("2024-03-21T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-08T05:00:00.000Z"),
    notes: "Escape",
    script: "",
  },
  {
    title: "This is your sign...",
    videoNumber: "2015",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-13T04:00:00.000Z"),
    postDate: new Date("2024-03-22T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-08T05:00:00.000Z"),
    notes: "Educational",
    script: "",
  },
  {
    title: "Urban Legends - Clarke Family",
    videoNumber: "2016",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-20T04:00:00.000Z"),
    postDate: new Date("2024-03-25T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-15T04:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Conversations",
    videoNumber: "2017",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-20T04:00:00.000Z"),
    postDate: new Date("2024-03-26T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-15T04:00:00.000Z"),
    notes: "Escape",
    script: "",
  },
  {
    title: "Unsolved Mysetries",
    videoNumber: "2018",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-20T04:00:00.000Z"),
    postDate: new Date("2024-03-27T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-15T04:00:00.000Z"),
    notes: "Horror",
    script: "",
  },
  {
    title: "Escape Room Tips",
    videoNumber: "2019",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-20T04:00:00.000Z"),
    postDate: new Date("2024-03-28T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-15T04:00:00.000Z"),
    notes: "Escpape",
    script: "",
  },
  {
    title: "Morty Educational - Hey Siri",
    videoNumber: "2020",
    clientId: "morty",
    status: "done",
    dueDate: new Date("2024-03-20T04:00:00.000Z"),
    postDate: new Date("2024-03-29T04:00:00.000Z"),
    scriptDueDate: new Date("2024-03-15T04:00:00.000Z"),
    notes: "Educational",
    script: "",
  },
];
