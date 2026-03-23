import React from "react";
import {NavBar} from "../navbar";
import {Footer} from "../footer";
import {Hero} from "./hero";
import {constructMetadata} from "@/lib/utils";
import LaunchLibraryPageClient from "./launch-library-page-client";

export const metadata = constructMetadata({
  title: "Ripple Media - Launch Library",
  description: "A Human curated library of the best YC launch videos",
});

const Page = () => {
  return (
    <div id="hero" className="flex flex-col min-h-screen">
      <NavBar />
      <Hero />
      <LaunchLibraryPageClient />
      <Footer />
    </div>
  );
};

export default Page;
