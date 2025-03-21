import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import LoadingScreen from "@/src/app/(marketing)/components/loading-screen";
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
import UseCases from "./components/use-cases";
import Compare from "./components/compare";
import {Hero} from "./hero/hero";
import {RippleEffect} from "./hero/ripple-effect";

export const metadata = constructMetadata({
  title: "Ripple Media",
  description: "Experts in short form",
});
const HomePage = () => {
  return (
    <>
      {/* <LoadingScreen /> */}
      <div className="dark max-w-screen relative h-fit overflow-hidden over-x">
        <Background />
        <div className="h-screen w-screen absolute ">
          <RippleEffect />
        </div>
        <div className="md:h-screen max-w-screen  w-screen max-w-screen   flex flex-col  overflow-hidden">
          <Navbar show={false} />
          <div className=" h-screen max-h-screen w-full max-w-screen over-x items-center justify-center  flex z-30 relative s">
            <Hero />
            <DownArrow />
          </div>
          {/* <Banner /> */}
        </div>

        <IntroText />
        <Stats />
        <UseCases />
        <Compare />
        <Showcase />
        {/* <Process /> */}
        <Faq />
        <CTA />
        {/* 

        <Testimonials />
        <ContactUs /> */}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
