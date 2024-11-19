"use client";

import "./editor.css";
import * as React from "react";
import Link from "next/link";
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
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";

import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import {ScrollArea} from "@/components/ui/scroll-area";

type Post = {
  id: string;
  content?: any; // Assuming you're using Prisma's Json type, adjust as needed
};

interface EditorProps {
  post: Pick<Post, "id" | "content">;
  setScript: (script: any) => void;
}

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({post, setScript}: EditorProps) {
  console.log("post === ", post);

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
        holder: "notes-editor",
        onReady() {
          ref.current = editorRef.current;
        },
        onChange: () => {
          SaveData();
        },
        data: body.content,
        inlineToolbar: true,

        placeholder: "Type any notes here...",
        tools: {
          header: Header,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
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
            setScript(savedData);
          })
          .catch((error: any) => {
            console.log("error", error);
          });
      };
    }
  }, [post, setScript]);

  return (
    <ScrollArea className="grid w-full h-[200px] border rounded-md">
      <div
        id="notes-editor"
        className="h-fit w-[500px]  relative px-4  text-primary  editor-js-view "
      ></div>
    </ScrollArea>
  );
}
