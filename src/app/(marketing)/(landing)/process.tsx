"use client";
import React, {useEffect, useState, useRef} from "react";
import Link from "next/link";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});
// heading should be an element
export const Process = ({Heading}: {Heading: React.ReactNode}) => {
  const [isInView, setIsInView] = useState(false);

  // if #hero is in view isInView is true
  useEffect(() => {
    const processElement = document.getElementById("process");

    if (!processElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.01, // Trigger when 1% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(processElement);

    return () => {
      observer.unobserve(processElement);
    };
  }, []);

  useEffect(() => {
    const videoElements = document.querySelectorAll(".process-video");

    videoElements.forEach((video) => {
      const videoElement = video as HTMLVideoElement;
      if (!isInView) {
        videoElement.pause();
      } else {
        videoElement.play().catch((error: Error) => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented:", error);
        });
      }
    });
  }, [isInView]);

  return (
    <div id="process" className="container flex flex-col">
      {Heading}
      <div
        id="services"
        className="flex flex-col lg:grid lg:grid-cols-3 gap-20 xl:gap-10 mt-24"
      >
        <div className="w-full  lg:max-w-[400px]  bg-[#202020] h-fit rounded-3xl relative  flex flex-col sm:grid sm:grid-cols-2  lg:flex  lg:flex-col ">
          <div
            className={`absolute bg-theme-color3 rounded-[8px] top-0 -translate-y-1/2 left-6 -rotate-3 text-3xl sm:text-4xl  p-2 text-background uppercase ${h1Font.className}`}
          >
            Content Creation
          </div>
          <video
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/social_ripple_media_httpss.mj.run1-JGTcfXcWw_Create_a_seamless_loop__a1513d2c-ed14-4011-91b6-382727edea07_0.mp4?alt=media&token=969e329f-cd9f-486b-b2dd-1a26c3269dd6"
            className="aspect-square w-full rounded-3xl process-video"
            muted
            loop
            playsInline
          />
          <div className="flex flex-col gap-4 p-4 pt-0 sm:items-start sm:justify-center ">
            <p
              className={` text-primary text-xl text-center sm:text-left lg:text-center ${bodyFont.className}`}
            >
              We craft purpose-driven content that stops the scroll. With 10+
              years of viral success, our team knows how to spark engagement and
              get your brand seen.
            </p>
            <Link
              href="/services/content-creation"
              className={`text-xl w-full text-center border-2 border-white rounded-full px-6 py-2 hover:border-theme-color3 hover:ring-2 ring-offset-2 ring-offset-background ring-theme-color3 ${h2Font.className}`}
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="w-full  lg:max-w-[400px]  bg-[#202020] h-fit rounded-3xl relative  flex flex-col sm:grid sm:grid-cols-2  lg:flex  lg:flex-col ">
          <div
            className={`absolute bg-theme-color2 rounded-[8px] top-0 -translate-y-1/2 left-6 -rotate-3 text-3xl sm:text-4xl  p-2 text-background uppercase ${h1Font.className}`}
          >
            Social Management
          </div>
          <video
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/social_ripple_media_httpss.mj.runYhCUs5GnHsU_Create_a_seamless_loop__6a50952f-5226-4e9b-adbd-ecacd77f093a_0.mp4?alt=media&token=2dfdb1a7-1317-45d5-8ac7-32c91682709c"
            className="aspect-square w-full rounded-3xl process-video "
            muted
            loop
            playsInline
          />
          <div className="flex flex-col gap-4 p-4 pt-0 sm:items-start sm:justify-center ">
            <p
              className={` text-primary text-xl text-center sm:text-left lg:text-center ${bodyFont.className}`}
            >
              From posting to engagement, we handle your entire social
              presence—building awareness, growing your audience, and keeping
              your brand top of mind.
            </p>
            <Link
              href="/services/social-management"
              className={`text-xl w-full text-center border-2 border-white rounded-full px-6 py-2 hover:border-theme-color2 hover:ring-2 ring-offset-2 ring-offset-background ring-theme-color2 ${h2Font.className}`}
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="w-full  lg:max-w-[400px]  bg-[#1A1A1A] h-fit rounded-3xl relative  flex flex-col sm:grid sm:grid-cols-2  lg:flex  lg:flex-col ">
          <div
            className={`absolute bg-theme-color1 rounded-[8px] top-0 -translate-y-1/2 left-6 -rotate-3 text-3xl sm:text-4xl  p-2 text-background uppercase ${h1Font.className}`}
          >
            Paid Media
          </div>
          <video
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/social_ripple_media_httpss.mj.runpQy1I133QYk_Create_a_seamless_loop__1244c476-b91f-4a0b-9521-d6d0269e8629_2.mp4?alt=media&token=481aee2a-4312-40f4-9e24-66daaa99aa8c"
            className="aspect-square w-full rounded-3xl process-video"
            muted
            loop
            playsInline
          />

          <div className="flex flex-col gap-4 p-4 pt-0 sm:items-start sm:justify-center ">
            <p
              className={` text-primary text-xl text-center sm:text-left lg:text-center ${bodyFont.className}`}
            >
              We run targeted ad campaigns built to perform. Backed by data, we
              drive clicks, conversions, and real ROI tailored to your goals.
              <br />
              <br />
            </p>
            <Link
              href="/services/paid-media"
              className={`text-xl w-full uppercase text-center border-2 border-white rounded-full px-6 py-2  hover:border-theme-color1 hover:ring-2 ring-offset-2 ring-offset-background ring-theme-color1 ${h2Font.className}`}
            >
              Learn More
            </Link>
          </div>
          {/* <div className="flex flex-col gap-4">
            <div className="h-1 border-b border-dashed border-primary/20 w-full"></div>
            <button className="hover:text-theme-color1 text-left  underline hover:no-underline text-2xl big-text">
              Discover
            </button>
            <div className="h-1 border-b border-dashed border-primary/20 w-full"></div>
            <button className="hover:text-theme-color1 text-left  underline hover:no-underline text-2xl big-text">
              Plan
            </button>
            <div className="h-1 border-b border-dashed border-primary/20 w-full"></div>

            <button className="hover:text-theme-color1 text-left  underline hover:no-underline text-2xl big-text">
              Create
            </button>
            <div className="h-1 border-b border-dashed border-primary/20 w-full"></div>

            <button className="hover:text-theme-color1 text-left  underline hover:no-underline text-2xl big-text">
              Launch
            </button>
            <div className="h-1 border-b border-dashed border-primary/20 w-full"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
