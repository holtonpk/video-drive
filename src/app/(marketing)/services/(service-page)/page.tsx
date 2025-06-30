import React from "react";
import {NavBar} from "../../navbar";
import {Reviews} from "../../landing2/reviews";
import {Footer} from "../../footer";
import {Hero} from "../hero";
import {constructMetadata} from "@/lib/utils";
import {Process} from "../../landing2/process";

export const metadata = constructMetadata({
  title: "Ripple Media - Services",
  description:
    "We offer a range of services to help you grow your business. We offer a range of services to help you grow your business.",
});

const Page = () => {
  return (
    <div id="hero" className="flex flex-col min-h-screen dark">
      <NavBar />
      <Hero />
      <Process Heading={<></>} />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Page;
