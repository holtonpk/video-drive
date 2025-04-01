"use client";
import React, {useEffect, useState} from "react";

import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {VideoData, PayoutChangeRequest, UpdatedAt} from "@/config/data";
import {
  onSnapshot,
  query,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {
  formatDateFromTimestamp,
  formatDateFromTimestampToTime,
  formatDayMonthDay,
  formatAsUSD,
  convertTimestampToDate,
} from "@/lib/utils";
import {DatabaseZap} from "lucide-react";

type ClientDataByWeek = {
  weekRange: string;
  weekNumber: number;
  posts: VideoData[];
};

const VectorizeData = ({clientInfo}: {clientInfo: any}) => {
  const [totalVideos, setTotalVideos] = useState<number>();

  const [ClientData, setClientData] = React.useState<ClientDataByWeek[] | null>(
    null
  );

  useEffect(() => {
    const clientDataQuery = query(
      collection(db, "videos"),
      where("clientId", "==", clientInfo.value)
    );
    const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
      const clientDataLocal: VideoData[] = [];
      querySnapshot.forEach((doc) => {
        clientDataLocal.push(doc.data() as VideoData);
      });

      const largestVideoNumber = Math.max(
        ...clientDataLocal.map((post: any) => post.videoNumber)
      );
      setTotalVideos(clientDataLocal.length);
      //   setCurrentVideoNumber(largestVideoNumber);

      // Get the earliest and latest post date in UTC
      const earliestPostDate = new Date(
        Math.min(...clientDataLocal.map((post) => post.postDate.seconds * 1000))
      );
      earliestPostDate.setUTCHours(0, 0, 0, 0);

      // Group posts by week starting from the earliest post's week (Monday to Sunday)
      const groupedByWeek: {[key: number]: VideoData[]} = {};
      clientDataLocal.forEach((post) => {
        const postDateUTC = new Date(post.postDate.seconds * 1000);
        postDateUTC.setUTCHours(0, 0, 0, 0);
        const postWeek = getWeekNumber(postDateUTC, earliestPostDate);

        console.log(
          "dd",
          post.videoNumber,
          postWeek,
          convertTimestampToDate(post.postDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
        if (!groupedByWeek[postWeek]) {
          groupedByWeek[postWeek] = [];
        }
        groupedByWeek[postWeek].push(post);
      });

      const clientDataByWeek: ClientDataByWeek[] = Object.keys(groupedByWeek)
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort weeks in ascending order
        .map((week) => ({
          weekNumber: parseInt(week),
          weekRange: getWeekRange(new Date(earliestPostDate), parseInt(week)),
          posts: groupedByWeek[parseInt(week)],
        }));

      setClientData(clientDataByWeek);
    });
    return () => unsubscribe();
  }, [clientInfo]);

  const getWeekNumber = (date: Date, startDate: Date) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(
      (date.getTime() - startDate.getTime()) / oneDayMilliseconds
    );

    const daysOffset = (startDate.getUTCDay() + 6) % 7; // Adjust for Monday being the first day of the week
    return Math.ceil((daysDifference - daysOffset + 1) / 7);
  };

  // Helper function to get the week range (start and finish date)
  const getWeekRange = (startDate: Date, weekNumber: number) => {
    const startOfWeek = new Date(startDate);
    const endOfWeek = new Date(startDate);
    startOfWeek.setUTCDate(
      startOfWeek.getUTCDate() +
        (weekNumber - 1) * 7 -
        startOfWeek.getUTCDay() +
        2
    );
    endOfWeek.setUTCDate(
      endOfWeek.getUTCDate() +
        (weekNumber - 1) * 7 -
        startOfWeek.getUTCDay() +
        9
    );
    return `${startOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${endOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="text-primary bg-transparent border-primary ml-auto mr-2"
        >
          <DatabaseZap className="mr-2 h-4 w-4" />
          Vectorize Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        {ClientData ? (
          <ExportBody clientData={ClientData} clientInfo={clientInfo} />
        ) : (
          <>loading</>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VectorizeData;

const ExportBody = ({
  clientData,
  clientInfo,
}: {
  clientData: ClientDataByWeek[];
  clientInfo: any;
}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const toggleWeekSelection = (weekNumber: number) => {
    setSelectedWeeks(
      (prev) =>
        prev.includes(weekNumber)
          ? prev.filter((num) => num !== weekNumber) // Remove if already selected
          : [...prev, weekNumber] // Add if not selected
    );
  };

  const selectAllWeeks = () => {
    setSelectedWeeks(clientData.map((week) => week.weekNumber));
  };

  const deselectAllWeeks = () => {
    setSelectedWeeks([]);
  };

  interface Timestamp {
    nanoseconds: number;
    seconds: number;
  }

  const videoDataFields: (keyof VideoData)[] = [
    "videoNumber",
    "title",
    "postDate",
    "script",
    "priceUSD",
    "clientId",
    "editor",
    "paid",
    "posted",
  ];

  const [selectedFields, setSelectedFields] = useState<(keyof VideoData)[]>([
    "videoNumber",
    "title",
    "script",
  ]);

  const toggleFieldSelection = (fieldValue: keyof VideoData) => {
    setSelectedFields(
      (prev) =>
        prev.includes(fieldValue)
          ? prev.filter((value) => value !== fieldValue) // Remove if already selected
          : [...prev, fieldValue] // Add if not selected
    );
  };

  const selectAllFields = () => {
    setSelectedFields(videoDataFields);
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const [isExporting, setIsExporting] = useState(false);

  const ExportData = async () => {
    setIsExporting(true);
    let FilteredData: Partial<VideoData>[] = [];

    const weeks = clientData.filter((week) =>
      selectedWeeks.includes(week.weekNumber)
    );

    weeks.forEach((weekData) => {
      weekData.posts.forEach((video) => {
        // console.log("vv", video);
        // Pick only the selected fields from each video
        const videoData = selectedFields.reduce<Record<string, any>>(
          (acc, field) => {
            if (field === "postDate") {
              acc[field] = convertTimestampToDate(
                video[field as keyof VideoData] as Timestamp
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } else if (field == "script") {
              console.log("ss", acc);
              acc[field] =
                typeof video?.script == "object"
                  ? video.script.blocks
                      .flatMap((block) => block.data.text)
                      .join(" ")
                  : video.script || "no script";
            } else {
              acc[field] = video[field as keyof VideoData];
            }
            return acc;
          },
          {}
        );

        FilteredData.push(videoData);
      });
    });

    console.log("FilteredData", FilteredData);

    setIsExporting(false);
  };

const createEmbedding = async (textToEmbed:string) =>{

  // let response = await fetch ()


}



  return (
    <div className="flex flex-col">
      <h1 className="text-primary text-2xl font-bold mb-2">
        Select data to Vectorize
      </h1>

      <div className="flex justify-between items-center">
        <h1 className="text-primary font-bold mb-2">
          Select weeks ({selectedWeeks.length})
        </h1>
        {clientData.length === selectedWeeks.length ? (
          <button onClick={deselectAllWeeks} className="text-blue-600">
            deselect all
          </button>
        ) : (
          <button onClick={selectAllWeeks} className="text-blue-600">
            select all
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 overflow-scroll rounded-md max-h-[200px] border p-2">
        {[...clientData].reverse().map((week, i) => {
          return (
            <button
              onClick={() => toggleWeekSelection(week.weekNumber)}
              key={i}
              className={` hover:bg-muted p-1 rounded-md text-left flex items-center gap-2 group
                 ${
                   selectedWeeks?.includes(week.weekNumber)
                     ? "text-primary"
                     : "text-primary/50"
                 }
                
                `}
            >
              <div
                className={`h-4 w-4 border rounded-[2px]  relative flex items-center justify-center
                 ${
                   selectedWeeks?.includes(week.weekNumber)
                     ? ""
                     : "group-hover:bg-primary/60"
                 }
                
                `}
              >
                {selectedWeeks?.includes(week.weekNumber) && (
                  <Icons.check className="text-primary" />
                )}
              </div>{" "}
              Week {week.weekNumber} -- {week.weekRange}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-primary font-bold mb-2">
          Select Fields ({selectedFields.length})
        </h1>
        {videoDataFields.length === selectedFields.length ? (
          <button onClick={deselectAllFields} className="text-blue-600">
            deselect all
          </button>
        ) : (
          <button onClick={selectAllFields} className="text-blue-600">
            select all
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 overflow-scroll rounded-md max-h-[200px] border p-2 mb-4">
        {videoDataFields.map((field: any) => (
          <button
            key={field}
            onClick={() => toggleFieldSelection(field)}
            className={`hover:bg-muted p-1 rounded-md text-left flex items-center gap-2 group ${
              selectedFields.includes(field)
                ? "text-primary"
                : "text-primary/50"
            }`}
          >
            <div
              className={`h-4 w-4 border rounded-[2px] relative flex items-center justify-center ${
                selectedFields.includes(field)
                  ? ""
                  : "group-hover:bg-primary/60"
              }`}
            >
              {selectedFields.includes(field) && (
                <Icons.check className="text-primary" />
              )}
            </div>
            {field}
          </button>
        ))}
      </div>
      <DialogFooter>
        <Button onClick={ExportData}>
          {isExporting ? (
            <>
              <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
              Vectorize Data
            </>
          ) : (
            "Export Data"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};
