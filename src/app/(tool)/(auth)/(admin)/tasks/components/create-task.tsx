"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {db} from "@/config/firebase";
import {Checkbox} from "@/components/ui/checkbox";
import {
  cn,
  convertTimestampToDate,
  convertDateToTimestamp,
  calculateTotalWeeksRemaining,
} from "@/lib/utils";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notes/notes";
import {OutputData} from "@editorjs/editorjs";
import {sendNotification} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notifications";
import {setDoc, doc, Timestamp, getDoc} from "firebase/firestore";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";
import {format, add} from "date-fns";
import edjsHTML from "editorjs-html";
import {EditorJsToHtml} from "./notes/editor-js-render";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {TaskCard} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-card";

export const CreateTask = ({
  task,
  children,
  userData,
  heading,
  buttonCopy,
  callBack,
  defaultDate,
}: {
  task?: Task;
  children: React.ReactNode;
  userData: UserData[];
  heading: string;
  buttonCopy?: string;
  callBack?: (task: Task) => void;
  defaultDate?: Timestamp | undefined;
}) => {
  console.log("defaultDate ====", defaultDate);
  const [open, setOpen] = React.useState(false);

  const {currentUser, logInWithGoogleCalender} = useAuth()!;

  const [isSaving, setIsSaving] = React.useState(false);

  const [title, setTitle] = React.useState(task ? task.name : "");
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    task && task.category ? task.category : ""
  );

  const [assignee, setAssignee] = React.useState<string[]>(
    task ? task.assignee : []
  );
  const [dueDate, setDueDate] = React.useState<Timestamp | undefined>(
    task ? task.dueDate : defaultDate ? defaultDate : undefined
  );
  const [notes, setNotes] = React.useState<OutputData | string | undefined>(
    task ? task.notes : ""
  );

  const [addToCalendar, setAddToCalendar] = React.useState(
    localStorage.getItem("addToGoogleDefault") === "true" ? true : false
  );

  const [isWeekly, setIsWeekly] = React.useState<boolean>(
    task ? (task.isWeekly ? task.isWeekly : false) : false
  );

  const [taskRepeat, setTaskRepeat] = React.useState<number | undefined>(
    task && task?.dueDatesWeekly
      ? calculateTotalWeeksRemaining(
          task.dueDatesWeekly.map((dueDateWeekly) => dueDateWeekly.dueDate)
        )
      : 3
  );

  const [taskLocal, setTaskLocal] = React.useState<Task | undefined>(task);

  useEffect(() => {
    // save to local storage
    localStorage.setItem("addToGoogleDefault", addToCalendar.toString());
  }, [addToCalendar]);

  const saveTask = async () => {
    setIsSaving(true);
    const id = task ? task.id : Math.random().toString(36).substring(7);
    const taskData: Task = {
      id,
      name: title,
      dueDate: dueDate!,
      assignee: assignee,
      status: "todo",
      category: selectedCategory,
      isWeekly: isWeekly,
      dueDatesWeekly:
        isWeekly && dueDate
          ? Array.from({length: taskRepeat!}, (_, i) => {
              // Convert the timestamp to a date, add i weeks, then convert back to a timestamp
              const baseDate = new Date(convertTimestampToDate(dueDate)); // Ensure dueDate is valid
              const updatedDate = add(baseDate, {weeks: i});
              return {
                dueDate: convertDateToTimestamp(updatedDate) as Timestamp,
                isComplete: false,
              };
            })
          : undefined,
      notes,
    };
    setTaskLocal(taskData);

    const taskRef = doc(db, "tasks", id);
    await setDoc(taskRef, taskData);

    if (currentUser)
      assignee.forEach((assigneeSingle) => {
        sendNotification(
          "created",
          assigneeSingle,
          userData,
          currentUser,
          taskData,
          task ? "A task has been updated" : "A new task has been created"
        );
      });
    // Save task logic here
    // if (addToCalendar) {
    //   await saveToCalender();
    // }

    if (callBack) {
      console.log("nnnnnnn", notes);
      callBack(taskData);
    }

    setIsSaving(false);
    setOpen(false);
    setTitle("");
    setAssignee([]);
    setDueDate(undefined);
    setSelectedCategory("");
    setNotes("");
    setIsWeekly(false);
    setShowTask(true);
  };

  const resetValues = () => {
    setTitle("");
    setAssignee([]);
    setDueDate(undefined);
    setSelectedCategory("");
    setNotes("");
    setIsWeekly(false);
  };

  useEffect(() => {
    if (!open) {
      resetValues();
    }
  }, [open]);

  useEffect(() => {
    if (defaultDate) {
      setDueDate(defaultDate);
    }
    if (task) {
      setTitle(task.name);
      setAssignee(task.assignee);
      setDueDate(task.dueDate);
      setSelectedCategory(task.category || "");
      setNotes(task.notes || "");
      setIsWeekly(task.isWeekly || false);
      setTaskLocal(task);
    }
  }, [task, defaultDate]);

  const [showTask, setShowTask] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="text-primary min-w-fit ">
          <DialogHeader>
            <DialogTitle className="text-primary">{heading}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the details below to create a new task
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1 ">
              <h1>Task name</h1>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task name"
              />
            </div>
            <div className="grid gap-1">
              <h1>Category</h1>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-1 ">
              <h1>Due date</h1>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? (
                      format(convertTimestampToDate(dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      dueDate ? convertTimestampToDate(dueDate) : new Date()
                    }
                    onSelect={(date) =>
                      date
                        ? setDueDate(convertDateToTimestamp(date) as Timestamp)
                        : setDueDate(undefined)
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-1">
              <h1>Assign to</h1>

              <div className=" flex h-9 items-center  rounded-md border border-border overflow-hidden  max-w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-full w-full text-primary bg-transparent dark:bg-transparent"
                    >
                      {assignee && assignee?.length == 0 && (
                        <>
                          <Icons.add className="h-4 w-4" />
                          <span className="hidden sm:inline">Assign to</span>
                        </>
                      )}
                      {assignee && assignee?.length > 0 && (
                        <div className="flex gap-1 w-full justify-start">
                          {assignee.map((user) => (
                            <div
                              key={user}
                              className="bg-foreground dark:bg-muted text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
                            >
                              {/* <button
                                onClick={() => {
                                  setAssignee(assignee?.filter((u) => u != user));
                                }}
                                className="hover:text-primary/70"
                              >
                                <Icons.close className="h-3 w-3" />
                              </button> */}
                              {user == currentUser?.uid
                                ? "You"
                                : userData?.find((u) => u.uid == user)
                                    ?.firstName}
                            </div>
                          ))}
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-1 h-fit" align="start">
                    <>
                      {userData.map((user) => (
                        <button
                          onClick={() => {
                            if (assignee?.includes(user.uid)) {
                              setAssignee(
                                assignee?.filter((u) => u != user.uid)
                              );
                            } else {
                              setAssignee([...(assignee || []), user.uid]);
                            }
                          }}
                          key={user.uid}
                          className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
                        >
                          <img
                            src={user.photoURL}
                            alt={user.firstName}
                            className="h-6 w-6 rounded-full"
                          />
                          {user.uid == currentUser?.uid
                            ? "You"
                            : user.firstName}
                          {assignee?.includes(user.uid) && (
                            <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                          )}
                        </button>
                      ))}
                    </>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="grid gap-1  w-[500px]">
            <h1>Notes (optional)</h1>

            <Editor
              post={{
                id: "1",
                content: notes,
              }}
              setScript={setNotes}
            />
          </div>
          {/* <GoogleCalender
          addToCalendar={addToCalendar}
          setAddToCalendar={setAddToCalendar}
        /> */}

          <WeeklyTask
            task={taskLocal!}
            isWeekly={isWeekly}
            setIsWeekly={setIsWeekly}
            taskRepeat={taskRepeat}
            setTaskRepeat={setTaskRepeat}
          />

          <div className="flex w-full justify-between mt-4">
            <Button onClick={() => setOpen(false)} variant={"outline"}>
              Cancel
            </Button>
            <Button onClick={saveTask}>
              {isSaving && (
                <Icons.spinner className="animate-spin h-4 w-4 mr-2" />
              )}

              {buttonCopy ? buttonCopy : "Save Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {taskLocal && (
        <Dialog open={showTask} onOpenChange={setShowTask}>
          <DialogContent className="p-0">
            <TaskCard
              task={taskLocal}
              setTask={setTaskLocal as any}
              userData={userData}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const WeeklyTask = ({
  task,
  isWeekly,
  setIsWeekly,
  taskRepeat,
  setTaskRepeat,
}: {
  task: Task;
  isWeekly: boolean;
  setIsWeekly: React.Dispatch<React.SetStateAction<boolean>>;
  taskRepeat: number | undefined;
  setTaskRepeat: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={isWeekly}
          onCheckedChange={(checked: boolean) => setIsWeekly(checked)}
        />

        <p className={`${isWeekly ? "text-primary" : "text-muted-foreground"}`}>
          This is a weekly task
        </p>
        {task?.dueDatesWeekly && (
          <div className="flex gap-1">
            <h1>scheduled for </h1>
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
        )}
      </div>
      {isWeekly && (
        <div className="grid gap-1">
          <div className="flex gap-2 items-center">
            Create task for the next
            <Input
              onChange={(e) => setTaskRepeat(parseInt(e.target.value))}
              type="number"
              value={taskRepeat}
              className="w-[50px]"
            />
            weeks
          </div>
        </div>
      )}
    </div>
  );
};

export const checkUserAccessScopes = async (currentUserToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${currentUserToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Error checking user access scopes:", response);
    return false;
  }
  const data = await response.json();
  const scopes = data.scope.split(" ");
  if (scopes.includes("https://www.googleapis.com/auth/calendar")) {
    return true;
  } else {
    return false;
  }
};
