import React from "react";
import localFont from "next/font/local";
import {Footer} from "../../footer";
import {NavBar} from "../../navbar";
import {BlogBody} from "./blog-body";

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
