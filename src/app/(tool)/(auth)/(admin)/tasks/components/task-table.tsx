"use client";

import React, {use, useEffect, useState} from "react";
import {UserData} from "@/context/user-auth";
import {convertTimestampToDate} from "@/lib/utils";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Task} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {TaskRow} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-row";
export const TaskTable = ({
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

  return (
    <ScrollArea className="max-h-fit h-[400px] overflow-scroll py-2 px-4 pt-2 w-full bg-muted/40 border-t">
      <ScrollBar orientation="vertical" className="" />
      <div className="w-full h-full flex flex-col items-center gap-1">
        {!tasks || tasks.length == 0 ? (
          <div className="text-2xl text-center w-full text-primary flex items-center justify-center  h-[200px] ">
            No tasks found
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1  w-[100%] ">
            {tasks.map((task) => (
              <TaskRow taskData={task} key={task.id} userData={userData} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
