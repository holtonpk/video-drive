"use client";

import React from "react";
import {motion} from "framer-motion";

export const IntroText = () => {
  const text =
    "We specialize in creating viral, short-form content for fast growing tech startups, helping them connect with audiences quickly and effectively.".split(
      " "
    );

  return (
    <div
      id="about"
      className="flex flex-col gap-4 md:gap-8 w-[90%] md:w-[600px] items-start mx-auto py-20 "
    >
      <div className="flex gap-1 md:gap-2 w-full flex-wrap">
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
            className="font1-light text-xl md:text-3xl text-white  "
            key={i}
          >
            {el}{" "}
          </motion.span>
        ))}
      </div>
      <p className="font1-light text-3xl text-white  w-full h-fit max-w-[400px] "></p>
      <motion.div
        variants={{
          hidden: {opacity: 0},
          visible: {
            opacity: 1,
            transition: {
              delay: 2,
              duration: 0.5,
            },
          },
        }}
        initial="hidden" // Start in the hidden state
        whileInView="visible" // Animate to the visible state when in view
        viewport={{once: true}} // Ensures animation only plays once
        className="font1-light text-xl md:text-3xl text-white  w-full h-fit max-w-[500px]  "
      >
        From concept to execution, we deliver content that amplifies brand
        presence and drives real users.
      </motion.div>
    </div>
  );
};
