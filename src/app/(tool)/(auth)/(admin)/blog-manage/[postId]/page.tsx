import React from "react";
import EditorLayout from "./editor-layout";
import "./blog-style.css";

interface EditorPageProps {
  params: {postId: string};
}

export default function EditorPage({params}: EditorPageProps) {
  return <EditorLayout postId={params.postId} />;
}
