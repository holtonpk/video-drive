import React from "react";
import {NavBar} from "../navbar";
import {Footer} from "../footer";
import {Hero} from "./hero";
import {constructMetadata} from "@/lib/utils";
import LaunchLibraryPageClient from "./launch-library-page-client";
import {getHomepageVideos} from "@/lib/launch-library/get-homepage-videos";

export const metadata = constructMetadata({
  title: "Ripple Media - Launch Library",
  description: "A Human curated library of the best YC launch videos",
});

export const revalidate = 3600;

export default async function Page() {
  const homepageVideos = await getHomepageVideos();

  return (
    <div id="hero" className="flex flex-col min-h-screen">
      <NavBar />
      <Hero />
      <LaunchLibraryPageClient homepageVideos={homepageVideos} />
      <Footer />
    </div>
  );
}
