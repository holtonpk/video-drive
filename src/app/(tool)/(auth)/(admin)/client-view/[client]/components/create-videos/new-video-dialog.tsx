import React, {useEffect} from "react";
import {doc, getDoc, setDoc, writeBatch} from "firebase/firestore";
import {db} from "@/config/firebase";
import {NewVideo, NewVideoContext} from "./create-videos";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {Input} from "@/components/ui/input";
import {MANAGER_USERS, EDITOR_USERS} from "@/config/data";
import {PersonSelector} from "./video-fields/person-selector";
import {DateSelector} from "./video-fields/date-selector";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {VideoProvider} from "./create-videos";
import {Span} from "next/dist/trace";
import {UserData} from "@/context/user-auth";
import {BulkSchedule} from "./bulk-video-dialog";
import {useToast} from "@/components/ui/use-toast";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ValidateVideo = (video: NewVideo) => {
  const errors: string[] = [];
  if (!video.title) {
    errors.push("title");
  }
  if (!video.manager) {
    errors.push("manager");
  }
  if (!video.editor) {
    errors.push("editor");
  }
  if (!video.postDate) {
    errors.push("postDate");
  }
  if (!video.scriptDueDate) {
    errors.push("scriptDueDate");
  }
  if (!video.dueDate) {
    errors.push("dueDate");
  }
  if (video.priceUSD === undefined) {
    errors.push("priceUSD");
  }
  return errors;
};

