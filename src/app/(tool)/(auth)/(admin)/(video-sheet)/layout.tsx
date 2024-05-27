import React from "react";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Video Sheet",
  description: "Agency Video Sheet",
});

const VideoSheetLayout = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
};

export default VideoSheetLayout;
