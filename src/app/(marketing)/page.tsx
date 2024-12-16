import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import LoadingScreen from "@/src/app/(marketing)/components/loading-screen";
import {Hero, Banner} from "@/src/app/(marketing)/components/hero";
import {Stats} from "@/src/app/(marketing)/components/stats";
import {Testimonials} from "@/src/app/(marketing)/components/testimonials";
import {Faq} from "@/src/app/(marketing)/components/faq";
import {Process} from "@/src/app/(marketing)/components/process";
import {ContactUs} from "@/src/app/(marketing)/components/contact";
import {constructMetadata} from "@/lib/utils";
import {IntroText} from "@/src/app/(marketing)/components/intro-text";
import {Showcase} from "@/src/app/(marketing)/components/showcase";
import {CTA} from "@/src/app/(marketing)/components/cta";
import {delay} from "framer-motion";
import DownArrow from "./components/down-arrow";

export const metadata = constructMetadata({
  title: "Whitespace Media",
  description: "Experts in short form",
});
const HomePage = () => {
  return (
    <>
      {/* <LoadingScreen /> */}
      <div className="dark ">
        <Background />
        <div className="md:h-screen   min-w-screen   flex flex-col  overflow-hidden">
          <Navbar show={true} />

          <div className=" h-screen w-full   items-center justify-center  flex   relative">
            <Hero />
            <DownArrow />
          </div>
          {/* <Banner /> */}
        </div>
        <div className="">
          <IntroText />
          <Stats />

          <Showcase />
          <Process />
          <CTA />
        </div>
        {/* 

        <Testimonials />
        <Faq />
        <ContactUs /> */}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
