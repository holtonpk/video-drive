"use client";
import React, {use} from "react";
import {useEffect} from "react";
import {VideoData, Post, EDITORS, clients} from "@/config/data";
import {Button} from "@/components/ui/button";
import {db} from "@/config/firebase";
import {Icons} from "@/components/icons";
import {
  query,
  collection,
  onSnapshot,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {UserData} from "@/context/user-auth";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {set} from "date-fns";

const ManagePage = () => {
  const [videos, setVideos] = React.useState<VideoData[] | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const clientDataQuery = query(
        collection(db, "videos"),
        orderBy("editor")
      );
      const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
        const clientDataLocal: VideoData[] = [];
        querySnapshot.forEach((doc) => {
          clientDataLocal.push(doc.data() as VideoData);
        });
        setVideos(clientDataLocal);
      });
    }

    fetchVideos();
  }, []);

  const [editors, setEditors] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const editorPromises = EDITORS.map(async (editor) => {
          const dataSnap = await getDoc(doc(db, "users", editor));
          return dataSnap.data() as UserData;
        });

        const editorData = await Promise.all(editorPromises);
        setEditors(editorData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchEditors();
  }, []);

  // console.log(videos);

  const sortedVideos = videos?.sort((a, b) => {
    const aTime = a.dueDate.seconds * 1e9 + a.dueDate.nanoseconds;
    const bTime = b.dueDate.seconds * 1e9 + b.dueDate.nanoseconds;
    return bTime - aTime; // Sort in descending order
  });

  const [editor, setEditor] = React.useState<string | undefined>();
  const [client, setClient] = React.useState<string | undefined>();

  const filteredVideos = sortedVideos?.filter((video) => {
    if (editor && video.editor !== editor) return false;
    if (client && video.clientId !== client) return false;
    return true;
  });

  const [amountVisible, setAmountVisible] = React.useState<number>(12);

  return (
    <div className="container mt-6 flex flex-col gap-6">
      <div className="flex items-center justify-center gap-6">
        {editors && editors.length > 0 && (
          <Select
            value={editor}
            onValueChange={(value) => {
              setEditor(value);
            }}
          >
            <SelectTrigger
              id="editor"
              className=" truncate w-[200px] mt-4  text-primary"
            >
              <SelectValue placeholder="Select an editor" />
            </SelectTrigger>
            <SelectContent className="bg-background ">
              {editors.map((option) => (
                <SelectItem
                  key={option.uid}
                  value={option.uid}
                  className="flex flex-nowrap"
                >
                  <div className="flex items-center">
                    <img
                      src={option.photoURL}
                      alt="editor"
                      className="h-6 w-6 rounded-full mr-2"
                    />
                    <span className="">{option.firstName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={client}
          onValueChange={(value) => {
            setClient(value);
          }}
        >
          <SelectTrigger
            id="editor"
            className=" truncate w-[200px] mt-4  text-primary"
          >
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent className="bg-background ">
            {clients.map((option) => (
              <SelectItem
                key={option.id}
                value={option.value}
                className="flex flex-nowrap"
              >
                <div className="flex items-center">
                  {option.icon && (
                    <option.icon className="mr-2 h-6 w-6 text-muted-foreground rounded-sm" />
                  )}
                  <span className="">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {videos && filteredVideos && editors && (
        <div className="grid grid-cols-6 gap-10">
          {filteredVideos.slice(0, amountVisible).map((video) => (
            <Video video={video} key={video.videoNumber} editors={editors} />
          ))}
        </div>
      )}
      <Button
        onClick={() => {
          setAmountVisible((prev) => prev + 6);
        }}
      >
        Load More
        <Icons.chevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ManagePage;

const Video = ({video, editors}: {video: VideoData; editors: UserData[]}) => {
  const [price, setPrice] = React.useState<number | undefined>(video.priceUSD);
  const [paid, setPaid] = React.useState<boolean>(video.paid || false);

  const editor = editors.find((editor) => editor.uid === video.editor);
  const client = clients.find((client) => client.value === video.clientId);

  const shouldShowUpdateButton =
    (video.paid ?? false) !== paid || video.priceUSD !== price;

  const [isLoading, setIsLoading] = React.useState(false);

  const saveUpdate = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "videos", video.videoNumber), {
        priceUSD: price,
        paid: paid,
      });
    } catch (error) {
      console.error("Error updating video: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full  aspect-[1/2] border rounded-md relative">
      <div className="absolute top-0 left-0 w-full bg-background/20 blurBack p-2 flex justify-between rounded-t-md">
        <div className="text-primary text-2xl ">#{video.videoNumber}</div>
        {client && client.icon && (
          <client.icon className=" h-6 w-6 text-muted-foreground rounded-sm" />
        )}
      </div>
      {video.uploadedVideos && video.uploadedVideos[0]?.videoURL ? (
        <video
          className="w-full aspect-[9/16]"
          src={video.uploadedVideos[0]?.videoURL}
          controls
        ></video>
      ) : (
        <div className=" bg-foreground w-full aspect-[9/16] flex items-center justify-center text-primary">
          video not uploaded
        </div>
      )}
      <div className="p-2 flex flex-col overflow-hidden gap-2">
        <p className="text-primary whitespace-nowrap overflow-hidden text-ellipsis">
          {video.title}
        </p>
        {editor && (
          <div className="flex items-center">
            <img
              src={editor.photoURL}
              alt="editor"
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-primary">{editor.firstName}</span>
          </div>
        )}

        <Input
          placeholder="$"
          type="number"
          className="text-primary"
          value={price}
          onChange={(e) => {
            setPrice(e.target.valueAsNumber);
          }}
        />

        <div className="flex items-center space-x-2">
          <Switch id="paid" checked={paid} onCheckedChange={setPaid} />
          <Label
            htmlFor="airplane-mode"
            className={`${paid ? "text-green-500" : "text-red-500"}`}
          >
            {paid ? "Paid" : "Not Paid"}
          </Label>
        </div>
        {shouldShowUpdateButton && (
          <Button onClick={saveUpdate}>
            Update
            {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          </Button>
        )}
      </div>
    </div>
  );
};
