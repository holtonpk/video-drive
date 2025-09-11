"use client";

import {Metadata} from "next";
import Task from "./task";
import {useRouter} from "next/router";

const Page = () => {
  const router = useRouter();
  const {taskId} = router.query;
  return <Task taskId={taskId as string} />;
};

export default Page;
