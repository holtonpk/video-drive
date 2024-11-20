"use client";

import React, {use, useEffect} from "react";
import {Icons} from "@/components/icons";
import {useAuth, UserData} from "@/context/user-auth";
import axios from "axios";
import {EditorJsToHtml} from "./notes/editor-js-render";
import {OutputData} from "@editorjs/editorjs";
import {Button} from "@/components/ui/button";
import {formatDaynameMonthDay} from "@/lib/utils";
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
import {doc, setDoc, getDoc, arrayUnion} from "firebase/firestore";
import {db} from "@/config/firebase";
import {get} from "http";
import {set} from "date-fns";
import {Task} from "../data";

//  created>userIDCretedFor>userToGetNotification[]
// completed>userIDCompletedFor>userToGetNotification[]

export const Notifications = ({userData}: {userData: UserData[]}) => {
  const [open, setOpen] = React.useState(false);

  const {currentUser} = useAuth()!;

  const [triggerValue, setTriggerValue] = React.useState("");

  const [selectedUser, setSelectedUser] = React.useState("");

  const [isSaving, setIsSaving] = React.useState(false);

  const saveNotificationSettings = async () => {
    if (!triggerValue || !selectedUser || !currentUser) return;
    setIsSaving(true);
    const docRef = doc(db, "taskAlerts", triggerValue); // Reference the document by triggerValue
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing document
      await setDoc(
        docRef,
        {
          [selectedUser]: {
            recipients: arrayUnion(currentUser.uid), // Ensure no duplicate UIDs
          },
        },
        {merge: true}
      );
    } else {
      // Create a new document if it doesn't exist
      await setDoc(docRef, {
        [selectedUser]: {
          recipients: [currentUser.uid],
        },
      });
    }
    setUserNotificationSettings((prev: any) => {
      if (prev) {
        return [
          ...prev,
          {
            text: `A task is ${
              triggerValue == "completed" ? "completed by" : "created for"
            } ${
              selectedUser === currentUser.uid
                ? "you"
                : userData.find((user) => user.uid === selectedUser)?.firstName
            }`,
            trigger: triggerValue,
            user: selectedUser,
          },
        ];
      } else {
        return [
          {
            text: `A task is ${
              triggerValue == "completed" ? "completed by" : "created for"
            } for ${
              selectedUser === currentUser.uid
                ? "you"
                : userData.find((user) => user.uid === selectedUser)?.firstName
            }`,
            trigger: triggerValue,
            user: selectedUser,
          },
        ];
      }
    });
    setIsSaving(false);
  };

  type NotificationSetting = {
    text: string;
    trigger: "completed" | "created";
    user: string;
  };

  const [userNotificationSettings, setUserNotificationSettings] =
    React.useState<NotificationSetting[]>();

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (!currentUser?.uid) return;
      const notifications: NotificationSetting[] = [];

      // Helper function to process notifications
      const processNotifications = async (
        trigger: "completed" | "created",
        text: string
      ) => {
        const docRef = doc(db, "taskAlerts", trigger);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data() as NotificationSettings;

          Object.entries(docData).forEach(([key, value]) => {
            if (value.recipients.includes(currentUser?.uid)) {
              const userText =
                key === currentUser?.uid
                  ? "You"
                  : userData.find((user) => user.uid === key)?.firstName ||
                    "Unknown";
              notifications.push({
                text: `${text} ${userText}`,
                trigger,
                user: key,
              });
            }
          });
        }
      };

      // Fetch "completed" and "created" notifications
      await processNotifications("completed", "A task is completed by");
      await processNotifications("created", "A task is created for");

      // Update state with the collected notifications
      setUserNotificationSettings(notifications);
    };

    fetchNotificationSettings();
  }, [currentUser?.uid, userData]);

  const removeNotification = async (notification: NotificationSetting) => {
    const docRef = doc(db, "taskAlerts", notification.trigger);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data() as NotificationSettings;

      const updatedRecipients = docData[notification.user].recipients.filter(
        (recipient: string) => recipient !== currentUser?.uid
      );
      console.log("docData", docData);
      console.log("recipients", docData[notification.user].recipients);
      console.log("updatedRecipients", updatedRecipients);

      if (updatedRecipients.length) {
        await setDoc(
          docRef,
          {
            [notification.user]: {
              recipients: updatedRecipients,
            },
          },
          {merge: true}
        );
      } else {
        console.log("22222");
        await setDoc(
          docRef,
          {
            [notification.user]: {
              recipients: [],
            },
          },
          {merge: true}
        );
      }
    }

    setUserNotificationSettings((prevSettings) =>
      prevSettings?.filter(
        (prevNotification) =>
          !(
            prevNotification.text === notification.text &&
            prevNotification.trigger === notification.trigger &&
            prevNotification.user === notification.user
          )
      )
    );
  };

  console.log("userNotificationSettings", userNotificationSettings);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className=" text-primary bg-muted gap-1 hidden md:flex"
        >
          <Icons.bell className="h-4 w-4" />
          Notifications
        </Button>
      </DialogTrigger>

      <DialogContent className="text-primary">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Configure Notifications
          </DialogTitle>
          <DialogDescription>
            Notifications will be sent to {currentUser?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 mt-3">
          {userNotificationSettings && (
            <div className="grid gap-1">
              <h1>Current Notification</h1>
              <div className="max-h-[300px] overflow-scroll">
                <div className="flex flex-col gap-1">
                  {userNotificationSettings.map((notification) => (
                    <div
                      key={notification.text}
                      className="border p-2 text-primary  grid grid-cols-[1fr_50px] items-center rounded-md"
                    >
                      {notification.text}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification)}
                      >
                        <Icons.close className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <h1 className="mt-3">New notification</h1>
          <div className="grid grid-cols-[1fr_50px_1fr] items-center">
            <Select value={triggerValue} onValueChange={setTriggerValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="event trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">a task is created</SelectItem>
                <SelectItem value="completed">a task is completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-full flex text-center justify-center ">
              {triggerValue === "completed" && "by"}
              {triggerValue === "created" && "for"}
            </div>
            {triggerValue && (
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="user" />
                </SelectTrigger>
                <SelectContent>
                  {userData &&
                    userData.map((user) => (
                      <SelectItem value={user.uid} key={user.uid}>
                        <div className="flex items-center gap-2">
                          <img
                            src={user.photoURL}
                            alt={user.firstName}
                            className="h-6 w-6 rounded-full"
                          />
                          {user.uid == currentUser?.uid
                            ? "You"
                            : user.firstName}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="flex w-full justify-between mt-4">
          <Button onClick={() => setOpen(false)} variant={"outline"}>
            Cancel
          </Button>
          <Button
            disabled={!triggerValue || !selectedUser || !currentUser}
            onClick={saveNotificationSettings}
          >
            {isSaving ? (
              <>
                <Icons.loader className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Create Notification"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type NotificationSettings = {
  [key: string]: {
    recipients: string[]; // Assume recipients is an array of strings
  };
};

export const sendNotification = async (
  trigger: string,
  user: string,
  usersData: UserData[],
  currentUser: UserData,
  task: Task,
  subjectCopy: string
) => {
  const docRef = doc(db, "taskAlerts", trigger);
  const docSnap = await getDoc(docRef);

  let emailTemp: any = null;

  const dueDate = `
  <p style="color:blue;">
    Due Date:
  ${formatDaynameMonthDay(task.dueDate)}
  </p>
  `;

  let notesString = "";
  if (task.notes) {
    if (task.notes && typeof task.notes !== "string") {
      notesString = EditorJsToHtml(task.notes as OutputData);
    } else {
      notesString = task.notes;
    }
  }

  if (docSnap.exists()) {
    const data = docSnap.data() as NotificationSettings;
    if (!data[user]?.recipients) return;
    const recipients = data[user].recipients;
    recipients.forEach((recipient: string) => {
      if (trigger === "created") {
        emailTemp = {
          subject: `${subjectCopy} for ${
            user === currentUser.uid
              ? "you"
              : usersData.find((userData) => userData.uid === user)?.firstName
          }`,
          line_1: `${task.name}`,
          html_line: `${dueDate} ${
            task.notes && "<h2>Notes:</h2>" + notesString
          }`,
          to_email: usersData.find((userData) => userData.uid === recipient)
            ?.email,
        };
      } else if (trigger === "completed") {
        emailTemp = {
          subject: `${subjectCopy} by ${
            user === currentUser.uid
              ? "you"
              : usersData.find((userData) => userData.uid === user)?.firstName
          }`,
          line_1: `The following task has been completed:
        \n\n ${task.name}
        `,
          html_line: `${dueDate} ${
            task.notes && "<h2>Notes:</h2>" + notesString
          }`,
          to_email: usersData.find((userData) => userData.uid === recipient)
            ?.email,
        };
      }
      sendEmail(emailTemp);
    });
  }
};

const sendEmail = async (emailTemp: any) => {
  const emailData = {
    service_id: "service_xh39zvd",
    template_id: "template_gt6vtz8",
    user_id: "_xxtFZFU5RPJivl-9",
    template_params: emailTemp,
    accessToken: "rIezh-MOZPAh3KEMZWpa_",
  };
  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", emailData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
