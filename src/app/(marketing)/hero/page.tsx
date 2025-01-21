"use client";

import React from "react";
import {Boxes} from "./hero";
import Background from "../components/background";
import {motion, AnimatePresence} from "framer-motion";
import {Icons} from "@/components/icons";

export const Page = () => {
  return (
    <>
      <Background />
      <div className="h-screen w-screen relative overflow-hidden">
        <Hero />
      </div>
    </>
  );
};

export const Hero = () => {
  const playerHeight = 400;

  const [openPlayer, setOpenPlayer] = React.useState(false);

  return (
    <>
      <motion.div
        initial={{top: "50%", translateY: "-50%", translateX: "-50%"}}
        animate={{
          top: 120 + playerHeight,
          translateY: "0%",
          translateX: "-50%",
        }}
        transition={{duration: 0.8, delay: 2}}
        className="absolute text-center whitespace-nowrap left-1/2  z-[999] flex flex-col"
      >
        <h1 className="relative z-20 font1-bold text-8xl ">
          {" "}
          We Scale{" "}
          <span className="relative px-3  ">
            <motion.span
              initial={{width: "0%"}}
              animate={{width: "100%"}}
              transition={{duration: 2, delay: 3}}
              className="absolute  h-[96px] bg-[rgb(52,244,175)] left-0 z-10 rounded-md   origin-left"
            ></motion.span>
            <motion.div
              initial={{width: "100%"}}
              animate={{width: "0%"}}
              transition={{duration: 2, delay: 3}}
              className="absolute z-30  right-0 top-1/2 -translate-y-1/2 overflow-hidden   h-[96px] "
            >
              <span className="absolute  text-white right-0 px-3">
                Tech Tools
              </span>
            </motion.div>
            <motion.span className="relative z-20  text-[rgb(21,21,25)]">
              Tech Tools
            </motion.span>
          </span>
        </h1>
        <span className="flex gap-2 text-[rgb(52,244,175)] font1-bold">
          <motion.span
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1, delay: 3}}
            className="text-4xl"
          >
            with
          </motion.span>
          <motion.span
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1.5, delay: 4}}
            className="text-4xl"
          >
            {/* <RotatingWords /> */}
            short from content
          </motion.span>
        </span>
      </motion.div>
      <Boxes setOpenPlayer={setOpenPlayer} />

      <AnimatePresence>
        {openPlayer && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            className="h-screen w-screen fixed top-0 left-0 bg-black/50 blurBack  z-[9999] flex items-center justify-center"
          >
            <button
              onClick={() => setOpenPlayer(false)}
              className="w-full h-full z-10 absolute"
            ></button>
            <motion.div
              initial={{opacity: 0, width: 225, height: 400}}
              animate={{
                opacity: 1,
                width: 711,
                height: 400,
              }}
              transition={{
                duration: 0.5,
                width: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }}
              className="aspect-[9/16] bg-[#34F4AF] rounded-md z-30 p-4 flex flex-col items-center justify-center relative videoShadow overflow-hidden"
            >
              <span className="text-background font1-extra-bold text-center text-2xl  whitespace-nowrap">
                What is ripple studios?
              </span>
              {/* <Icons.frown className="h-6 w-6 fill-white" /> */}
              <span className="text-background font1-bold text-center text-xl whitespace-nowrap">
                (sorry our amazing team of editors are still working on this
                video)
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Page;

const RotatingWords = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const words = container.querySelectorAll(".word");

    // Process each word, including those with spaces
    words.forEach((word: any) => {
      // Split the text, preserving spaces
      let textContent = word.textContent;
      let characters = textContent
        .split("")
        .map((char: any) => (char === " " ? " " : char));

      // Clear original text content
      word.textContent = "";

      // Create spans for each character
      characters.forEach((char: any) => {
        let span = document.createElement("span");

        // Handle spaces differently
        if (char === " ") {
          span.innerHTML = "&nbsp;";
          span.className = "letter space";
        } else {
          span.textContent = char;
          span.className = "letter";
        }

        word.appendChild(span);
      });
    });

    let currentWordIndex = 0;
    let maxWordIndex = words.length - 1;
    (words[currentWordIndex] as HTMLElement).style.opacity = "1";

    let rotateText = () => {
      let currentWord = words[currentWordIndex];
      let nextWord =
        currentWordIndex === maxWordIndex
          ? words[0]
          : words[currentWordIndex + 1];

      // rotate out letters of current word
      Array.from(currentWord.children).forEach((letter: any, i) => {
        setTimeout(() => {
          letter.className = letter.classList.contains("space")
            ? "letter space"
            : "letter out";
        }, i * 80);
      });

      // reveal and rotate in letters of next word
      (nextWord as HTMLElement).style.opacity = "1";
      Array.from(nextWord.children).forEach((letter: any, i) => {
        letter.className = letter.classList.contains("space")
          ? "letter space"
          : "letter behind";

        setTimeout(() => {
          letter.className = letter.classList.contains("space")
            ? "letter space"
            : "letter in";
        }, 340 + i * 80);
      });

      currentWordIndex =
        currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
    };
    rotateText();
    const intervalId = setInterval(rotateText, 4000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="rotating-text" ref={containerRef}>
      <p>
        <span className="word ">organic content.</span>
        <span className="word  ">branding.</span>
        <span className="word  ">funnel optimization.</span>
        <span className="word  ">trend jacking.</span>
        <span className="word ">story telling.</span>
      </p>
    </div>
  );
};
