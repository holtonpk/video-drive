"use client";
import React from "react";
import {motion} from "framer-motion";
import {useInView} from "motion/react";
import {LucideProps} from "lucide-react";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "./fonts/HeadingNowTrial-56Bold.ttf",
});
const bodyFont = localFont({
  src: "./fonts/proximanova_light.otf",
});

export const EmphSection = ({
  title,
  description,
  Icon1,
  Icon2,
}: {
  title: string;
  description: string;
  Icon1: React.ReactNode;
  Icon2: React.ReactNode;
}) => {
  const Icon1Ref = React.useRef(null);
  const isIcon1InView = useInView(Icon1Ref, {once: true});
  const Icon2Ref = React.useRef(null);
  const isIcon2InView = useInView(Icon2Ref, {once: true});

  return (
    <div className="bg-background dark py-20 sm:py-40">
      <div className="px-10 md:px-0 container mx-auto  gap-10 bg-background dark">
        <div className="flex flex-col gap-4  max-w-[600px] lg:max-w-[800px] text-center mx-auto relative py-4 ">
          <div
            className={`text-4xl sm:text-6xl md:text-7xl uppercase text-primary relative ${h1Font.className}`}
          >
            <span className="relative z-20">{title}</span>
            <motion.div
              ref={Icon1Ref}
              initial={{opacity: 0, scale: 0, rotate: 180}}
              animate={
                isIcon1InView
                  ? {opacity: 1, scale: 1, rotate: 0}
                  : {opacity: 0, scale: 0, rotate: 180}
              }
              transition={{duration: 1, delay: 0.5, ease: "easeInOut"}}
              className="absolute -top-12 md:-top-16 right-10 "
            >
              {Icon1}
            </motion.div>

            <motion.div
              ref={Icon2Ref}
              initial={{opacity: 0, scale: 0, rotate: -180}}
              animate={
                isIcon2InView
                  ? {opacity: 1, scale: 1, rotate: 0}
                  : {opacity: 0, scale: 0, rotate: -180}
              }
              transition={{duration: 1, delay: 0.8, ease: "easeInOut"}}
              className="absolute bottom-0 sm:bottom-10 lg:bottom-20 -left-0 sm:-left-10"
            >
              {Icon2}
            </motion.div>
          </div>
          <p className={`text-primary/70 text-xl ${bodyFont.className}`}>
            {description}
          </p>
          <Arrow className="absolute top-0 right-0 translate-x-1/2 md:translate-x-full -translate-y-full  h-[40px] w-[80px] md:h-[80px] md:w-[120px] " />
          <Arrow className="absolute top-0 left-0 -translate-x-1/2 md:-translate-x-full -translate-y-full  rotate-[250deg] h-[40px] w-[80px] md:h-[80px] md:w-[120px]" />
          <Arrow className="absolute bottom-0 right-0 translate-x-1/2 md:translate-x-full translate-y-full  rotate-[70deg] h-[40px] w-[80px] md:h-[80px] md:w-[120px]" />
          <Arrow className="absolute bottom-0 left-0 -translate-x-1/2 md:-translate-x-full translate-y-full  rotate-180 h-[40px] w-[80px] md:h-[80px] md:w-[120px]" />
        </div>
      </div>
    </div>
  );
};

export const Arrow = (props: LucideProps) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 153 130"
      fill="none"
    >
      <path
        d="M26.0505 101.394C64.3199 73.2451 103.47 45.2889 144.035 20.5478C145.312 19.7805 146.602 21.9086 145.424 22.7521C106.787 50.3846 67.2978 76.8851 28.693 104.607C26.5258 106.146 23.9205 102.98 26.0691 101.417L26.0505 101.394Z"
        fill="#CAF291"
      />
      <path
        d="M10.3976 109.941C8.79427 109.854 8.0691 107.858 8.94973 106.636C19.4388 92.2556 30.5178 78.3326 43.9253 66.4919C45.2775 65.2835 46.8933 67.3868 45.6683 68.6106C34.2074 80.1937 23.3126 92.2525 14.3975 105.901C26.2457 106.327 38.0522 106.211 49.9236 105.739C52.5623 105.629 53.271 109.702 50.5847 109.849C37.2095 110.654 23.7912 110.574 10.4214 109.922L10.3976 109.941Z"
        fill="#CAF291"
      />
    </svg>
  );
};
