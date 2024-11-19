"use client";

import React, {use, useEffect} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import {PlusCircle, Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {db} from "@/config/firebase";
import {CheckCircle, Circle, CircleOff, HelpCircle, Timer} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";

import {
  cn,
  formatDaynameMonthDay,
  convertTimestampToDate,
  convertDateToTimestamp,
} from "@/lib/utils";
import {Editor} from "./components/description";
import {OutputData} from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
import {motion} from "framer-motion";
import {AnimatePresence} from "framer-motion";
import {sendNotification} from "./components/notifications";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

import {
  deleteDoc,
  getDoc,
  setDoc,
  doc,
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
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
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";
import {format, set} from "date-fns";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Notifications} from "./components/notifications";

const USERS = [
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
];

type Task = {
  id: string;
  name: string;
  dueDate: Timestamp;
  assignee: string[];
  status: "todo" | "done";
  notes?: OutputData | string;
  category?: string;
};

type Status = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const statuses: Status[] = [
  {
    value: "todo",
    label: "Todo",
    icon: <Circle className="h-4 w-4 text-blue-600" />,
  },

  {
    value: "done",
    label: "Done",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
  },
];

const categories = [
  {
    label: "🎯 Acquisition",
    value: "acquisition",
  },
  {
    label: "🎨 Branding",
    value: "branding",
  },
  {
    label: "💰 Finance",
    value: "finance",
  },
  {
    label: "👥 Client management",
    value: "client-management",
  },
  {
    label: "📹 Videos",
    value: "videos",
  },
];

const Tasks = () => {
  const {currentUser} = useAuth()!;

  const [userData, setUsersData] = React.useState<UserData[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Promise.all(
          USERS.map(async (user) => {
            const userSnap = await getDoc(doc(db, "users", user));
            return userSnap.data() as UserData; // Ensure type casting if needed
          })
        );
        setUsersData(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasks);
      setIsLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  console.log("userdat ==", userData);

  const [selectedUsers, setSelectedUsers] = React.useState<
    string[] | undefined
  >(USERS);

  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([
    statuses[0].value,
    statuses[1].value,
  ]);

  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      const matchesStatus =
        !selectedStatus.length || selectedStatus.includes(task.status);

      const matchesUsers =
        !selectedUsers?.length ||
        selectedUsers.includes("all") ||
        task.assignee.some((u) => selectedUsers.includes(u));

      const matchesDate =
        !selectedDate ||
        convertTimestampToDate(task.dueDate).toDateString() ===
          selectedDate.toDateString();

      return matchesStatus && matchesUsers && matchesDate;
    });

    setFilteredTasks(filteredTasks);
  }, [tasks, selectedStatus, selectedUsers, selectedDate]);

  const taskForDate = tasks.filter((task) => {
    return (
      !selectedUsers?.length ||
      selectedUsers.includes("all") ||
      task.assignee.some((u) => selectedUsers.includes(u))
    );
  });

  return (
    <div>
      <div className="container">
        {userData && userData.length > 0 && (
          <div className="flex flex-col gap-4 mx-auto items-center w-[80%] mt-6">
            <div className="flex w-full justify-between">
              <div className="flex gap-4  ">
                <FilterStatus
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />
                <FilterUser
                  userData={userData}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                />
              </div>
              <div className="flex gap-4 ">
                <Notifications userData={userData} />
                <CreateTask userData={userData} heading="Create a new task">
                  <Button size="sm">
                    <Icons.add className="h-4 w-4" />
                    <span className="hidden sm:inline">New Task</span>
                  </Button>
                </CreateTask>
              </div>
            </div>
            {isLoading ? (
              <div className="w-full justify-center items-center flex">
                <Icons.spinner className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : (
              <div className="flex flex-col border rounded-md  gap-2 pt-4 w-full  bg-muted/20">
                <DateFilter
                  tasks={taskForDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />

                <TaskTable tasks={filteredTasks} userData={userData} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

const DateFilter = ({
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

const CreateTask = ({
  task,
  children,
  userData,
  heading,
}: {
  task?: Task;
  children: React.ReactNode;
  userData: UserData[];
  heading: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const {currentUser, logInWithGoogleCalender} = useAuth()!;

  const [isSaving, setIsSaving] = React.useState(false);

  const [title, setTitle] = React.useState(task ? task.name : "");
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    task && task.category ? task.category : ""
  );
  const [description, setDescription] = React.useState(task ? task.notes : "");
  const [assignee, setAssignee] = React.useState<string[]>(
    task ? task.assignee : []
  );
  const [dueDate, setDueDate] = React.useState<Timestamp | undefined>(
    task ? task.dueDate : undefined
  );
  const [notes, setNotes] = React.useState<OutputData | string | undefined>(
    task ? task.notes : ""
  );

  const [addToCalendar, setAddToCalendar] = React.useState(false);

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
      notes,
    };
    const taskRef = doc(db, "tasks", id);
    await setDoc(taskRef, taskData);

    if (currentUser)
      assignee.forEach((assigneeSingle) => {
        sendNotification(
          "created",
          assigneeSingle,
          userData,
          currentUser,
          title
        );
      });
    // Save task logic here
    if (addToCalendar && currentUser?.calenderToken) {
      await saveToCalender();
    }

    setIsSaving(false);
    setOpen(false);
    setTitle("");
    setDescription("");
    setAssignee([]);
    setDueDate(undefined);
    setSelectedCategory("");
    setNotes("");
  };

  const saveToCalender = async () => {
    if (!currentUser?.calenderToken) return;

    const startDate = convertTimestampToDate(dueDate!);
    startDate.setHours(8, 0, 0, 0); // Set to 8:00 AM

    const endDate = convertTimestampToDate(dueDate!);
    endDate.setHours(9, 0, 0, 0); // Set to 9:00 AM

    const res = await fetch("/api/save-to-google-calender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: currentUser.calenderToken,
        event: {
          summary: title,
          description:
            description && typeof description !== "string"
              ? description.blocks.map((block) => block.data.text).join(" ") ||
                description.blocks.map((block) => block.data.items).join(" ")
              : description,
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
        },
      }),
    });
    const data = await res.json();
    console.log("res", data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="text-primary min-w-fit">
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
                <SelectValue placeholder="create task for" />
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
            {/* <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="create task for" />
              </SelectTrigger>
              <SelectContent>
                {userData &&
                  userData.map((user) => (
                    <SelectItem key={user.uid} value={user.uid}>
                      <div className="flex items-center gap-2">
                        <img
                          src={user.photoURL}
                          alt={user.firstName}
                          className="h-6 w-6 rounded-full"
                        />
                        {user.uid == currentUser?.uid ? "You" : user.firstName}
                      </div>
                    </SelectItem>
                  ))}
                <SelectItem value={"all"}>Everyone</SelectItem>
              </SelectContent>
            </Select> */}
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
                              : userData?.find((u) => u.uid == user)?.firstName}
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
                            setAssignee(assignee?.filter((u) => u != user.uid));
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
                        {user.uid == currentUser?.uid ? "You" : user.firstName}
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
        <GoogleCalender
          addToCalendar={addToCalendar}
          setAddToCalendar={setAddToCalendar}
        />

        <div className="flex w-full justify-between mt-4">
          <Button onClick={() => setOpen(false)} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={saveTask}>
            {isSaving ? (
              <>
                <Icons.spinner className="animate-spin h-4 w-4 mr-2" />
                Saving Task
              </>
            ) : (
              "Save Task"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GoogleCalender = ({
  addToCalendar,
  setAddToCalendar,
}: {
  addToCalendar: boolean;
  setAddToCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {currentUser, logInWithGoogleCalender} = useAuth()!;

  const [hasToken, setHasToken] = React.useState(false);

  useEffect(() => {
    if (!hasToken) {
      checkUserAccessScopes("https://www.googleapis.com/auth/calendar").then(
        (res) => {
          setHasToken(res);
        }
      );
    }
  }, [currentUser]);

  const checkUserAccessScopes = async (scope: string) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${currentUser?.calenderToken}`,
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

  return (
    <>
      {!hasToken ? (
        <Button onClick={logInWithGoogleCalender}>
          <Icons.google className="h-6 w-6 mr-2" />
          Setup Google calender
        </Button>
      ) : (
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={addToCalendar}
            onCheckedChange={(checked: boolean) => setAddToCalendar(checked)}
          />

          <p
            className={`${
              addToCalendar ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Add to Google calendar
          </p>
        </div>
      )}
    </>
  );
};

const TaskTable = ({
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
              <TaskRow task={task} key={task.id} userData={userData} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

const TaskRow = ({task, userData}: {task: Task; userData: UserData[]}) => {
  const [isCompleted, setIsCompleted] = React.useState(task.status == "done");

  const {currentUser} = useAuth()!;

  const updateField = async (field: string, value: any) => {
    await setDoc(
      doc(db, "tasks", task.id),
      {
        [field]: value,
      },
      {merge: true}
    );
  };

  const toggleCompleted = async () => {
    setIsCompleted(!isCompleted);
    setTimeout(() => {
      updateField("status", isCompleted ? "todo" : "done");
      if (!isCompleted && currentUser)
        sendNotification(
          "completed",
          currentUser.uid,
          userData,
          currentUser,
          task.name
        );
    }, 500);
  };

  const DeleteTask = async () => {
    await deleteDoc(doc(db, "tasks", task.id));
  };

  const [showViewDialog, setShowViewDialog] = React.useState(false);

  return (
    <div className="flex  justify-between items-center bg-foreground/40 overflow-hidden text-primary p-2 px-4 rounded-lg  border relative gap-4 w-full hover:bg-foreground/60">
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogTrigger asChild>
          <button className="absolute w-full h-full  z-10 left-0 top-0"></button>
        </DialogTrigger>
        <DialogContent className="text-primary">
          <DialogHeader>
            <DialogTitle>{task.name}</DialogTitle>
            {task.notes && (
              <DialogDescription>
                <div className="grid gap-2">
                  {typeof task.notes === "string" ? (
                    <div className="h-fit  overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
                      {task.notes}
                    </div>
                  ) : (
                    <EditorJsRender script={task.notes} />
                  )}
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="">
            <div className="w-full justify-between flex">
              <div className="flex gap-4 items-center">
                <div className="flex gap-1 items-center w-fit ">
                  <div className="flex items-center gap-1">
                    <Icons.calendar className="h-4 w-4 " />
                    Due Date:
                  </div>
                  {formatDaynameMonthDay(task.dueDate)}
                </div>
                <div className="flex  justify-end min-w-8">
                  {task.assignee.map((assignee, index) => {
                    const user = userData.find((u) => u.uid == assignee);
                    return (
                      <img
                        key={index}
                        src={user?.photoURL}
                        alt={user?.firstName}
                        style={{zIndex: task.assignee.length - index}}
                        className="h-8 min-w-8 aspect-square rounded-full -ml-3"
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <CreateTask userData={userData} task={task} heading="Edit task">
                  <Button variant="ghost" size="sm">
                    <span className="hidden sm:inline">edit</span>
                  </Button>
                </CreateTask>
                <Button
                  onClick={() => {
                    updateField("status", isCompleted ? "todo" : "done");
                    setIsCompleted(!isCompleted);
                    setShowViewDialog(false);
                    if (!isCompleted && currentUser)
                      sendNotification(
                        "completed",
                        currentUser.uid,
                        userData,
                        currentUser,
                        task.name
                      );
                  }}
                  variant="outline"
                >
                  {isCompleted ? "Mark as todo" : "Mark as done"}
                </Button>
              </div>
            </div>
          </DialogFooter>
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
        className={`border  dark:border-border rounded-[4px] h-6 w-6 relative hover:border-primary transition-colors duration-300  z-20
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
        className={`w-[350px] overflow-hidden text-ellipsis whitespace-nowrap transition-opacity duration-300
        ${isCompleted ? "opacity-30" : "opacity-100"}
        `}
      >
        {task.name}
      </h1>
      {/* <h1 className="w-[400px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
        {task.notes}
      </h1> */}
      <div
        className={`flex ml-auto gap-4 items-center transition-opacity duration-300
         ${isCompleted ? "opacity-30" : "opacity-100"}
        `}
      >
        <div className="bg-foreground dark:bg-muted border  p-1 rounded-[12px] px-4 justify-center items-center text-center w-fit ">
          {categories.find((c) => c.value == task.category)?.label}
        </div>
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

        <Popover>
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

            <CreateTask task={task} userData={userData} heading="Edit task">
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
        </Popover>
      </div>
    </div>
  );
};

const EditorJsRender = ({script}: {script: OutputData}) => {
  const edjsParser = edjsHTML();
  const htmlList = edjsParser.parse(script);

  const html = htmlList.join("");
  return (
    <div
      dangerouslySetInnerHTML={{__html: html}}
      className="h-fit overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 "
    />
  );
};

function FilterStatus({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className=" flex h-9  items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {statuses.map((status) => (
              <button
                key={status.value}
                className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
                onClick={() => {
                  if (selectedStatus?.includes(status.value)) {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status.value)
                    );
                  } else {
                    setSelectedStatus([
                      ...(selectedStatus || []),
                      status.value,
                    ]);
                  }
                }}
              >
                {status.icon}
                {status.label}
                {selectedStatus?.includes(status.value) && (
                  <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                )}
              </button>
            ))}
          </>
        </PopoverContent>
      </Popover>
      {selectedStatus?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedStatus.map((status) => (
              <div
                key={status}
                className="bg-foreground dark:bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status)
                    );
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {statuses.find((u) => u.value == status)?.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterUser({
  userData,
  selectedUsers,
  setSelectedUsers,
}: {
  userData: UserData[];
  selectedUsers: string[] | undefined;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  const {currentUser} = useAuth()!;

  console.log("selectedUsers 0000", userData);

  return (
    <div className=" flex h-9 items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Tasks for
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {userData.map((user) => (
              <button
                onClick={() => {
                  if (selectedUsers?.includes(user.uid)) {
                    setSelectedUsers(
                      selectedUsers?.filter((u) => u != user.uid)
                    );
                  } else {
                    setSelectedUsers([...(selectedUsers || []), user.uid]);
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
                {user.uid == currentUser?.uid ? "You" : user.firstName}
                {selectedUsers?.includes(user.uid) && (
                  <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                )}
              </button>
            ))}
          </>
        </PopoverContent>
      </Popover>
      {selectedUsers && selectedUsers?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedUsers.map((user) => (
              <div
                key={user}
                className="bg-foreground dark:bg-muted text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedUsers(selectedUsers?.filter((u) => u != user));
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {user == currentUser?.uid
                  ? "You"
                  : userData?.find((u) => u.uid == user)?.firstName}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
