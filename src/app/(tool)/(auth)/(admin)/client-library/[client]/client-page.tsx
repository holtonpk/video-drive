"use client";

import React, {useEffect} from "react";
import {clients} from "@/config/data";
import {ADMIN_USERS, EDITORS, Post, VideoData} from "@/config/data";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import {LinkButton} from "@/components/ui/link";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Video} from "lucide-react";
import {useAuth, UserData} from "@/context/user-auth";
import {Icons} from "@/components/icons";
import {Editor} from "@/src/app/(tool)/(auth)/(admin)/client-library/[client]/description/description-edit";
import {db, app} from "@/config/firebase";
import edjsHTML from "editorjs-html";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {Switch} from "@/components/ui/switch";

import {
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {OutputData} from "@editorjs/editorjs";
import {ALL_USERS, ClientInfo} from "@/config/data";

type Idea = {
  id: string;
  user: string;
  description: OutputData;
  clientId: string;
  uploads: UploadedFile[];
  isUsed: boolean;
};

const ClientPage = ({client}: {client: string}) => {
  const [clientInfo, setClientInfo] = React.useState<ClientInfo>();

  const [userData, setUsersData] = React.useState<UserData[]>();

  const clientInfoHard = clients.find((c: any) => c.value === client);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Promise.all(
          ALL_USERS.map(async (user) => {
            const userSnap = await getDoc(doc(db, "users", user));
            return userSnap.data() as UserData; // Ensure type casting if needed
          })
        );
        setUsersData(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [ideas, setIdeas] = React.useState<Idea[]>([]);

  useEffect(() => {
    // fetch ideas from firebase where clientId === client

    const clientIdeaDataQuery = query(
      collection(db, "ideas"),
      where("clientId", "==", client)
    );
    const unsubscribe = onSnapshot(clientIdeaDataQuery, (querySnapshot) => {
      const ideas: Idea[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ideas.push({
          id: doc.id,
          user: data.user,
          description: data.description,
          clientId: data.clientId,
          uploads: data.uploads,
          isUsed: data.isUsed || false,
        });
      });
      setIdeas(ideas);
    });

    return () => unsubscribe();
  }, [client]);

  useEffect(() => {
    // get assets from firebase
    const clientDocRef = doc(db, "clients", client);
    const unsubscribe = onSnapshot(clientDocRef, (doc) => {
      const data = doc.data();
      setClientInfo(data as ClientInfo);
    });

    return () => unsubscribe();
  }, [client]);

  ideas.sort((a, b) => {
    if (a.isUsed && !b.isUsed) return 1;
    if (!a.isUsed && b.isUsed) return -1;
    return 0;
  });

  return (
    <div className="relative z-10">
      <div className="flex w-full h-16  relative">
        <div className="flex items-center gap-4 text-primary  w-fit justify-center mx-auto ">
          <div className="flex ">
            <div className="flex gap-2">
              {clientInfoHard && (
                <clientInfoHard.icon className="h-10 w-10 rounded-lg" />
              )}
              <span className="font-bold text-4xl ">{clientInfo?.label}</span>
            </div>

            {/* <p className="max-w-[400px] text-muted-foreground">
            {clientInfo?.description}
          </p> */}
          </div>
        </div>
      </div>
      {userData && clientInfo ? (
        <div className="container flex flex-col z-[99] overflow-hidden h-[calc(100vh-128px)] ">
          <div className="grid grid-cols-2 gap-8   ">
            <div className="flex flex-col gap-1 w-full dark:bg-foreground/20 bg-foreground/20 border rounded-md overflow-hidden">
              {ideas && ideas.length > 0 ? (
                <>
                  <div className="flex justify-between items-center h-16 dark:bg-foreground/20 bg-foreground p-4">
                    <h1 className="text-xl font-bold text-primary">
                      Video Ideas
                    </h1>
                    <CreateIdea client={client} />
                  </div>

                  <ScrollArea className="flex flex-col  w-full  gap-4    px-4 h-[calc(100vh-240px)]  overflow-scroll pb-0 ">
                    <div className="flex flex-col gap-4 py-2">
                      {ideas.map((idea) => (
                        <IdeaRow
                          key={idea.id}
                          idea={idea}
                          userData={userData}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 flex-col gap-4">
                  <p className="text-muted-foreground">No ideas yet</p>
                  <CreateIdea client={client} />
                </div>
              )}
            </div>
            <Assets client={client} clientInfo={clientInfo} />

            {/* <VideoInspirations /> */}
          </div>
        </div>
      ) : (
        <>Not found</>
      )}
    </div>
  );
};

export default ClientPage;

type Asset = {
  name: string;
  url: string;
  type: "img" | "video";
};

const Assets = ({
  client,
  clientInfo,
}: {
  client: string;
  clientInfo: ClientInfo;
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(20);
  const [uploads, setUploads] = React.useState<Asset[]>();

  useEffect(() => {
    // get assets from firebase
    const clientDocRef = doc(db, "clients", client);
    const unsubscribe = onSnapshot(clientDocRef, (doc) => {
      const data = doc.data();
      setUploads(data?.assets);
    });

    return () => unsubscribe();
  }, [client]);

  const [showDelete, setShowDelete] = React.useState(false);

  const deleteAsset = async (asset: Asset) => {
    // delete asset from firebase
    // update the client doc
    const newUploads = uploads?.filter((upload) => upload.url !== asset.url);
    setUploads(newUploads as Asset[]);
    updateDoc(doc(db, "clients", client), {
      assets: newUploads,
    });
  };

  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const [isDownloadingAll, setIsDownloadingAll] =
    React.useState<boolean>(false);

  const downloadAsset = async (asset: Asset) => {
    setIsDownloading(true);

    // download asset
    try {
      const response = await fetch(asset.url);
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = asset.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
    setIsDownloading(false);
  };

  const downloadAllAssetsAsZip = async () => {
    if (!uploads) return;
    setIsDownloadingAll(true);

    const zip = new JSZip();

    try {
      // Loop through assets and add each to the zip
      for (const asset of uploads) {
        const response = await fetch(asset.url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${asset.name}, status: ${response.status}`
          );
        }
        const blob = await response.blob();
        zip.file(asset.name, blob); // Add the file to the zip
      }

      // Generate the zip and trigger download
      const zipBlob = await zip.generateAsync({type: "blob"});
      saveAs(zipBlob, "assets.zip"); // Use a library like `file-saver` for triggering downloads
    } catch (error) {
      console.error("Error downloading assets as zip:", error);
    }

    setIsDownloadingAll(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full dark:bg-foreground/20 bg-foreground/20 h-[calc(100vh-240px)]  border rounded-md overflow-hidden ">
      {clientInfo && clientInfo.assets && clientInfo.assets.length > 0 ? (
        <>
          <div className="flex justify-between items-center h-16 dark:bg-foreground/20 bg-foreground p-4">
            <h1 className="text-xl font-bold text-primary">Assets</h1>
            <div className="flex gap-2">
              {uploads && uploads.length > 0 && (
                <Button
                  onClick={downloadAllAssetsAsZip}
                  size="sm"
                  className="mr-2 text-[12px]"
                >
                  Download All ({uploads.length})
                  {isDownloadingAll ? (
                    <Icons.spinner className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Icons.download className="h-4 w-4 ml-2" />
                  )}
                </Button>
              )}
              <AddAsset
                setUploads={setUploads}
                uploads={uploads}
                setIsUploading={setIsUploading}
                setUploadProgress={setUploadProgress}
                client={client}
              />
            </div>
          </div>

          <ScrollArea className="flex flex-col  w-full  gap-4    px-4 h-[calc(100vh-240px)]  overflow-scroll pb-0 ">
            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-4 gap-2">
                {uploads &&
                  uploads.map((upload) => (
                    <div
                      key={upload.name}
                      className={`w-full aspect-square relative  text-foreground border rounded-md  flex items-center  justify-between  group overflow-hidden`}
                    >
                      {upload.type === "img" ? (
                        <img src={upload.url} className="w-full  " />
                      ) : (
                        <video
                          controls
                          src={upload.url}
                          className="w-full h-full object-cover"
                        />
                      )}

                      <div className="  justify-center items-center absolute bg-foreground/40 blurBackSmall h-10 top-0 w-full hidden group-hover:flex">
                        <AlertDialog
                          open={showDelete}
                          onOpenChange={setShowDelete}
                        >
                          <AlertDialogTrigger asChild>
                            <Button variant={"ghost"}>
                              <Icons.trash className="h-5 w-5 text-primary " />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <h1 className="text-primary">Delete Asset</h1>
                            </AlertDialogHeader>
                            <AlertDialogDescription>
                              Are you sure you want to delete this Asset?
                            </AlertDialogDescription>
                            <div className="flex gap-4 justify-end">
                              <Button
                                onClick={() => setShowDelete(false)}
                                variant={"ghost"}
                                className="text-primary"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => deleteAsset(upload)}
                                variant={"destructive"}
                              >
                                Delete
                              </Button>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          onClick={() => downloadAsset(upload)}
                          variant={"ghost"}
                        >
                          {isDownloading ? (
                            <Icons.spinner className="h-5 w-5 animate-spin text-primary" />
                          ) : (
                            <Icons.download className=" h-5 w-5 text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              {isUploading && (
                <div className="w-full text-foreground  rounded-md p-4 flex  items-center justify-between gap-4 absolute bottom-0 left-0 bg-foreground/40">
                  <h1 className="text-primary font-bold whitespace-nowrap">
                    Uploading File
                  </h1>
                  <Progress
                    value={uploadProgress}
                    className="dark:bg-muted-foreground bg-muted-foreground/20"
                  />
                  <span className="text-primary w-[80px] ">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex items-center justify-center h-96 flex-col gap-4">
          <p className="text-muted-foreground">No Assets yet</p>
          <AddAsset
            setUploads={setUploads}
            uploads={uploads}
            setIsUploading={setIsUploading}
            setUploadProgress={setUploadProgress}
            client={client}
          />
        </div>
      )}
    </div>
  );
};

const AddAsset = ({
  setUploads,
  uploads,
  setIsUploading,
  setUploadProgress,
  client,
}: {
  setUploads: React.Dispatch<React.SetStateAction<Asset[] | undefined>>;
  uploads: Asset[] | undefined;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  client: string;
}) => {
  async function onFileChange(e: any) {
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  async function saveFileToFirebase(file: File) {
    console.log("saving file to firebase");
    const storage = getStorage(app);
    const storageRef = ref(storage, `video-concepts/${file.name}`);
    // Start the file upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Return a promise that resolves with the download URL
    // after the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update the upload progress state
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            const newUploads = [
              ...(uploads || []),
              {
                name: file.name,
                url: fileUrl,
                type: file.type.includes("video") ? "video" : "img",
              },
            ];
            setUploads(newUploads as Asset[]);
            updateDoc(doc(db, "clients", client), {
              assets: newUploads,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  return (
    <>
      <input
        multiple
        id="addAsset"
        type="file"
        accept=".mp4 , .mov, png, jpg, jpeg"
        onChange={onFileChange}
        style={{display: "none"}}
      />
      <Button
        size="sm"
        className=" text-[12px]"
        onClick={() => document.getElementById("addAsset")?.click()}
      >
        Add new asset
        <Icons.add className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
};

type UploadedFile = {
  name: string;
  url: string;
};

const CreateIdea = ({client}: {client: string}) => {
  const [description, setDescription] = React.useState<string>("");

  const [uploads, setUploads] = React.useState<UploadedFile[]>([]);

  const [open, setOpen] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const {currentUser} = useAuth()!;

  const saveIdea = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    const id = Math.random().toString(36).substring(7);
    const idea = {
      id,
      user: currentUser.uid,
      description,
      clientId: client,
      uploads,
      isUsed: false,
    };
    // save to firebase at /ideas/id
    const docRef = doc(db, "ideas", id);
    await setDoc(docRef, idea);

    setIsSaving(false);
    setOpen(false);
  };

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  async function saveFileToFirebase(file: File) {
    console.log("saving file to firebase");
    const storage = getStorage(app);
    const storageRef = ref(storage, `video-concepts/${file.name}`);
    // Start the file upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Return a promise that resolves with the download URL
    // after the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update the upload progress state
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            setUploads((prev) => [...prev, {name: file.name, url: fileUrl}]);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className=" text-[12px]">
          Create new concept
          <Icons.add className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Create new concept</DialogTitle>
          <DialogDescription>Enter your idea below</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Editor post={undefined} setScript={setDescription} />
          <input
            multiple
            id="addFile"
            type="file"
            accept=".mp4 , .mov"
            onChange={onFileChange}
            style={{display: "none"}}
          />
          {isUploading && (
            <div className="w-full text-foreground border rounded-md p-4 flex  items-center justify-between gap-4">
              <h1 className="text-primary font-bold whitespace-nowrap">
                Uploading Video
              </h1>
              <Progress
                value={uploadProgress}
                className="bg-muted-foreground"
              />
              <span className="text-primary w-[80px] ">
                {Math.round(uploadProgress)}%
              </span>
            </div>
          )}
          {uploads &&
            uploads.length > 0 &&
            uploads.map((file) => (
              <div
                key={file.url}
                className={`w-full  text-foreground border rounded-md  flex items-center  justify-between p-2`}
              >
                <h1 className="text-primary font-bold">{file.name}</h1>
                <div className="flex gap-4 w-fit items-center">
                  <Button
                    className="w-fit"
                    variant={"ghost"}
                    // onClick={() => deleteUploadedVideo(uploadedVideo.id)}
                  >
                    <Icons.trash className=" h-5 w-5 text-muted-foreground" />
                  </Button>
                  <LinkButton href={file.url} target="_blank">
                    Open
                  </LinkButton>
                </div>
              </div>
            ))}
          <Button
            onClick={() => document.getElementById("addFile")?.click()}
            variant={"outline"}
            className="border-dashed text-primary hover:border-primary hover:bg-transparent"
          >
            <Icons.add className="h-4 w-4 " />
            Add Reference Video
          </Button>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setOpen(false)}
              variant={"ghost"}
              className="text-primary"
            >
              Cancel
            </Button>
            <Button onClick={saveIdea}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const IdeaRow = ({idea, userData}: {idea: Idea; userData: UserData[]}) => {
  const user = userData.find((u) => u.uid == idea.user);

  const [isUsed, setIsUsed] = React.useState(idea.isUsed);

  const toggleIsUsed = async () => {
    setIsUsed(!isUsed);
    setTimeout(() => {
      setDoc(doc(db, "ideas", idea.id), {isUsed: !isUsed}, {merge: true});
    }, 1000);
  };

  const [showAssets, setShowAssets] = React.useState(false);

  const [showDelete, setShowDelete] = React.useState(false);

  const deleteIdea = async () => {
    await deleteDoc(doc(db, "ideas", idea.id));
  };

  return (
    <div className="flex items-center justify-between border p-4 bg-foreground/40 dark:bg-foreground/20 rounded-md relative">
      {/* <p className="text-primary">{idea.id}</p> */}
      {/* {isUsed && (
        <div className="absolute w-full h-full top-0 left-0 bg-muted/50 "></div>
      )} */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-primary text-lg font-bold ">
            Idea created by {user?.firstName}
          </h1>
          <div className="flex flex-col flex-grow">
            <EditorJsRender script={idea.description} />
          </div>
        </div>

        {idea.uploads.length > 0 && (
          <button
            onClick={() => setShowAssets(!showAssets)}
            className="text-primary flex items-center gap-2"
          >
            {showAssets ? "Hide" : "Show Assets"}

            <Icons.chevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showAssets ? "rotate-180" : " rotate-0"
              }`}
            />
          </button>
        )}
        {showAssets && (
          <div className="flex gap-4">
            {idea.uploads.map((upload) => (
              <div
                key={upload.name}
                className="relative rounded-md overflow-hidden h-[300px] aspect-[9/16]"
              >
                <video
                  controls
                  src={upload.url}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 absolute top-2 right-2">
        <p className="text-primary">
          {isUsed ? (
            <span className="text-red-600">Used</span>
          ) : (
            <span className="text-green-600">Not used </span>
          )}
        </p>
        <Switch checked={isUsed} onCheckedChange={toggleIsUsed} />
        <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size="sm" className=" p-0 px-2">
              <Icons.trash className="h-3 w-3 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <h1 className="text-primary">Delete Idea</h1>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete this idea?
            </AlertDialogDescription>
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => setShowDelete(false)}
                variant={"ghost"}
                className="text-primary"
              >
                Cancel
              </Button>
              <Button onClick={deleteIdea} variant={"destructive"}>
                Delete
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const EditorJsRender = ({script}: {script: OutputData}) => {
  const edjsParser = edjsHTML();
  const htmlList = edjsParser.parse(script);

  const html = htmlList.join("");
  return (
    <div
      dangerouslySetInnerHTML={{__html: html}}
      className="h-fit overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 "
    />
  );
};

const VideoInspirations = () => {
  const inspirationList = ["https://www.instagram.com/p/C4bRBeXJvXj/"];

  return (
    <div className="grid gap-1 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">
          Video inspiration/styles
        </h1>
        <Button size="sm" className="ml-auto text-[12px]">
          add new inspiration
          <Icons.add className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="flex flex-col border p-4 bg-foreground/40 dark:bg-foreground/20 rounded-md w-full">
        {inspirationList.map((inspoLink) => (
          <div key={inspoLink} className="flex items-center justify-between">
            <p className="text-primary">{inspoLink}</p>
            <div className="flex items-center gap-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
