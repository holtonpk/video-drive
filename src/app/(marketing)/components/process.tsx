"use client";
import React, {useState, useRef, useEffect} from "react";
import {AnimatePresence, motion, useScroll} from "framer-motion";
import {Percent} from "lucide-react";

export const Process = () => {
  const [step, setStep] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [containerTop, setContainerTop] = useState(0);

  const getContainerPosition = () => {
    const container = document.getElementById("process-container");
    if (!container) return;

    const {top, bottom, height} = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if the top of the container has scrolled into view

    setIsFixed(top <= 20 && bottom > viewportHeight);
    setIsBottom(bottom < viewportHeight);

    const percentageScrolled = Math.min(
      Math.max(
        ((viewportHeight - bottom) / (viewportHeight - height)) * 100,
        0
      ),
      100
    );

    if (100 - percentageScrolled < 33) {
      setStep(1);
      setScrollProgress(((100 - percentageScrolled) / 33) * 100); // Normalize 0-33 to 0-100
    } else if (
      100 - percentageScrolled > 33 &&
      100 - percentageScrolled <= 66
    ) {
      setStep(2);
      setScrollProgress(((100 - percentageScrolled - 33) / 33) * 100); // Normalize 33-66 to 0-100
    } else {
      setStep(3);
      setScrollProgress(((100 - percentageScrolled - 66) / 34) * 100); // Normalize 66-100 to 0-100
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      getContainerPosition();
    };

    // Initial top position of the container
    const container = document.getElementById("process-container");
    if (container) {
      const rect = container.getBoundingClientRect();
      setContainerTop(rect.top + window.scrollY);
    }

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="process-container"
      className={`relative h-[300vh]  mb-10 w-full px-4  md:w-[90%]  mx-auto rounded-l-xl mt-10 py-10

        `}
    >
      <div
        className={`flex flex-col w-full items-center gap-8 h-[580px] md:h-[500px] 
        ${isFixed ? "px-4 w-full md:w-[90%]" : "w-full"}
          ${
            !isFixed && isBottom
              ? "bottom-[0px] md:bottom-[180px] px-4"
              : "bottom-auto"
          }
          `}
        style={{
          position: isFixed ? "fixed" : isBottom ? "absolute" : "relative",
          top: isFixed ? "80px" : isBottom ? "auto" : "auto",
          // bottom: !isFixed && isBottom ? "180px" : "auto",
          left: isFixed ? "50%" : 0,
          // width: isFixed ? "90%" : "100%",

          transform: isFixed ? "translate(-50%)" : "translate(0)",
        }}
      >
        <div className="flex gap-1 flex-col md:w-[800px]">
          <h1 className="font1-bold text-4xl md:text-6xl text-center ">
            How To Get Started
          </h1>
          <p className="font1 text-center text-base md:text-xl">
            It’s plug-and-play: 3 easy steps, and your first piece of content is
            live in days.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-[80%]  ">
          <AnimatePresence>
            {step === 1 ? (
              <motion.div
                animate={{opacity: 1, y: 0}}
                initial={{opacity: 0, y: 50}}
                exit={{opacity: 0, y: 50}}
                className="flex gap-4 h-fit relative my-10"
              >
                <div className="h-full w-[4px] rounded-full bg-[#f50e85]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#f50f86] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-2 md:gap-4 md:w-full">
                  <div className="flex md:flex-row flex-col items-center gap-2 md:gap-4">
                    <div className="h-10 w-10 min-w-10 md:h-16 md:w-16 md:min-w-16 rounded-full text-3xl border-4 border-[#f50f86] text-[#f50f86] font1-bold flex items-center justify-center">
                      1
                    </div>
                    <h1 className="md:text-5xl whitespace-nowrap font-bold text-primary text-center text-2xl font1-bold">
                      Come on board
                    </h1>
                  </div>
                  <p className="text-sm md:text-2xl text-center md:text-left font1">
                    After a short call, we do a deep dive into your brand, come
                    up with multiple tailored series ideas and build a
                    full-months content calendar. We review the strategy on
                    another call with you and then only will you need to sign up
                    and pay.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-2xl md:text-6xl whitespace-nowrap font-bold text-muted-foreground/60 text-center md:text-left font1-bold">
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
                className="flex gap-4 h-fit relative my-10"
              >
                <div className="h-full w-[4px] rounded-full bg-[#971df7]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#971df7] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-2 md:gap-4 md:w-full">
                  <div className="flex md:flex-row flex-col items-center gap-2 md:gap-4">
                    <div className="h-10 w-10 min-w-10 md:h-16 md:w-16 md:min-w-16 rounded-full text-3xl border-4 border-[#971df7] text-[#971df7] font1-bold flex items-center justify-center">
                      2
                    </div>
                    <h1 className="md:text-5xl whitespace-nowrap font-bold text-primary text-center text-2xl font1-bold">
                      We get to work
                    </h1>
                  </div>
                  <p className="text-sm md:text-2xl text-center md:text-left font1">
                    After that second call, you can sit back and leave the
                    social media to us. We handle everything—from video
                    production and posting to full community engagement; taking
                    the organic content side completely off your hands.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-2xl md:text-6xl whitespace-nowrap font-bold text-muted-foreground/60 text-center md:text-left font1-bold">
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
                className="flex gap-4 h-fit relative my-10"
              >
                <div className="h-full w-[4px] rounded-full bg-[#1863f0]/20 absolute -left-8">
                  <div
                    style={{height: `${scrollProgress}%`}}
                    className="top-0 absolute bg-[#1863f0] w-full rounded-full"
                  ></div>
                </div>
                <div className="flex flex-col gap-2 md:gap-4 md:w-full">
                  <div className="flex md:flex-row flex-col items-center gap-2 md:gap-4">
                    <div className="h-10 w-10 min-w-10 md:h-16 md:w-16 md:min-w-16 rounded-full text-3xl border-4 border-[#1863f0] text-[#1863f0]  font1-bold flex items-center justify-center">
                      3
                    </div>
                    <h1 className="md:text-5xl whitespace-nowrap font-bold text-primary text-center text-2xl font1-bold">
                      You get the reports.
                    </h1>
                  </div>
                  <p className="text-sm md:text-2xl text-center md:text-left font1">
                    Every week, you get a performance report covering all the
                    content that went out last week, how each performed and
                    valuable insights we’ve extracted. And we’ll do a monthly
                    call to review results and plan any necessary adjustments.
                  </p>
                </div>
              </motion.div>
            ) : (
              <h1 className="text-2xl md:text-6xl whitespace-nowrap font-bold text-muted-foreground/60 text-center md:text-left font1-bold">
                You get the reports.
              </h1>
            )}
          </AnimatePresence>
          {/* Repeat for Step 2 and Step 3 */}
        </div>
      </div>
    </div>
  );
};
