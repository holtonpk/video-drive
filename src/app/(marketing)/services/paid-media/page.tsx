import React from "react";
import {ServiceHero} from "../service-hero";
import "../../marketing-style.css";
import {Footer} from "../../footer";
import {FAQ, FAQData as FAQDataType} from "../faq";
import {HeroGraphic} from "./hero-graphic";
import {ServiceDetails} from "../service-details";
import {Rocket, Eyes} from "../../icons";
import {EmphSection} from "../../emph-section";
import {Process, ProcessData as ProcessDataType} from "../process";
import {constructMetadata} from "@/lib/utils";
import {
  PaidMediaServiceDetailsData,
  PaidMediaProcessData,
  PaidMediaFAQData,
} from "../data";
import {Services} from "../services";
import {Team} from "../team";

export const metadata = constructMetadata({
  title: "Ripple Media - Paid Media",
  description:
    "We run paid campaigns across Google Ads, Microsoft Bing, Meta (Facebook & Instagram), LinkedIn, YouTube, and TikTok. Each platform is selected based on your target audience and goals.",
});

const Page = () => {
  return (
    <div className="min-h-screen p-0">
      <ServiceHero
        label="Paid Media"
        heading="Maximise ROI With Every Click"
        body="Our paid media services are built to drive results and maximize ROI. We use data-backed strategies to launch campaigns tailored to your goals, audience, and platform—turning ad spend into measurable growth."
        color="#FFF1FD"
      >
        <HeroGraphic />
      </ServiceHero>
      <ServiceDetails
        title="Take control of your content"
        description="We bring energy, expertise, and originality to every project pushing boundaries, moving fast, and delivering content built to win."
        details={PaidMediaServiceDetailsData}
        color="#FFB3DC"
      />
      <EmphSection
        title="Managed for Maximum Impact"
        description="From planning to optimization, our paid media services are built for full-funnel performance. We handle everything—targeting, creative, tracking, and testing—so you get results that scale, fast."
        Icon1={
          <Rocket className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
        }
        Icon2={
          <Eyes className="h-[50px] w-[50px] md:h-[80px] md:w-[80px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
        }
      />
      <Process data={PaidMediaProcessData} />
      <Team />
      <FAQ data={PaidMediaFAQData} />
      <Services />
      <div className="bg-background  dark">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