export const NewVideoDialog = ({
  clientInfo,
  currentVideoNumber,
  children,
}: {
  clientInfo: any;
  currentVideoNumber: number;
  children: React.ReactNode;
}) => {
  const [openVideoCreator, setOpenVideoCreator] =
    React.useState<boolean>(false);

  const GenerateBlankVideo = (newVideosLength: number): NewVideo => {
    return {
      title: "",
      id: Math.random().toString(36).substring(2, 15),
      // videoNumber: "8001",
      videoNumber: "new video " + Number(newVideosLength + 1).toString(),
      clientId: clientInfo.value,
      status: "draft",
      dueDate: undefined,
      postDate: undefined,
      scriptDueDate: undefined,
      notes: "",
      script: "",
      posted: false,
      editor: undefined,
      manager: undefined,
      priceUSD: undefined,
      isSaved: false,
      errors: [],
    };
  };

  const [newVideos, setNewVideos] = React.useState<NewVideo[] | undefined>(
    localStorage.getItem(`video_creator_${clientInfo.value}`)
      ? JSON.parse(
          localStorage.getItem(`video_creator_${clientInfo.value}`) || "[]"
        )
      : undefined
  );

  const [displayedVideo, setDisplayedVideo] = React.useState<
    string | undefined
  >(undefined);

  // Initialize from localStorage
  useEffect(() => {
    const storedVideos = localStorage.getItem(
      `video_creator_${clientInfo.value}`
    );
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      setNewVideos(parsedVideos);
      if (parsedVideos.length > 0) {
        setDisplayedVideo(parsedVideos[0].id);
      }
    } else {
      setNewVideos([GenerateBlankVideo(0)]);
      setDisplayedVideo(GenerateBlankVideo(0).id);
    }
  }, [clientInfo.value]);

  // Save to localStorage when videos change
  useEffect(() => {
    if (newVideos) {
      localStorage.setItem(
        `video_creator_${clientInfo.value}`,
        JSON.stringify(newVideos)
      );
    }
  }, [newVideos, clientInfo.value]);

  useEffect(() => {
    if (newVideos?.length == 1) {
      setDisplayedVideo(newVideos?.[0]?.id || undefined);
    }
  }, [newVideos]);

  const addVideo = () => {
    const newVideo = GenerateBlankVideo(
      (newVideos?.length && newVideos?.length) || 0
    );
    setNewVideos([...(newVideos || []), newVideo]);
    setDisplayedVideo(newVideo.id);
  };

  const [saving, setSaving] = React.useState<boolean>(false);

  const [openResetDialog, setOpenResetDialog] = React.useState<boolean>(false);

  const resetVideos = () => {
    localStorage.removeItem(`video_creator_${clientInfo.value}`);
    setNewVideos([GenerateBlankVideo(0)]);
    setDisplayedVideo(GenerateBlankVideo(0).id);
  };

  const {toast} = useToast();

  const saveVideos = async () => {
    if (newVideos) {
      setSaving(true);
      let allSaved = true;
      let updatedVideos = [...newVideos];
      let firstErrorVideo: string | undefined;
      let totalVideosSaved = 0;

      let newVideoNumber = currentVideoNumber + 1;
      for (const video of newVideos) {
        const videoErrors = ValidateVideo(video);
        if (videoErrors.length > 0) {
          const videoIndex = updatedVideos?.findIndex((v) => v.id === video.id);
          if (videoIndex !== -1) {
            console.log("errors founds", videoIndex);
            updatedVideos[videoIndex] = {...video, errors: videoErrors};
            if (!firstErrorVideo) {
              firstErrorVideo = video.id;
            }
          }
          allSaved = false;

          continue;
        } else {
          // remove video from updatedVideos
          updatedVideos = updatedVideos.filter((v) => v.id !== video.id);
        }

        try {
          const videoRef = doc(db, "videos", newVideoNumber.toString());
          await setDoc(
            videoRef,
            {
              ...video,
              videoNumber: newVideoNumber.toString(),
              postDate: video.postDate ? new Date(video.postDate) : undefined,
              scriptDueDate: video.scriptDueDate
                ? new Date(video.scriptDueDate)
                : undefined,
              dueDate: video.dueDate ? new Date(video.dueDate) : undefined,
            },
            {merge: true}
          );
          totalVideosSaved++;
          newVideoNumber++;
          const videoIndex = updatedVideos.findIndex((v) => v.id === video.id);
          if (videoIndex !== -1) {
            updatedVideos[videoIndex] = {...video, isSaved: true, errors: []};
          }
        } catch (error) {
          console.error("Error saving video:", video.id, error);
          allSaved = false;
        }
      }

      if (firstErrorVideo) {
        setDisplayedVideo(firstErrorVideo);
        setNewVideos(updatedVideos);
        toast({
          variant: "destructive",
          title: "Error saving video",
          description: "Please check the video and try again",
        });
      }
      if (allSaved) {
        toast({
          title: `${newVideos.length} new videos saved`,
          description: `You can now view them on the client view`,
        });
        setOpenVideoCreator(false);
        setNewVideos(undefined);
        localStorage.removeItem(`video_creator_${clientInfo.value}`);
      }

      if (totalVideosSaved > 0) {
        toast({
          title: `${totalVideosSaved} new video${
            totalVideosSaved > 1 ? "s" : ""
          } saved`,
          description: `You can now view them on the client view`,
        });
      }
      setSaving(false);
    }
  };

  const [peopleData, setPeopleData] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const peoplePromises = [...EDITOR_USERS, ...MANAGER_USERS].map(
          async (person) => {
            const dataSnap = await getDoc(doc(db, "users", person));
            return dataSnap.data() as UserData;
          }
        );

        const peopleData = await Promise.all(peoplePromises);
        const uniquePeopleData = peopleData.reduce((acc, current) => {
          const x = acc.find((item) => item.uid === current.uid);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as UserData[]);

        setPeopleData(uniquePeopleData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    if (!newVideos) {
      setNewVideos([GenerateBlankVideo(0)]);
      setDisplayedVideo(GenerateBlankVideo(0).id);
    }
  }, [newVideos]);

  return (
    <Dialog open={openVideoCreator} onOpenChange={setOpenVideoCreator}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-[1200px] max-h-[800px] bg-card dark:bg-muted/20 blurBack p-0">
        {newVideos && newVideos.length > 0 ? (
          <div className="grid grid-cols-[200px_1fr] ">
            <div className=" bg-primary/5 rounded-r-md  p-2 gap-1 grid grid-rows-[1fr_80px]">
              <div className="flex flex-col h-[300px] overflow-y-auto">
                {newVideos &&
                  newVideos.length > 0 &&
                  newVideos.map((video) => (
                    <button
                      key={video.id}
                      className={`px-2 py-1 text-primary rounded-md h-fit flex items-center justify-between gap-1 group relative
                    ${
                      video.id === displayedVideo
                        ? "bg-primary/10"
                        : "hover:bg-primary/5"
                    }
                    `}
                      onClick={() => setDisplayedVideo(video.id)}
                    >
                      <div className="flex items-center gap-1 text-primary">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                          {video.title || "untitled"}
                        </span>
                        {video.isSaved ? (
                          <span className="text-green-500 text-[12px]">
                            (saved)
                          </span>
                        ) : video.errors.length > 0 ? (
                          <span className="text-red-500 text-[12px] whitespace-nowrap">
                            (missing fields)
                          </span>
                        ) : (
                          <span className="text-red-500 text-[12px] whitespace-nowrap">
                            (unsaved)
                          </span>
                        )}
                      </div>

                      <Icons.chevronRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-2" />
                    </button>
                  ))}
              </div>
              <div className="flex flex-col gap-2 h-[80px] ">
                <Button
                  onClick={addVideo}
                  className="mx-auto  w-full  "
                  size={"sm"}
                >
                  <Icons.add className="h-5 w-5 mr-1" />
                  New video
                </Button>
                <BulkSchedule
                  clientInfo={clientInfo}
                  // this should be the biggest video number in the newVideos array
                  currentVideoNumber={newVideos?.length}
                  setNewVideos={setNewVideos}
                  newVideosFull={newVideos || []}
                />
              </div>
            </div>

            {displayedVideo && newVideos && (
              <NewVideoForm
                video={
                  newVideos.find((v) => v.id === displayedVideo) || newVideos[0]
                }
                newVideos={newVideos}
                setNewVideos={setNewVideos}
                setDisplayedVideo={setDisplayedVideo}
                key={displayedVideo}
                peopleData={peopleData}
                currentVideoNumber={currentVideoNumber}
                setOpenVideoCreator={setOpenVideoCreator}
              />
            )}
          </div>
        ) : (
          <div className="w-[300px] flex flex-col gap-2 mx-auto h-[300px] items-center justify-center">
            <Button
              onClick={addVideo}
              className="mx-auto  w-full  "
              size={"sm"}
            >
              <Icons.add className="h-5 w-5 mr-1" />
              New video
            </Button>
            <BulkSchedule
              clientInfo={clientInfo}
              // this should be the biggest video number in the newVideos array
              currentVideoNumber={
                newVideos?.length
                  ? Math.max(...newVideos.map((v) => Number(v.id)))
                  : 0
              }
              setNewVideos={setNewVideos}
              newVideosFull={newVideos || []}
            />
          </div>
        )}
        <div className="absolute -bottom-4 w-full translate-y-full flex flex-col gap-1 items-center ">
          {newVideos && newVideos.length > 1 && (
            <Button
              className="w-full dark:bg-primary bg-white text-black hover:bg-white/90"
              onClick={saveVideos}
            >
              {saving ? (
                <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Icons.uploadCloud className="h-5 w-5 mr-2" />
              )}
              Save all ({newVideos?.length || 0})
            </Button>
          )}
          <AlertDialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
            <AlertDialogTrigger>
              <Button
                variant={"ghost"}
                className="w-full dark:text-white dark:hover:text-white dark:hover:bg-white/60 text-card hover:bg-card/70 hover:text-card"
              >
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-primary">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-primary">
                  This will delete all unsaved videos
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant={"outline"}
                  className="text-primary"
                  onClick={() => {
                    setOpenResetDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    resetVideos();
                    setOpenResetDialog(false);
                  }}
                >
                  Reset
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NewVideoForm = ({
  video,
  newVideos,
  setNewVideos,
  setDisplayedVideo,
  peopleData,
  currentVideoNumber,
  setOpenVideoCreator,
}: {
  video: NewVideo;
  newVideos: NewVideo[];
  setNewVideos: (newVideos: NewVideo[] | undefined) => void;
  setDisplayedVideo: (videoNumber: string) => void;
  peopleData: UserData[] | undefined;
  currentVideoNumber: number;
  setOpenVideoCreator: (open: boolean) => void;
}) => {
  const [title, setTitle] = React.useState<string>(video.title);
  const [notes, setNotes] = React.useState<string>(video.notes);
  const [priceUSD, setPriceUSD] = React.useState<number | undefined>(
    video.priceUSD
  );

  const [saving, setSaving] = React.useState<boolean>(false);

  const errors = newVideos.find((v) => v.id === video.id)?.errors || [];

  const setErrors = (errors: string[]) => {
    setNewVideos(
      newVideos.map((v) => {
        if (v.id === video.id) {
          return {...v, errors};
        }
        return v;
      })
    );
  };

  const {toast} = useToast();

  const saveVideo = async () => {
    setSaving(true);
    const errors = ValidateVideo(video);
    if (errors.length > 0) {
      setErrors(errors);
      setSaving(false);
      toast({
        variant: "destructive",
        title: "Error saving video",
        description: "Please check the video and try again",
      });
      return;
    }
    const newVideoNumber = currentVideoNumber + 1;

    const videoRef = doc(db, "videos", newVideoNumber.toString());
    const videoData = newVideos.find((v) => v.id === video.id);
    await setDoc(videoRef, {
      ...videoData,
      videoNumber: newVideoNumber.toString(),
      // convert the dates from a string to a timestamp from "2025-05-22T05:00:00.000Z" to a timestamp
      postDate: video.postDate ? new Date(video.postDate) : undefined,
      scriptDueDate: video.scriptDueDate
        ? new Date(video.scriptDueDate)
        : undefined,
      dueDate: video.dueDate ? new Date(video.dueDate) : undefined,
    });
    setSaving(false);
    toast({
      title: "Video saved",
      description: "You can now view it on the client view",
    });

    // remove the video from the newVideos array

    const newVideosFiltered =
      newVideos.filter((v) => v.id !== video.id).length == 0
        ? undefined
        : newVideos.filter((v) => v.id !== video.id);

    setNewVideos(newVideosFiltered);
    if (!newVideosFiltered) {
      setOpenVideoCreator(false);
    }
  };

  const duplicateVideo = () => {
    const updatedNewVideos = [
      ...newVideos,
      {
        ...video,
        id: Math.random().toString(36).substring(2, 15),
        videoNumber: "new video " + (newVideos.length + 1).toString(),
        isSaved: false,
        title: video.title + " (copy)",
      },
    ];
    setNewVideos(updatedNewVideos);
    setDisplayedVideo(updatedNewVideos?.[updatedNewVideos.length - 1]?.id);
  };

  const deleteVideo = () => {
    const currentIndex = newVideos.findIndex((v) => v.id === video.id);
    const updatedNewVideos = newVideos.filter((v) => v.id !== video.id);
    setNewVideos(updatedNewVideos);
    setDisplayedVideo(
      updatedNewVideos?.[currentIndex === 0 ? 0 : currentIndex - 1]?.id
    );
  };

  return (
    <Card className="w-full  border-none  bg-transparent relative ">
      <div className=" w-full pt-2 px-4  flex items-center justify-between gap-4">
        {/* <CardTitle className="font-bold">
          Id <span className="text-blue-500">{video.id}</span>
        </CardTitle> */}

        <div className="gap-4 flex   w-full">
          <Button onClick={duplicateVideo} variant={"outline"}>
            <Icons.copy className="h-5 w-5 mr-2" />
            Duplicate
          </Button>

          {!video.isSaved && (
            <Button onClick={deleteVideo} variant={"outline"}>
              <Icons.trash className="h-5 w-5 mr-2" />
              Delete
            </Button>
          )}
          <Button
            onClick={saveVideo}
            disabled={video.isSaved}
            className="ml-auto"
          >
            {video.isSaved ? (
              <>
                <Icons.check className="h-5 w-5 mr-2" />
                Saved
              </>
            ) : (
              <>
                {saving ? (
                  <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Icons.uploadCloud className="h-5 w-5 mr-2" />
                )}
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-4 bg-transparent">
        <div className="grid  gap-4">
          <div className="grid gap-4">
            <div className="grid gap-1 h-fit">
              <Label htmlFor="client" className=" relative w-fit">
                Title
                {errors.find((e) => e === "title") && (
                  <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                    *Missing
                  </span>
                )}
              </Label>
              <Input
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  const newErrors = newTitle
                    ? errors.filter((e) => e !== "title")
                    : [...errors, "title"];
                  setNewVideos(
                    newVideos.map((v) => {
                      if (v.id === video.id) {
                        return {
                          ...v,
                          title: newTitle,
                          isSaved: false,
                          errors: newErrors,
                        };
                      }
                      return v;
                    })
                  );
                }}
                className={`${
                  errors.find((e) => e === "title") && "border-red-500"
                }`}
                placeholder="Title"
              />
            </div>

            <div className="grid gap-1 h-fit">
              <Label htmlFor="client" className=" relative w-fit">
                Notes
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => {
                  const newNotes = e.target.value;
                  setNotes(newNotes);
                  setNewVideos(
                    newVideos.map((v) => {
                      if (v.id === video.id) {
                        return {
                          ...v,
                          notes: newNotes,
                          isSaved: false,
                        };
                      }
                      return v;
                    })
                  );
                }}
                className="mt-2"
                placeholder="Notes"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Post Date
                  {errors.find((e) => e === "postDate") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <DateSelector
                  video={video}
                  newVideos={newVideos}
                  setNewVideos={setNewVideos}
                  label="Post Date"
                  field="postDate"
                  errors={errors}
                  onValueChange={(value) => {
                    const newErrors = value
                      ? errors.filter((e) => e !== "postDate")
                      : [...errors, "postDate"];
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.id === video.id) {
                          return {
                            ...v,
                            postDate: value ? new Date(value) : undefined,
                            isSaved: false,
                            errors: newErrors,
                          };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Script Due
                  {errors.find((e) => e === "scriptDueDate") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <DateSelector
                  video={video}
                  newVideos={newVideos}
                  setNewVideos={setNewVideos}
                  label="Script Due"
                  field="scriptDueDate"
                  errors={errors}
                  onValueChange={(value) => {
                    const newErrors = value
                      ? errors.filter((e) => e !== "scriptDueDate")
                      : [...errors, "scriptDueDate"];
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.id === video.id) {
                          return {
                            ...v,
                            scriptDueDate: value ? new Date(value) : undefined,
                            isSaved: false,
                            errors: newErrors,
                          };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Editing Due
                  {errors.find((e) => e === "dueDate") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <DateSelector
                  video={video}
                  newVideos={newVideos}
                  setNewVideos={setNewVideos}
                  label="Editing Due"
                  field="dueDate"
                  errors={errors}
                  onValueChange={(value) => {
                    const newErrors = value
                      ? errors.filter((e) => e !== "dueDate")
                      : [...errors, "dueDate"];
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.id === video.id) {
                          return {
                            ...v,
                            dueDate: value ? new Date(value) : undefined,
                            isSaved: false,
                            errors: newErrors,
                          };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Manager
                  {errors.find((e) => e === "manager") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <PersonSelector
                  selectedPerson={video.manager}
                  newVideos={newVideos}
                  video={video}
                  setNewVideos={setNewVideos}
                  peopleIDs={MANAGER_USERS}
                  label="Manager"
                  field="manager"
                  errors={errors}
                  // MANAGER_USERS must contain the id of the person in peopleData
                  peopleData={peopleData?.filter((p) =>
                    MANAGER_USERS.includes(p.uid)
                  )}
                  onValueChange={(value) => {
                    const newErrors = value
                      ? errors.filter((e) => e !== "manager")
                      : [...errors, "manager"];
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.id === video.id) {
                          return {
                            ...v,
                            manager: value,
                            isSaved: false,
                            errors: newErrors,
                          };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Editor
                  {errors.find((e) => e === "editor") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <PersonSelector
                  selectedPerson={video.editor}
                  newVideos={newVideos}
                  video={video}
                  setNewVideos={setNewVideos}
                  peopleIDs={EDITOR_USERS}
                  label="Editor"
                  field="editor"
                  errors={errors}
                  // people data should not have duplicates identified by uid
                  peopleData={peopleData?.filter((p) =>
                    EDITOR_USERS.includes(p.uid)
                  )}
                  onValueChange={(value) => {
                    const newErrors = value
                      ? errors.filter((e) => e !== "editor")
                      : [...errors, "editor"];
                    setNewVideos(
                      newVideos.map((v) => {
                        if (v.id === video.id) {
                          return {
                            ...v,
                            editor: value,
                            isSaved: false,
                            errors: newErrors,
                          };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label className=" relative w-fit">
                  Editor Payout
                  {errors.find((e) => e === "editorPayout") && (
                    <span className="text-red-500 text-[12px] absolute top-0 -right-1 translate-x-full">
                      *Missing
                    </span>
                  )}
                </Label>
                <Input
                  placeholder="$"
                  onChange={(e) => {
                    const value = e.target.value;
                    const newPrice = value === "" ? undefined : Number(value);

                    if (
                      value === "" ||
                      (newPrice !== undefined && !isNaN(newPrice))
                    ) {
                      setPriceUSD(newPrice);
                      const newErrors =
                        value === "" ||
                        (typeof newPrice === "number" && !isNaN(newPrice))
                          ? errors.filter((e) => e !== "priceUSD")
                          : [...errors, "priceUSD"];
                      setNewVideos(
                        newVideos.map((v) => {
                          if (v.id === video.id) {
                            return {
                              ...v,
                              priceUSD: newPrice,
                              isSaved: false,
                              errors: newErrors,
                            };
                          }
                          return v;
                        })
                      );
                    }
                  }}
                  value={priceUSD?.toString() ?? ""}
                  className={`${
                    errors.find((e) => e === "priceUSD") && "border-red-500"
                  } `}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
