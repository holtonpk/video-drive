import React from "react";
import {Button} from "@/components/ui/button";
import {NewVideoProvider} from "./new-video-context";
import NewVideo from "./new-video";
const Page = () => {
  return (
    <div className=" w-screen  flex flex-col space-y-4">
      <NewVideoProvider>
        <NewVideo />
      </NewVideoProvider>
    </div>
  );
};

export default Page;
