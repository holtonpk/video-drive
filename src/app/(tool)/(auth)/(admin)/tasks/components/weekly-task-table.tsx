"use client";

import React, {use, useEffect, useState} from "react";
import {UserData} from "@/context/user-auth";
import {convertTimestampToDate} from "@/lib/utils";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Task} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {WeeklyTaskRow} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/weekly-task-row";
import {motion, AnimatePresence} from "framer-motion";
export const WeeklyTaskTable = ({
  tasks,
  userData,
}: {
  tasks: Task[];

  userData: UserData[];
}) => {
  // order by status if the status is the same order by due date
  tasks.sort((a, b) => {
    if (a.status == b.status) {
      return (
        convertTimestampToDate(a.dueDate).getTime() -
        convertTimestampToDate(b.dueDate).getTime()
      );
    } else {
      return a.status == "done" ? 1 : -1;
    }
  });

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
      className="max-h-fit h-[405px] overflow-scroll    w-full max-w-full  border-t bg-muted/10"
    >
      <ScrollBar orientation="vertical" className="" />
      <div className="w-[200px] h-full flex flex-col min-w-full items-center gap-1">
        {!tasks || tasks.length == 0 ? (
          <div className="text-2xl text-center w-full text-primary flex items-center justify-center  h-[200px] ">
            No tasks found
          </div>
        ) : (
          <div className="flex flex-col items-center px-2 gap-1 py-2 w-[100%]  max-w-full ">
            {tasks.map((task) => (
              <WeeklyTaskRow
                taskData={task}
                key={task.id}
                userData={userData}
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
