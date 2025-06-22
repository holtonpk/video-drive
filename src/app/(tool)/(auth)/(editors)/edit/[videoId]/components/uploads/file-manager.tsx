"use client";

import {useState, useCallback, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useDropzone} from "react-dropzone";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {VideoData, UploadedVideo} from "@/config/data";
import {AssetDetails} from "./asset-details";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import {useVideo} from "../../data/video-context";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {app} from "@/config/firebase";
import {Progress} from "@/components/ui/progress";
import {MediaPlayer} from "./media-player";
import {MediaListItem} from "./file-list-item";

type ActiveUpload = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: "video" | "image";
  progress: number;
  uploadTask: any;
};

export const MediaManager = ({
  setIsDragging,
  isDragging,
}: {
  setIsDragging: (isDragging: boolean) => void;
  isDragging: boolean;
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const {video, setVideo} = useVideo()!;
  const {currentUser} = useAuth()!;
  const [activeUploads, setActiveUploads] = useState<ActiveUpload[]>([]);

  const isEmpty =
    (video.uploadedVideos?.length === 0 ||
      video.uploadedVideos?.length === undefined) &&
    activeUploads.length === 0;

  async function onFileChange(files: File[]) {
    const newUploads: ActiveUpload[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      fileName: file.name,
      fileSize: Math.round(file.size / 1024 / 1024),
      fileType: file.type.startsWith("video/") ? "video" : "image",
      progress: 0,
      uploadTask: null,
    }));

    setActiveUploads((prev) => [...prev, ...newUploads]);

    // Upload all files in parallel
    await Promise.all(
      files.map(async (file, index) => {
        try {
          await saveFileToFirebase(file, newUploads[index].id);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      })
    );
  }

  async function saveFileToFirebase(file: File, uploadId: string) {
    console.log("saving file to firebase");
    const storage = getStorage(app);
    const storageRef = ref(storage, `video/${file.name}`);
    // Start the file upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Update the upload task in state
    setActiveUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId ? {...upload, uploadTask} : upload
      )
    );

    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Update progress for this specific upload
          setActiveUploads((prev) =>
            prev.map((upload) =>
              upload.id === uploadId
                ? {...upload, progress: Math.round(progress)}
                : upload
            )
          );
        },
        (error) => {
          console.error(error);
          if (error.code === "storage/canceled") {
            console.log("Upload was cancelled by user");
            resolve(null);
          } else {
            reject(error);
          }
        },
        async () => {
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);

            // Get the latest state of video.uploadedVideos
            const videoDoc = await getDoc(
              doc(db, "videos", video.videoNumber.toString())
            );
            const currentUploadedVideos = videoDoc.data()?.uploadedVideos || [];

            // Create new uploaded video object
            const newUploadedVideo = {
              id: currentUploadedVideos.length + 1,
              title: file.name,
              videoURL: fileUrl,
              size: Math.round(file.size / 1024 / 1024),
            };

            // Update Firestore with the new video
            await setDoc(
              doc(db, "videos", video.videoNumber.toString()),
              {
                uploadedVideos: [...currentUploadedVideos, newUploadedVideo],
                updatedAt: {date: new Date(), user: currentUser?.firstName},
                status: "done",
                videoReviewed: [],
              },
              {
                merge: true,
              }
            );

            // Update local state
            setVideo(
              (prev) =>
                ({
                  ...prev,
                  uploadedVideos: [...currentUploadedVideos, newUploadedVideo],
                } as VideoData)
            );

            // Remove the completed upload from activeUploads
            setActiveUploads((prev) =>
              prev.filter((upload) => upload.id !== uploadId)
            );
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  const cancelUpload = (uploadId: string) => {
    setActiveUploads((prev) => {
      const upload = prev.find((u) => u.id === uploadId);
      if (upload?.uploadTask) {
        try {
          upload.uploadTask.cancel();
        } catch (error) {
          console.log("Error cancelling upload:", error);
        }
      }
      return prev.filter((u) => u.id !== uploadId);
    });
  };

  const deleteUploadedVideo = async (uploadedVideoId: string) => {
    const updatedUploadedVideos = video.uploadedVideos?.filter(
      (video) => video.id !== uploadedVideoId
    );
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        uploadedVideos: updatedUploadedVideos,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
        status:
          updatedUploadedVideos?.length === 0 && video.status === "done"
            ? "todo"
            : video.status === "needs revision"
            ? "needs revision"
            : "done",
      },
      {
        merge: true,
      }
    );
    setVideo(
      (prev) =>
        ({
          ...prev,
          uploadedVideos: video.uploadedVideos?.filter(
            (video) => video.id !== uploadedVideoId
          ),
        } as VideoData)
    );
    setSelectedFile(video.uploadedVideos?.[0].id || "");
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 w-full container relative z-50 h-full">
      <UploadArea onUpload={onFileChange} setIsDragging={setIsDragging} />

      <div
        className={`w-full h-fit
        ${
          isEmpty || !selectedFile
            ? "flex flex-col "
            : " hidden md:grid md:grid-cols-[500px_1fr]"
        }
        `}
      >
        <div className="flex flex-col w-full rounded-md   border    h-fit bg-foreground/40 blurBack text-primary">
          {!isEmpty && (
            <div className="flex justify-between items-center bg-muted/50  p-2">
              <h1 className="text-lg font-bold px-2">
                Upload Manager{" "}
                {(!isEmpty &&
                  `(${
                    video?.uploadedVideos?.length || 0 + activeUploads.length
                  })`) ||
                  ""}
              </h1>
              <UploadButton onUpload={onFileChange} />
            </div>
          )}
          {!isEmpty && (
            <div className="flex flex-col gap-2 mt-3  h-[350px] ">
              <div className="flex flex-col gap-2 pt-0 p-2 h-full overflow-y-auto max-h-[350px]">
                {video.uploadedVideos?.map((file: UploadedVideo) => (
                  <MediaListItem
                    key={file.id}
                    file={file}
                    isSelected={selectedFile === file.id}
                    onSelect={setSelectedFile}
                  />
                ))}
                {activeUploads.map((upload) => (
                  <ActiveUploadPreview
                    key={upload.id}
                    file={upload}
                    onCancel={() => cancelUpload(upload.id)}
                  />
                ))}
              </div>
            </div>
          )}
          {isEmpty && (
            <>
              <input
                type="file"
                ref={inputRef}
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    await onFileChange(Array.from(e.target.files));
                  }
                }}
                accept="video/*,image/*"
                multiple
                className="hidden"
              />

              <button
                className="flex flex-col items-center gap-4 py-4 h-fit  cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <div className="flex items-center justify-center p-4 rounded-full border dark:bg-muted/50">
                  <Icons.video
                    className={`w-8 h-8 mx-auto transition-all duration-300  ${
                      isDragging
                        ? "text-[#34F4AF]"
                        : "text-primary/60 group-hover:text-primary "
                    }`}
                  />
                </div>
                <h1
                  className={`text-xl text-center  transition-all duration-300 font-bold  ${
                    isDragging
                      ? "text-[#34F4AF]"
                      : "text-primary/60 group-hover:text-primary "
                  }`}
                >
                  Drop completed video here
                </h1>
                <p className="text-sm text-center text-primary/50">
                  .MP4, .MOV, .JPG, .JPEG, .PNG, up to 100mb
                </p>
                <div className="border px-4 py-2 rounded-md  flex items-center gap-2">
                  <Icons.upload className="w-4 h-4" />
                  Select Files
                </div>
              </button>
            </>
          )}
        </div>
        {!isEmpty && (
          <>
            {selectedFile && (
              <div className="grid  border  rounded-r-md grid-cols-[auto_1fr] items-center">
                <div className="w-full">
                  <MediaPlayer
                    file={
                      (video.uploadedVideos?.find(
                        (file) => file.id === selectedFile
                      ) as UploadedVideo) ||
                      (video.uploadedVideos?.[0] as UploadedVideo)
                    }
                  />

                  <div className="md:hidden flex flex-col gap-4 mt-2 ">
                    {video.uploadedVideos?.map((file) => (
                      <MediaPlayer
                        key={file.id}
                        file={
                          (video.uploadedVideos?.find(
                            (file) => file.id === selectedFile
                          ) as UploadedVideo) ||
                          (video.uploadedVideos?.[0] as UploadedVideo)
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full  rounded-r-md h-fit p-2 ">
                  <AssetDetails
                    file={
                      (video.uploadedVideos?.find(
                        (file) => file.id === selectedFile
                      ) as UploadedVideo) ||
                      (video.uploadedVideos?.[0] as UploadedVideo)
                    }
                    // onChatUpdate={handleChatUpdate}
                    onDelete={deleteUploadedVideo}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Upload components
const UploadArea = ({
  onUpload,
  setIsDragging,
}: {
  onUpload: (files: File[]) => void;
  setIsDragging: (isDragging: boolean) => void;
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsDragging(false);
      try {
        await onUpload(acceptedFiles);
      } finally {
        setIsDragging(false);
      }
    },
    [onUpload]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    noClick: true, // Don't trigger click events
    noKeyboard: true, // Don't trigger keyboard events
  });

  // Global drag event handlers
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set dragging to false if we're leaving the window
      if (!e.relatedTarget) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      console.log("handleDrop===================");
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        // Filter for video and image files
        const mediaFiles = files.filter(
          (file) =>
            file.type.startsWith("video/") ||
            file.type.startsWith("image/") ||
            [
              ".mp4",
              ".mov",
              ".avi",
              ".webm",
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".webp",
            ].some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        if (mediaFiles.length > 0) {
          onUpload(mediaFiles);
        }
      }
    };

    // Add event listeners to the document
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    // Clean up
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [onUpload]);

  return <></>;
};

const UploadButton = ({onUpload}: {onUpload: (files: File[]) => void}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload(Array.from(files));
      } finally {
        setIsUploading(false);
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*,image/*"
        multiple
        className="hidden"
      />
      <Button
        onClick={handleClick}
        disabled={isUploading}
        size="sm"
        variant="outline"
        className={` disabled:opacity-50 disabled:cursor-not-allowed w-full`}
      >
        {isUploading ? (
          <>
            <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
            <p>Uploading Media...</p>
          </>
        ) : (
          <>
            <Icons.add className="w-4 h-4 mr-2" />
            Add Media
          </>
        )}
      </Button>
    </div>
  );
};

const ActiveUploadPreview = ({
  file,
  onCancel,
}: {
  file: ActiveUpload;
  onCancel: () => void;
}) => {
  return (
    <div
      className={`flex flex-col gap-1 p-2 w-full border group rounded-md transition-all duration-300 border-primary/10`}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border rounded-[6px] flex items-center justify-center">
          {file.fileType === "video" ? (
            <Icons.video className="w-4 h-4" />
          ) : (
            <Icons.camera className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-primary">{file.fileName}</h1>
          <h1 className="text-primary/50 text-[12px]">{file.fileSize} mb</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-6 w-6"
          onClick={onCancel}
        >
          <Icons.close className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-[1fr_30px] gap-2 w-full items-center">
        <Progress value={file.progress} className="w-full h-2" />
        <span className="text-sm text-primary/50">{file.progress}%</span>
      </div>
    </div>
  );
};
