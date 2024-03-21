"use client";
import {VideoData} from "@/src/app/(tool)/video/[videoId]/data/data";
import {
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  collection,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import React, {useContext, createContext, useEffect, useState} from "react";

const NewVideoContext = createContext<NewVideoContextType | null>(null);

export function useNewVideo() {
  return useContext(NewVideoContext);
}

interface Props {
  children?: React.ReactNode;
}

interface NewVideoContextType {
  saveVideo: () => void;
  title: string;
  setTitle: (title: string) => void;
  videoNumber: string;
  setVideoNumber: (videoNumber: string) => void;
  client: string;
  setClient: (client: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dueDate: Date | undefined;
  setDueDate: (dueDate: Date | undefined) => void;
  notes: string;
  setNotes: (notes: string) => void;
  script: string;
  setScript: (script: string) => void;
  videoFile: string | null;
  setVideoFile: (videoFile: string | null) => void;
  assets: AssetType[];
  setAssets: (assets: AssetType[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  postDate: Date | undefined;
  setPostDate: (postDate: Date | undefined) => void;
  scriptDueDate: Date | undefined;
  setScriptDueDate: (scriptDueDate: Date | undefined) => void;
}
export type AssetType = {
  title: string;
  url: string;
};

export const NewVideoProvider = ({children}: Props) => {
  const [title, setTitle] = useState<string>("");
  const [videoNumber, setVideoNumber] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [postDate, setPostDate] = useState<Date | undefined>();
  const [scriptDueDate, setScriptDueDate] = useState<Date | undefined>();

  const [loading, setLoading] = useState<boolean>(false);

  const saveVideo = async () => {
    setLoading(true);
    const newVideo = {
      title,
      videoNumber,
      clientId: client,
      status,
      dueDate,
      notes,
      script,
      videoFile,
      updatedAt: new Date(),
      assets,
      postDate,
      scriptDueDate,
    };
    // create new video in firebase set doc name to videoNumber
    await setDoc(doc(db, "videos", videoNumber), newVideo);
    setLoading(false);
    window.location.reload();
  };

  const values = {
    scriptDueDate,
    setScriptDueDate,
    loading,
    setLoading,
    saveVideo,
    title,
    setTitle,
    videoNumber,
    setVideoNumber,
    client,
    setClient,
    status,
    setStatus,
    dueDate,
    setDueDate,
    notes,
    setNotes,
    script,
    setScript,
    videoFile,
    setVideoFile,
    assets,
    setAssets,
    postDate,
    setPostDate,
  };

  return (
    <NewVideoContext.Provider value={values}>
      {children}
    </NewVideoContext.Provider>
  );
};

export default NewVideoContext;
