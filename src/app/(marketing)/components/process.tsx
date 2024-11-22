"use client";
import React, {useState, useRef, useEffect} from "react";
import {AnimatePresence, motion, useScroll} from "framer-motion";
import {Percent} from "lucide-react";

export const Process = () => {
  const [step, setStep] = useState(1);

  const [scrollProgress, setScrollProgress] = useState(0);
  const getContainerPosition = () => {
    const container = document.getElementById("process-container");
    if (!container) return;

    const {top, bottom, height} = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate percentage scrolled relative to the viewport
    const percentageScrolled =
      100 -
      Math.min(
        Math.max(
          ((viewportHeight - bottom) / (viewportHeight - height)) * 100,
          0
        ),
        100
      );

    console.log(percentageScrolled);

    // Determine the current step based on percentageScrolled
    if (percentageScrolled > 33 && percentageScrolled <= 66) {
      setStep(2);
      setScrollProgress(((percentageScrolled - 33) / 33) * 100); // Normalize 33-66 to 0-100
    } else if (percentageScrolled > 66) {
      setStep(3);
      setScrollProgress(((percentageScrolled - 66) / 34) * 100); // Normalize 66-100 to 0-100
    } else {
      setStep(1);
      setScrollProgress((percentageScrolled / 33) * 100); // Normalize 0-33 to 0-100
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      getContainerPosition();
    });
    return () => {
      document.removeEventListener("scroll", () => {
        getContainerPosition();
      });
    };
  }, []);

  return (
    <div
      id="process-container"
      className="   relative h-[300vh] mb-40 md:w-[80%] mx-auto rounded-l-xl mt-20 py-10  "
    >
      <div className="flex flex-col sticky top-20 w-full    items-center    gap-8">
        <div className="flex gap-1 flex-col w-[800px]">
          <h1 className="font1-bold text-6xl text-center">
            How To Get Started
          </h1>
          <p className="font1 text-center text-xl">
            It’s plug-and-play: 3 easy steps, and your first piece of content is
            live in days.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-[400px] mt-10">
          <AnimatePresence>
            {step === 1 ? (
              <motion.div
                animate={{opacity: 1, y: 0}}
                initial={{opacity: 0, y: 50}}
                exit={{opacity: 0, y: 50}}
                className="flex gap-4 h-fit relative"
              >
                <div className="h-full w-[4px] rounded-full bg-[#f50e85]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#f50f86] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-4 s">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full border-4 border-[#f50f86] text-[#f50f86] font1-bold flex items-center justify-center">
                      1
                    </div>
                    <h1 className="text-3xl font-bold text-primary">
                      Come on board
                    </h1>
                  </div>

                  <p>
                    After a short call, we do a deep dive into your brand, come
                    up with multiple tailored series ideas and build a
                    full-months content calendar. We review the strategy on
                    another call with you and then only will you need to sign up
                    and pay.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-3xl font-bold text-muted-foreground/60">
                Come on board
              </h1>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 2 ? (
              <motion.div
                animate={{opacity: 1, y: 0}}
                initial={{opacity: 0, y: 50}}
                exit={{opacity: 0, y: 50}}
                className="flex gap-4 h-fit relative"
              >
                <div className="h-full w-[4px] rounded-full bg-[#971df7]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#971df7] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-4 s">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full border-4 border-[#971df7] text-[#971df7]  font1-bold flex items-center justify-center">
                      2
                    </div>
                    <h1 className="text-3xl font-bold text-primary">
                      We get to work
                    </h1>
                  </div>
                  <p>
                    After that second call, you can sit back and leave the
                    social media to us. We handle everything—from video
                    production and posting to full community engagement; taking
                    the organic content side completely off your hands.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-3xl font-bold text-muted-foreground/60">
                We get to work
              </h1>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 3 ? (
              <motion.div
                animate={{opacity: 1, y: 0}}
                initial={{opacity: 0, y: 50}}
                exit={{opacity: 0, y: 50}}
                className="flex gap-4 h-fit relative"
              >
                <div className="h-full w-[4px] rounded-full bg-[#1863f0]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#1863f0] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-4 s">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full border-4 border-[#1863f0] text-[#1863f0]  font1-bold flex items-center justify-center">
                      3
                    </div>
                    <h1 className="text-3xl font-bold text-primary">
                      You get the reports.
                    </h1>
                  </div>

                  <p>
                    Every week, you get a performance report covering all the
                    content that went out last week, how each performed and
                    valuable insights we’ve extracted. And we’ll do a monthly
                    call to review results and plan any necessary adjustments.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-3xl font-bold text-muted-foreground/60">
                You get the reports.
              </h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* <div className="md:container  p-8 md:px-16 flex flex-col">
        <motion.h1
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          className="font1 text-3xl md:text-6xl  "
        >
          Starting with a new team can be daunting, <br /> but we make it easy.
        </motion.h1>
        <div className="flex flex-col ">
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
      </div> */}
    </div>
  );
};
