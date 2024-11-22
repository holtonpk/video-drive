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

  const getLastMonday = (date: Date): Date => {
    const lastMonday = new Date(date);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Adjust for Sunday (0) and other days
    lastMonday.setDate(date.getDate() + diff);
    return lastMonday;
  };

  const startFrom = getLastMonday(referenceDate);

  const dates = Array.from({length: 11}, (_, i) => {
    const date = new Date(startFrom);
    date.setDate(startFrom.getDate() + i);
    return date;
  });

  const handleMoveDate = (direction: "next" | "prev") => {
    setReferenceDate((prev) => {
      const newDate = new Date(prev);
      // Move by 7 days (1 week) * number of steps (e.g., 10 days/7 = ~1.4 weeks, rounded)
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7)); // Increase week ranges
      // 👆  newDate.setDate is "given selected, offset w/ multiples"
      return newDate;
    });
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const displayedDays =
    screenWidth < 450
      ? 3
      : screenWidth < 640
      ? 5
      : screenWidth < 768
      ? 7
      : screenWidth < 1024
      ? 7
      : 11;

  return (
    <div className="flex gap-2 flex-col w-full items-center bg-foreground/40 dark:bg-muted/40 pb-2 pt-4 ">
      <div className="flex items-center w-fit ">
        <Button
          variant={"ghost"}
          size="sm"
          className="px-2 text-primary"
          onClick={() => handleMoveDate("prev")}
        >
          <Icons.chevronLeft className="h-6 w-6" />
        </Button>
        <div className="grid grid-cols-3 xsm:grid-cols-5 sm:grid-cols-7 md:grid-cols-7 lg:grid-cols-11 gap-4">
          {dates.splice(0, displayedDays).map((date) => (
            <button
              key={date.toISOString()}
              className={`flex flex-col cursor-pointer text-primary bg-background items-center  transition-colors duration-300 rounded-md relative overflow-hidden border-2 ${
                selectedDate?.toDateString() === date.toDateString()
                  ? "border-blue-600 "
                  : "hover:border-blue-300"
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date.toDateString() === new Date().toDateString() && (
                <div
                  className={`absolute h-3 w-3 bottom-0 right-0  bg-blue-600 rounded-tl-full`}
                ></div>
              )}
              {tasks.some(
                (task) =>
                  convertTimestampToDate(task.dueDate).toDateString() ===
                    date.toDateString() && task.status == "todo"
              ) && (
                <div
                  className={`absolute h-1 w-1 top-2 left-2 rounded-full
                ${date > referenceDate ? "bg-blue-600" : "bg-red-600"}
                  `}
                ></div>
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
