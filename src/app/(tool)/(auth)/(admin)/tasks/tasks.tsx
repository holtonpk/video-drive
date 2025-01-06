"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {db} from "@/config/firebase";
import {
  convertTimestampToDate,
  convertDateToTimestamp,
  isDueDateBeforeToday,
} from "@/lib/utils";
import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import {Notifications} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notifications";
import {useAuth, UserData} from "@/context/user-auth";
import {
  Task,
  USERS,
  statuses,
} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";

import {TaskTable} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-table";
import {DateFilter} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/filters/date-filter";
import {FilterStatus} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/filters/status-filter";
import {FilterUser} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/filters/user-filter";
import {CreateTask} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/create-task";
import {WeeklyTaskTable} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/weekly-task-table";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";

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

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedUsers, setSelectedUsers] = React.useState<
    string[] | undefined
  >(
    USERS // Replace `USERS` with your default users array
  );

  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([
    statuses[0].value,
    statuses[1].value,
  ]); // Replace `statuses` with your status array

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  // Function to calculate the week range
  const getWeekRange = (date: Date) => {
    const day = date.getDay();

    // Find the last Monday
    const lastMonday = new Date(date);
    lastMonday.setDate(date.getDate() - ((day + 6) % 7)); // Adjust for Monday being the first day of the week
    lastMonday.setHours(0, 0, 0, 0); // Set to the first minute of Monday

    // Find the Sunday of the same week
    const sunday = new Date(lastMonday);
    sunday.setDate(lastMonday.getDate() + 6); // Move to Sunday
    sunday.setHours(23, 59, 59, 999); // Set to the last minute of Sunday

    return {
      start: lastMonday,
      end: sunday,
    };
  };

  const weekRange = selectedDate ? getWeekRange(selectedDate) : undefined;

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

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
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

      const isIncomplete =
        selectedDate &&
        selectedDate.toLocaleDateString() === new Date().toLocaleDateString() &&
        task.status === "todo" &&
        isDueDateBeforeToday(convertTimestampToDate(task.dueDate));

      return (
        matchesStatus &&
        matchesUsers &&
        (matchesDate || isIncomplete) &&
        !task.isWeekly
      );
    });
  }, [tasks, selectedStatus, selectedUsers, selectedDate]);

  const filteredWeeklyTasks = React.useMemo(() => {
    return tasks.flatMap((task) => {
      const matchesStatus =
        !selectedStatus.length || selectedStatus.includes(task.status);

      const matchesUsers =
        !selectedUsers?.length ||
        selectedUsers.includes("all") ||
        task.assignee.some((u) => selectedUsers.includes(u));

      const matchesWeekDate = (dueDate: Timestamp) =>
        weekRange &&
        convertTimestampToDate(dueDate).getTime() >=
          weekRange.start.getTime() &&
        convertTimestampToDate(dueDate).getTime() <= weekRange.end.getTime();

      // If the task is weekly, generate tasks for each due date in `dueDatesWeekly`
      if (task.isWeekly && task.dueDatesWeekly?.length) {
        return task.dueDatesWeekly
          .filter(({dueDate}) => matchesWeekDate(dueDate)) // Filter based on the `dueDate`
          .map(({dueDate, isComplete}) => ({
            ...task,
            dueDate, // Override the `dueDate` with the specific weekly due date
            isComplete, // Include `isComplete` in the task
          }));
      }

      // Otherwise, only include the task if it matches the conditions
      const isMatch =
        matchesStatus &&
        matchesUsers &&
        matchesWeekDate(task.dueDate) &&
        task.isWeekly;

      return isMatch ? [task] : [];
    });
  }, [tasks, selectedStatus, selectedUsers, weekRange]);

  const taskForDate = tasks.filter((task) => {
    return (
      !selectedUsers?.length ||
      selectedUsers.includes("all") ||
      (task.assignee.some((u) => selectedUsers.includes(u)) && !task.isWeekly)
    );
  });

  const formatWeekDay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("en-US", options); // Format: Mon 11/16
  };

  const dateIsOverdue = (date: Date) => {
    // if date is before the current week current week is todays dates last monday to sunday
    const weekRange = getWeekRange(new Date());
    return date < weekRange.start;
  };

  console.log("filteredTasks =============", filteredWeeklyTasks);

  return (
    <div>
      <div className="md:container">
        {userData && userData.length > 0 && (
          <div className="flex flex-col gap-4 mx-auto items-center w-full  mt-6 ">
            <div className="flex lg:flex-row flex-col w-full justify-between ">
              <div className=" gap-4  md:flex-row flex-col hidden md:flex">
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
              <div className="flex gap-4 md:flex-row flex-col ">
                <Notifications userData={userData} />
                <CreateTask
                  userData={userData}
                  heading="Create a new task"
                  defaultDate={
                    selectedDate
                      ? (convertDateToTimestamp(selectedDate) as Timestamp)
                      : undefined
                  }
                >
                  <Button size="sm">
                    <Icons.add className="h-4 w-4" />
                    <span className="">New Task</span>
                  </Button>
                </CreateTask>
              </div>
            </div>
            {isLoading ? (
              <div className="w-full justify-center items-center flex">
                <Icons.spinner className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : (
              <div className=" md:grid-cols-[70%_28%] grid  w-full justify-between">
                <div className="flex flex-col border rounded-md overflow-hidden  blurBack w-full shadow-lg">
                  <DateFilter
                    tasks={taskForDate}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />

                  <TaskTable
                    tasks={filteredTasks}
                    userData={userData}
                    selectedDate={selectedDate}
                  />
                </div>
                <div className="w-full  max-w-full border h-full flex flex-col blurBack rounded-md shadow-lg">
                  <div className="p-4 bg-foreground/40 dark:bg-muted/40 flex items-center justify-between">
                    <h1 className="text-primary font-bold flex gap-1 items-center text-base">
                      Weekly tasks
                      {/* {selectedDate &&
                        filteredWeeklyTasks.some(   
                          (task) => task.status == "todo"
                        ) && (
                          <div
                            className={` h-1 w-1  rounded-full
                ${dateIsOverdue(selectedDate) ? "bg-red-600 " : "bg-blue-600"}
                  `}
                          ></div>
                        )} */}
                    </h1>
                    {weekRange && (
                      <h1 className="text-primary font-bold text-sm ">
                        {formatWeekDay(weekRange.start)} -{" "}
                        {formatWeekDay(weekRange.end)}
                      </h1>
                    )}
                  </div>
                  <WeeklyTaskTable
                    tasks={filteredWeeklyTasks}
                    userData={userData}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
