import React, {useEffect} from "react";
import {VideoData} from "@/config/data";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "@/config/firebase";
import {Switch} from "@/components/ui/switch";
import {Icons} from "@/components/icons";

export const FeedPreview = ({
  clientInfo,
  displayedVideo,
  setDisplayedVideo,
}: {
  clientInfo: any;
  displayedVideo: VideoData | undefined;
  setDisplayedVideo: React.Dispatch<
    React.SetStateAction<VideoData | undefined>
  >;
}) => {
  const [ClientData, setClientData] = React.useState<VideoData[] | null>(null);

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
      setClientData(clientDataLocal);
      const largestVideoNumber = Math.max(
        ...clientDataLocal.map((post: any) => post.videoNumber)
      );
    });
    return () => unsubscribe();
  }, [clientInfo]);

  const [aspectRatio, setAspectRatio] = React.useState<"vertical" | "square">(
    "square"
  );
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  return (
    <div
      className={`flex flex-col rounded-md shadow-lg  w-fit mx-auto overflow-hidden ${
        theme === "dark"
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
    >
      <div className="h-fit ">
        <div className="flex justify-between items-start ">
          <div className="flex items-center gap-2 p-2">
            {clientInfo.icon && (
              <div className="relative rounded-full overflow-hidden h-16 w-16 bg-white border">
                <clientInfo.icon className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className=" text-2xl font-bold">{clientInfo.label}</h1>
          </div>
          {/* add toggle for light and dark mode */}
          <div className="flex items-center gap-2 p-2">
            <Icons.sun className="w-4 h-4 " />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
            <Icons.moon className="w-4 h-4 " />
          </div>
        </div>
      </div>
      <div className="flex w-fit  p-1  h-fit ">
        <button
          onClick={() =>
            setAspectRatio(aspectRatio === "vertical" ? "square" : "vertical")
          }
          className={` px-4 py-1 h-fit ${
            aspectRatio === "square" ? "border-b-2 " : "hover:bg-primary/10"
          }`}
        >
          Main Feed
        </button>
        <button
          onClick={() => setAspectRatio("vertical")}
          className={` px-4 py-1  h-fit ${
            aspectRatio === "vertical" ? "border-b-2 " : "hover:bg-primary/10"
          }`}
        >
          Reels
        </button>
      </div>
      <div className="grid grid-cols-3 gap-[1px]  max-w-[600px]">
        {ClientData?.map((video) => (
          <button
            onClick={() => setDisplayedVideo(video)}
            className={` ${
              aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-square"
            } 
            ${theme === "dark" ? "bg-white/10" : "bg-black/10"}
            w-full relative`}
            key={video.id}
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center p-2">
                #{video.videoNumber} missing thumbnail
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
