"use client";
import React from "react";
import {Bolt, Eyes, Arrow} from "../icons";
import {motion, useInView} from "framer-motion";

export const Section1 = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {once: true});
  const eyesRef = React.useRef(null);
  const isEyesInView = useInView(eyesRef, {once: true});

  return (
    <div className="container relative py-16 mb-20 max-w-[800px] mx-auto flex flex-col items-center gap-4 ">
      <div className="flex flex-col relative  h-fit w-full">
        <h1 className="text-8xl big-text-bold text-center relative">
          <span className="relative z-20">
            We Make Scroll-Stopping Videos That Drive Real Results
          </span>
          <motion.div
            ref={ref}
            initial={{opacity: 0, scale: 0, rotate: 180}}
            animate={
              isInView
                ? {opacity: 1, scale: 1, rotate: 0}
                : {opacity: 0, scale: 0, rotate: 180}
            }
            transition={{duration: 1, delay: 0.5, ease: "easeInOut"}}
            className="absolute -top-10 right-10 "
          >
            <Bolt className=" h-[80px] w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
          </motion.div>
          {/* flip eyes on the y axis */}
          <motion.div
            ref={eyesRef}
            initial={{opacity: 0, scale: 0, rotate: -180}}
            animate={
              isEyesInView
                ? {opacity: 1, scale: 1, rotate: 0}
                : {opacity: 0, scale: 0, rotate: -180}
            }
            transition={{duration: 1, delay: 0.8, ease: "easeInOut"}}
            className="absolute bottom-20 left-0"
          >
            <Eyes className="h-[60px] w-[60px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
          </motion.div>
        </h1>
        <p className="text-center small-text text-xl text-primary/70">
          We combine sharp storytelling, platform-native strategy, and
          high-speed execution to create short-form content that grabs
          attention, builds engagement, and fuels growth. Turning views into
          value.
        </p>
        <Arrow className="absolute top-0 right-0 translate-x-full -translate-y-full h-[80px] w-[120px] " />
        <Arrow className="absolute top-0 left-0 -translate-x-full -translate-y-full  rotate-[250deg] h-[80px] w-[120px]" />
        <Arrow className="absolute bottom-0 right-0 translate-x-full translate-y-full  rotate-[70deg] h-[80px] w-[120px]" />
        <Arrow className="absolute bottom-0 left-0 -translate-x-full translate-y-full  rotate-180 h-[80px] w-[120px]" />
      </div>
    </div>
  );
};
