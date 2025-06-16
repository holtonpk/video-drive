"use client";

import {useState, useCallback, useRef, useEffect, Fragment} from "react";

import {Input} from "@/components/ui/input";

import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";

import {doc, setDoc, Timestamp} from "firebase/firestore";
import {VideoData, AssetFile, Chat, UploadedVideo} from "@/config/data";

import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import {useVideo} from "../../data/video-context";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Camera} from "lucide-react";

export const AssetDetails = ({
  file,
  onDelete,
}: {
  file: UploadedVideo;
  onDelete?: (id: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(file.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const {video, setVideo} = useVideo()!;
  const {currentUser} = useAuth()!;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(file.title);
  }, [file.title]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (editedTitle.trim() !== file.title) {
      await updateTitle(file.id, editedTitle.trim());
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setEditedTitle(file.title);
      setIsEditing(false);
    }
  };

  const updateTitle = async (id: string, newTitle: string) => {
    try {
      // Update in Firebase
      const updatedVideos = video.uploadedVideos?.map((video) =>
        video.id === id ? {...video, title: newTitle} : video
      );

      await setDoc(
        doc(db, "videos", video.videoNumber.toString()),
        {
          uploadedVideos: updatedVideos,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
        },
        {merge: true}
      );

      // Update local state
      setVideo(
        (prev) =>
          ({
            ...prev,
            uploadedVideos: updatedVideos,
          } as VideoData)
      );
    } catch (error) {
      console.error("Error updating title:", error);
      // Revert the title if there's an error
      setEditedTitle(file.title);
    }
  };

  return (
    <div className="flex flex-col border  p-4 min-w-[300px] gap-2 w-full rounded-0 bg-muted/40 rounded-md  h-fit  text-primary ">
      {/* <div className="flex justify-between items-center bg-muted/50 h-fit p-2">
          <h1 className="text-lg font-bold px-2 ">Asset Details</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} size={"sm"} className="w-fit">
                <Icons.trash className={`w-4 h-4 mr-2`} />
                Delete Asset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-primary">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{editedTitle}". This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-primary">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(file.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div> */}
      <div className="flex flex-col gap-4 p-4 pt-0 h-full ">
        {file.needsRevision && (
          <div className="flex items-center gap-2 bg-red-500/10 p-2 rounded-md">
            <h1 className="text-primary/50 text-[12px] text-red-500">
              Revision Notes: {file.revisionNotes}
            </h1>
          </div>
        )}
        <div className="grid gap-1 h-fit ">
          <h1>File Name</h1>
          <div className="flex justify-between items-center w-full">
            <Input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
            />
          </div>
        </div>
        <div className="grid gap-1 h-fit col-span-2 ">
          <h1>Thumbnail</h1>
          <div className="grid grid-cols-2 gap-4">
            <Button variant={"outline"} size={"sm"}>
              <Icons.upload className={`w-4 h-4 mr-2`} />
              Upload Thumbnail
            </Button>
            <Button variant={"outline"} size={"sm"}>
              <Camera className={`w-4 h-4 mr-2`} />
              Capture Current Frame
            </Button>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size={"sm"} className="w-full">
              <Icons.trash className={`w-4 h-4 mr-2`} />
              Delete Asset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-primary">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{editedTitle}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-primary">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete?.(file.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
