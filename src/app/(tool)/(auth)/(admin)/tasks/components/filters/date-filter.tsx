"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {convertTimestampToDate} from "@/lib/utils";
import {Task} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";

export const DateFilter = ({
  tasks,

  selectedDate,
  setSelectedDate,
}: {
  tasks: Task[];

  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) => {
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const [referenceDate, setReferenceDate] = React.useState<Date>(new Date());
  const dates = Array.from({length: 11}, (_, i) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() + i);
    return date;
  });

  const handleMoveDate = (direction: "next" | "prev") => {
    setReferenceDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 10 : -10));
      return newDate;
    });
  };

  return (
    <div className="flex gap-2 flex-col w-fit items-center  ">
      <div className="flex items-center w-fit ">
        <Button
          variant={"ghost"}
          size="sm"
          className="px-2 text-primary"
          onClick={() => handleMoveDate("prev")}
        >
          <Icons.chevronLeft className="h-6 w-6" />
        </Button>
        <div className="grid grid-cols-11 gap-4">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              className={`flex flex-col text-primary bg-background items-center  transition-colors duration-300 rounded-md relative overflow-hidden border-2 ${
                selectedDate?.toDateString() === date.toDateString()
                  ? "border-blue-500 "
                  : "hover:border-blue-300"
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date.toDateString() === new Date().toDateString() && (
                <div className="absolute h-3 w-3 bottom-0 right-0  bg-blue-600 rounded-tl-full"></div>
              )}
              {tasks.some(
                (task) =>
                  convertTimestampToDate(task.dueDate).toDateString() ===
                    date.toDateString() && task.status == "todo"
              ) && (
                <div className="absolute h-1 w-1 top-2 left-2  bg-blue-600 rounded-full"></div>
              )}
              <span className="bg-foreground dark:bg-muted w-full text-center">
                {date.toLocaleString("en-US", {weekday: "short"})}
              </span>
              <div className="bg-muted dark:bg-muted/40 flex gap-1 flex-col px-6 p-2">
                <div className="font-bold text-lg">{date.getDate()}</div>
                <span>{date.toLocaleString("en-US", {month: "short"})}</span>
              </div>
            </button>
          ))}
        </div>
        <Button
          variant={"ghost"}
          size="sm"
          className="px-2 text-primary"
          onClick={() => handleMoveDate("next")}
        >
          <Icons.chevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
