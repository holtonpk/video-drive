"use client";

import React from "react";
import {Plus, MoveUp} from "lucide-react";

import {motion, useMotionValue, useTransform, animate} from "framer-motion";
import {useInView} from "react-intersection-observer";

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
        "We've grown the social following of our clients by tens of thousands",
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
      <div className="grid  md:grid-cols-4 gap-4 md:gap-10 relative">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="w-full  h-full "
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
            <div className="w-full rounded-lg p-4 flex items-center md:items-start justify-between flex-col text-primary relative bg-white/40">
              <h1 className="text-3xl font-bold capitalize font1">
                {stat.title}
              </h1>
              <h2 className="text-sm font-bold text-center md:text-left">
                {stat.description}
              </h2>
              <StatNumber value={stat.value} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StatNumber = ({value}: {value: number}) => {
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
    <div className="flex items-start w-fit mt-4">
      <MoveUp className="h-6 w-8 text-primary " />
      <motion.h1 ref={ref} className="font1 text-5xl flex">
        {formatted}
      </motion.h1>
      <Plus className="h-8 w-8 text-primary fill-primary ml-2 mt-1" />
    </div>
  );
};
