"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import {Button} from "@/components/ui/button";
import {db} from "@/config/firebase";
import {convertTimestampToDate} from "@/lib/utils";
import {getDoc, doc, collection, onSnapshot} from "firebase/firestore";

import {Notifications} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notifications";
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
