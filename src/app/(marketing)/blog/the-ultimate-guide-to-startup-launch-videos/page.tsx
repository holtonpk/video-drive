import React from "react";
import localFont from "next/font/local";
import {Footer} from "../../footer";
import {NavBar} from "../../navbar";
import {BlogBody} from "./blog-body";
import {Metadata} from "next";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: `Ripple Media | The Ultimate Guide to Startup Launch Videos`,
  description:
    "We analyzed 1,000+ startup launch videos, across YC companies, breakout products, and everything in between, to figure out what actually works.",
});

const Page = () => {
  return (
    <div className="flex flex-col h-fit min-h-screen">
      <NavBar />
      <div className="min-w-screen flex flex-col overflow-hidden">
        <BlogBody />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
