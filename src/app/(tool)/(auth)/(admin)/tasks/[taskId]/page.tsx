import {constructMetadata} from "@/lib/utils";
import {Metadata} from "next";
import Task from "./task";

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

const Page = ({params}: {params: {taskId: string}}) => {
  return <Task taskId={params.taskId} />;
};

export default Page;
