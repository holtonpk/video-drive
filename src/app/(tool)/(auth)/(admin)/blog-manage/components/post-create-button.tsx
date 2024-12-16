"use client";

import * as React from "react";
import {useRouter} from "next/navigation";

import {cn} from "@/lib/utils";
import {ButtonProps, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Icons} from "@/components/icons";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth, UserData} from "@/context/user-auth";

interface PostCreateButtonProps extends ButtonProps {}

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const {CreateBlogPost} = useAdminStorage()!;
  const {currentUser} = useAuth()!;

  const CreateBlogPost = async (currentUser: UserData | undefined) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      const response = await addDoc(collection(db, "blog"), {
        title: "Untitled Post",
        content: "",
        published: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: id,
        author: {
          id: currentUser?.uid,
          avatar: currentUser?.photoURL,
          name: currentUser?.displayName,
        },
      });
      return {id: id};
    } catch {
      return "error";
    }
  };

  async function onClick() {
    setIsLoading(true);
    console.log("CreateBlogPost", currentUser);
    const post = await CreateBlogPost(currentUser);

    setIsLoading(false);

    if (post == "error") {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not created. Please try again.",
        variant: "destructive",
      });
    }

    // This forces a cache invalidation.
    router.refresh();
    router.push(`/blog-manage/${post.id}`);
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({variant}),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      New post
    </button>
  );
}
