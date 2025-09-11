"use client";
import React, {useEffect, useRef} from "react";
import {doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {
  VideoData,
  Post,
  clients,
  statuses,
  ADMIN_USERS,
  ALL_USERS,
  videoMessage,
} from "@/config/data";
import {motion, AnimatePresence} from "framer-motion";
import {Icons} from "@/components/icons";
import {VideoProvider, useVideo} from "./data/video-context";
import {HighlightProvider} from "./data/highlight-context";
import {VideoDetails} from "./components/video-details";
import {Button} from "@/components/ui/button";
import {useAuth, UserData} from "@/context/user-auth";
import Link from "next/link";
import {formatTimeDifference2} from "@/lib/utils";

export default function VideoPage({videoId}: {videoId: string}) {
  const [video, setVideo] = React.useState<VideoData | null>(null);

  useEffect(() => {
    const videoRef = doc(db, "videos", videoId);

    const unsubscribe = onSnapshot(videoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setVideo(docSnapshot.data() as VideoData);
      } else {
        setVideo(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [videoId]);

  const {currentUser} = useAuth()!;

  if (
    video &&
    currentUser &&
    currentUser.uid !== video.editor &&
    ADMIN_USERS.includes(currentUser.uid) === false
  ) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-foreground">
        Sorry you don&apos;t have access to this video
      </div>
    );
  }

  const hasUnreadMessages =
    currentUser &&
    video?.messages?.some(
      (message) => !message.viewedBy?.includes(currentUser?.uid)
    );

  console.log("video 1", video?.messages);

  return (
    <>
      {video ? (
        <HighlightProvider>
          <VideoProvider videoData={video}>
            <Link
              href="/dashboard"
              className="flex flex-row items-center text-primary px-4 hover:opacity-80 w-fit"
            >
              <Icons.chevronLeft className="h-8 w-8 text-primary" />
              back to dashboard
            </Link>

            <motion.div
              initial={{y: 200, opacity: 1}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.5}}
              className=" flex flex-col gap-4 mt-4 items-center relative  container   overflow-hidden  z-50  w-screen h-fit  bg-transparent "
            >
              <VideoDetails />
            </motion.div>
          </VideoProvider>
        </HighlightProvider>
      ) : (
        <div
          className="  w-[600px] max-w-screen h-[400px] 
         rounded-md flex items-center justify-center"
        >
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}

const ChatBox = ({video}: {video: VideoData}) => {
  const [userData, setUserData] = React.useState<UserData[] | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataPromises = ALL_USERS.map(async (userId) => {
          console.log("userId", userId);
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            return userDoc.data() as UserData;
          }
          return null;
        });

        // Wait for all promises to resolve
        const resolvedUserData = await Promise.all(userDataPromises);
        // Filter out any null values
        setUserData(
          resolvedUserData.filter((user) => user !== null) as UserData[]
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  return (
    <div className="w-full border bg-foreground/30 blurBack z-20 rounded-md flex flex-col  h-[400px] overflow-hidden  relative ">
      <div
        id="message-container"
        className="flex flex-col relative pt-4 pb-6  h-[300px] overflow-scroll px-6 gap-2"
      >
        {video.messages && video.messages.length > 0 ? (
          video.messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              usersData={userData}
              video={video}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-primary">
            No messages for this videos
          </div>
        )}
      </div>
      <MessageInput isScrolled={isScrolled} />
    </div>
  );
};

const MessageInput = ({isScrolled}: {isScrolled: boolean}) => {
  const {video, setVideo} = useVideo()!;
  const [message, setMessage] = React.useState("");
  const {currentUser} = useAuth()!;

  const [isSending, setIsSending] = React.useState(false);

  const messages = [
    {
      id: "1",
      senderId: "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
      message:
        "Can we make this video longer it doessnt work very well witht the current length. Can we make this video longer it doessnt work very well witht the current length. Can we make this video longer it doessnt work very well witht the current length. Can we make this video longer it doessnt work very well witht the current length",
      timestamp: new Date(),
      viewedBy: [],
    },
    {
      id: "2",
      senderId: "Mi4yipMXrlckU117edbYNiwrmI92",
      message: "test from patrick",
      timestamp: new Date(),
      viewedBy: [],
    },
    {
      id: "3",
      senderId: "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
      message: "test from rishabh",
      timestamp: new Date(),
      viewedBy: [],
    },
    {
      id: "4",
      senderId: "Mi4yipMXrlckU117edbYNiwrmI92",
      message: "test from patrick",
      timestamp: new Date(),
      viewedBy: [],
    },
  ];

  const SendMessage = async () => {
    if (!currentUser) return;
    setIsSending(true);
    const messageData: videoMessage = {
      id: Math.random().toString(),

      senderId: currentUser.uid,
      message: message,
      timestamp: new Date(),

      viewedBy: [currentUser.uid],
    };

    const videoRef = doc(db, "videos", video.videoNumber);
    const videoSnap = await getDoc(videoRef);

    if (videoSnap.exists()) {
      const videoData = videoSnap.data() as VideoData;
      const newMessages = [...(videoData.messages || []), messageData];
      // const newMessages = [...(messages || []), messageData];

      await setDoc(videoRef, {
        ...videoData,
        messages: newMessages,
      });

      // setVideo({
      //   ...videoData,
      //   messages: newMessages,
      // });
    }
    setMessage("");
    setIsSending(false);
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  };

  const scrollToBottom = () => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  };

  return (
    <div className="absolute bottom-0 h-[100px]  left-0 w-full flex dark:bg-foreground/60 bg-foreground/80 blurBsack p-2 gap-2">
      <div className="absolute w-full pointer-events-none s h-6 top-0 left-0 -translate-y-full message-grad-bottom " />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            SendMessage();
          }
        }}
        placeholder="type a new message"
        className="border min-h-full h-fit noResize overflow-scroll rounded-md w-full p-2 focus:outline-none text-primary"
      />

      <Button
        onClick={SendMessage}
        className=" w-fit text-xs gap-2 rounded-md mt-auto"
      >
        {isSending ? (
          <Icons.loader className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.send className="h-4 w-4 text-background  " />
        )}
        Send Message
      </Button>
    </div>
  );
};

