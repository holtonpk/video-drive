import React from "react";
import EditorLayout from "./editor-layout";
import "./blog-style.css";

interface PageProps {
  params: {postId: string};
}

export default async function Page({
  params,
}: {
  params: Promise<{postId: string}>;
}) {
  const postId = await params;

  return <EditorLayout postId={postId.postId} />;
}
