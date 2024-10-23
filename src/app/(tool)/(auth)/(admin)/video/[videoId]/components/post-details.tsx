"use client";
import React, {useEffect, useRef} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format, set} from "date-fns";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {platforms, Post} from "@/config/data";

import {VideoProvider, useVideo} from "../data/video-context";
import {setDoc, doc, collection, getDoc, deleteDoc} from "firebase/firestore";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";
import {Progress} from "@/components/ui/progress";
import {db, app} from "@/config/firebase";

import {convertTimestampToDate} from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import {useAuth} from "@/context/user-auth";

export const PostDetails = () => {
  const {video} = useVideo()!;

  const [loadingPost, setLoadingPost] = React.useState(false);
  const [posts, setPosts] = React.useState<Post[] | undefined>();
  const [selectedPost, setSelectedPost] = React.useState<undefined | Post>();

  const createdPost = useRef(false);

  const [loadingPostData, setLoadingPostData] = React.useState(false);

  const {currentUser} = useAuth()!;

  useEffect(() => {
    // fetch all posts for the video
    const fetchPosts = async () => {
      if (video.postIds) {
        // get all the post data from the post ids
        const postsData = await Promise.all(
          video.postIds.map(async (postId: any) => {
            const post = await getDoc(doc(db, "posts", postId));
            return post.data() as Post;
          })
        );
        setPosts(postsData);
        if (postsData.length) setSelectedPost(postsData[postsData.length - 1]);
      } else {
        // create a new post
        const newPostRef = doc(collection(db, `posts`));
        const newPost = {
          id: newPostRef.id,
          title: "v 1.0",
          clientId: video.clientId,
          updatedAt: {date: new Date(), user: currentUser?.firstName},
          postDate: video.postDate,
          uploaded: false,
        };

        await setDoc(newPostRef, newPost);
        //  add new post id to the video
        await setDoc(
          doc(db, "videos", video.videoNumber.toString()),
          {
            postIds: [newPostRef.id],
            updatedAt: {date: new Date(), user: currentUser?.firstName},
          },
          {
            merge: true,
          }
        );
        setSelectedPost(newPost);
      }
    };
    if (video) {
      if (!posts) {
        console.log("fetching posts", createdPost.current);
        if (!createdPost.current) {
          createdPost.current = true;
          fetchPosts();
        }
      } else if (!selectedPost && posts[0].videoURL) {
        setSelectedPost(posts[0]);
      }
    }
  }, [video, posts, selectedPost, currentUser]);

  useEffect(() => {
    setLoadingPostData(true);
    setTimeout(() => {
      setLoadingPostData(false);
    }, 1);
  }, [selectedPost]);

  return (
    <div className="border rounded-lg  w-full flex relative  mx-10  mt-10 shadow-sm ">
      {loadingPost ? (
        <>Loading...</>
      ) : (
        <div className="grid grid-cols-2 w-full bg-card">
          {posts && selectedPost && (
            <PostSelector
              posts={posts}
              setPosts={setPosts}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
            />
          )}
          {loadingPostData ? (
            <>Loading...</>
          ) : (
            <>
              {selectedPost && <PostInfo post={selectedPost} />}
              <VideoDisplay
                post={selectedPost}
                posts={posts}
                setPost={setSelectedPost}
                setPosts={setPosts}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

function PostSelector({
  posts,
  setPosts,
  selectedPost,
  setSelectedPost,
}: {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>;
  selectedPost: Post;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
}) {
  const {video} = useVideo()!;
  const {currentUser} = useAuth()!;

  const deletePost = async (postId: string) => {
    const newPosts = posts?.filter((post) => post.id !== postId);
    setPosts(newPosts);
    setSelectedPost(newPosts ? newPosts[0] : undefined);
    await deleteDoc(doc(db, "posts", postId));
    //  remove post id from the video
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        postIds: newPosts?.map((post) => post.id),
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  };

  const createNewPost = async () => {
    const newPostRef = doc(collection(db, `posts`));
    await setDoc(newPostRef, {
      id: newPostRef.id,
      clientId: video.clientId,
      updatedAt: {date: new Date(), user: currentUser?.firstName},
      title: `v 1.${posts ? posts.length : "0"}`,
      postDate: video.postDate,
    });
    //  add new post id to the video

    const existingPostIds = posts?.map((post) => post.id) || [];
    await setDoc(
      doc(db, "videos", video.videoNumber.toString()),
      {
        postIds: [...existingPostIds, newPostRef.id],
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
    const post = await getDoc(newPostRef);
    const postData = post.data() as Post;
    setPosts([...(posts || []), postData]);
    setSelectedPost(postData);
  };

  return (
    <div className="flex items-center max-w-full w-fit h-fit text-primary absolute top-0 -translate-y-full left-2 border border-b-0 rounded-t-lg overflow-hidden">
      {posts.map((post) => (
        <div
          key={post.id}
          className={`flex gap-4 relative items-center p-2  bg-background
            ${
              post.videoURL === selectedPost.videoURL
                ? "bg-background "
                : " bg-muted-foreground/10 "
            }
            `}
        >
          <button
            onClick={() => setSelectedPost(post)}
            className="w-full absolute h-full top-0 left-0 z-10 hover:bg-muted-foreground/5 "
          ></button>
          <Label className="font-bold z-20 pointer-events-none">
            {post.title}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger className="z-20">
              <Icons.ellipsis className="h-5 w-5 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => deletePost(post.id)}
                className="text-destructive hover:text-destructive"
              >
                <Icons.trash className="h-4 w-4 mr-2" />
                Delete video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
      <button
        onClick={createNewPost}
        className="text-background bg-primary  flex items-center  p-2 text-sm"
      >
        <Icons.add className="h-4 w-4 mr-1" />
        New version
      </button>
    </div>
  );
}

export function PostInfo({post}: {post: Post}) {
  const [copiedURL, setCopiedURL] = React.useState(false);
  const {currentUser} = useAuth()!;

  const copyVideoURL = () => {
    setCopiedURL(true);
    navigator.clipboard.writeText(post?.videoURL || "");
    setTimeout(() => {
      setCopiedURL(false);
    }, 2000);
  };

  async function updateField(field: string, value: any) {
    if (!post) return;
    await setDoc(
      doc(db, "posts", post?.id),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }

  const [caption, setCaption] = React.useState(post.caption || "");

  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(
    post && post.platforms ? post.platforms : []
  );

  const [postDate, setPostDate] = React.useState<Date | undefined>(
    post?.postDate ? convertTimestampToDate(post.postDate) : undefined
  );

  const [versionName, setVersionName] = React.useState(post.title);

  const [notes, setNotes] = React.useState(post?.notes || "");

  const [copied, setCopied] = React.useState(false);

  const copyCaption = () => {
    setCopied(true);
    navigator.clipboard.writeText(caption);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="h-full w-full overflow-scroll text-primary relative p-4 flex flex-col gap-4">
      {post && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>Version Name</Label>
              <Input
                value={versionName}
                onChange={(e) => {
                  setVersionName(e.target.value);
                  updateField("title", e.target.value);
                }}
              />
            </div>
            {post.videoURL && (
              <div className="grid gap-2">
                <Label>File URl</Label>
                <div className="w-full h-fit relative  ">
                  <Input value={post.videoURL} readOnly className="pr-8" />
                  <button
                    onClick={copyVideoURL}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {!copiedURL ? (
                      <Icons.copy className="h-4 w-4" />
                    ) : (
                      <Icons.check className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label>Post to</Label>

          <Popover>
            <PopoverTrigger>
              <div
                className={cn(
                  buttonVariants({variant: "outline", size: "sm"}),
                  "w-full border-dashed justify-start"
                )}
              >
                <Icons.add className="mr-2 h-4 w-4" />

                {selectedPlatforms?.length > 0 ? (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal lg:hidden"
                    >
                      {selectedPlatforms.length}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {selectedPlatforms.length > 2 ? (
                        <>
                          {selectedPlatforms.map((platform) => {
                            const platformObj = platforms.find(
                              (p) => p.value === platform
                            );

                            return (
                              <Badge
                                key={platform}
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                              >
                                {platformObj?.icon && (
                                  <platformObj.icon className="h-6 w-6" />
                                )}
                              </Badge>
                            );
                          })}
                        </>
                      ) : (
                        platforms
                          .filter((option) =>
                            selectedPlatforms.includes(option.value)
                          )
                          .map((option) => (
                            <Badge
                              variant="secondary"
                              key={option.value}
                              className="rounded-sm px-1 font-normal"
                            >
                              {option.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </>
                ) : (
                  <span>Select platforms</span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {platforms.map((option) => {
                      const isSelected =
                        selectedPlatforms &&
                        selectedPlatforms.includes(option.value);

                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            if (!isSelected) {
                              setSelectedPlatforms([
                                ...(selectedPlatforms || []),
                                option.value,
                              ]);
                              updateField("platforms", [
                                ...(selectedPlatforms || []),
                                option.value,
                              ]);
                            } else {
                              setSelectedPlatforms(
                                selectedPlatforms.filter(
                                  (platform) => platform !== option.value
                                )
                              );
                              updateField(
                                "platforms",
                                selectedPlatforms.filter(
                                  (platform) => platform !== option.value
                                )
                              );
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 gap-2 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Icons.check className={cn("h-4 w-4")} />
                          </div>
                          <div className="flex gap-2 items-center">
                            {option?.icon && (
                              <option.icon className="h-6 w-6" />
                            )}

                            {option.label}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid-gap-2">
          <Label htmlFor="post-date">Post Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="post-date"
                variant={"outline"}
                className={cn(
                  " justify-start text-left font-normal  w-full ",
                  !postDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {postDate ? format(postDate, "PPP") : <span>Post Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={postDate}
                onSelect={(value) => {
                  setPostDate(value);
                  updateField("postDate", value);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-2 relative">
        <div className="flex gap-2 absolute bottom-2 left-2">
          <AiCaption updateField={updateField} setCaption={setCaption} />

          <Button
            onClick={copyCaption}
            variant="ghost"
            className=" p-0 aspect-square"
          >
            {copied ? (
              <Icons.check className="h-3 w-3 " />
            ) : (
              <Icons.copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            updateField("caption", e.target.value);
          }}
          id="caption"
          className="min-h-[200px] w-full p-6"
          placeholder="The caption for the video goes here..."
        />
      </div>

      <div className="grid gap-2">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            updateField("notes", e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function VideoDisplay({
  post,
  setPost,
  posts,
  setPosts,
}: {
  post: Post | undefined;
  setPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
  posts: Post[] | undefined;
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>;
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const {currentUser} = useAuth()!;

  const getFileExtension = (fname: string) => {
    return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  async function saveFileToFirebase(file: File) {
    console.log("post", post);

    if (!post) return;
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `post/${post.id + "." + getFileExtension(file.name)}`
    );

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
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            if (!posts) return;
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
            // save the file url to the video
            const postId: string = post ? post?.id : posts[0].id;
            await setDoc(
              doc(db, "posts", postId),
              {
                videoURL: fileUrl,
                updatedAt: {date: new Date(), user: currentUser?.firstName},
              },
              {
                merge: true,
              }
            );

            const postRef = await getDoc(doc(db, "posts", postId));
            const postData = postRef.data() as Post;
            console.log("postData ******", postData);
            // update the post in the posts array with new video url
            const postIndex = posts.findIndex((post) => post.id === postId);
            const newPosts = [...posts];
            newPosts[postIndex] = postData;
            setPosts(newPosts);
            setPost(postData);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  const {video} = useVideo()!;

  async function onFileChange(e: any) {
    console.log(e.target.files);
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  async function removeVideo() {
    if (!posts || !post) return;
    await setDoc(
      doc(db, "posts", post.id),
      {
        videoURL: "",
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
    const postRef = await getDoc(doc(db, "posts", post.id));
    const postData = postRef.data() as Post;
    const postIndex = posts?.findIndex((post) => post.id === postData.id);
    const newPosts = [...posts];
    newPosts[postIndex] = postData;
    setPosts(newPosts);
    setPost(postData);
  }

  const selectVideo = async (videoUrl: string) => {
    if (!posts) return;
    await setDoc(
      doc(db, "posts", post ? post?.id : posts[0].id),
      {
        videoURL: videoUrl,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
    setPost({
      ...post,
      videoURL: videoUrl,
    } as Post);
  };

  return (
    <div className="group h-[550px] w-full rounded-r-lg overflow-hidden relative flex bg-muted items-center justify-center ">
      {isUploading ? (
        <div className="flex w-[400px] flex-col gap-3 items-center justify-center h-full px-6">
          <h1 className="text-primary font-bold">Uploading Video</h1>
          <Progress value={uploadProgress} className="bg-muted-foreground" />
        </div>
      ) : (
        <>
          {post && post?.videoURL ? (
            <>
              <div className=" z-10  w-[309px]  aspect-[9/16] overflow-hidden relative">
                <video
                  controls
                  className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-20"
                  src={post?.videoURL}
                />
              </div>
              <Button
                onClick={removeVideo}
                variant={"destructive"}
                className="z-40 absolute top-4 right-4"
              >
                <Icons.trash className="h-5 w-5 " />
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-4 items-center h-full justify-center bg-muted">
              <h1 className="text-primary">Completed video goes here</h1>
              <Button
                onClick={() => document.getElementById("selectedFile")?.click()}
              >
                Click to upload{" "}
              </Button>
              <input
                multiple
                id="selectedFile"
                type="file"
                accept=".mp4 , .mov"
                onChange={onFileChange}
                style={{display: "none"}}
              />
              {video.uploadedVideos &&
                video.uploadedVideos.map((uploadedVideo) => (
                  <div
                    key={uploadedVideo.id}
                    className="w-full justify-between text-foreground border rounded-md p-4 flex  items-center gap-4"
                  >
                    <Button
                      onClick={() => {
                        selectVideo(uploadedVideo.videoURL);
                      }}
                    >
                      Select
                    </Button>
                    <Link
                      href={uploadedVideo.videoURL}
                      target="_blank"
                      className={cn(buttonVariants({variant: "outline"}))}
                    >
                      View
                    </Link>
                    <h1 className="text-primary font-bold">
                      {uploadedVideo.title}
                    </h1>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const AiCaption = ({
  updateField,
  setCaption,
}: {
  updateField: (field: string, value: any) => void;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [prompt, setPrompt] = React.useState(
    "Create short video description (instagram, tiktok, youtube style) for the following video script. The description should  use relevant keywords, phrases and hashtags. hashtags should be lowercase. don't use emojis or unicode characters."
  );

  const {video} = useVideo()!;

  const [loadingResponse, setLoadingResponse] = React.useState(false);

  const [response, setResponse] = React.useState("");

  const getAiCaption = async () => {
    setLoadingResponse(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({
        directions: prompt,
        videoScript:
          typeof video.script !== "string"
            ? video.script.blocks.map((block) => block.data.text).join(" ")
            : video.script,
      }),
    });
    const data = await response.json();
    setResponse(data.response);
    setLoadingResponse(false);
  };

  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="">Ai generated caption</Button>
      </DialogTrigger>
      <DialogContent className="text-primary">
        <DialogHeader>
          <DialogTitle>AI Generated Caption</DialogTitle>
          <DialogDescription>
            The caption for the video generated by the AI
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          placeholder="prompt"
          className="h-[100px]"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        {response && (
          <div className="grid gap-2">
            <Label>Response</Label>
            <Textarea
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
              }}
              className="h-[300px]"
            />
          </div>
        )}
        <DialogFooter>
          <Button onClick={getAiCaption}>
            {loadingResponse && (
              <Icons.spinner className="animate-spin h-5 w-5 mr-2" />
            )}
            {response ? "Regenerate" : "Generate"}
          </Button>
          {response && (
            <Button
              onClick={() => {
                updateField("caption", response);
                setCaption(response);
                setOpen(false);
              }}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
