"use client";

import {motion} from "framer-motion";

export const Process = () => {
  return (
    <div className="bg-white/40 ml-auto blurBack md:right-0   h-fit md:w-[80%] rounded-l-xl mt-20  text-black py-10 ">
      <div className="md:container  p-8 md:px-16 flex flex-col">
        <motion.h1
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          className="font1 text-3xl md:text-6xl  "
        >
          Starting with a new team can be daunting, <br /> but we make it easy.
        </motion.h1>
        <div className="flex flex-col mt-10 ">
          <motion.div
            initial={{opacity: 0, y: 200}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            className="gap-8 flex flex-col"
          >
            <div className="w-full h-[1px] bg-black/20"></div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-center px-6 md:h-[100px]">
              <span className="font1 text-4xl">01</span>
              <span className="font-bold text-2xl">Onboarding</span>
              <span className="md:max-w-[50%] text-center md:text-left">
                After studying your brand, we come up with multiple series to
                run, draw up a content calendar for the whole month. Then jump
                on a call to discuss our plan and then only will you sign up.
              </span>
            </div>
            <div className="w-full h-[1px] bg-black/20"></div>
          </motion.div>
          <motion.div
            initial={{opacity: 0, y: 200}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            className="gap-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-center px-6 md:h-[100px] mt-8">
              <span className="font1 text-4xl">02</span>
              <span className="font-bold text-2xl">Executing</span>
              <span className="md:max-w-[50%] text-center md:text-left">
                Don&apos;t worry about the posting We take social media
                completely off your hands by fully manage the video production,
                posting and community engagement.
              </span>
            </div>
            <div className="w-full h-[1px] bg-black/20"></div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 200}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            className="gap-8 flex flex-col"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-center px-6 md:h-[100px] mt-8">
              <span className="font1 text-4xl">03</span>
              <span className="font-bold text-2xl">Reporting</span>
              <span className="md:max-w-[50%] text-center md:text-left">
                We send weekly performance reports to keep you in the loop. And
                at the end of every month, we will schedule a call to go over
                last months performance and discuss any adjustments
              </span>
            </div>
            <div className="w-full h-[1px] bg-black/20"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
