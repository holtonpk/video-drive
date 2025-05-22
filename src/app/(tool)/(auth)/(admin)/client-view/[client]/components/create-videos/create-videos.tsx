"use client";

import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";

import {NewVideoDialog} from "./new-video-dialog";
import {EDITOR_USERS, MANAGER_USERS} from "@/config/data";
import {UserData} from "@/context/user-auth";
import {doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {getDoc} from "firebase/firestore";

export type NewVideo = {
  title: string;
  id: string;
  videoNumber: string;
  clientId: string;
  status: string;
  dueDate: Date | undefined;
  postDate: Date | undefined;
  scriptDueDate: Date | undefined;
  priceUSD: number | undefined;
  notes: string;
  script: string;
  posted: boolean;
  editor: string | undefined;
  manager: string | undefined;
  isSaved: boolean;
  errors: string[];
};

export const CreateVideo = ({
  clientInfo,
  currentVideoNumber,
}: {
  clientInfo: any;
  currentVideoNumber: number;
}) => {
  return (
    <div className="flex items-center gap-2 w-fit h-fit ">
      <NewVideoDialog
        clientInfo={clientInfo}
        currentVideoNumber={currentVideoNumber}
      >
        <Button className="w-fit ">
          <Icons.add className="h-5 w-5 mr-2" />
          New Video
        </Button>
      </NewVideoDialog>
    </div>
  );
};

type NewVideoContextType = {
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
  setVideo: (video: NewVideo) => void;
};

export const NewVideoContext = React.createContext<NewVideoContextType | null>(
  null
);

interface VideoProviderProps {
  children: React.ReactNode;
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (videos: NewVideo[]) => void;
  setVideo: (video: NewVideo) => void;
}
// Provider component
export const VideoProvider = ({
  children,
  video,
  newVideos,
  setNewVideos,
  setVideo,
}: VideoProviderProps) => {
  return (
    <NewVideoContext.Provider
      value={{video, newVideos, setNewVideos, setVideo}}
    >
      {children}
    </NewVideoContext.Provider>
  );
};
