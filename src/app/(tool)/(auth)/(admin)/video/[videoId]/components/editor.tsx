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
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";

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
        holder: "script-editor",
        onReady() {
          ref.current = editorRef.current;
        },
        onChange: () => {
          SaveData();
        },
        data: body.content,
        inlineToolbar: true,
        placeholder: "Type the script here...",
        tools: {
          header: Header,

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

  const SaveBlogPost = async (id: string, data: any) => {
    return null;
  };

  async function onSave() {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    console.log("blocks:", blocks);

    setScript(blocks);

    // const response = await SaveBlogPost(post.id, {
    //   title: data.title || "Untitled Post",
    //   content: blocks,
    // });
    setIsSaving(false);

    // if (response == "error") {
    //   return toast({
    //     title: "Something went wrong.",
    //     description: "Your post was not saved. Please try again.",
    //     variant: "destructive",
    //   });
    // }

    // router.refresh();

    return toast({
      description: "Script has been saved",
    });
  }

  return (
    <div>
      <div className="grid w-full gap-4">
        <div
          id="script-editor"
          className="min-h-[200px] relative w-[800px] shadow-lg p-4 mx-auto text-primary border rounded-md editor-js-view"
        >
          {/* s */}
        </div>
      </div>
    </div>
  );
}