const Message = ({
  message,
  usersData,
  video,
}: {
  message: any;
  usersData: UserData[] | undefined;
  video: VideoData;
}) => {
  const userData =
    usersData && usersData.find((user) => user.uid == message.senderId);

  const {currentUser} = useAuth()!;

  const isSender = currentUser?.uid === message.senderId;

  const userIndex = ALL_USERS?.findIndex((user) => user === message.senderId);

  const colors = [
    "rgb(37 99 235 /.20)",
    "rgb(124 58 237 /.20)",
    "rgb(37 235 37 /.20)",
    "rgb(249 115 22 / .20)",
  ];

  const messageColor = colors[userIndex];

  const isViewed = useRef(false);

  useEffect(() => {
    // determine of the message is in view

    if (
      !message.viewedBy.includes(currentUser?.uid) &&
      isViewed.current === false
    ) {
      console.log("marking message as read");
      markMessageAsRead();
    }
  }, []);

  const markMessageAsRead = async () => {
    if (!currentUser) return;
    const videoRef = doc(db, "videos", video.videoNumber);
    const videoSnap = await getDoc(videoRef);
    isViewed.current = true;

    if (videoSnap.exists()) {
      const videoData = videoSnap.data() as VideoData;
      const newMessages =
        videoData &&
        videoData.messages &&
        videoData.messages.map((msg) => {
          if (msg.id === message.id) {
            return {
              ...msg,
              viewedBy: [...(msg.viewedBy || []), currentUser.uid],
            };
          }
          return msg;
        });

      await setDoc(videoRef, {
        ...videoData,
        messages: newMessages,
      });
      // setVideo({
      //   ...videoData,
      //   messages: newMessages,
      // });

      console.log("viewed message", message.id, newMessages);
    }
  };

  // if senderId is the current user, remove the current user from the viewedBy array
  // console.log("message", message.viewedBy);
  const messageViewedByArray =
    video.messages
      ?.find((msg) => msg.id === message.id)
      ?.viewedBy?.filter((viewedId: string) => message.senderId !== viewedId) ??
    [];

  console.log("messageViewedByArray", messageViewedByArray);

  return (
    <>
      {userData && (
        <div
          id={message.id}
          className={`max-w-[90%]  flex flex-col gap-1 ${
            isSender ? " ml-auto" : "mr-auto "
          }`}
        >
          <div
            style={{
              backgroundColor: messageColor,
              borderColor: messageColor,
            }}
            className={`p-2 rounded-md dark:bgs-muted bgs-foreground border blurBack   flex flex-col ${
              isSender ? "rounded-br-none " : "rounded-bl-none"
            }`}
          >
            <div className="flex items-center gap-1">
              <img src={userData.photoURL} className="w-4 h-4 rounded-full" />
              <span className=" text-muted-foreground">
                {isSender ? "You" : userData?.firstName}
              </span>
            </div>
            <span className="font-bold text-primary">{message.message}</span>
            <div className="flex flex-row gap-1 items-end">
              <span className="text-xs text-gray-400">
                {formatTimeDifference2(message.timestamp)}
              </span>

              {messageViewedByArray && messageViewedByArray.length > 0 && (
                <>
                  {messageViewedByArray.map((viewedId: string) => (
                    <Icons.check
                      key={viewedId}
                      className="h-3 w-3 text-primary"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
