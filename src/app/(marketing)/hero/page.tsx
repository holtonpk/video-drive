"use client";

import React from "react";
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

  const [screenWidth, setScreenWidth] = React.useState(0);

  React.useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.div
        initial={{top: "50%", translateY: "-50%", translateX: "-50%"}}
        animate={{
          // top: screenWidth > 600 ? 120 + playerHeight : 140,
          top: "50%",
          translateY: "-50%",
          translateX: "-50%",
        }}
        transition={{duration: 0.8, delay: 0.5}}
        className="absolute text-center whitespace-nowrap left-1/2  z-[999] flex flex-col items-center "
      >
        <h1 className="relative z-20 font1-bold  text-3xl sm:text-5xl md:text-6xl lg:text-7xl  ">
          {" "}
          We Scale{" "}
          <span className="relative px-2  ">
            <motion.span
              initial={{width: "0%"}}
              animate={{width: "100%"}}
              transition={{duration: 0.8, delay: 0.5}}
              className="absolute h-[40px] sm:h-[48px] md:h-[72px] bg-[rgb(52,244,175)] left-0 z-10 rounded-md   origin-left"
            ></motion.span>
            <motion.div
              initial={{width: "100%"}}
              animate={{width: "0%"}}
              transition={{duration: 0.8, delay: 0.5}}
              className="absolute z-30  right-0 top-1/2 -translate-y-1/2 overflow-hidden    h-[40px] sm:h-[48px] md:h-[72px]"
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
        <span className="flex gap-2 text-[rgb(52,244,175)] font1-bold mt-6">
          <motion.span
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1, delay: 0.9}}
            className="text-2xl md:text-4xl text-white"
          >
            with
          </motion.span>
          <motion.span
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 2, delay: 1.3}}
            className="text-2xl md:text-4xl"
          >
            {/* <RotatingWords /> */}
            short form content
          </motion.span>
        </span>
        <motion.button
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 2, delay: 1.8}}
          className="px-6 py-2 rounded-full bg-[rgb(52,244,175)] hover:bg-[rgb(52,244,175)]/80 text-background font1-bold text-lg md:text-2xl mt-8 uppercase flex items-center gap-1 relative pr-[52px] group"
        >
          Get my custom social media plan
          <Icons.arrowRight className="h-6 w-6 text-background absolute right-6 group-hover:right-2 transition-all duration-500 top-1/2 -translate-y-1/2" />
        </motion.button>
      </motion.div>
      {/* <RippleEffect /> */}
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
      <motion.button
        initial={{translateX: "100%"}}
        animate={{translateX: "0%"}}
        transition={{duration: 0.8, delay: 1.8}}
        onClick={() => setOpenPlayer(true)}
        className="fixed bottom-8 right-0 flex gap-2 font1-bold text-[#34F4AF] items-center text-2xl bg-[rgb(21,21,25)]/60 blurBack pr-8 p-3 pl-3 rounded-l-md border border-r-0 border-[#34F4AF] z-[99]"
      >
        <div className="rounded-full p-2 bg-[#34F4AF]">
          <Icons.play className="h-6 w-6 fill-background text-background" />
        </div>
        What is Ripple Media?
      </motion.button>
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

const IntroVideo = ({
  setOpenPlayer,
}: {
  setOpenPlayer: (value: boolean) => void;
}) => {
  const containerRef = React.useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle mouse over and out events
    // const handleMouseOver = () => setIsHovered(true);
    // const handleMouseOut = () => setIsHovered(false);

    // Handle mouse move events
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;

      // Get the bounding rectangle of the container
      const rect = container.getBoundingClientRect();

      // Calculate mouse position relative to the container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({x, y});
    };

    // Add event listeners
    // container.addEventListener("mouseover", handleMouseOver);
    // container.addEventListener("mouseout", handleMouseOut);
    // container.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listeners
    return () => {
      // container.removeEventListener("mouseover", handleMouseOver);
      // container.removeEventListener("mouseout", handleMouseOut);
      // container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setOpenPlayer(true)}
        ref={containerRef}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5, delay: 3.5}}
        className="w-full h-full bg-[#34F4AF] rounded-md z-30 p-4 flex items-center justify-center relative videoShadow group  transition-all duration-300 cursors-none"
      >
        <span className="text-[#151519] font1-extra-bold text-center text-2xl">
          What is Ripple Media?
        </span>

        <div
          // style={{
          //   top: isHovered ? `${mousePosition.y}px` : "auto",
          //   left: isHovered ? `${mousePosition.x}px` : "auto",
          //   bottom: isHovered ? "auto" : "-4px",
          //   right: isHovered ? "auto" : "-4px",
          // }}
          className="-bottom-2 -right-2 md:bottom-0 md:right-0 md:-translate-x-1/2 md:-translate-y-1/2 absolute h-16 w-16 bg-[#151519] text-white flex items-center justify-center rounded-full pointer-events-none  md:group-hover:scale-150  transition-all duration-300"
        >
          <Icons.play className="h-6 w-6 fill-white " />
        </div>

        {/* <Logo className="w-full z-20 relative " /> */}
      </motion.button>
    </>
  );
};
