import React from "react";
import {ServiceHero} from "../service-hero";
import "../../marketing-style.css";
import {Team} from "../team";
import {Footer} from "../../footer";
import {FAQ} from "../faq";
import {ServiceDetails} from "../service-details";
import {Eyes, Rocket} from "../../icons";
import {EmphSection} from "../../emph-section";
import {Process} from "../process";
import {HeroGraphic} from "./hero-graphic";
import {constructMetadata} from "@/lib/utils";
import {
  SocialManagementServiceDetailsData,
  SocialManagementProcessData,
  SocialMediaFAQData,
} from "../data";
import {Services} from "../services";

export const metadata = constructMetadata({
  title: "Ripple Media - Social Media Management",
  description:
    "We manage your social media presence, creating content, engaging with your audience, and driving measurable growth on the platforms that matter most.",
});

const Page = () => {
  return (
    <div className="min-h-screen p-0">
      <ServiceHero
        label="Social Media Management"
        heading="Engage with your audience"
        body="Social media marketing that builds real connections, strengthens brand loyalty, and drives measurable growth on the platforms that matter most."
        color="#E3F7F7"
      >
        <HeroGraphic />
      </ServiceHero>
      <ServiceDetails
        title="Unlock The Power Of Social"
        description="With the right strategy, social media becomes more than just posts—it becomes a tool for connection, growth, and lasting impact."
        details={SocialManagementServiceDetailsData}
        color="#6EE6ED"
      />
      <EmphSection
        title="We don't just manage your social media, we build your brand"
        description="Every post, comment, and strategy is crafted to amplify your voice, grow your community, and position your brand exactly where it needs to be—front and center."
        Icon1={
          <Rocket className="h-[80px] w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
        }
        Icon2={
          <Eyes className="h-[60px] w-[60px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
        }
      />
      <Process data={SocialManagementProcessData} />
      <Team />
      <FAQ data={SocialMediaFAQData} />
      <Services />
      <div className="bg-background  dark">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
