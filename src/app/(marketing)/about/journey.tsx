"use client";
import React from "react";
import {NavBar} from "../navbar";
import {Arrow, Smile, Star, Rocket} from "../icons";

import {motion, useInView} from "framer-motion";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export const Journey = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {once: true});
  const eyesRef = React.useRef(null);
  const isEyesInView = useInView(eyesRef, {once: true});

  return (
    <div className="container mx-auto py-40 flex flex-col gap-16 items-center dark  bg-background text-primary">
      <div className="flex flex-col items-center text-center gap-4 max-w-[800px] relative">
        <div className={`relative text-8xl text-primary ${h1Font.className}`}>
          <span className="relative z-20 uppercase">The Journey so Far</span>
          <motion.div
            ref={ref}
            initial={{opacity: 0, scale: 0, rotate: 180}}
            animate={
              isInView
                ? {opacity: 1, scale: 1, rotate: 0}
                : {opacity: 0, scale: 0, rotate: 180}
            }
            transition={{duration: 1, delay: 0.5, ease: "easeInOut"}}
            className="absolute -top-10 -right-16 "
          >
            <Rocket className=" h-[80px] w-[80px] z-10 hover:rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color2" />
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
            className="absolute bottom-0 -left-16"
          >
            <Star className="h-[60px] w-[60px] z-10 hover:-rotate-12 transition-all duration-300 scale-x-[-1] fill-theme-color3" />
          </motion.div>
        </div>
        <p
          className={`text-primary/70 small-text text-xl relative z-20 ${bodyFont.className}`}
        >
          What started small has evolved into a remote-first team that blends
          speed, creativity, and execution. We&apos;ve partnered with businesses
          across industries startups to enterprise crafting content that not
          only looks great, but drives results.
          <br />
          <br />
          Our in-house team pulls in top talent from around the world.
          We&apos;re young, driven, and digital-native—deeply tuned into how
          modern marketing works. From Gen Z to niche online communities, we
          understand what grabs attention and builds real engagement in
          today&apos;s fast-moving digital world.
          <br />
          <br />
          At our core is a mindset of constant learning. Every project is a
          chance to improve, push boundaries, and deliver better than the last.
        </p>
        <Arrow className="absolute top-0 right-0 translate-x-full -translate-y-full h-[80px] w-[120px] " />
        <Arrow className="absolute top-0 left-0 -translate-x-full -translate-y-full  rotate-[250deg] h-[80px] w-[120px]" />
        <Arrow className="absolute bottom-0 right-0 translate-x-full translate-y-full  rotate-[70deg] h-[80px] w-[120px]" />
        <Arrow className="absolute bottom-0 left-0 -translate-x-full translate-y-full  rotate-180 h-[80px] w-[120px]" />
      </div>
    </div>
  );
};
