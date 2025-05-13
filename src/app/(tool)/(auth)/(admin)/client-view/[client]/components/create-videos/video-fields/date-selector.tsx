import {NewVideo} from "../create-videos";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import DatePickerWithRange2 from "../../date-picker-hour";

export function DateSelector({
  video,
  newVideos,
  setNewVideos,
  label,
  field,
  errors,
  onValueChange,
}: {
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
  label: string;
  field: string;
  errors: string[];
  onValueChange: (value: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(
    (video[field as keyof NewVideo] as Date) || undefined
  );

  const [openDate, setOpenDate] = React.useState<boolean>(false);

  const updateDate = (date: Date) => {
    onValueChange(date);
    setOpenDate(false);
  };

  return (
    <Popover open={openDate} onOpenChange={setOpenDate}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            errors.find((e) => e === field) && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP 'at' p") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePickerWithRange2
          date={date}
          setDate={setDate}
          onSave={updateDate}
        />
      </PopoverContent>
    </Popover>
  );
}
