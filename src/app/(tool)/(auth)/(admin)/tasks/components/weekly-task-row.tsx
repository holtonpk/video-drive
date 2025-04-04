"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {db} from "@/config/firebase";
import {formatDaynameMonthDay} from "@/lib/utils";
import {OutputData} from "@editorjs/editorjs";
import {motion} from "framer-motion";
import {AnimatePresence} from "framer-motion";
import {sendNotification} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notifications";
import {deleteDoc, setDoc, doc, getDoc} from "firebase/firestore";
import {cn, convertTimestampToDate, convertDateToTimestamp} from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Task,
  USERS,
  statuses,
  categories,
} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {CreateTask} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/create-task";
import {EditorJsRender} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notes/editor-js-render";
import {checkUserAccessScopes} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/create-task";
import {ScrollArea} from "@/components/ui/scroll-area";
import {TaskCard} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-card";
import {set} from "date-fns";
export const WeeklyTaskRow = ({
  taskData,
  userData,
}: {
  taskData: Task;
  userData: UserData[];
}) => {
  const [task, setTask] = React.useState(taskData);
  const [isCompleted, setIsCompleted] = React.useState<boolean>();

  const {currentUser} = useAuth()!;

  const updateStatus = async () => {
    // update isCompleted for the given task in dueDatesWeekly
    const taskRef = doc(db, "tasks", task.id);
    const taskSnap = await getDoc(taskRef);
    const taskData = taskSnap.data();
    const dueDatesWeekly = taskData?.dueDatesWeekly;
    const index = dueDatesWeekly.findIndex(
      (d: any) => d.dueDate.seconds == task.dueDate.seconds
    );
    dueDatesWeekly[index].isComplete = !dueDatesWeekly[index].isComplete;
    await setDoc(taskRef, {dueDatesWeekly: dueDatesWeekly}, {merge: true});
  };

  const toggleCompleted = async () => {
    setIsCompleted(!isCompleted);
    await updateStatus();
    setTimeout(() => {
      // updateField("status", isCompleted ? "todo" : "done");
      if (!isCompleted && currentUser)
        sendNotification(
          "completed",
          currentUser.uid,
          userData,
          currentUser,
          task,
          "A task has been completed"
        );
    }, 500);
  };

  const DeleteTask = async () => {
    await deleteDoc(doc(db, "tasks", task.id));
  };

  const [showViewDialog, setShowViewDialog] = React.useState(false);

  useEffect(() => {
    console.log("useeeee");
    setTask(taskData);
    // setIsCompleted(taskData.status == "done");
    // setIsCompleted based on the dueDatesWeekly
    taskData.dueDatesWeekly &&
      taskData.dueDatesWeekly.forEach((dueDate) => {
        if (dueDate.dueDate.seconds == taskData.dueDate.seconds) {
          return setIsCompleted(dueDate.isComplete);
        }
      });

    console.log("task.status", task.status);
  }, [taskData]);

  return (
    <div className="flex justify-between items-center bg-foreground/40 overflow-hidden text-primary p-2 px-4 rounded-lg  border relative gap-4 max-w-full w-full hover:bg-foreground/60">
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogTrigger asChild>
          <button className="absolute w-full h-full  z-10 left-0 top-0"></button>
        </DialogTrigger>

        <DialogContent className="p-0">
          <TaskCard
            task={task}
            setTask={setTask}
            userData={userData}
            setShowViewDialog={setShowViewDialog}
          />
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            animate={{width: "calc(100% - 76px)"}}
            initial={{width: "0%"}}
            exit={{width: "0%"}}
            className="absolute top-1/2 -translate-y-1/2 left-[56px] pointer-events-none  h-[2px] bg-primary z-30 origin-left rounded-sm "
          ></motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleCompleted}
        className={`border  dark:border-border rounded-[4px] h-6 w-6  min-w-6 relative hover:border-primary transition-colors duration-300  z-20
           ${
             isCompleted
               ? "border-primary bg-primary"
               : "border-border dark:border-muted"
           } 

            `}
      >
        {isCompleted && (
          <Icons.check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-background" />
        )}
      </button>
      <h1
        className={`flex-grow overflow-hidden text-ellipsis whitespace-nowrap transition-opacity duration-300 max-w-[80%] text-base
        ${isCompleted ? "opacity-30" : "opacity-100"}
        `}
      >
        {task.name}
      </h1>
      {/* <h1 className="w-[400px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground w-[150px] sm:w-[225px] md:w-[185px]  lg:w-[350px]">
        {task.notes}
      </h1> */}
      <div
        className={`flex ml-auto gap-4 items-center transition-opacity duration-300
         ${isCompleted ? "opacity-30" : "opacity-100"}
        `}
      >
        {/* <div className="bg-foreground dark:bg-muted border p-1 rounded-[12px] px-4 justify-center items-center text-center w-fit ">
          {categories.find((c) => c.value == task.category)?.label}
        </div> */}
        <div className="flex  justify-end min-w-8">
          {task.assignee.map((assignee, index) => {
            const user = userData.find((u) => u.uid == assignee);
            return (
              <img
                key={index}
                src={user?.photoURL}
                alt={user?.firstName}
                style={{zIndex: task.assignee.length - index}}
                className="h-8 min-w-8 w-8 aspect-square rounded-full -ml-3"
              />
            );
          })}
        </div>

        {/* <Popover>
          <PopoverTrigger asChild>
            <button className="bg-foreground dark:bg-muted border p-1 rounded-[12px] relative z-20">
              <Icons.ellipsis />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-1 ">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-2 hover:bg-muted text-destructive flex items-center">
                  <Icons.trash className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-primary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure your want to delete this task?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={DeleteTask}
                    className="p-0 bg-transparent hover:bg-transparent border-none"
                  >
                    <Button variant={"destructive"}>
                      <Icons.trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <CreateTask
              task={task}
              userData={userData}
              heading="Edit task"
              buttonCopy="Update"
            >
              <button className="w-full p-2 hover:bg-muted flex items-center">
                <Icons.pencil className="h-4 w-4 mr-2" />
                Edit
              </button>
            </CreateTask>
            <CreateTask
              task={{...task, id: Math.random().toString(36).substring(7)}}
              userData={userData}
              heading="Duplicate task"
            >
              <button className="w-full p-2 hover:bg-muted flex items-center">
                <Icons.copy className="h-4 w-4 mr-2" />
                Duplicate
              </button>
            </CreateTask>
          </PopoverContent>
        </Popover> */}
      </div>
    </div>
  );
};
