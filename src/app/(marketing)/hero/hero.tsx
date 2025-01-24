"use client";
import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState, useRef} from "react";
import {Icons} from "@/components/icons";

export const RippleEffect = () => {
  type Box = {
    height: number;
    width: number;
    zIndex: number;
  };

  const ringArray: Box[] = Array.from({length: 20}, (_, i) => ({
    height: window.innerWidth > 400 ? 600 + i * 50 : 100 + i * 50,
    width: window.innerWidth > 400 ? 600 + i * 50 : 100 + i * 50,
    zIndex: 10 - i, // zIndex starts at 10 for the smallest box
  }));

  console.log("abc", window.innerWidth);

  return (
    <>
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
    </>
  );
};
