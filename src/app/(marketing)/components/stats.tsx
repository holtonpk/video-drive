"use client";

import React from "react";
import {Plus, MoveUp} from "lucide-react";

import {motion, useMotionValue, useTransform, animate} from "framer-motion";
import {useInView} from "react-intersection-observer";

const colors = ["#F51085", "#971EF7", "#1963F0", "#53E8B3"];

export const Stats = () => {
  const stats = [
    {
      title: "Impressions",
      value: 10000000,
      description:
        "We've generated millions of organic impressions across all platforms",
    },
    {
      title: "Leads Generated",
      value: 10000,
      description: "Our content is driving thousands of qualified leads week",
    },
    {
      title: "Followers",
      value: 250000,
      description:
        "We've grown the social following of our clients by hundreds of thousands",
    },
    {
      title: "new users",
      value: 5000,
      description:
        "Thousands of new customers signing up after watching one of our videos ",
    },
  ];

  return (
    <div id="stats" className="text-black px-4 md:container md:mt-20">
      <div className="grid  md:grid-cols-2 gap-4 md:gap-10 relative max-w-[800px] mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="w-full   "
            variants={{
              hidden: {y: 20, opacity: 0},

              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.2 * index,
                  duration: 0.5, // Duration of the animation for each item
                },
              },
            }}
            initial="hidden" // Start in the hidden state
            whileInView="visible" // Animate to the visible state when in view
            viewport={{once: true}} // Ensures animation only plays once
          >
            <div
              style={{
                borderColor: colors[index],
              }}
              className={`w-full rounded-md p-4 gap-2 flex items-center md:items-start justify-between flex-col text-primary overflow-hidden relative border`}
            >
              <div
                style={{
                  backgroundColor: "transparent",
                  backgroundImage: `radial-gradient(${colors[index]} 1px, transparent 0.4px)`,
                  backgroundSize: "8px 8px",
                  maskImage: `
      linear-gradient(to top right, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 1) 100%)
    `,
                  WebkitMaskImage: `
      linear-gradient(to top right, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 1) 100%)
    `,
                }}
                className="h-full w-full absolute top-0 left-0 z-10"
              ></div>
              <div className="flex flex-col gap-2 relative z-20">
                <StatNumber value={stat.value} index={index} />
                <h1 className="text-3xl font-bold capitalize font1">
                  {stat.title}
                </h1>
                <h2 className="text-sm font-bold text-center md:text-left">
                  {stat.description}
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StatNumber = ({value, index}: {value: number; index: number}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const formatted = useTransform(rounded, (value) => value.toLocaleString());
  const {ref, inView} = useInView();

  React.useEffect(() => {
    if (inView) {
      animate(count, value, {
        duration: 3,
      });
    }
  }, [inView, value, count]); // Trigger animation on visibility change or value change

  return (
    <div
      style={{color: colors[index]}}
      className="flex items-center w-fit mt-4 "
    >
      <motion.h1 ref={ref} className="font1 text-3xl flex">
        {formatted}
      </motion.h1>
      <Plus className="h-4 w-4  fill-primary ml-1 " />
    </div>
  );
};
