import React from "react";
import VideoReview from "./video-review";

import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Video Review",
  description: "Video Review",
  image: "image/favicon.ico",
});

const Page = () => {
  return <VideoReview />;
};

export default Page;
