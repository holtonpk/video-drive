"use client";
import React, {useEffect, useRef} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Calendar as CalendarIcon, Loader2} from "lucide-react";
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
import {
  Platform,
  platforms,
  Post,
  ResponseFormatType,
  VideoData,
  clients,
} from "@/config/data";

import {VideoProvider, useVideo} from "../data/video-context";
import {
  setDoc,
  doc,
  collection,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
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
import VideoPlayer from "@/components/ui/video-player";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

const ResponseFormat: ResponseFormatType = {
  instagram: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  tiktok: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  youtube: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  linkedin: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  twitter: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  facebook: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
};

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
        <div className="grid grid-cols-[45%_1fr] w-full bg-card">
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
  const {video, setVideo} = useVideo()!;
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

  const {video} = useVideo()!;

  const [responseFormat, setResponseFormat] = React.useState<
    ResponseFormatType | undefined
  >(post?.captions);

  useEffect(() => {
    setResponseFormat(post?.captions);
  }, [post]);

  console.log("responseFormat", responseFormat);

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

  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(
    post && post.platforms ? post.platforms : []
  );

  const [postDate, setPostDate] = React.useState<Date | undefined>(
    post?.postDate
      ? convertTimestampToDate(post.postDate) || undefined
      : undefined
  );

  const [versionName, setVersionName] = React.useState(post.title);

  const [notes, setNotes] = React.useState(post?.notes || "");

  const [caption, setCaption] = React.useState(post.caption || "");
  const [scrapedVideoText, setScrapedVideoText] = React.useState(
    post.scrapedVideoText || ""
  );
  const [copied, setCopied] = React.useState({});

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
          <AiCaption
            updateField={updateField}
            setCaption={setCaption}
            videoURL={post?.videoURL || undefined}
          />

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

        {/* these should be tabs */}
        {responseFormat && (
          <Tabs
            defaultValue={Object.keys(responseFormat)[0] as Platform}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              {(Object.keys(responseFormat) as Platform[]).map((platform) => (
                <TabsTrigger key={platform} value={platform}>
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>
            {(Object.keys(responseFormat) as Platform[]).map((platform) => (
              <TabsContent key={platform} value={platform}>
                <div className="grid gap-2 max-h-fit overflow-y-auto pb-10">
                  <div className="border p-2 grid gap-2">
                    <div className="flex justify-between items-center col-span-2">
                      <Label>Title</Label>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            responseFormat[platform].title
                          );
                          setCopied({...copied, [platform]: "title"});
                          setTimeout(() => {
                            setCopied({...copied, [platform]: ""});
                          }, 3000);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {copied[platform as keyof typeof copied] === "title"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    </div>
                    <Input
                      value={responseFormat[platform].title}
                      onChange={(e) => {
                        setResponseFormat({
                          ...responseFormat,
                          [platform]: {
                            ...responseFormat[platform],
                            title: e.target.value,
                          },
                        });
                        updateField("captions", responseFormat);
                      }}
                      className="col-span-2 "
                    />
                  </div>

                  <div className="border p-2 grid gap-2  w-full">
                    <div className="flex justify-between items-center col-span-2">
                      <Label>Caption</Label>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            responseFormat[platform].caption
                          );
                          setCopied({...copied, [platform]: "caption"});
                          setTimeout(() => {
                            setCopied({...copied, [platform]: ""});
                          }, 3000);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {copied[platform as keyof typeof copied] === "caption"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    </div>
                  </div>
                  <Textarea
                    className="min-h-[200px] pb-20"
                    value={responseFormat[platform].caption}
                    onChange={(e) => {
                      setResponseFormat({
                        ...responseFormat,
                        [platform]: {
                          ...responseFormat[platform],
                          caption: e.target.value,
                        },
                      });
                      updateField("captions", responseFormat);
                    }}
                  />

                  <div className="border p-2 grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Hashtags</Label>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            responseFormat[platform].hashtags.join(" ")
                          );
                          setCopied({...copied, [platform]: "hashtags"});
                          setTimeout(() => {
                            setCopied({...copied, [platform]: ""});
                          }, 3000);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {copied[platform as keyof typeof copied] === "hashtags"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    </div>
                    <Textarea
                      className="min-h-[200px] pb-20"
                      value={responseFormat[platform].hashtags.join(", ")}
                      onChange={(e) => {
                        setResponseFormat({
                          ...responseFormat,
                          [platform]: {
                            ...responseFormat[platform],
                            hashtags: e.target.value
                              .split(" ")
                              .map((tag) => tag.trim()),
                          },
                        });
                        updateField("captions", responseFormat);
                      }}
                    />
                  </div>
                  <div className="border p-2 grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Keywords</Label>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            responseFormat[platform].keywords.join(", ")
                          );
                          setCopied({...copied, [platform]: "keywords"});
                          setTimeout(() => {
                            setCopied({...copied, [platform]: ""});
                          }, 3000);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {copied[platform as keyof typeof copied] === "keywords"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    </div>
                    <Textarea
                      className="min-h-[200px] pb-20"
                      value={responseFormat[platform].keywords.join(", ")}
                      onChange={(e) => {
                        setResponseFormat({
                          ...responseFormat,
                          [platform]: {
                            ...responseFormat[platform],
                            keywords: e.target.value
                              .split(",")
                              .map((keyword) => keyword.trim()),
                          },
                        });
                        updateField("captions", responseFormat);
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* <div className="grid gap-2">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            updateField("notes", e.target.value);
          }}
        />
      </div> */}
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
    console.log("saving file to firebase");
    const storage = getStorage(app);
    const storageRef = ref(storage, `video/${file.name}`);
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
            const newUploadedVideo = {
              id: video.uploadedVideos ? video?.uploadedVideos.length + 1 : 1,
              title: file.name,
              videoURL: fileUrl,
            };
            await setDoc(
              doc(db, "videos", video.videoNumber.toString()),
              {
                uploadedVideos: video.uploadedVideos
                  ? [...video.uploadedVideos, newUploadedVideo]
                  : [newUploadedVideo],
                updatedAt: {date: new Date(), user: currentUser?.firstName},
                status: "done",
                videoReviewed: [],
              },
              {
                merge: true,
              }
            );
            setVideo(
              (prev) =>
                ({
                  ...prev,
                  uploadedVideos: video.uploadedVideos
                    ? [...video.uploadedVideos, newUploadedVideo]
                    : [newUploadedVideo],
                } as VideoData)
            );
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  const {video, setVideo} = useVideo()!;

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
  };

  return (
    <div className="group h-[550px] w-full rounded-r-lg overflow-hidden relative flex  items-center justify-center ">
      {(!video.uploadedVideos || video.uploadedVideos.length == 0) &&
        !isUploading && (
          <div className="w-full  bg-foreground rounded-md  flex flex-col gap-2 flex-grow h-full items-center justify-center">
            <span className="text-muted-foreground text-center  justify-center items-center flex">
              No videos uploaded
            </span>
            <input
              type="file"
              id="selectedFile2"
              className="hidden"
              onChange={onFileChange}
            />

            <button
              onClick={() => document.getElementById("selectedFile2")?.click()}
              className="h-fit justify-center  p-2  text-center rounded-md w-fit px-6 bg-blue-500/20 hover:bg-blue-500/50 text-blue-500 flex items-center"
            >
              <Icons.add className="h-6 w-6 mr-1" />
              Click to Upload
            </button>
          </div>
        )}

      {video.uploadedVideos && video.uploadedVideos?.length !== 0 && (
        <div className="w-full  bg-foreground rounded-md  grid grid-cols-[309px_1fr] gap-2 flex-grow h-full">
          <div className=" z-10  h-[550px] w-[309px]  aspect-[9/16] overflow-hidden relative">
            {post && post?.videoURL ? (
              // <video
              //   controls
              //   className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-20"
              //   src={post?.videoURL}
              // />
              <VideoPlayer videoUrl={post?.videoURL} title={post?.title} />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-muted">
                <Icons.video className="h-12 w-12 text-primary" />
                <h1 className="text-primary text-sm">
                  No video selected for this post
                </h1>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center w-full h-full gap-2 p-2">
            {[...video.uploadedVideos].reverse().map((uploadedVideo) => {
              return (
                <div
                  key={uploadedVideo.id}
                  className={`w-full  text-foreground border rounded-md  flex-col   gap-4 relative 
                    ${
                      uploadedVideo.needsRevision
                        ? "border-destructive hover:border-primary/70"
                        : uploadedVideo.videoURL === post?.videoURL
                        ? "border-primary"
                        : "border-border hover:border-primary/70"
                    }
                    `}
                >
                  <div className="absolute w-full h-full  z-10">
                    <button
                      onClick={() => selectVideo(uploadedVideo.videoURL)}
                      className="w-full h-full"
                    ></button>
                  </div>
                  <div className="flex w-full justify-between items-center p-2 ">
                    <h1 className="text-primary font-bold text-sm">
                      {uploadedVideo.title}
                    </h1>
                    {uploadedVideo.needsRevision && (
                      <span className="text-red-600 ml-auto">
                        Needs revision
                      </span>
                    )}
                    {uploadedVideo.isReadyToPost && (
                      <span className="text-green-600 ml-auto">
                        Ready to post
                      </span>
                    )}
                    <div className="flex gap-4 w-fit items-center relative z-20">
                      {/* <Link
                        href={uploadedVideo.videoURL}
                        target="_blank"
                        className={cn(
                          buttonVariants({variant: "outline"}),
                          "text-primary"
                        )}
                      >
                        Open
                      </Link> */}
                      <Button
                        className="w-fit"
                        variant={"ghost"}
                        onClick={() => deleteUploadedVideo(uploadedVideo.id)}
                      >
                        <Icons.trash className=" h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {uploadedVideo.needsRevision && (
                    <div className="grid gap-1 bg-muted/40 p-4">
                      <h1 className="text-primary text-lg">Revision Notes</h1>
                      <span className="text-muted-foreground">
                        {uploadedVideo.revisionNotes}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {isUploading && (
              <div className="w-full text-foreground border rounded-md p-4 flex  items-center justify-between gap-4">
                <h1 className="text-primary font-bold whitespace-nowrap text-base">
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
            <input
              type="file"
              id="selectedFile2"
              className="hidden"
              onChange={onFileChange}
            />
            <button
              onClick={() => document.getElementById("selectedFile2")?.click()}
              className="h-fit justify-center   p-2  text-center rounded-md w-full bg-blue-500/20 hover:bg-blue-500/50 text-blue-500 flex items-center"
            >
              <Icons.add className="h-6 w-6 mr-1" />
              Click to Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const AiCaption = ({
  updateField,
  setCaption,
  videoURL,
}: {
  updateField: (field: string, value: any) => void;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string | undefined;
}) => {
  const [prompt, setPrompt] = React.useState(clients[0].value);

  const clientDetails = "";

  const {video} = useVideo()!;

  useEffect(() => {
    setVideoScript(
      typeof video.script !== "string"
        ? video.script?.blocks.map((block) => block.data.text).join(" ") ||
            video.script?.blocks.map((block) => block.data.items).join(" ")
        : video.script
    );
    setScrapedVideoText(undefined);
  }, [video]);

  const [loadingResponse, setLoadingResponse] = React.useState(false);

  const [videoScript, setVideoScript] = React.useState(
    typeof video.script !== "string"
      ? video.script?.blocks.map((block) => block.data.text).join(" ") ||
          video.script?.blocks.map((block) => block.data.items).join(" ")
      : video.script
  );

  const [scrapedVideoText, setScrapedVideoText] = React.useState<
    string | undefined
  >(video.scrapedVideoText);

  useEffect(() => {
    setScrapedVideoText(video.scrapedVideoText);
  }, [video]);

  const [response, setResponse] = React.useState<ResponseFormatType | string>(
    ""
  );

  const getAiCaption = async () => {
    setLoadingResponse(true);
    console.log(
      "brand info ======",
      clients.find((client) => client.value === prompt)?.brandInfo
    );
    const response = await fetch("/api/open-router", {
      method: "POST",
      body: JSON.stringify({
        brandInfo: clients.find((client) => client.value === prompt)?.brandInfo,
        videoScript: scrapedVideoText ? scrapedVideoText : videoScript,
      }),
    });
    const data = await response.json();
    console.log("Data received:", data.response);
    setResponse(data.response);
    setLoadingResponse(false);
  };

  const [open, setOpen] = React.useState(false);

  const [isScraping, setIsScraping] = React.useState(false);

  const {currentUser} = useAuth()!;

  const [isLoadingVideoText, setIsLoadingVideoText] = React.useState(false);

  async function updateVideoField(field: string, value: any) {
    if (!video) return;
    await setDoc(
      doc(db, "videos", video?.videoNumber.toString()),
      {
        [field]: value,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
  }
  const getVideoText = async () => {
    setIsLoadingVideoText(true);
    if (!videoURL) return;
    const url = new URL(videoURL);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];
    console.log("fileName", fileName);
    const response = await fetch("/api/transcribe-whisper-1", {
      method: "POST",
      body: JSON.stringify({
        fileName: fileName,
      }),
    });
    const data = await response.json();
    console.log("++++++++++++++s", data.response);
    setScrapedVideoText(data.response);
    updateVideoField("scrapedVideoText", data.response);

    setIsLoadingVideoText(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
        <Select
          value={prompt}
          onValueChange={(value) => {
            setPrompt(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => {
              const Icon = client.icon;
              return (
                <SelectItem key={client.value} value={client.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-6 h-6 " />
                    <span className="text-md">{client.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="prompt"
          className="h-[100px]"
          value={clients.find((client) => client.value === prompt)?.brandInfo}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        {/* {scrapedVideoText && (
          <>
            <Label htmlFor="prompt">Scraped Video Text</Label>
            <Textarea
              placeholder="scraped text"
              className="h-[100px]"
              value={scrapedVideoText}
              onChange={(e) => {
                setScrapedVideoText(e.target.value);
              }}
            />
          </>
        )} */}
        <Textarea
          value={scrapedVideoText}
          onChange={(e) => {
            setScrapedVideoText(e.target.value);
            updateVideoField("scrapedVideoText", e.target.value);
          }}
          id="caption"
          className="min-h-[200px] w-full p-4 pb-10"
          placeholder="Video text goes here..."
        />

        {response && (
          <div className="grid gap-2">
            <Label>Response</Label>
            <Textarea
              value={JSON.stringify(response, null, 2)}
              onChange={(e) => {
                setResponse(e.target.value);
              }}
              className="h-[300px]"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              getVideoText();
            }}
          >
            {isLoadingVideoText ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Get Video Text"
            )}
          </Button>
          <Button onClick={getAiCaption}>
            {loadingResponse && (
              <Icons.spinner className="animate-spin h-5 w-5 mr-2" />
            )}
            {response ? "Regenerate" : "Generate"}
          </Button>
          {response && (
            <Button
              onClick={() => {
                updateField("captions", response);
                setCaption(response as string);
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
