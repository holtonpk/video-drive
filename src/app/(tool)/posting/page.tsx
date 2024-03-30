import React from "react";
import PostingSheet from "./posting-sheet";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Posting",
  description: "Agency Posting Sheet",
  image: "image/favicon.ico",
});

const Page = () => {
  return <PostingSheet />;
};

export default Page;
