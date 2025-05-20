"use client";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import VideoPlayer from "@/components/ui/video-player";
import {Plus} from "lucide-react";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {db} from "@/config/firebase";
import {doc, setDoc, getDoc, onSnapshot} from "firebase/firestore";
import {useAuth} from "@/context/user-auth";
import {UserData} from "@/context/user-auth";
import {cn} from "@/lib/utils";

const Whiteboard = () => {
  type WhiteBoard = {
    title: string;
    boxes?: Box[];
  };

  type Box = {
    id: number;
    text: string;
    videos: {id: number; url: string}[];
    links?: {id: number; url: string}[];
  };

  const initialBoxes: Box[] = [
    {
      id: 1,
      text: "Rebrand these for blaze and give cta. fix tone up a bit. change branding",
      videos: [
        {
          id: 1,
          url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FFINAL%203038.mp4?alt=media&token=52748394-d8d7-46eb-a128-df9c88545f21",
        },
        {
          id: 2,
          url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FFINAL%203036.mp4?alt=media&token=2a7b20e8-97f9-4e45-bf0a-b940ddc2e915",
        },
      ],
    },
    {
      id: 2,
      text: "same style as this just change the writing to making fun of guru style",
      videos: [
        {
          id: 1,
          url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FFINAL%202%203030.mp4?alt=media&token=e92923f9-c1f5-428b-a9f9-6488042db0ab",
        },
      ],
      links: [
        {
          id: 1,
          url: "https://www.instagram.com/reel/DH_3VZ9vNgB/?igsh=M29naHp6ejVsajE4",
        },
      ],
    },
  ];

  const initialWhiteboard: WhiteBoard = {
    title: "5/19 Meeting Whiteboard",
    boxes: initialBoxes,
  };

  const auth = useAuth();
  const [whiteboard, setWhiteboard] = useState<WhiteBoard>(initialWhiteboard);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  // Load whiteboard data from Firestore
  useEffect(() => {
    if (!auth?.currentUser) return;

    const whiteboardRef = doc(db, "whiteboards", "5-19");

    // Set up real-time listener
    const unsubscribe = onSnapshot(whiteboardRef, (doc) => {
      if (doc.exists()) {
        setWhiteboard(doc.data() as WhiteBoard);
      } else {
        // If no document exists, create one with initial data
        setDoc(whiteboardRef, initialWhiteboard);
      }
    });

    return () => unsubscribe();
  }, [auth?.currentUser]);

  // Save whiteboard data to Firestore
  const saveToFirestore = async (data: WhiteBoard) => {
    if (!auth?.currentUser) return;

    try {
      const whiteboardRef = doc(db, "whiteboards", "5-19");
      await setDoc(whiteboardRef, data);
    } catch (error) {
      console.error("Error saving whiteboard:", error);
    }
  };

  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };

  const handleNewIdea = () => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: [
        ...(whiteboard.boxes || []),
        {
          id: (whiteboard.boxes?.length || 0) + 1,
          text: "",
          videos: [],
          links: [],
        },
      ],
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleDeleteIdea = (id: number) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.filter((box) => box.id !== id),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleUpdateIdea = (id: number, text: string) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.map((box) =>
        box.id === id ? {...box, text} : box
      ),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleAddVideo = (boxId: number, url: string) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.map((box) =>
        box.id === boxId
          ? {...box, videos: [...box.videos, {id: box.videos.length + 1, url}]}
          : box
      ),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleDeleteVideo = (boxId: number, videoId: number) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.map((box) =>
        box.id === boxId
          ? {...box, videos: box.videos.filter((video) => video.id !== videoId)}
          : box
      ),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleAddLink = (boxId: number, url: string) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.map((box) =>
        box.id === boxId
          ? {
              ...box,
              links: [
                ...(box.links || []),
                {id: (box.links?.length || 0) + 1, url},
              ],
            }
          : box
      ),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const handleDeleteLink = (boxId: number, linkId: number) => {
    const newWhiteboard = {
      ...whiteboard,
      boxes: whiteboard.boxes?.map((box) =>
        box.id === boxId
          ? {...box, links: box.links?.filter((link) => link.id !== linkId)}
          : box
      ),
    };
    setWhiteboard(newWhiteboard);
    saveToFirestore(newWhiteboard);
  };

  const exportWhiteboard = () => {
    const blob = new Blob([JSON.stringify(whiteboard)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${whiteboard.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportWhiteboard = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedWhiteboard = JSON.parse(content) as WhiteBoard;

        // Validate the imported data structure
        if (
          !importedWhiteboard.title ||
          !Array.isArray(importedWhiteboard.boxes)
        ) {
          throw new Error("Invalid whiteboard format");
        }

        setWhiteboard(importedWhiteboard);
        saveToFirestore(importedWhiteboard);
      } catch (error) {
        console.error("Error importing whiteboard:", error);
        alert("Invalid whiteboard file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full relative")}>
      <div className={cn("flex justify-between items-center w-full")}>
        <h1 className={cn("text-3xl font-bold text-left text-primary")}>
          {whiteboard.title}
        </h1>
        {/* <div className={cn("flex gap-2")}>
          <Button
            onClick={() => {
              setWhiteboard(initialWhiteboard);
              saveToFirestore(initialWhiteboard);
            }}
            variant="outline"
            className={cn(
              "bg-primary/10 text-primary/80 hover:bg-primary/20 transition-all duration-300"
            )}
          >
            Eject
          </Button>
          <Button
            onClick={exportWhiteboard}
            variant="outline"
            className={cn(
              "bg-primary/10 text-primary/80 hover:bg-primary/20 transition-all duration-300"
            )}
          >
            Export
          </Button>
          <div className={cn("relative")}>
            <input
              type="file"
              accept=".json"
              onChange={handleImportWhiteboard}
              className={cn("hidden")}
              id="import-whiteboard"
            />
            <Button
              variant="outline"
              className={cn(
                "bg-primary/10 text-primary/80 hover:bg-primary/20 transition-all duration-300"
              )}
              onClick={() =>
                document.getElementById("import-whiteboard")?.click()
              }
            >
              Import
            </Button>
          </div>
        </div> */}
      </div>
      {whiteboard.boxes?.map((box) => (
        <div
          key={box.id}
          className={cn(
            "text-primary border p-2 border-primary/20 rounded-md min-h-fit grid grid-cols-2 gap-4 h-[400px] relative"
          )}
        >
          <div className={cn("absolute top-0 right-0 flex gap-2")}>
            {selectedBox === box.id && (
              <Button
                onClick={() => handleDeleteIdea(box.id)}
                variant="outline"
                className={cn(
                  "text-primary/80 bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                )}
                size="icon"
              >
                <Icons.trash className={cn("h-4 w-4")} />
              </Button>
            )}
            <Button
              onClick={() => {
                selectedBox === box.id
                  ? setSelectedBox(null)
                  : setSelectedBox(box.id);
              }}
              variant="outline"
              className={cn(
                "text-primary/80 bg-primary/10 hover:bg-primary/20 transition-all duration-300"
              )}
              size="icon"
            >
              {selectedBox === box.id ? (
                <Icons.showPassword className={cn("h-4 w-4")} />
              ) : (
                <Icons.pencil className={cn("h-4 w-4")} />
              )}
            </Button>
          </div>

          <Textarea
            className={cn(
              "text-primary bg-primary/10 p-2 border-none rounded-md text-2xl"
            )}
            value={box.text}
            onChange={(e) => handleUpdateIdea(box.id, e.target.value)}
          />
          <div className={cn("flex flex-col gap-4")}>
            <div className={cn("flex gap-4")}>
              {box.videos.map((video) => (
                <div
                  key={video.id}
                  className={cn("relative h-[400px] aspect-[9/16]")}
                >
                  <VideoPlayer
                    videoUrl={video.url}
                    title={video.id.toString()}
                  />
                  {selectedBox === box.id && (
                    <Button
                      onClick={() => handleDeleteVideo(box.id, video.id)}
                      variant="outline"
                      className={cn(
                        "absolute top-2 right-2 text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                      )}
                      size="icon"
                    >
                      <Icons.trash className={cn("h-4 w-4")} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {selectedBox === box.id && (
              <div className={cn("flex gap-2 mt-10")}>
                <input
                  type="text"
                  placeholder="Enter video URL"
                  className={cn(
                    "flex-1 p-2 rounded-md bg-primary/10 text-primary"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement;
                      handleAddVideo(box.id, input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(
                      `input[placeholder="Enter video URL"]`
                    ) as HTMLInputElement;
                    handleAddVideo(box.id, input.value);
                    input.value = "";
                  }}
                  variant="outline"
                >
                  Add Video
                </Button>
              </div>
            )}

            <div className={cn("flex flex-col gap-2")}>
              {box.links?.map((link) => (
                <div key={link.id} className={cn("w-full flex flex-col gap-2")}>
                  <div className={cn("relative")}>
                    <Link
                      href={link.url}
                      target="_blank"
                      className={cn(
                        "text-sm w-full text-muted-foreground hover:text-primary hover:underline transition-all duration-300 items-center p-2 rounded-md bg-primary/10 gap-4 grid grid-cols-[16px_1fr]"
                      )}
                    >
                      <img
                        src={getFavIcon(link.url)}
                        alt="Favicon"
                        className={cn("w-4 h-4")}
                      />
                      <div
                        className={cn(
                          "w-full overflow-hidden text-ellipsis whitespace-nowrap"
                        )}
                      >
                        {link.url}
                      </div>
                    </Link>
                    {selectedBox === box.id && (
                      <Button
                        onClick={() => handleDeleteLink(box.id, link.id)}
                        variant="outline"
                        className={cn(
                          "absolute top-1/2 -right-8 -translate-y-1/2 text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                        )}
                        size="icon"
                      >
                        <Icons.trash className={cn("h-4 w-4")} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedBox === box.id && (
              <div className={cn("flex gap-2 ")}>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  className={cn(
                    "flex-1 p-2 rounded-md bg-primary/10 text-primary"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement;
                      handleAddLink(box.id, input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(
                      `input[placeholder="Enter link URL"]`
                    ) as HTMLInputElement;
                    handleAddLink(box.id, input.value);
                    input.value = "";
                  }}
                  variant="outline"
                >
                  Add Link
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      <Button onClick={handleNewIdea} className={cn("mt-4")}>
        Add Idea
      </Button>
    </div>
  );
};

export default Whiteboard;

const getFavIcon = (url: string) => {
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}`;
};
