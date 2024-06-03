import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

export const emailVideoUpdate = functions.firestore
  .document("videos/{videoId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status === after.status) return null;

    let updatedUser = after.updatedAt.user;
    const updatedDate = formatDateFromTimestamp(after.updatedAt.date);
    const videoNumber = after.videoNumber;
    const editor = after.editor;

    const ADMIN_USERS = [
      "Mi4yipMXrlckU117edbYNiwrmI92",
      "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
    ];
    // Get all users from the database at "/users" in bulk
    const usersSnapshot = await admin.firestore().collection("users").get();
    const emailPromises: Promise<void>[] = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const notificationSettings = userData.notificationSettings;
      if (!notificationSettings) return;
      if (editor !== userData.uid && !ADMIN_USERS.includes(userData.uid)) {
        return;
      }

      let emailTemp: EmailTemp | null = null;

      if (updatedUser === userData.firstName) {
        updatedUser = "You";
      }

      if (after.status === "done" && notificationSettings.done) {
        emailTemp = {
          subject: `✅ ${updatedUser} completed video #${videoNumber}`,
          line_1: `Video #${videoNumber} has been marked as done.`,
          line_2:
            `The video was marked as done at ${updatedDate} by` +
            ` ${updatedUser}`,
          action_url: `https://video-drive.vercel.app/edit/${videoNumber}`,
          to_email: notificationSettings.email,
        };
      } else if (
        after.status === "needs revision" &&
        notificationSettings.revision
      ) {
        emailTemp = {
          subject: `❗Video #${videoNumber} needs revision❗`,
          line_1:
            `${updatedUser} marked video #${videoNumber}` +
            " as needing revision.",
          line_2:
            "Please review the feedback and make the necessary changes." +
            `The following notes were left: "${after.notes}"`,
          action_url: `https://video-drive.vercel.app/edit/${videoNumber}`,
          to_email: notificationSettings.email,
        };
      } else if (
        before.status === "draft" &&
        after.status === "todo" &&
        notificationSettings.new_video
      ) {
        emailTemp = {
          subject: `Video #${videoNumber} is ready to edit`,
          line_1: `Video #${videoNumber} is ready to edit.`,
          line_2: "Let us know if you have any questions.",
          action_url: `https://video-drive.vercel.app/edit/${videoNumber}`,
          to_email: notificationSettings.email,
        };
      }

      if (emailTemp) {
        emailPromises.push(sendEmail(emailTemp));
      }
    });

    // Await all email sending promises
    await Promise.all(emailPromises);

    return null;
  });

const sendEmail = async (emailTemp: EmailTemp) => {
  const emailData = {
    service_id: "service_xh39zvd",
    template_id: "template_7ccloj9",
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
type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

const formatDateFromTimestamp = (timestamp: Timestamp | any): string => {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString(); // Convert the date to a local date string
};

type EmailTemp = {
  subject: string;
  line_1: string;
  line_2: string;
  action_url: string;
  to_email: string;
};
