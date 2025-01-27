"use client";
import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState, useRef} from "react";
import {Icons} from "@/components/icons";
import Link from "next/link";
import {TypeAnimation} from "react-type-animation";

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
        className="absolute text-center whitespace-nowrap left-1/2  z-[999] hidden md:flex flex-col items-center "
      >
        <h1 className="relative z-20 font1-bold  text-4xl sm:text-5xl md:text-6xl lg:text-7xl  ">
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

        <motion.span
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1, delay: 0.9}}
          className="text-2xl md:text-4xl text-white flex justify-start w-[250px] md:w-[350px] gap-2 font1-bold mt-3 md:mt-6"
        >
          with
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              " Short Form Content",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              " Content Marketing",
              1000,
              " Social Media",
              1000,
              " Brand Awareness",
              1000,
            ]}
            wrapper="span"
            speed={10}
            repeat={Infinity}
            className="font1-bold text-2xl md:text-4xl text-[rgb(52,244,175)]"
          />
        </motion.span>
        {/* <span className="flex gap-2 text-[rgb(52,244,175)] font1-bold mt-3 md:mt-6">
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

            short form content
          </motion.span>
        </span> */}

        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 2, delay: 1.8}}
        >
          <Link
            href={"/content-plan"}
            className="px-6 py-2 rounded-full bg-[rgb(52,244,175)] hover:bg-[rgb(52,244,175)]/90 text-background font1-extra-bold text-sm md:text-2xl mt-4 md:mt-8 uppercase flex items-center gap-1 relative pr-[52px] group hover:-translate-y-[2px] transition-all duration-300"
          >
            Get my custom social media plan
            <Icons.arrowRight className="h-6 w-6 text-background absolute right-6 group-hover:right-2 transition-all duration-500 top-1/2 -translate-y-1/2" />
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{top: "350px", translateY: "-50%", translateX: "-50%"}}
        animate={{
          // top: screenWidth > 600 ? 120 + playerHeight : 140,
          top: "300px",
          translateY: "-50%",
          translateX: "-50%",
        }}
        transition={{duration: 0.8, delay: 0.5}}
        className="absolute md:hidden text-center whitespace-nowrap left-1/2  z-[999] flex flex-col items-center "
      >
        <h1 className="relative z-20 font1-bold  text-4xl sm:text-5xl md:text-6xl lg:text-7xl  ">
          {" "}
          We Scale{" "}
          <span className="relative px-1">
            <motion.span
              initial={{width: "0%"}}
              animate={{width: "100%"}}
              transition={{duration: 0.8, delay: 0.5}}
              className="absolute h-[40px] sm:h-[48px] md:h-[72px] bg-[rgb(52,244,175)] left-0 z-10 rounded-sm   origin-left"
            ></motion.span>
            <motion.div
              initial={{width: "100%"}}
              animate={{width: "0%"}}
              transition={{duration: 0.8, delay: 0.5}}
              className="absolute z-30  right-0 top-1/2 -translate-y-1/2 overflow-hidden    h-[40px] sm:h-[48px] md:h-[72px]"
            >
              <span className="absolute  text-white right-0 px-2">
                Tech Tools
              </span>
            </motion.div>
            <motion.span className="relative z-20  text-[rgb(21,21,25)]">
              Tech Tools
            </motion.span>
          </span>
        </h1>

        <motion.span
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1, delay: 0.9}}
          className="text-2xl md:text-4xl text-white flex justify-start w-[250px] md:w-[350px] gap-2 font1-bold mt-3 md:mt-6"
        >
          with
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              " Short Form Content",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              " Content Marketing",
              1000,
              " Social Media",
              1000,
              " Brand Awareness",
              1000,
            ]}
            wrapper="span"
            speed={10}
            repeat={Infinity}
            className="font1-bold text-2xl md:text-4xl text-[rgb(52,244,175)]"
          />
        </motion.span>
        {/* <span className="flex gap-2 text-[rgb(52,244,175)] font1-bold mt-3 md:mt-6">
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

            short form content
          </motion.span>
        </span> */}

        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 2, delay: 1.8}}
        >
          <Link
            href={"/content-plan"}
            className="px-6 py-2 rounded-full bg-[rgb(52,244,175)] hover:bg-[rgb(52,244,175)]/90 text-background font1-extra-bold text-sm md:text-2xl mt-4 md:mt-8 uppercase flex items-center gap-1 relative pr-[52px] group hover:-translate-y-[2px] transition-all duration-300"
          >
            Get my custom social media plan
            <Icons.arrowRight className="h-6 w-6 text-background absolute right-6 group-hover:right-2 transition-all duration-500 top-1/2 -translate-y-1/2" />
          </Link>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {openPlayer && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            className="h-screen w-screen hidden md:flex fixed top-0 left-0 bg-black/50 blurBack  z-[9999] items-center justify-center"
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
        transition={{duration: 0.8, delay: 2}}
        onClick={() => setOpenPlayer(true)}
        className="fixed bottom-8 right-0 hidden md:flex gap-2 font1-bold text-[#34F4AF] items-center text-xl md:text-2xl bg-[rgb(21,21,25)]/60 blurBack pr-8 p-3 pl-3 rounded-l-md border border-r-0 border-[#34F4AF] z-[99] overflow-hidden group"
      >
        <div
          className="w-full h-full  absolute left-0 top-0 z-10"
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( transparent 1px,  #151618 1px)`,
            backgroundSize: "4px 4px",
          }}
        />
        <div className="rounded-full p-2 bg-[#34F4AF] relative z-20 group-hover:scale-[1.1] transition-all duration-300">
          <span className="absolute  h-full w-full animate-ping rounded-full bg-[#34F4AF] opacity-50 left-0 top-0 z-10 play-ping-animation group-hover:inline-flex hidden" />
          <Icons.play className="md:h-6 md:w-6 h-4 w-4 fill-background text-background relative z-20" />
        </div>
        <span className="relative z-20 group-hover:text-white transition-all duration-300">
          What is Ripple Media?
        </span>
      </motion.button>
      <motion.button
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.8, delay: 2}}
        onClick={() => setOpenPlayer(true)}
        className="absolute bottom-40 -translate-x-1/2 left-1/2 md:hidden flex  gap-2 font1-bold text-[#34F4AF] items-center text-xl md:text-2xl bg-[rgb(21,21,25)]/60 blurBack pr-8 p-3 pl-3 rounded-md border border-[#34F4AF] z-[99] overflow-hidden group"
      >
        <div
          className="w-full h-full  absolute left-0 top-0 z-10"
          style={{
            opacity: 0.8,
            backgroundColor: "transparent",
            backgroundImage: `radial-gradient( transparent 1px,  #151618 1px)`,
            backgroundSize: "4px 4px",
          }}
        />
        <div className="rounded-full p-2 bg-[#34F4AF] relative z-20 group-hover:scale-[1.1] transition-all duration-300">
          <span className="absolute  h-full w-full animate-ping rounded-full bg-[#34F4AF] opacity-50 left-0 top-0 z-10 play-ping-animation group-hover:inline-flex hidden" />
          <Icons.play className="md:h-6 md:w-6 h-4 w-4 fill-background text-background relative z-20" />
        </div>
        <span className="relative z-20 group-hover:text-white transition-all duration-300 whitespace-nowrap">
          What is Ripple Media?
        </span>
      </motion.button>
    </>
  );
};

