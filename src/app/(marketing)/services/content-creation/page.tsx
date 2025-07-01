import React from "react";
import {ServiceHero} from "../service-hero";
import "../../marketing-style.css";
import {Bolt, Eyes} from "../../icons";
import {Team} from "../team";
import {Footer} from "../../footer";
import {Process} from "../process";
import {FAQ} from "../faq";
import {constructMetadata} from "@/lib/utils";
import {ServiceDetails} from "../service-details";
import {EmphSection} from "../../emph-section";
import {HeroGraphic} from "./hero-graphic";
import {
  ContentCreationServiceDetailsData,
  ContentCreationProcessData,
  ContentCreationFAQData,
} from "../data";
import {Services} from "../services";

export const metadata = constructMetadata({
  title: "Ripple Media - Content Creation",
  description:
    "We create content that is not only engaging but also optimized for algorithms. Our powerful team of writers and editors work fast at the highest quality.",
});

const Page = () => {
  return (
    <div className="min-h-screen p-0">
      <ServiceHero
        label="Content Creation"
        heading="Top-Tier Talent. Proven Results"
        body="We craft content that captivates audiences and plays nice with the algorithm. Our sharp team of writers and editors move fast—delivering high-quality work without compromise."
        color="#EAFAEA"
      >
        <HeroGraphic />
      </ServiceHero>
      <ServiceDetails
        title="Take control of your content"
        description="We bring energy, expertise, and originality to every project pushing boundaries, moving fast, and delivering content built to win."
        details={ContentCreationServiceDetailsData}
        color="#C9F292"
      />
      {/* <Platforms /> */}
      <EmphSection
        title="Content Optimized for every platform"
        description="From TikTok and Instagram Reels to YouTube Shorts and LinkedIn, we craft platform-native content that performs. Our team knows what each algorithm favors—and how to grab attention fast. With sharp writing, fast editing, and trend-savvy execution, we deliver high-quality content built to win the scroll, no matter where it lives."
        Icon1={
          <Bolt className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
        }
        Icon2={
          <Eyes className="h-[50px] w-[50px] md:h-[80px] md:w-[80px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
        }
      />
      <Process data={ContentCreationProcessData} />
      <Team />
      <FAQ data={ContentCreationFAQData} />
      <Services />
      <div className="bg-background  dark">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
