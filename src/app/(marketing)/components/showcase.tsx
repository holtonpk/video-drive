"use client";
import React from "react";
import {motion} from "framer-motion";

export const Showcase = () => {
  const text =
    "All your videos will be written, edited and posted by our in house team".split(
      " "
    );
  return (
    <div className="flex flex-col pb-20 gap-8">
      <h1 className="text-primary font1-bold text-4xl md:text-6xl text-center">
        Showcase
      </h1>
      <div className="flex flex-col gap-2 md:gap-4 md:w-[600px] w-[80%] items-start md:mx-auto ">
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
              className="font1-light text-xl md:text-2xl text-white  "
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <p className="font1-light text-2xl text-white  w-full h-fit md:max-w-[400px] "></p>
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
          className="font1-light text-xl md:text-2xl text-white  w-full h-fit md:max-w-[500px]  "
        >
          Here are some of our best work. Custom made for some of the amazing
          companies we have worked with.
        </motion.div>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 justify-between md:max-w-[800px] mx-auto">
        <div
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( #F51085 1px, transparent 0.4px)`,
            backgroundSize: "8px 8px",
          }}
          className="w-full aspect-[9/16] p-4"
        >
          <div className="w-full relative  h-full bg-muted rounded-[6px] border"></div>
        </div>
        <div
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( #F51085 1px, transparent 0.4px)`,
            backgroundSize: "8px 8px",
          }}
          className="w-full aspect-[9/16] p-4"
        >
          <div className="w-full relative  h-full bg-muted rounded-[6px] border"></div>
        </div>
        <div
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( #F51085 1px, transparent 0.4px)`,
            backgroundSize: "8px 8px",
          }}
          className="w-full aspect-[9/16] p-4"
        >
          <div className="w-full relative  h-full bg-muted rounded-[6px] border"></div>
        </div>
        <div
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( #F51085 1px, transparent 0.4px)`,
            backgroundSize: "8px 8px",
          }}
          className="w-full aspect-[9/16] p-4"
        >
          <div className="w-full relative  h-full bg-muted rounded-[6px] border"></div>
        </div>
      </div>
    </div>
  );
};
