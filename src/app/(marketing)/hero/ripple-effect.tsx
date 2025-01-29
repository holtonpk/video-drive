"use client";
import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState, useMemo, useRef} from "react";

export const RippleEffect = React.memo(() => {
  type Box = {
    height: number;
    width: number;
    zIndex: number;
  };

  const [ringArray, setRingArray] = useState<Box[]>([]);

  useEffect(() => {
    const isLargeScreen = window.innerWidth > 400;

    const rings: Box[] = Array.from({length: 20}, (_, i) => ({
      height: isLargeScreen ? 600 + i * 50 : 100 + i * 50,
      width: isLargeScreen ? 600 + i * 50 : 100 + i * 50,
      zIndex: 10 - i,
    }));

    setRingArray(rings);
  }, []);

  const memoizedRingArray = useMemo(() => ringArray, [ringArray]);

  return (
    <>
      <div className="md:hidden block">
        {memoizedRingArray.map(
          (ring, i) =>
            i > 0 && (
              <motion.div
                initial={{
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
                  willChange: "transform, opacity",
                  height: ring.height,
                  width: ring.width,
                  zIndex: ring.zIndex,
                  transform: "translateZ(0)", // Enable GPU acceleration
                }}
                className="absolute top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[rgb(52,244,175)] rounded-full border z-20 inlay-shadow origin-center"
              />
            )
        )}
      </div>
      <div className="hidden md:block">
        {memoizedRingArray.map(
          (ring, i) =>
            i > 0 && (
              <motion.div
                initial={{
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
                  willChange: "transform, opacity",
                  height: ring.height,
                  width: ring.width,
                  zIndex: ring.zIndex,
                  transform: "translateZ(0)", // Enable GPU acceleration
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[rgb(52,244,175)] rounded-full border z-20 inlay-shadow origin-center"
              />
            )
        )}
      </div>
    </>
  );
});

RippleEffect.displayName = "RippleEffect";
