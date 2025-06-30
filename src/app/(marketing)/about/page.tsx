import React from "react";
import {NavBar} from "../navbar";
import {Journey} from "./journey";
import {Reviews} from "../(landing)/reviews";
import {Footer} from "../footer";
import {WhyUs} from "./why-us";
import {Hero} from "./hero";
import {Testimonial} from "./testimonial";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Ripple Media - About Us",
  description:
    "We combine sharp storytelling, platform-native strategy, and high-speed execution to create short-form content that grabs attention, builds engagement, and fuels growth. Turning views into value.",
});

const Page = () => {
  return (
    <div id="hero" className="flex flex-col min-h-screen">
      <NavBar />
      <Hero />
      <Journey />
      <Testimonial />
      <WhyUs />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Page;
