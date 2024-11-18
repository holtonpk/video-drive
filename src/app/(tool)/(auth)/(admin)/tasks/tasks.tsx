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
import {cn, formatDaynameMonthDay, convertTimestampToDate} from "@/lib/utils";
import {Editor} from "./components/description";
import {OutputData} from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
import {motion} from "framer-motion";
import {AnimatePresence} from "framer-motion";
import {sendNotification} from "./components/notifications";
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
  dueDate: Date;
  assignee: string[];
  status: "todo" | "done";
  notes?: OutputData | string;
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

  console.log("userdat ==", userData);

  const [selectedUsers, setSelectedUsers] = React.useState<
    string[] | undefined
  >(currentUser && [currentUser.uid]);

  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([
    statuses[0].value,
  ]);

  return (
    <div>
      <div className="container">
        {userData && userData.length > 0 && (
          <div className="flex flex-col gap-8 mx-auto items-center w-[80%] mt-6">
            <div className="flex w-full justify-between">
              <div className="flex gap-4">
                <CreateTask userData={userData} heading="Create a new task">
                  <Button size="sm">
                    <Icons.add className="h-4 w-4" />
                    <span className="hidden sm:inline">New Task</span>
                  </Button>
                </CreateTask>
                <Notifications userData={userData} />
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
            </div>
            <TaskTable
              userData={userData}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

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

  const {currentUser} = useAuth()!;

  const [isSaving, setIsSaving] = React.useState(false);

  const [title, setTitle] = React.useState(task ? task.name : "");
  const [description, setDescription] = React.useState(task ? task.notes : "");
  const [assignee, setAssignee] = React.useState(task ? task.assignee[0] : "");
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task ? convertTimestampToDate(task.dueDate as any) : new Date()
  );
  const [notes, setNotes] = React.useState<OutputData | string | undefined>(
    task ? task.notes : ""
  );

  const saveTask = async () => {
    setIsSaving(true);
    const id = task ? task.id : Math.random().toString(36).substring(7);
    const taskData: Task = {
      id,
      name: title,
      dueDate: dueDate!,
      assignee: assignee == "all" ? USERS : [assignee],
      status: "todo",
      notes,
    };
    const taskRef = doc(db, "tasks", id);
    await setDoc(taskRef, taskData);

    if (currentUser)
      sendNotification("created", assignee, userData, currentUser, title);
    // Save task logic here
    setIsSaving(false);
    setOpen(false);
    setTitle("");
    setDescription("");
    setAssignee("");
    setDueDate(new Date());
    setNotes("");
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
        <div className="grid gap-1 ">
          <h1>Task name</h1>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task name"
          />
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
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-1">
            <h1>Assign to</h1>
            <Select value={assignee} onValueChange={setAssignee}>
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
            </Select>
          </div>
        </div>
        <div className="grid gap-1  w-[500px]">
          <h1>Notes (optional)</h1>
          {/* <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Task description"
            className="w-full h-24"
          ></Textarea> */}
          <Editor
            post={{
              id: "1",
              content: notes,
            }}
            setScript={setNotes}
          />
        </div>
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

const TaskTable = ({
  userData,
  selectedStatus,
  setSelectedStatus,
  selectedUsers,
  setSelectedUsers,
}: {
  userData: UserData[];
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUsers: string[] | undefined;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>([]);
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

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      const matchesStatus =
        !selectedStatus.length || selectedStatus.includes(task.status);

      const matchesUsers =
        !selectedUsers?.length ||
        selectedUsers.includes("all") ||
        task.assignee.some((u) => selectedUsers.includes(u));

      return matchesStatus && matchesUsers;
    });

    setFilteredTasks(filteredTasks);
  }, [tasks, selectedStatus, selectedUsers]);

  return (
    <>
      {isLoading ? (
        <div className="w-full justify-center items-center flex">
          <Icons.spinner className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-1">
          {!filteredTasks || filteredTasks.length == 0 ? (
            <div className="text-2xl text-center w-full text-primary">
              No tasks found
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1  w-[100%] ">
              {filteredTasks.map((task) => (
                <TaskRow task={task} key={task.id} userData={userData} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
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
    }, 1000);
  };

  const DeleteTask = async () => {
    await deleteDoc(doc(db, "tasks", task.id));
  };

  const [showViewDialog, setShowViewDialog] = React.useState(false);

  return (
    <div className="flex justify-between items-center bg-foreground/40 overflow-hidden text-primary p-2 px-4 rounded-lg shadow-sm border relative gap-4 w-full hover:bg-foreground/60">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            animate={{width: "95%"}}
            initial={{width: "0%"}}
            exit={{width: "0%"}}
            className="absolute top-1/2 -translate-y-1/2 left-[56px] pointer-events-none  h-[2px] bg-primary z-30 origin-left"
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
      <h1 className="w-[350px] overflow-hidden text-ellipsis whitespace-nowrap">
        {task.name}
      </h1>
      {/* <h1 className="w-[400px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
        {task.notes}
      </h1> */}
      <div className="flex ml-auto gap-4 items-center">
        <div className="flex  justify-end min-w-12">
          {task.assignee.map((assignee, index) => {
            const user = userData.find((u) => u.uid == assignee);
            return (
              <img
                key={index}
                src={user?.photoURL}
                alt={user?.firstName}
                style={{zIndex: task.assignee.length - index}}
                className="h-8 w-8 aspect-square rounded-full -ml-3"
              />
            );
          })}
        </div>

        <div className="bg-muted p-1 rounded-[12px] px-4 justify-center items-center text-center w-[120px] ">
          {formatDaynameMonthDay(task.dueDate)}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="bg-muted p-1 rounded-[12px] relative z-20">
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
            className="h-full  text-primary bg-muted"
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
                className="bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
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
            className="h-full  text-primary bg-muted"
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
                className="bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
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
