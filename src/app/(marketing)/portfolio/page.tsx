import {Metadata} from "next";

import React from "react";
import {NavBar} from "../navbar";
import {Footer} from "../footer";
import localFont from "next/font/local";
import {PortfolioCard} from "./portfolio-card";

const h1Font = localFont({src: "../fonts/HeadingNow-56Bold.ttf"});
const bodyFont = localFont({src: "../fonts/proximanova_light.otf"});

export const generateMetadata = (): Metadata => {
  return {
    title: `Ripple Media | Portfolio`,
    description: "",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const portfolioItems = [
  {
    title: "TeamOut",
    subtitle: "Founder-led",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FTeamOut%20(Founder-led).mp4?alt=media&token=8fcc7283-1ec3-4695-9b13-443a7f1234ab",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fteamout-thumbnail.png?alt=media&token=0884c0b8-ac4f-4b5c-9012-28a0b6642a79",
    accent: "color1",
  },
  {
    title: "PerfectBit",
    subtitle: "AI Film",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fperfectbit%20hq%202.mp4?alt=media&token=e61ebbd6-05e8-4fb7-9293-2de221777ba1",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fperfectbit_thumb.jpg?alt=media&token=d6628fa6-86de-4846-9854-9d8191c94d37",
    accent: "color3",
  },
  {
    title: "Questom",
    subtitle: "AI Film",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FQuestom%20(AI%20Film).mp4?alt=media&token=0ca7c2ec-e9b7-4cfb-bbf2-1a50462e5008",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fquestom-thumbnail.png?alt=media&token=8614ff2a-6c5a-4ece-9302-e8c3c34c3998",
    accent: "color3",
  },
  {
    title: "Everest",
    subtitle: "AI Motion Graphics",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FEverest%20(AI_Motion%20graphics).mp4?alt=media&token=68ab0251-8566-4b85-bb13-7df61f6e156d",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Feverest-thumbnail.png?alt=media&token=9c44ed9b-79b0-4771-9094-733dfbb215c0",
    accent: "color3",
  },
  {
    title: "Portfolio Pilot",
    subtitle: "Motion Graphics",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FPortfolio%20Pilot%20(Motion%20graphics).mp4?alt=media&token=1bc75572-cd28-4114-bd87-ebc4a6c763f4",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fportfolio-pilot-thumbnail.png?alt=media&token=287a10c5-6f65-4ec4-9d72-e5dccb96c01e",
    accent: "color2",
  },
  {
    title: "Goodfin",
    subtitle: "Founder-led",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FGoodfin%20(Founder-led).mp4?alt=media&token=7c9b5af1-37e7-41bf-aaaf-46ed64022965",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fgoodfin-thumbnail.png?alt=media&token=27ffd8a3-7c3a-4e97-9bd6-d2a455933c0d",
    accent: "color1",
  },
  {
    title: "Hercules",
    subtitle: "Motion Graphics",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FHercules%20(Motion%20Graphics).mp4?alt=media&token=ff84a2ec-d56e-43a2-8787-dedf438efefc",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fhercules-thumbnail.png?alt=media&token=e8ca19c1-fa0e-424a-9b38-65410e20e65a",
    accent: "color2",
  },
  {
    title: "InvoFox",
    subtitle: "Founder-led",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FInvoFox%20(Founder-led).mp4?alt=media&token=ae7f1f6f-780a-4d24-89bb-8d38e612d952",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Finvofox-thumbnail.png?alt=media&token=5597a4f6-ae6c-44e9-964e-06dda770c5c7",
    accent: "color1",
  },
  {
    title: "Sitefire",
    subtitle: "Founder-led",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FSitefire%20(Founder-led).mp4?alt=media&token=b6501ec3-8a00-43fd-a9d8-57307af29d01",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Fsitefire-thumbnail.png?alt=media&token=8e7c12ae-19e1-4524-840e-e03bdb8622e3",
    accent: "color1",
  },
  {
    title: "Tusk",
    subtitle: "Founder-led",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2FTusk%20(Founder-led)%20.mp4?alt=media&token=75f2d2a1-c3e8-45cb-a7c2-3c95c25c23b1",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/portfolio%2Ftusk-thumbnail.png?alt=media&token=49f183fd-9cf2-4201-be92-1f93e7b3d580",
    accent: "color1",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-white text-[#121212]">
      <NavBar bgColor="#fff" />

      {/* Hero */}
      <section className="container mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center gap-6">
        <div
          className={`bg-theme-color1 p-2 rounded-[8px] uppercase text-primary w-fit text-2xl -rotate-6 ${h1Font.className}`}
        >
          Our Work
        </div>
        <h1
          className={`text-6xl sm:text-8xl lg:text-[120px] uppercase leading-none text-[#121212] ${h1Font.className}`}
        >
          Portfolio
        </h1>
        <p
          className={`text-lg md:text-xl text-[#121212]/60 max-w-[560px] ${bodyFont.className}`}
        >
          Brands trusted us with their biggest moments. Here&apos;s what we made
          together.
        </p>
        <div className="w-24 h-1 rounded-full bg-theme-color1 mt-2" />
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {portfolioItems.map((item, index) => (
            <PortfolioCard key={index} item={item} />
          ))}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Page;
