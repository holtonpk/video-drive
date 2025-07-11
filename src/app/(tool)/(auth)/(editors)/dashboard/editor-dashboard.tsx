"use client";
import React, {use, useEffect} from "react";
import Cards from "./components/stat-cards";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {Timestamp} from "@/config/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useIsVisible} from "@/lib/hooks";

import {
  getDoc,
  getDocs,
  query,
  where,
  collection,
  onSnapshot,
  doc,
  addDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn, convertTimestampToDate} from "@/lib/utils";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

import {db} from "@/config/firebase";
import {ADMIN_USERS, EDITORS, Post, VideoData} from "@/config/data";
import {formatDaynameMonthDay} from "@/lib/utils";
import {clients, REVIEW_USERS_DATA} from "@/config/data";
import Link from "next/link";
import {useAuth} from "@/context/user-auth";
import {EditorSelector} from "./components/editor-selector";
import Background from "@/components/background";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {Banknote, Clock, Grid, List} from "lucide-react";
import {VideoDisplay} from "../../(admin)/client-view/[client]/components/video-display";
import {connectStorageEmulator} from "firebase/storage";

const EditDashboard = () => {
  const [videoData, setVideoData] = React.useState<VideoData[] | undefined>();

  const {currentUser} = useAuth()!;

  const [dummyUid, setDummyUid] = React.useState<string>(
    currentUser?.uid || "Mi4yipMXrlckU117edbYNiwrmI92"
  );

  useEffect(() => {
    if (!currentUser) return;
    let uid = currentUser.uid;
    if (ADMIN_USERS.includes(currentUser.uid)) {
      uid = dummyUid;
    }
    const q = query(collection(db, "videos"), where("editor", "==", uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const videos = querySnapshot.docs.map((doc) => doc.data() as VideoData);
        setVideoData(videos);
      },
      (error) => {
        console.error("Error fetching video data: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dummyUid, currentUser]);

  return (
    <div className="md:container h-fit md:h-[calc(100vh-104px)]  overflow-hidden  flex flex-col ">
      {/* <Cards /> */}
      {currentUser && ADMIN_USERS.includes(currentUser.uid) && (
        <EditorSelector selectEditor={setDummyUid} selectedEditor={dummyUid} />
      )}
      {videoData && <VideoSheet videoData={videoData} dummyUid={dummyUid} />}
    </div>
  );
};

export default EditDashboard;

interface CounterProps {
  from: number;
  to: number;
}

const Counter: React.FC<CounterProps> = ({from, to}) => {
  const nodeRef = React.useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      // Add a null check
      const controls = animate(from, to, {
        duration: 0.5,
        onUpdate(value) {
          node.textContent = value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
      });

      return () => controls.stop();
    }
  }, [from, to]);

  return <p ref={nodeRef} />;
};

const VideoSheet = ({
  videoData,
  dummyUid,
}: {
  videoData: VideoData[];
  dummyUid: string;
}) => {
  const needsRevision = videoData.filter(
    (video) => video.status === "needs revision"
  );

  const reviewerIds = REVIEW_USERS_DATA.map((user) => user.id);

  const todo = videoData.filter(
    (video) => video.status === "todo"
    // video.scriptReviewed && // Ensure scriptReviewed is not undefined
    // Array.isArray(video.scriptReviewed) &&
    // reviewerIds.every(
    //   (id) => video.scriptReviewed && video.scriptReviewed.includes(id)
    // )
  );

  const [showPaid, setShowPaid] = React.useState(true);
  const [showUnpaid, setShowUnpaid] = React.useState(true);
  const [showDemos, setShowDemos] = React.useState(true);

  const completed = videoData
    .filter((video) => video.status === "done")
    .filter((video) => {
      if (showPaid && video.priceUSD > 0 && video.paid) return true;
      if (showUnpaid && video.priceUSD > 0 && !video.paid) return true;
      if (showDemos && video.priceUSD === 0) return true;
      return false;
    })
    .sort((a, b) => b.dueDate.seconds - a.dueDate.seconds);

  const payableVideos = completed.filter(
    (video) => video.priceUSD !== 0 && !video.paid
  );

  // add all the video.priceUSD to get total earnings
  const totalEarnings = videoData.reduce(
    (acc, video) => acc + video.priceUSD,
    0
  );

  // add all the video.priceUSD to get total earnings where vide0.paid === false
  const nextPayout = payableVideos.reduce(
    (acc, video) => (video.paid ? acc : acc + video.priceUSD),
    0
  );

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  const getTimeUntilDue = (dueDate: Timestamp) => {
    const now = new Date();
    const diffTime = dueDate.seconds * 1000 - now.getTime();
    const diffHours = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60));
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      if (diffHours < 24) {
        return {isLate: true, value: `${diffHours}h`};
      }
      return {isLate: true, value: `${diffDays}d`};
    }

    if (diffHours < 24) {
      return {isLate: false, value: `${diffHours}h`};
    }
    return {isLate: false, value: `${diffDays}d`};
  };

  const orderedTodo = todo.sort((a, b) => {
    return (
      convertTimestampToDate(a.dueDate).getTime() -
      convertTimestampToDate(b.dueDate).getTime()
    );
  });

  const [completedView, setCompletedView] = React.useState<"grid" | "list">(
    "list"
  );

  console.log("needs revision", needsRevision);

  return (
    <div className="w-full  overflow-hiddens  h-fit md:h-[calc(100vh-104px)]  grid md:grid-cols-2  items-start gap-8  relative z-20 ">
      <div className=" flex flex-col   md:h-[calc(100vh-104px)]  gap-4">
        {/* -------------------------------------------------*/}
        <div className="flex flex-col h-fit md:h-[150px] ">
          <div className="flex items-center gap-2  ">
            <div className="h-fit w-fit p-1 bg-green-500/20 rounded-md">
              <Icons.money className="h-4 w-4 text-green-500" />
            </div>
            <h1 className="text-primary font-bold  mt-1  font1 text-2xl">
              Payouts
            </h1>

            <PayoutRequest videos={payableVideos} editor={dummyUid} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-2 ">
            <div className="border shadow-lg dark:shadow-none bg-foreground/50 blurBack rounded-md w-full h-[100px] flex flex-col p-4 ">
              <h1 className="font1 text-xl text-muted-foreground flex gap-1 items-center">
                Total earnings (usd)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.info className="h-4 w-4 text-muted-foreground mb-[2px] hover:text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[100px]">
                        The total amount earned. This includes the available
                        payout balance
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h1>
              <h1 className="text-primary text-2xl font-bold font1 flex">
                {/* {totalEarnings > 0 ? formatAsUSD(totalEarnings) + " usd" : "--"} */}{" "}
                $
                <Counter from={0} to={totalEarnings} />
              </h1>
            </div>
            <div className="border shadow-lg dark:shadow-none bg-foreground/50 blurBack rounded-md w-full h-[100px] flex flex-col p-4 ">
              <h1 className="font1 text-xl text-muted-foreground flex gap-1 items-center">
                Available payouts (usd)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.info className="h-4 w-4 text-muted-foreground mb-[2px] hover:text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[100px]">
                        Your unpaid earnings. This can be scheduled or requested
                        by clicking &quot;Request a Payout&quot;
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h1>
              <h1 className="text-primary font-bold text-2xl font1 flex">
                {/* {nextPayout > 0 ? formatAsUSD(nextPayout) + " usd" : "--"} */}
                $
                <Counter from={0} to={nextPayout} />
              </h1>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------*/}
        <div className=" relative   h-[calc(100vh-286px)] ">
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                animate={{opacity: 1}}
                initial={{opacity: 0}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
                className="absolute top-0 left-0 w-full  z-30 pointer-events-none "
              >
                <div className="task-table-grad-top w-full h-20 z-30 pointer-events-none"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* {needsRevision.length + todo.length > 4 && (
            <>
              <div className=" absolute bottom-0 left-0 w-full pointer-events-none z-30 animate-in fade-in-0 duration-500">
                <div className="task-table-grad-bottom w-full h-20 z-30 pointer-events-none"></div>
              </div>
            </>
          )} */}

          <div className="flex flex-col  col-span-2 h-full    ">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-fit w-fit p-1 bg-blue-500/20 rounded-md">
                <Icons.todo className="h-4 w-4 text-blue-500" />
              </div>
              <h1 className="text-primary mt-1  font1 text-2xl">
                Ready to edit
                {todo.length + needsRevision.length > 0 &&
                  ` (${todo.length + needsRevision.length})`}
              </h1>
            </div>
            <div
              className="rounded-md h-full   flex flex-col gap-8   border p-2  dark:bg-foreground/50  overflow-scroll pb-6 relatives
             "
            >
              {(orderedTodo.length && orderedTodo.length > 0) ||
              (needsRevision.length && needsRevision.length > 0) ? (
                <div className="flex flex-col gap-2 ">
                  {[...needsRevision, ...orderedTodo].map((video, i) => {
                    const client = clients.find(
                      (c: any) => c.value === video.clientId
                    )!;

                    return (
                      <div key={video.videoNumber}>
                        <Link
                          href={`/edit/${video.videoNumber}`}
                          className="w-full border bg-foreground/80 blurBack shadow-lg dark:shadow-none p-4 rounded-md hover:bg-foreground  cursor-pointer grid gap-2 items-center  md:flex  justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {client?.icon && (
                              <client.icon className=" h-8 w-8 text-muted-foreground rounded-sm" />
                            )}
                            <span className="text-primary max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                              {video.title}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <h1 className=" text-primary">
                              #{video.videoNumber}
                            </h1>
                          </div>

                          {video.status === "needs revision" && (
                            <div className="text-red-500 bg-red-500/20 rounded-md p-2 text-sm">
                              Needs revision
                            </div>
                          )}

                          <h1
                            className={`
                                text-sm  md:ml-auto flex items-center gap-1
                                ${
                                  getTimeUntilDue(video.dueDate).isLate
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }
                              `}
                          >
                            <Clock className="h-4 w-4 " />
                            {getTimeUntilDue(video.dueDate).isLate
                              ? `Late by ${
                                  getTimeUntilDue(video.dueDate).value
                                }`
                              : `Due in ${
                                  getTimeUntilDue(video.dueDate).value
                                }`}
                          </h1>
                          <>
                            {video.priceUSD > 0 ? (
                              <>
                                <h1 className="text-lg w-fit bg-green-500/20 rounded-md p-2 text-green-500 items-center flex">
                                  + ${video.priceUSD}
                                  {video.payoutChangeRequest &&
                                    video.payoutChangeRequest.status ===
                                      "pending" && (
                                      <span className="text-xs text-green-500 ml-1">
                                        (requested $
                                        {video.payoutChangeRequest.value})
                                      </span>
                                    )}
                                </h1>
                              </>
                            ) : (
                              <h1 className="text-lg  bg-blue-500/20 rounded-md p-2 text-blue-500 items-center flex">
                                Demo
                              </h1>
                            )}
                          </>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <h1 className="text-xl text-muted-foreground text-center h-full w-full flex justify-center items-center flex-col border bg-foreground/50 blurBack rounded-md p-6">
                  <Icons.frown className="h-6 w-6 text-muted-foreground" />
                  No videos ready check back later
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------------------*/}

      <div className="relative h-full  flex flex-col ">
        <div className="flex justify-between w-full h-12  items-center">
          <div className="flex items-center gap-2 mb-2 ">
            <div className="h-fit w-fit p-1 bg-purple-500/20 rounded-md">
              <Icons.checkCircle className="h-4 w-4 text-purple-500" />
            </div>
            <h1 className="text-primary  mt-1  font1 text-2xl">
              Completed videos{completed.length > 0 && ` (${completed.length})`}
            </h1>
          </div>
          <div className="hidden md:flex items-center w-fit ml-auto  gap-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[10px] rounded-l-md rounded-r-none flex  items-center gap-1 bg-foreground/50 hover:bg-foreground/80 text-primary border  rounded-md"
                >
                  <Icons.filter className="h-4 w-4 text-muted-foreground" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" w-[100px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showPaid}
                  onCheckedChange={setShowPaid}
                >
                  Paid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showUnpaid}
                  onCheckedChange={setShowUnpaid}
                >
                  Unpaid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showDemos}
                  onCheckedChange={setShowDemos}
                >
                  Demos
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className=" bg-foreground/50 hover:bg-foreground/80 text-primary border  rounded-md overflow-hidden">
              <Button
                size="sm"
                className={`
                  ${
                    completedView === "grid"
                      ? "bg-primary/10 text-background hover:bg-primary/10"
                      : "bg-foreground/50 hover:bg-primary/5"
                  }
                   rounded-none
                  `}
                onClick={() => setCompletedView("grid")}
              >
                <Grid className="h-3 w-3 text-muted-foreground" />
              </Button>
              <Button
                size="sm"
                className={`
                  ${
                    completedView === "list"
                      ? "bg-primary/10 text-background hover:bg-primary/10"
                      : "bg-foreground/50 hover:bg-primary/5"
                  }
                  rounded-l-none rounded-r-md
                  `}
                onClick={() => setCompletedView("list")}
              >
                <List className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border dark:bg-foreground/50 blurBack  p-2 shadow-lg dark:shadow-none rounded-md  relative overflow-scroll  h-[316px]">
          {completed && completed.length > 0 ? (
            <>
              {completedView === "grid" && (
                <div className="flex gap-2 h-fit ">
                  {completed.map((video) => (
                    <VideoDisplayGrid video={video} key={video.videoNumber} />
                  ))}
                </div>
              )}
              {completedView === "list" && (
                <div className="flex gap-2 h-fit flex-col ">
                  {completed.map((video) => (
                    <VideoDisplayList video={video} key={video.videoNumber} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <h1 className="text-xl text-muted-foreground text-center h-full w-full flex justify-center items-center">
              No videos completed
            </h1>
          )}
        </div>

        <div className="  w-full  flex flex-col mt-4 h-[250px]">
          <div className="flex items-center gap-2 mb-2 ">
            <div className="h-fit w-fit p-1 bg-yellow-500/20 rounded-md">
              <Icons.profile className="h-4 w-4 text-yellow-500" />
            </div>
            <h1 className="text-primary  mt-1  font1 text-2xl">
              Client library
            </h1>
          </div>
          <ClientDisplay dummyUid={dummyUid} />
        </div>
      </div>
    </div>
  );
};

const ClientDisplay = ({dummyUid}: {dummyUid: string}) => {
  const editorData = EDITORS.find((editor) => editor.id === dummyUid);

  const assignedClients = clients.filter((client) =>
    editorData?.clients.includes(client.value)
  );

  return (
    <div className=" dark:bg-foreground/50  p-2 rounded-md relative overflow-scroll flex-grow gap-2 flex flex-col">
      {assignedClients.map((client) => (
        <Link
          key={client.id}
          href={"/client-page/" + client.value}
          className="border gap-2 p-2 shadow-lg dark:shadow-none rounded-md flex items-center hover:bg-foreground bg-foreground/80"
        >
          {client.icon && (
            <client.icon className="h-6 w-6 text-muted-foreground rounded-sm" />
          )}
          <h1 className="text-primary text-lg font-bold">{client.label}</h1>
        </Link>
      ))}
    </div>
  );
};

const VideoDisplayList = ({video}: {video: VideoData}) => {
  const client = clients.find((c: any) => c.value === video.clientId)!;

  const [postData, setPostData] = React.useState<Post | undefined>();

  useEffect(() => {
    const fetchVideo = async () => {
      if (video?.postIds && video?.postIds.length > 0) {
        const getDocRef = await getDoc(doc(db, "posts", video?.postIds[0]));

        if (getDocRef.exists()) {
          setPostData(getDocRef.data() as Post);
        }
      }
    };
    fetchVideo();

    return () => {
      setPostData(undefined);
    };
  }, [video]);

  const [loadVideo, setLoadVideo] = React.useState(false);

  const {isVisible, targetRef} = useIsVisible(
    {
      root: null,
      rootMargin: "10px",
      threshold: 1,
    },
    false
  );

  useEffect(() => {
    if (isVisible) {
      setLoadVideo(true);
    } else {
      return;
    }
  }, [isVisible]);

  const getTimeUntilDue = (dueDate: Timestamp) => {
    const now = new Date();
    const diffTime = dueDate.seconds * 1000 - now.getTime();
    const diffHours = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60));
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      if (diffHours < 24) {
        return {isLate: true, value: `${diffHours}h`};
      }
      return {isLate: true, value: `${diffDays}d`};
    }

    if (diffHours < 24) {
      return {isLate: false, value: `${diffHours}h`};
    }
    return {isLate: false, value: `${diffDays}d`};
  };

  return (
    <Link
      href={`/edit/${video.videoNumber}`}
      className="w-full border bg-foreground/80 blurBack shadow-lg dark:shadow-none p-4 rounded-md hover:bg-foreground  cursor-pointer grid gap-2 items-center  md:flex  justify-between"
    >
      <div className="flex items-center gap-2">
        {client?.icon && (
          <client.icon className=" h-8 w-8 text-muted-foreground rounded-sm" />
        )}
        <span className="text-primary max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {video.title}
        </span>
        <span className="text-muted-foreground">•</span>
        <h1 className=" text-primary">#{video.videoNumber}</h1>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className=" z-20 font1 text-white flex items-center">
          {video.priceUSD > 0 ? (
            <>
              {video.paid ? (
                <>
                  <Icons.check className="h-4 w-4 text-green-500 mr-1 mb-[2px]" />
                  paid
                </>
              ) : (
                <>
                  <Icons.close className="h-4 w-4 text-red-500 mr-1 mb-[2px]" />
                  unpaid
                </>
              )}
            </>
          ) : (
            <>demo</>
          )}
        </div>
        {video.priceUSD > 0 ? (
          <h1 className="text-lg w-fit bg-green-500/20 rounded-md p-2 text-green-500 items-center flex">
            + ${video.priceUSD}
            {video.payoutChangeRequest &&
              video.payoutChangeRequest.status === "pending" && (
                <span className="text-xs text-green-500 ml-1">
                  (requested ${video.payoutChangeRequest.value})
                </span>
              )}
          </h1>
        ) : (
          <h1 className="text-lg  bg-blue-500/20 rounded-md p-2 text-blue-500 items-center flex">
            Demo
          </h1>
        )}
      </div>
    </Link>
  );
};

const VideoDisplayGrid = ({video}: {video: VideoData}) => {
  const client = clients.find((c: any) => c.value === video.clientId)!;

  const [postData, setPostData] = React.useState<Post | undefined>();

  useEffect(() => {
    const fetchVideo = async () => {
      if (video?.postIds && video?.postIds.length > 0) {
        const getDocRef = await getDoc(doc(db, "posts", video?.postIds[0]));

        if (getDocRef.exists()) {
          setPostData(getDocRef.data() as Post);
        }
      }
    };
    fetchVideo();

    return () => {
      setPostData(undefined);
    };
  }, [video]);

  const [loadVideo, setLoadVideo] = React.useState(false);

  const {isVisible, targetRef} = useIsVisible(
    {
      root: null,
      rootMargin: "10px",
      threshold: 1,
    },
    false
  );

  useEffect(() => {
    if (isVisible) {
      setLoadVideo(true);
    } else {
      return;
    }
  }, [isVisible]);

  return (
    <Link
      href={`/edit/${video.videoNumber}`}
      key={video.videoNumber}
      ref={targetRef as any}
      className="aspect-[9/16] h-[300px] border hover:border-primary p-6 rounded-md hover:bg-muted/40 cursor-pointer relative group"
    >
      <div className=" w-full items-center gap-2 absolute bottom-0  rounded-md left-0 p-2  justify-between z-20 flex bg-background/20 blurBack">
        <h1 className="text-[12px] text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {video.title}
        </h1>
        {client?.icon && (
          <client.icon className=" h-6 w-6 text-muted-foreground rounded-sm" />
        )}
      </div>
      <div className="absolute top-0 left-0 w-full rounded-t-md flex justify-between p-2 bg-background/20 blurBack z-20">
        <div className=" font1 text-primary z-20 text-white">
          #{video.videoNumber}
        </div>

        <div className=" z-20 font1 text-white flex items-center">
          {video.priceUSD > 0 ? (
            <>
              {video.paid ? (
                <>
                  <Icons.check className="h-4 w-4 text-green-500 mr-1 mb-[2px]" />
                  paid
                </>
              ) : (
                <>
                  <Icons.close className="h-4 w-4 text-red-500 mr-1 mb-[2px]" />
                  unpaid
                </>
              )}
            </>
          ) : (
            <>demo</>
          )}
        </div>
      </div>

      {postData && (
        <>
          {postData.videoURL ? (
            <>
              <video
                className="w-full h-full object-cover absolute top-0 left-0 z-10 rounded-md"
                // controls
                preload={loadVideo ? "auto" : "none"}
                autoPlay={false}
              >
                <source src={postData.videoURL} type="video/mp4" />
              </video>

              <div className="h-full w-full z-[5] rounded-md flex justify-center items-center">
                <Icons.spinner className="animate-spin h-4 w-4 text-primary" />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-foreground absolute top-0 left-0 z-10 rounded-md flex justify-center items-center flex-col">
              <Icons.clock className="h-4 w-4  text-primary" />
              <h1 className="text-primary text-[12px]">Awaiting approval</h1>
            </div>
          )}
        </>
      )}
    </Link>
  );
};

const PayoutRequest = ({
  videos,
  editor,
}: {
  videos: VideoData[];
  editor: string;
}) => {
  const [date, setDate] = React.useState<Date>();

  const [open, setOpen] = React.useState(false);

  const [paymentMethod, setPaymentMethod] = React.useState<string>();

  const [selectedVideos, setSelectedVideos] = React.useState<string[]>(
    videos.map((video) => video.videoNumber)
  );

  const selectAll = () => {
    setSelectedVideos(videos.map((video) => video.videoNumber));
  };

  const deselectAll = () => {
    setSelectedVideos([]);
  };

  const [isLoading, setIsLoading] = React.useState(false);

  const {toast} = useToast();

  const {currentUser} = useAuth()!;

  const sendPayoutRequest = async () => {
    setIsLoading(true);
    // create a new doc in 'invoices' collection

    const invoice = {
      editor: editor,
      videos: selectedVideos,
      total: videos
        .filter((video) => selectedVideos.includes(video.videoNumber))
        .reduce((acc, video) => acc + video.priceUSD, 0),
      date: date,
      paid: false,
      method: paymentMethod,
    };

    // create a new doc in 'invoices' collection
    await addDoc(collection(db, "invoices"), invoice);
    const emailTemp = {
      subject: `💰💰 ${currentUser?.firstName} requested to be paid`,
      line_1: `${
        currentUser?.firstName
      } requested to be paid on ${date} The total amount is ${formatAsUSD(
        invoice.total
      )} usd`,
      line_2: `the invoice is for the following videos \n ${invoice.videos}`,
      action_url: `https://video-drive.vercel.app/manage`,
      to_email: "holtonpk@gmail.com",
    };

    await sendEmail(emailTemp);

    setOpen(false);

    setIsLoading(false);
    return toast({
      title: "Successfully sent payout requested",
      description:
        "We will process your request shortly, and will notify you once it's done",
    });
  };

  const sendEmail = async (emailTemp: any) => {
    const emailData = {
      service_id: "service_xh39zvd",
      template_id: "template_7ccloj9",
      user_id: "_xxtFZFU5RPJivl-9",
      template_params: emailTemp,
      accessToken: "rIezh-MOZPAh3KEMZWpa_",
    };
    try {
      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-[10px] rounded-l-md rounded-r-none flex  items-center gap-1 bg-foreground/50 hover:bg-foreground/80 text-primary border  rounded-md ml-auto"
        >
          <Banknote className="h-4 w-4 text-muted-foreground" />
          Request a Payout
        </Button>
      </DialogTrigger>
      {videos.length > 0 ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary ">Payout request</DialogTitle>
            <DialogDescription>
              Request or schedule a payout to your account
            </DialogDescription>
            <div className="h-2"></div>
            <div className="w-full  grid gap-4 bg-foreground border p-4 rounded-md">
              <div className="grid gap-2">
                <Label className="text-primary">Payout Method</Label>
                <Select onValueChange={(value) => setPaymentMethod(value)}>
                  <SelectTrigger className="w-full text-primary">
                    <SelectValue placeholder="Select a payout method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="wise">
                        <div className="flex items-center">
                          <Icons.wise className="h-6 w-6 mr-2 rounded-md" />
                          Wise
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal" className="flex items-center">
                        <div className="flex items-center">
                          <Icons.paypal className="h-6 w-6 mr-2" />
                          Paypal
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid  gap-4">
                {/* <div className="grid gap-2">
                  <Label className="text-primary">Sent to </Label>
                  <Input
                    className="text-primary "
                    placeholder="@username or email"
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label className="text-primary">Payout Date</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-primary",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-1">
                <div className="w-full justify-between flex items-center">
                  <Label className="text-primary">
                    Videos to be paid({selectedVideos.length})
                  </Label>
                  {selectedVideos.length === videos.length ? (
                    <button
                      onClick={deselectAll}
                      className="text-primary text-[12px] underline"
                    >
                      deselect all
                    </button>
                  ) : (
                    <button
                      onClick={selectAll}
                      className="text-primary text-[12px] underline"
                    >
                      Select all
                    </button>
                  )}
                </div>

                <div className="max-h-[200px]  h-fit   overflow-scroll border p-1 rounded-md flex flex-col gap-1">
                  {videos.map((video) => (
                    <VideoSelector
                      video={video}
                      key={video.videoNumber}
                      selectedVideos={selectedVideos}
                      setSelectedVideos={setSelectedVideos}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-1">
                <Label className="text-primary">Total Payout</Label>

                <h1 className="text-primary font-bold">
                  {formatAsUSD(
                    videos
                      .filter((video) =>
                        selectedVideos.includes(video.videoNumber)
                      )
                      .reduce((acc, video) => acc + video.priceUSD, 0)
                  ) + " usd"}
                </h1>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              variant={"outline"}
              className="text-primary"
            >
              Cancel
            </Button>
            <Button onClick={sendPayoutRequest}>
              Send Request
              {isLoading && (
                <Icons.spinner className="animate-spin h-4 w-4 ml-2" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary ">
              No Payout available
            </DialogTitle>
            <DialogDescription>
              All your payments are up to date
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              variant={"outline"}
              className="text-primary"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

const VideoSelector = ({
  video,
  selectedVideos,
  setSelectedVideos,
}: {
  video: VideoData;
  selectedVideos: string[];
  setSelectedVideos: (videos: string[]) => void;
}) => {
  const client = clients.find((c: any) => c.value === video.clientId)!;

  const isSelected = selectedVideos.includes(video.videoNumber);

  const toggleSelected = () => {
    if (selectedVideos.includes(video.videoNumber)) {
      setSelectedVideos(selectedVideos.filter((v) => v !== video.videoNumber));
    } else {
      setSelectedVideos([...selectedVideos, video.videoNumber]);
    }
  };

  return (
    <button
      onClick={toggleSelected}
      className={`flex items-center gap-2  p-2 rounded-md justify-between hover:bg-background w-full
        ${isSelected ? "bg-background" : ""}
        `}
    >
      <div className="flex items-center gap-1">
        <Checkbox id="terms" checked={isSelected} />

        <h1 className="text-primary mx-2">#{video.videoNumber}</h1>
        <client.icon className="h-6 w-6 text-muted-foreground rounded-md" />
      </div>
      <h1 className="text-primary">{formatAsUSD(video.priceUSD)}</h1>
    </button>
  );
};

function formatAsUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
