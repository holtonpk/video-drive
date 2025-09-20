"use client";
import React from "react";
import EditorLayout from "./editor-layout";
import "./blog-style.css";
import {useRouter} from "next/router";

export default function Page() {
  const router = useRouter();
  const {postId} = router.query;

  return <EditorLayout postId={postId as string} />;
}
