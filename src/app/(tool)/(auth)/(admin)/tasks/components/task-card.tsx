"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import {Button} from "@/components/ui/button";
import {db} from "@/config/firebase";
import {formatDaynameMonthDay, calculateTotalWeeksRemaining} from "@/lib/utils";
import {OutputData} from "@editorjs/editorjs";
import {sendNotification} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notifications";
import {deleteDoc, setDoc, doc, getDoc, Timestamp} from "firebase/firestore";
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

import {Task} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {CreateTask} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/create-task";
import {EditorJsRender} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notes/editor-js-render";
import {checkUserAccessScopes} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/create-task";
import {ScrollArea} from "@/components/ui/scroll-area";

export const TaskCard = ({
  task,
  setTask,
  userData,
  setShowViewDialog,
}: {
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  userData: UserData[];
  setShowViewDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log("task===========", task);
  const [isCompleted, setIsCompleted] = React.useState(task.status == "done");

  const {currentUser, logInWithGoogleCalender} = useAuth()!;

  const updateField = async (field: string, value: any) => {
    await setDoc(
      doc(db, "tasks", task.id),
      {
        [field]: value,
      },
      {merge: true}
    );
  };

  const updateTask = async (updatedTask: Task) => {
    console.log("updatedTask===========", updatedTask);
    setTask(updatedTask);
  };

  const DeleteTask = async () => {
    await deleteDoc(doc(db, "tasks", task.id));
    if (setShowViewDialog) setShowViewDialog(false);
  };

  const [savingToGoogleCalender, setSavingToGoogleCalender] =
    React.useState(false);
  const [isSavedToCalender, setIsSavedToCalender] = React.useState(false);

  const saveToCalender = async () => {
    if (!currentUser) return;
    setSavingToGoogleCalender(true);
    // if (!currentUser?.calenderToken) return;

    let accessToken = currentUser.calenderToken;

    const hasAccess = accessToken && (await checkUserAccessScopes(accessToken));

    if (!hasAccess) {
      await logInWithGoogleCalender()
        .then(() => {
          // Return the promise so the next `.then` can use its result
          return getDoc(doc(db, "users", currentUser.uid));
        })
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data) {
              accessToken = data.calenderToken;
            }
          }
        })
        .catch((error) => {
          console.error(
            "Error during Google Calendar login or fetching document:",
            error
          );
        });
    }

    const startDate = convertTimestampToDate(task.dueDate!);
    startDate.setHours(8, 0, 0, 0); // Set to 8:00 AM

    const endDate = convertTimestampToDate(task.dueDate!);
    endDate.setHours(9, 0, 0, 0); // Set to 9:00 AM

    const calenderEvent = {
      summary: task.name,
      description:
        task.notes && typeof task.notes !== "string"
          ? task.notes.blocks.map((block) => block.data.text).join(" ") ||
            task.notes.blocks.map((block) => block.data.items).join(" ")
          : task.notes,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Chicago",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Chicago",
      },
      reminders: {
        useDefault: false,
        overrides: [
          {method: "email", minutes: 10},
          {method: "popup", minutes: 10},
        ],
      },
    };

    const res = await fetch("/api/save-to-google-calender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
        event: calenderEvent,
      }),
    });
    const data = await res.json();
    setSavingToGoogleCalender(false);
    if (data.success) {
      setIsSavedToCalender(true);
      setTimeout(() => {
        setIsSavedToCalender(false);
      }, 3000);
    }
  };

  const UpdateDescription = async (description: OutputData | string) => {
    await setDoc(
      doc(db, "tasks", task.id),
      {
        notes: description,
      },
      {merge: true}
    );
  };

  return (
    <div className="w-full blurBack md:px-8  mx-auto  rounded-md p-4 text-primary ">
      <div className="flex flex-col gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold text-center">{task.name}</h1>
        <div className="flex items-center gap-4">
          {!task.isWeekly && (
            <p>Due date: {formatDaynameMonthDay(task.dueDate)}</p>
          )}
          {task.dueDatesWeekly && (
            <div className="grid gap-1">
              <div className="flex gap-1">
                <h1>Weekly task scheduled for </h1>
                <h1 className="text-primary font-bold">
                  {calculateTotalWeeksRemaining(
                    task.dueDatesWeekly.map(
                      (dueDateWeekly) => dueDateWeekly.dueDate
                    )
                  )}{" "}
                  more
                  {calculateTotalWeeksRemaining(
                    task.dueDatesWeekly.map(
                      (dueDateWeekly) => dueDateWeekly.dueDate
                    )
                  ) > 1
                    ? " weeks"
                    : " week"}
                </h1>
              </div>
              {/* <div className="flex flex-col border">
                {task.dueDatesWeekly.map((date, index) => (
                  <p> {formatDaynameMonthDay(date)}</p>
                ))}
              </div> */}
            </div>
          )}
          {userData && (
            <div className="flex h-6  justify-end min-w-6">
              {task.assignee.map((assignee, index) => {
                const user = userData.find((u) => u.uid == assignee);
                return (
                  <img
                    key={index}
                    src={user?.photoURL}
                    alt={user?.firstName}
                    style={{zIndex: task.assignee.length - index}}
                    className="h-6 min-w-6 aspect-square rounded-full -ml-2"
                  />
                );
              })}
            </div>
          )}
        </div>
        {task.notes && (
          <ScrollArea className="p-4 border rounded-md bg-foreground/40 dark:bg-muted/40 w-full max-h-fit  h-[300px] overflow-scroll">
            {typeof task.notes === "string" ? (
              <div className="h-fit  overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
                {task.notes}
              </div>
            ) : (
              <EditorJsRender
                script={task.notes}
                onUpdate={UpdateDescription}
              />
            )}
          </ScrollArea>
        )}
        <div className="grid gap-2 mt-4 w-full">
          <Button
            onClick={() => {
              updateField("status", isCompleted ? "todo" : "done");
              setIsCompleted(!isCompleted);
              setShowViewDialog && setShowViewDialog(false);
              if (!isCompleted && currentUser)
                sendNotification(
                  "completed",
                  currentUser.uid,
                  userData,
                  currentUser,
                  task,
                  "A task has been completed"
                );
            }}
          >
            {isCompleted ? "Mark as todo" : "Mark as completed"}
          </Button>
          <Button onClick={saveToCalender} variant={"outline"}>
            {savingToGoogleCalender ? (
              <>
                <Icons.spinner className="animate-spin h-4 w-4 mr-2" />
                Saving to Google Calendar
              </>
            ) : isSavedToCalender ? (
              <>
                <Icons.check className="h-4 w-4 mr-2" />
                Saved to Google Calendar
              </>
            ) : (
              <>
                <Icons.google className="h-4 w-4 mr-2" />
                Add to Google Calendar
              </>
            )}
          </Button>
          <CreateTask
            userData={userData}
            task={task}
            heading="Edit task"
            buttonCopy="Update"
            callBack={updateTask}
          >
            <Button variant={"outline"}>
              <Icons.pencil className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
          </CreateTask>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                className="text-destructive hover:text-destructive/90 hover:bg-transparent"
              >
                Delete Task
              </Button>
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
        </div>
      </div>
    </div>
  );
};
