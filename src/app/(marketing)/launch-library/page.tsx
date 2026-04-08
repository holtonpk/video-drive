import React from "react";
import {NavBar} from "../navbar";
import {Footer} from "../footer";
import {Hero} from "./hero";
import {constructMetadata} from "@/lib/utils";
import LaunchLibrarySearchClient from "./launch-library-search-client";
import {TopTen} from "./top-ten";
import {LaunchLibraryContent} from "./launch-library-content";
import {getHomepageVideos} from "@/lib/launch-library/get-homepage-videos";

export const metadata = constructMetadata({
  title: "Ripple Media - Launch Library",
  description: "A Human curated library of the best YC launch videos",
});

/** Avoid ISR prerender body size limit on Vercel (FALLBACK_BODY_TOO_LARGE). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Page() {
  const homepageVideos = await getHomepageVideos();

  return (
    <div
      id="launch-library"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      className="flex flex-col min-h-[100dvh] bg-[#121212]"
    >
      <NavBar />
      <Hero />
      <LaunchLibrarySearchClient>
        <TopTen videos={homepageVideos} />
        <LaunchLibraryContent videos={homepageVideos} />
      </LaunchLibrarySearchClient>
      <Footer />
    </div>
  );
}
