"use client";

import "../editor.css";
import * as React from "react";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import {zodResolver} from "@hookform/resolvers/zod";
// import {Post} from "@prisma/client";
import {useForm} from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {postPatchSchema} from "@/lib/validations/post";
import {buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {updateDoc, doc, serverTimestamp, getDoc} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  uploadBytesResumable,
  getDownloadURL,
  ref as refStorage,
  getStorage,
} from "firebase/storage";
import {db, app} from "@/config/firebase";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import {ADMIN_USERS, BlogPost, blogCategories} from "@/config/data";
import {SwitchCamera} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {UserData} from "@/context/user-auth";

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({post}: {post: BlogPost}) {
  const [userData, setUsersData] = React.useState<UserData[]>();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Promise.all(
          ADMIN_USERS.map(async (user) => {
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

  const {register, handleSubmit} = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });
  const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const editorRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!editorRef.current) {
      const body = postPatchSchema.parse(post);

      editorRef.current = new EditorJS({
        holder: "blog",
        onReady() {
          ref.current = editorRef.current;
        },
        onChange: () => {
          SaveData();
        },
        data: body.content,
        inlineToolbar: true,
        placeholder: "Start writing here...",
        tools: {
          header: {
            class: Header as any,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3],
              defaultLevel: 1,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          linkTool: LinkTool,
        },
      });
      const SaveData = () => {
        editorRef.current
          .save()
          .then((savedData: any) => {
            console.log("savedData", savedData);
            // setScript(savedData);
          })
          .catch((error: any) => {
            console.log("error", error);
          });
      };
    }
  }, [post]);

  // const {SaveBlogPost} = useAdminStorage()!;

  const SaveBlogPost = async (
    id: string,
    post: {title: string; content: any; description: string}
  ) => {
    try {
      const response = await updateDoc(doc(db, "blog", id), {
        title: post.title,
        path: post.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^a-zA-Z0-9-]/g, ""),
        content: post.content,
        description: post.description,
        updatedAt: serverTimestamp(),
      });
      return "success";
    } catch {
      return "error";
    }
  };
  console.log("post", post);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    console.log("title:", data.title, "blocks:", blocks);

    const response = await SaveBlogPost(post.id, {
      title: data.title || "Untitled Post",
      content: blocks,
      description: data.description || "No description",
    });
    setIsSaving(false);

    if (response == "error") {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      });
    }

    router.refresh();

    return toast({
      description: "Your post has been saved.",
    });
  }

  const [isPublished, setIsPublished] = React.useState<boolean>(post.published);

  const togglePublished = async (value: boolean) => {
    console.log("togglePublished");
    setIsPublished(value);
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        published: value,
      });
      return "success";
    } catch {
      console.log("error");
      return "error";
    }
  };

  const [image, setImage] = React.useState<string | undefined>(post.image);

  const [isUploading, setIsUploading] = React.useState(false);

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    setIsUploading(true);
    await saveFileToFirebase(file);
    setIsUploading(false);
  }

  async function saveFileToFirebase(file: File) {
    console.log("saving file to firebase");
    if (!post) return;
    const storage = getStorage(app);
    const storageRef = refStorage(storage, `video-concepts/${file.name}`);
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
          // setUploadProgress(progress); // Update the upload progress state
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

            // setUploads(newUploads as Asset[]);
            updateDoc(doc(db, "blog", post.id), {
              image: fileUrl,
            });
            setImage(fileUrl);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  const saveCategory = async (category: string) => {
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        category: category,
      });
      return "success";
    } catch {
      return "error";
    }
  };

  const saveAuthor = async (author: string) => {
    let authorData = {
      id: "team",
      name: "Ripple MediaTeam",
      avatar: "logo",
    };
    if (author !== "team") {
      const user = userData?.find((u) => u.uid === author);
      if (!user) return;
      authorData = {
        id: user.uid,
        name: user.firstName + " " + user.lastName,
        avatar: user.photoURL,
      };
    }
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        author: authorData,
      });
      return "success";
    } catch {
      return "error";
    }
  };

  const colors = ["#F51085", "#971EF7", "#1963F0", "#53E8B3"];

  const [tags, setTags] = React.useState<string[]>(post.tags);
  const [tagValue, setTagValue] = React.useState<string>("");

  const addTag = async () => {
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        tags: [...(tags || []), tagValue],
      });
      setTags([...(tags || []), tagValue]);
      setTagValue("");
      return "success";
    } catch {
      return "error";
    }
  };

  const removeTag = async (tag: string) => {
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        tags: tags?.filter((t) => t !== tag),
      });
      setTags(tags?.filter((t) => t !== tag));
      return "success";
    } catch {
      return "error";
    }
  };

  const [duration, setDuration] = React.useState<number>(post.length);

  const [durationSaved, setDurationSaved] = React.useState(
    post.length ? true : false
  );

  const saveDuration = async (duration: number) => {
    try {
      const response = await updateDoc(doc(db, "blog", post.id), {
        length: duration,
      });
      setDurationSaved(true);
      return "success";
    } catch {
      return "error";
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen container mt-3"
    >
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/blog-manage"
              className={cn(buttonVariants({variant: "ghost"}), "text-primary")}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <div className="flex items-center gap-2">
              <Switch checked={isPublished} onCheckedChange={togglePublished} />
              <span
                className={`${isPublished ? "text-green-600" : "text-red-600"}`}
              >
                {isPublished ? "Published" : "not published"}
              </span>
            </div>
          </div>
          <Button type="submit" variant="default" className="bg-theme">
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </Button>
        </div>

        <div className="prose prose-stone mx-auto w-[90%] md:w-[70%] gap-2 container dark:prose-invert">
          <Select onValueChange={saveCategory} defaultValue={post.category}>
            <SelectTrigger className="w-[180px] bg-muted text-primary">
              <SelectValue placeholder="select a category" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Title"
            className="w-full resize-none  appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none text-primary mt-4"
            {...register("title")}
          />
          <TextareaAutosize
            autoFocus
            id="description"
            defaultValue={post.description}
            placeholder="Description"
            className="w-full resize-none  appearance-none overflow-hidden bg-transparent text-2xl font-bold focus:outline-none text-muted-foreground mt-4"
            {...register("description")}
          />
          <input
            multiple={false}
            id="addImage"
            type="file"
            accept="png, jpg, jpeg"
            onChange={onFileChange}
            style={{display: "none"}}
          />
          {image && !isUploading ? (
            <div className="w-full aspect-[16/9] mx-auto   text-primary hover:text-primary/80  flex items-center justify-center">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => document.getElementById("addImage")?.click()}
                className="w-full aspect-[16/9] mx-auto border-dashed border-2 text-primary hover:text-primary/80  flex items-center justify-center"
              >
                {isUploading ? (
                  <Icons.loader className="h-10 w-10 animate-spin" />
                ) : (
                  "Click to upload image"
                )}
              </button>
            </>
          )}
          <div className="flex w-full justify-between mt-4">
            {userData && (
              <Select onValueChange={saveAuthor} defaultValue={post.author.id}>
                <SelectTrigger className="w-[180px] bg-muted text-primary">
                  <SelectValue placeholder="select an author" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_USERS.map((userId) => {
                    const user = userData?.find((u) => u.uid === userId);
                    console.log("user", user);
                    console.log("userData", userData);
                    return (
                      <SelectItem key={userId} value={userId}>
                        {user?.firstName + " " + user?.lastName}
                      </SelectItem>
                    );
                  })}
                  <SelectItem value={"team"}>Ripple Mediateam</SelectItem>
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2 items-center">
              {tags &&
                tags.map((tag, index) => (
                  <p
                    key={index}
                    className="text-sm border  px-2 py-1 rounded-md h-fit items-center flex"
                    style={{
                      borderColor: colors[index % colors.length],
                      color: colors[index % colors.length],
                    }}
                  >
                    <button type="button" onClick={() => removeTag(tag)}>
                      <Icons.close className="h-3 w-3  mr-1 hover:text-primary" />
                    </button>
                    {tag}
                  </p>
                ))}
              {(!tags || tags.length < 3) && (
                <div className="relative">
                  <Input
                    onChange={(e) => setTagValue(e.target.value)}
                    value={tagValue}
                    type="text"
                    placeholder="add tags (max 3)"
                    className="text-primary"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-md p-1 h-full aspect-square bg-primary flex items-center justify-center"
                  >
                    <Icons.add className="h-4 w-4 text-background" />
                  </button>
                </div>
              )}
              {!durationSaved ? (
                <div className="relative">
                  <Input
                    onChange={(e) => {
                      setDuration(e.target.value as unknown as number);
                    }}
                    value={duration}
                    type="number"
                    placeholder="minutes to read"
                    className="text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => saveDuration(duration)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-md p-1 h-full aspect-square bg-primary flex items-center justify-center text-background"
                  >
                    save
                  </button>
                </div>
              ) : (
                <p
                  className="text-sm border  px-2 py-1 rounded-md h-fit"
                  style={{
                    borderColor: colors[3],
                    color: colors[3],
                  }}
                >
                  <button type="button" onClick={() => setDurationSaved(false)}>
                    <Icons.close className="h-3 w-3  mr-1 hover:text-primary" />
                  </button>
                  {duration} min read
                </p>
              )}
            </div>
          </div>
          <div id="blog" className=" w-full  text-primary mt-10" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border border-border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
}
