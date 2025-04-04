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
  onSelect,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
  onSelect: (date: Date) => void;
}) => {
  const today = new Date();
  const [time, setTime] = useState<string | null>(null);

  const id = useId();

  const changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    const [hours, minutes] = e.target.value.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0); // Set hours and minutes directly, reset seconds to 0
    setDate(newDate);
  };
  console.log("time===", time);
  console.log("date===", date);

  return (
    <div>
      <div className="rounded-lg border border-border">
        <Calendar
          mode="single"
          className="p-2 bg-background"
          selected={date}
          onSelect={(date) => {
            setDate(date as Date);
            onSelect(date as Date);
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
        </div>
      </div>
    </div>
  );
};

export default DatePickerWithRange2;
