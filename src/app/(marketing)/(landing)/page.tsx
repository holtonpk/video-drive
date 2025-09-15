import React from "react";
import {Hero} from "./hero/hero";
import {Process} from "./process";
import {Reviews} from "./reviews";
import {Team} from "./team";
import {Footer} from "../footer";
import {constructMetadata} from "@/lib/utils";
import {Bolt, Eyes, Slash} from "../icons";
import {EmphSection} from "../emph-section";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export const metadata = constructMetadata({
  title: "Ripple Media",
  description:
    "We combine sharp storytelling, platform-native strategy, and high-speed execution to create short-form content that grabs attention, builds engagement, and fuels growth. Turning views into value.",
});

const Page = () => {
  return (
    <div className="bg-background min-h-screen ">
      <div className="relative z-20 ">
        <Hero />
        <EmphSection
          title={`Scroll-Stopping Videos That Drive Real Results`}
          description="Every post, comment, and strategy is crafted to amplify your voice, grow your community, and position your brand exactly where it needs to be—front and center."
          Icon1={
            <Bolt className="h-[50px] w-[50px] md:h-[80px] md:w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
          }
          Icon2={
            <Eyes className="h-[50px] w-[50px] md:h-[80px] md:w-[80px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
          }
        />
        <Process
          Heading={
            <div className="flex flex-col gap-4 ">
              <h1
                className={`text-6xl sm:text-8xl  text-center uppercase relative ${h1Font.className}`}
              >
                Helping you <br />{" "}
                <span className="relative ">
                  transform
                  <Slash className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110%] fill-theme-color3" />
                </span>{" "}
                your <br /> Marketing
              </h1>
              <p
                className={`text-center text-base md:text-lg xl:text-xl text-primary/70  mx-auto max-w-[400px] sm:max-w-[600px] ${bodyFont.className}`}
              >
                We combine sharp storytelling, platform-native strategy, and
                high-speed execution to create short-form content that grabs
                attention, builds engagement, and fuels growth. Turning views
                into value.
              </p>
            </div>
          }
        />
        <Reviews />
        <Team
          title="A dedicated team of professionals"
          description="We bring energy, expertise, and creativity to every project—driven to go the extra mile and built to help you win."
        />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
