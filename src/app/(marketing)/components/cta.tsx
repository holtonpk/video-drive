"use client";
import React from "react";
import {motion} from "framer-motion";
import {LinkButton} from "@/components/ui/link";
import {Icons} from "@/components/icons";

export const CTA = () => {
  const text = "Amplify your business with Ripple Media".split(" ");

  return (
    <div className="flex flex-col h-fit  pb-32 container items-center ">
      <div className="flex gap-2 flex-wrap mx-auto w-fit justify-center md:justify-normal">
        {text.map((el, i) => (
          <motion.span
            variants={{
              hidden: {opacity: 0},
              visible: {
                opacity: 1,
                transition: {
                  delay: i / 10,
                  duration: 0.25,
                },
              },
            }}
            initial="hidden" // Start in the hidden state
            whileInView="visible" // Animate to the visible state when in view
            viewport={{once: true}} // Ensures animation only plays once
            className="font1-bold text-3xl md:text-4xl text-white  "
            key={i}
          >
            {el}{" "}
          </motion.span>
        ))}
      </div>

      <motion.div
        variants={{
          hidden: {opacity: 0},
          visible: {
            opacity: 1,
            transition: {
              delay: 1,
              duration: 0.25,
            },
          },
        }}
        initial="hidden" // Start in the hidden state
        whileInView="visible" // Animate to the visible state when in view
        viewport={{once: true}} // Ensures animation only plays once
      >
        <LinkButton
          href="/work-with-us"
          className="w-fit mt-4 group relative z-20 bg-[#1863F0] hover:bg-[#1863F0] rounded-[4px] items-center"
        >
          <span className="text-white font1">Book a call today</span>
          <Icons.chevronRight className="group-hover:ml-4 ml-2 transition-all duration-300 text-white h-4 w-4" />
        </LinkButton>
      </motion.div>
    </div>
  );
};
