import React from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {NewVideo, VideoProvider} from "./create-videos";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CalendarIcon} from "@radix-ui/react-icons";
import {addDays, format, subDays} from "date-fns";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {clients} from "@/config/data";

export const BulkSchedule = ({
  clientInfo,
  currentVideoNumber,
  setNewVideos,
  newVideosFull,
}: {
  clientInfo: any;
  currentVideoNumber: number;
  setNewVideos: (videos: NewVideo[]) => void;
  newVideosFull: NewVideo[];
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
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
      let newVideos: NewVideo[] = videoSchedule.flatMap((day) => {
        return Array.from({length: day.videosForThisDay}).map(() => {
          videoCount++;
          const videoNumber = Number(
            currentVideoNumber + videoCount
          ).toString();

          return {
            title: "video - #" + videoNumber.toString(),
            videoNumber: videoNumber,
            id: Math.random().toString(36).substring(2, 15),
            clientId: clientInfo.value,
            status: "draft",
            dueDate: subDays(day.date, SUBDAYS_VIDEO_DUE),
            postDate: day.date,
            scriptDueDate: subDays(day.date, SUBDAYS_SCRIPT_DUE),
            notes: "",
            script: "",
            posted: false,
            priceUSD: 0,
            editor: "",
            manager: "",
            isSaved: false,
            errors: [],
          };
        });
      });
      // setNewVideos(newVideos as NewVideo[]);
      setNewVideos([...newVideosFull, ...newVideos]);
    }
    setShowModal(false);
  };

  const readyToCreate = totalVideos && date;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          className="w-full  bg-transparent border border-primary text-primary"
          variant={"outline"}
          size={"sm"}
        >
          <Icons.calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">Bulk schedule</span>
        </Button>
      </DialogTrigger>
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

function DatePickerWithRange({
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
