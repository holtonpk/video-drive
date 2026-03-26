import React from "react";
import localFont from "next/font/local";
import {Footer} from "../../footer";
import {NavBar} from "../../navbar";
import {BlogBody} from "./blog-body";
import {Metadata} from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: `Ripple Media | The Ultimate Guide to Startup Launch Videos`,
    description:
      "We analyzed 1,000+ startup launch videos, across YC companies, breakout products, and everything in between, to figure out what actually works.",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

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
