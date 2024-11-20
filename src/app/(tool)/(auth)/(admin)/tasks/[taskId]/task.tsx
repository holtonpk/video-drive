"use client";
import {useEffect, useState} from "react";
import {EditorJsRender} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/notes/editor-js-render";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth, UserData} from "@/context/user-auth";
import {USERS, Task as TaskType} from "../data";
import {formatDaynameMonthDay} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {TaskCard} from "@/src/app/(tool)/(auth)/(admin)/tasks/components/task-card";
const Task = ({taskId}: {taskId: string}) => {
  const [task, setTask] = useState<TaskType>();
  const [loading, setLoading] = useState(true);

  const fetchTask = async (taskId: string) => {
    const docData = await getDoc(doc(db, "tasks", taskId));
    setTask(docData.data() as TaskType);
    setLoading(false);
  };

  useEffect(() => {
    fetchTask(taskId);
  }, [taskId]);

  const [userData, setUsersData] = useState<UserData[]>();

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

  return (
    <div className="md:container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="h-[calc(100vh-64px)]  flex justify-center items-center">
          {task && userData ? (
            <div className="w-fit max-w-[95%]  md:max-w-[80%] mx-auto bg-foreground/20 shadow-lg dark:bg-muted/20 border  rounded-md p-4 text-primary ">
              <TaskCard
                task={task}
                setTask={setTask as any}
                userData={userData}
              />
            </div>
          ) : (
            <div>Task not found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Task;

// const TaskCard = ({task}: {task: TaskType}) => {

//   return (
//     <div className="w-fit max-w-[95%] md:px-8 md:max-w-[80%] mx-auto bg-foreground/20 shadow-lg dark:bg-muted/20 border  rounded-md p-4 text-primary ">
//       <div className="flex flex-col gap-2 justify-between items-center">
//         <h1 className="text-2xl font-bold text-center">{task.name}</h1>
//         <div className="flex items-center gap-4">
//           <p>Due date: {formatDaynameMonthDay(task.dueDate)}</p>
//           {userData && (
//             <div className="flex h-6  justify-end min-w-6">
//               {task.assignee.map((assignee, index) => {
//                 const user = userData.find((u) => u.uid == assignee);
//                 return (
//                   <img
//                     key={index}
//                     src={user?.photoURL}
//                     alt={user?.firstName}
//                     style={{zIndex: task.assignee.length - index}}
//                     className="h-6 min-w-6 aspect-square rounded-full -ml-2"
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </div>
//         {task.notes && (
//           <div className="p-4 border rounded-md bg-foreground/40 dark:bg-muted/40 w-full h-fit max-h-[200px]">
//             {typeof task.notes === "string" ? (
//               <div className="h-fit  overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
//                 {task.notes}
//               </div>
//             ) : (
//               <EditorJsRender
//                 script={task.notes}
//                 //   onUpdate={UpdateDescription}
//               />
//             )}
//           </div>
//         )}
//         <div className="grid gap-2 mt-4 w-full">
//           <Button>Mark as Completed</Button>
//           <Button variant={"outline"}>
//             <Icons.google className="h-6 w-6 mr-2" />
//             Add to Google Calendar
//           </Button>
//           <Button variant={"outline"}>
//             <Icons.pencil className="h-4 w-4 mr-2" />
//             Edit Task
//           </Button>
//           <Button
//             variant={"ghost"}
//             className="text-destructive hover:text-destructive/90 hover:bg-transparent"
//           >
//             Delete Task
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };
