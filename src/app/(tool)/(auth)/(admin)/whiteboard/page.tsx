import React from "react";
import Whiteboard from "./whiteboard";
import {Metadata} from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: `5/19 Meeting Whiteboard`,
    description: "5/19 Meeting Whiteboard",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-fit min-h-screen container mx-auto">
      <Whiteboard />
    </div>
  );
};

export default Page;
