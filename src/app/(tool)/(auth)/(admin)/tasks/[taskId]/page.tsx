"use client";
import {constructMetadata} from "@/lib/utils";
import {Metadata} from "next";
import Task from "./task";
import {useRouter} from "next/router";
export const generateMetadata = ({
  params,
}: {
  params: {taskId: string};
}): Metadata => {
  return {
    title: `Task - ${params.taskId}`,
    description: "Agency Video Sheet",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = () => {
  const router = useRouter();
  const {taskId} = router.query;
  return <Task taskId={taskId as string} />;
};

export default Page;
