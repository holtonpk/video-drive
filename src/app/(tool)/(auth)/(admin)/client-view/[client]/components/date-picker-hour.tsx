"use client";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {format} from "date-fns";
import {Clock} from "lucide-react";
import {Component, useEffect, useState, useId} from "react";

const DatePickerWithRange2 = ({
  date,
  setDate,
  onSave,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
  onSave: (date: Date) => void;
}) => {
  const [dateLocal, setDateLocal] = useState<Date | undefined>(date);
  const today = new Date();
  const [time, setTime] = useState<string | null>(
    date ? format(date, "HH:mm") : null
  );
  const [originalDate, setOriginalDate] = useState<Date | undefined>(date);
  const [originalTime, setOriginalTime] = useState<string | null>(
    date ? format(date, "HH:mm") : null
  );

  useEffect(() => {
    if (!date) return;
    setTime(format(date, "HH:mm"));
    // Store the original date and time when component mounts
    if (!originalDate) {
      setOriginalDate(new Date(date));
      setOriginalTime(format(date, "HH:mm"));
    }
  }, [date, originalDate]);

  console.log("date===", date);

  console.log("time===", date ? format(date, "HH:mm") : null);

  const id = useId();

  const changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    const [hours, minutes] = e.target.value.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0); // Set hours and minutes directly, reset seconds to 0
    setDateLocal(newDate);
  };

  return (
    <div>
      <div className="rounded-lg border border-border">
        <Calendar
          mode="single"
          className="p-2 bg-background"
          selected={dateLocal}
          onSelect={(date) => {
            setDateLocal(date as Date);
            // onSelect(date as Date);
          }}
        />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="text-xs">
              Enter time
            </Label>
            <div className="relative grow ">
              <Input
                id={id}
                type="time"
                onChange={(e) => {
                  changeTime(e);
                  setTime(e.target.value);
                }}
                step="1"
                value={time || "00:00:00"}
                className="peer pl-9  [&::-webkit-calendar-picker-indicator]:hidden "
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Clock size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
          {/* if the date or time is not changed from the original date, then don't show the save button. */}
          {date &&
            time &&
            originalDate &&
            originalTime &&
            (date.getTime() !== originalDate.getTime() ||
              time !== originalTime) && (
              <Button
                onClick={() => {
                  // the time needs to be added to the date
                  const newDate = new Date(date as Date);
                  newDate.setHours(
                    parseInt(time?.split(":")[0] || "0"),
                    parseInt(time?.split(":")[1] || "0"),
                    0
                  );
                  setDate(newDate);
                  onSave(newDate);
                }}
                className="w-full mt-1"
              >
                Save
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default DatePickerWithRange2;
