"use client";

import React, {use, useEffect, useState} from "react";
import {UserData} from "@/context/user-auth";
import {convertTimestampToDate} from "@/lib/utils";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Task} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {TaskRow} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-row";
import {motion, AnimatePresence} from "framer-motion";
export const TaskTable = ({
  tasks,
  userData,
  selectedDate,
}: {
  tasks: Task[];
  userData: UserData[];
  selectedDate: Date | undefined;
}) => {
  // order by status if the status is the same order by due date
  function sortTasks(tasks: Task[]): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    return tasks.sort((a, b) => {
      const aDate = convertTimestampToDate(a.dueDate);
      const bDate = convertTimestampToDate(b.dueDate);

      aDate.setHours(0, 0, 0, 0);
      bDate.setHours(0, 0, 0, 0);

      // Custom priority order
      const getPriority = (task: Task, date: Date) => {
        if (date < today) return 0; // Before today gets lowest priority
        if (date.getTime() === today.getTime()) {
          return task.status === "todo" ? 2 : 1; // Today's todo tasks come after other tasks
        }
        return 3; // Future tasks
      };

      const aPriority = getPriority(a, aDate);
      const bPriority = getPriority(b, bDate);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If priorities are the same, sort by date
      return aDate.getTime() - bDate.getTime();
    });
  }

  const sortedTasks = sortTasks(tasks);

  console.log(
    "tasks",
    tasks.map((task) => task.id)
  );
  console.log(
    "sortedTasks",
    sortedTasks.map((task) => task.id)
  );

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  return (
    <ScrollArea
      onScroll={(e: any) => {
        if (e.target.scrollTop !== 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }}
      id="task-table"
      className="max-h-fit h-[405px] overflow-scroll  px-4  w-full  border-t bg-muted/10"
    >
      <ScrollBar orientation="vertical" className="" />
      <div className="w-full h-full flex flex-col items-center gap-1">
        {!tasks || tasks.length == 0 ? (
          <div className="text-2xl text-center w-full text-primary flex items-center justify-center  h-[200px] ">
            No tasks found
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-2 w-[100%] ">
            {sortedTasks.reverse().map((task) => (
              <TaskRow
                taskData={task}
                key={task.id}
                userData={userData}
                selectedDate={selectedDate}
              />
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            animate={{opacity: 1}}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="absolute top-0 left-0 w-full  z-30 pointer-events-none "
          >
            <div className="task-table-grad-top w-full h-20 z-30 pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {tasks && tasks.length > 7 && (
        <>
          <div className="w-full h-6"></div>
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-30 animate-in fade-in-0 duration-500">
            <div className="task-table-grad-bottom w-full h-20 z-30 pointer-events-none"></div>
          </div>
        </>
      )}
    </ScrollArea>
  );
};
