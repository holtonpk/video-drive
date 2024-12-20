"use client";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {Icons, Logo} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useEffect, useState, useRef} from "react";

export const Banner = () => {
  return (
    <div className="w-[100vw] relative overflow-hidden   h-[140px] -rotate-[0deg]">
      <div className="flex absolute left-0 gap-6 cred-carousel-animation top-1/2">
        {skills.map((skill, index) => (
          <h1
            key={index}
            className={`text-6xl md:text-[150px] whitespace-nowrap  font-bold
            ${index % 2 === 0 ? "normal" : "stroke"}
            
            `}
          >
            {skill}.
          </h1>
        ))}
      </div>
    </div>
  );
};

export const Hero = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
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

  const [openPlayer, setOpenPlayer] = useState(false);

  return (
    <>
      <div className=" z-30 relative  flex flex-col  items-center  gap-10 h-fit  w-full  pb-20">
        <div className="flex flex-col md:flex-row items-center mds:items-start md:gap-10 ">
          <IntroVideo setOpenPlayer={setOpenPlayer} />
          <div className="absolute z-10 left-1/2 -translate-x-1/2 top-[50px]  md:top-[20px] w-[70%] xl:w-[70%] mds:w-[922px]  ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 922 380"
            >
              <defs>
                <pattern
                  id="dot-matrix"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="#34F4AF" />
                  <animateTransform
                    attributeType="XML"
                    attributeName="patternTransform"
                    type="translate"
                    from="0,0"
                    to="800,0"
                    dur="80s"
                    repeatCount="indefinite"
                  />
                </pattern>
              </defs>

              <path
                fill="url(#dot-matrix)"
                d="M92.863 1.106c39.909 3.98 80.703 20.013 113.647 44.56 11.498 8.515 31.95 28.64 40.794 39.918 13.266 16.917 20.452 30.076 61.135 112.453 44.11 88.901 43.889 88.569 57.708 97.857 18.351 12.274 45.879 12.495 64.341.664 6.08-3.871 17.799-15.812 18.794-19.24.442-1.438-5.307-14.264-17.357-38.48-9.95-20.014-30.291-61.036-45.105-91.112s-37.256-75.3-49.748-100.622C324.469 21.894 314.409.884 314.63.553S334.971 0 359.514.22c47.537.221 54.612.774 79.707 6.635 44.774 10.283 87.778 37.042 118.843 73.973 17.467 20.677 19.457 24.437 86.673 160.663 17.246 35.052 19.236 38.479 25.758 45.446 11.94 12.605 24.985 18.134 42.563 18.244 20.23 0 38.25-8.956 49.084-24.547l2.985-4.312-18.793-38.038c-10.171-20.898-31.176-63.469-46.543-94.429C657.561 58.493 629.038.663 629.038.332c0-.11 65.889-.332 146.481-.332S922 .442 922 .885c0 .442-12.271 25.542-27.196 55.84-15.035 30.296-34.05 68.997-42.452 86.025-76.612 156.13-79.154 160.663-102.591 183.773-60.804 60.041-158.863 70.103-232.269 23.773-17.025-10.836-40.683-32.84-50.854-47.546-2.653-3.76-4.975-6.856-5.085-6.856-.221 0-3.317 4.091-6.965 9.178-7.517 10.394-25.537 28.196-38.03 37.484-22.994 17.36-54.502 30.408-83.466 34.609-52.623 7.63-100.713-4.644-144.602-36.931-10.06-7.408-30.07-28.086-38.472-39.917-7.185-10.062-31.286-57.277-80.923-158.673-7.407-15.259-26.09-52.964-41.347-83.814C12.492 26.98 0 1.327 0 .774 0-.332 81.366 0 92.863 1.106"
              ></path>
            </svg>
          </div>
          <div className="flex flex-col gap-4 items-center md:items-start relative z-20 md:w-[700px]">
            <motion.h1
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2, duration: 0.5}}
              className="text-2xl  md:text-[4rem] md:leading-[70px] bg-clip-text text-center md:text-left  bg-gradient-to-l bg-black   py-2  text-[#34F4AF] font-[500] font1-extra-bold"
            >
              <div className="rotating-text" ref={containerRef}>
                {/* Experts in Short Form Content. */}
                We scale
                <span className="bg-[#34F4AF] text-background rounded-md px-2 ml-2 ">
                  tech tools
                </span>
                <br />
                with{" "}
                <p>
                  <span className="word ">organic content.</span>
                  <span className="word  ">branding.</span>
                  <span className="word  ">funnel optimization.</span>
                  <span className="word  ">trend jacking.</span>
                  <span className="word ">story telling.</span>
                </p>
              </div>
            </motion.h1>
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5, duration: 0.5}}
              className="max-w-[100%] md:text-xl text-center md:text-left w-full relative z-20 font1"
            >
              We specialize in creating viral, short-form content for fast
              growing tech startups, helping them connect with audiences quickly
              and effectively.
            </motion.p>

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.8, duration: 0.5}}
            >
              <LinkButton
                href="/work-with-us"
                className="w-fit mt-4 group relative z-20 bg-[#1863F0] hover:bg-[#1863F0] rounded-full items-center"
              >
                <span className="text-white font1 text-xl">
                  Book a call today
                </span>
                <Icons.chevronRight className="group-hover:ml-4 ml-2 mt-1 transition-all duration-300 text-white h-5 w-5" />
              </LinkButton>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {openPlayer && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            className="h-screen w-screen fixed top-0 left-0 bg-black/50 blurBack z-[100] flex items-center justify-center"
          >
            <button
              onClick={() => setOpenPlayer(false)}
              className="w-full h-full z-10 absolute"
            ></button>
            <motion.div
              // ref={containerRef}
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
              className="aspect-[9/16] bg-[#34F4AF] rounded-md z-30 p-4 flex items-center justify-center relative videoShadow overflow-hidden"
            >
              <span className="text-background font1-extra-bold text-center text-2xl">
                What is Whitespace Media?
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const IntroVideo = ({
  setOpenPlayer,
}: {
  setOpenPlayer: (value: boolean) => void;
}) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle mouse over and out events
    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

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
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listeners
    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setOpenPlayer(true)}
        ref={containerRef}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        className="w-[100px] md:w-[175px] aspect-[9/16] bg-[#34F4AF] rounded-md z-30 p-4 flex items-center justify-center relative videoShadow group hover:rotate-[-2deg] hover:scale-[1.05] transition-all duration-300 cursor-none"
      >
        <span className="text-background font1-extra-bold text-center text-2xl">
          What is Whitespace Media?
        </span>

        <div
          style={{
            top: isHovered ? `${mousePosition.y}px` : "auto",
            left: isHovered ? `${mousePosition.x}px` : "auto",
            bottom: isHovered ? "auto" : "-4px",
            right: isHovered ? "auto" : "-4px",
          }}
          className="absolute h-10 w-10 bg-background text-white flex items-center justify-center rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          <Icons.play className="h-4 w-4 fill-white " />
        </div>

        {/* <Logo className="w-full z-20 relative " /> */}
      </motion.button>
    </>
  );
};

const skills = [
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
];
