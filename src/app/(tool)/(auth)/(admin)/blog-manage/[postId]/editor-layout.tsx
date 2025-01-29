"use client";
import * as React from "react";
import {Editor} from "../components/editor";
import {Icons} from "@/components/icons";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {useEffect, useState} from "react";
import {BlogPost} from "@/config/data";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  getStorage,
} from "firebase/storage";

export default function EditorLayout({postId}: {postId: string}) {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);

  useEffect(() => {
    const fetchPost = async () => {
      const FindBlogPost = async (id: string) => {
        const post = await getDoc(doc(db, "blog", id));
        console.log("postData", post.data());
        return {id: id, ...post.data()} as BlogPost;
      };
      const post = await FindBlogPost(postId);

      setPost(post);
    };

    fetchPost();
  }, [postId]);

  console.log("post", post);

  return (
    <>
      {post ? (
        <Editor post={post} />
      ) : (
        <div className="h-screen w-full flex pt-20 justify-center ">
          <Icons.spinner className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}
