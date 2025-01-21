import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState, useRef} from "react";
import {Icons} from "@/components/icons";

export const Boxes = ({
  setOpenPlayer,
}: {
  setOpenPlayer: (value: boolean) => void;
}) => {
  type Box = {
    height: number;
    width: number;
    zIndex: number;
  };

  const boxArray: Box[] = Array.from({length: 25}, (_, i) => ({
    height: 250 + i * 50,
    width: 500 + i * 50,
    zIndex: 10 - i, // zIndex starts at 10 for the smallest box
  }));

  console.log("boxArray", boxArray);

  return (
    <>
      {boxArray.map((box, i) => (
        <>
          {i > 0 && (
            <motion.div
              initial={{
                rotate: 8 * i,
                translateX: "-50%",
                translateY: "-60%",
                scale: 1,
                opacity: 0.6,
              }}
              animate={{rotate: 0, scale: 1.02, opacity: 0}}
              transition={{
                scale: {
                  duration: 0.1,
                  delay: 2 + i * 0.04,
                  repeatDelay: 1,
                  //   repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.5,
                  delay: 2 + i * 0.05,
                },
                rotate: {
                  duration: 2,
                  ease: "easeInOut",
                },
              }}
              key={i}
              style={{
                willChange: "transform",
                height: box.height,
                width: box.width,
                zIndex: box.zIndex,
                // transform: `rotate(${20}) translate(-50%, -50%)`,
                // rotate: `${i * 2}deg`,
              }}
              className="absolute top-1/2 left-1/2  border-[rgb(52,244,175)] rounded-lg border-[1px]  z-20 inlay-shadow origin-center"
            ></motion.div>
          )}
        </>
      ))}
      <motion.div
        initial={{
          height: 250,
          width: 500,
          backgroundColor: "rgba(52, 244, 175, 0)",
          top: "50%",
          translateY: "-60%",
          translateX: "-50%",
          opacity: 0.6,
        }}
        animate={{
          height: 400,
          width: 800,
          backgroundColor: "rgb(52, 244, 175)",
          top: 100,
          //   top: "50%",
          opacity: 1,
          translateY: "0%",
          translateX: "-50%",
        }}
        transition={{
          height: {
            duration: 2.2,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },
          width: {
            duration: 2.2,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },
          top: {
            duration: 1,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },
          translateY: {
            duration: 1,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },
          translateX: {
            duration: 1,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },
          opacity: {
            duration: 1,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          },

          backgroundColor: {
            duration: 1.5,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01],
          }, // Delayed by 1 second
        }}
        style={{
          height: 300,
          width: 150,
          zIndex: boxArray[0].zIndex,
        }}
        className="absolute left-1/2 -translate-x-1/2 border-[rgb(52,244,175)]  rounded-md  border-1 z-20 card-shadow origin-center transition-colors "
      >
        <IntroVideo setOpenPlayer={setOpenPlayer} />
      </motion.div>
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
          style={{
            top: isHovered ? `${mousePosition.y}px` : "auto",
            left: isHovered ? `${mousePosition.x}px` : "auto",
            bottom: isHovered ? "auto" : "-4px",
            right: isHovered ? "auto" : "-4px",
          }}
          className="absolute h-16 w-16 bg-[#151519] text-white flex items-center justify-center rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 group-hover:scale-150  transition-all duration-300"
        >
          <Icons.play className="h-6 w-6 fill-white " />
        </div>

        {/* <Logo className="w-full z-20 relative " /> */}
      </motion.button>
    </>
  );
};