export const RippleEffect = () => {
  type Box = {
    height: number;
    width: number;
    zIndex: number;
  };

  const [ringArray, setRingArray] = useState<Box[]>([]);

  useEffect(() => {
    // This ensures the code runs only on the client side
    const isLargeScreen = window.innerWidth > 400;

    const rings: Box[] = Array.from({length: 20}, (_, i) => ({
      height: isLargeScreen ? 600 + i * 50 : 100 + i * 50,
      width: isLargeScreen ? 600 + i * 50 : 100 + i * 50,
      zIndex: 10 - i, // zIndex starts at 10 for the smallest box
    }));

    setRingArray(rings);
  }, []);
  return (
    <>
      <div className="md:hidden block">
        {ringArray.map((ring, i) => (
          <>
            {i > 0 && (
              <motion.div
                initial={{
                  // rotate: 8 * i,
                  translateX: "-50%",
                  translateY: "-50%",
                  scale: 1,
                  opacity: 0.6,
                }}
                animate={{scale: 1.02, opacity: i * 0.05 * 0.6}}
                transition={{
                  scale: {
                    duration: 0.5,
                    delay: 0.5 + i * 0.04,
                    ease: "easeInOut",
                    repeatDelay: 3,
                    repeat: Infinity,
                  },
                  opacity: {
                    duration: 0.5,
                    delay: 0.5 + i * 0.04,
                    repeatDelay: 3,
                    repeat: Infinity,
                  },
                }}
                key={i}
                style={{
                  willChange: "transform",
                  height: ring.height,
                  width: ring.width,
                  zIndex: ring.zIndex,
                }}
                className="absolute top-[300px] left-1/2  border-[rgb(52,244,175)] rounded-full border-[1px]   z-20 inlay-shadow origin-center"
              />
            )}
          </>
        ))}
      </div>
      <div className="hidden md:block">
        {ringArray.map((ring, i) => (
          <>
            {i > 0 && (
              <motion.div
                initial={{
                  // rotate: 8 * i,
                  translateX: "-50%",
                  translateY: "-50%",
                  scale: 1,
                  opacity: 0.6,
                }}
                animate={{scale: 1.02, opacity: i * 0.05 * 0.6}}
                transition={{
                  scale: {
                    duration: 0.5,
                    delay: 0.5 + i * 0.04,
                    ease: "easeInOut",
                    repeatDelay: 3,
                    repeat: Infinity,
                  },
                  opacity: {
                    duration: 0.5,
                    delay: 0.5 + i * 0.04,
                    repeatDelay: 3,
                    repeat: Infinity,
                  },
                }}
                key={i}
                style={{
                  willChange: "transform",
                  height: ring.height,
                  width: ring.width,
                  zIndex: ring.zIndex,
                }}
                className="absolute top-1/2 left-1/2  border-[rgb(52,244,175)] rounded-full border-[1px]   z-20 inlay-shadow origin-center"
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};
