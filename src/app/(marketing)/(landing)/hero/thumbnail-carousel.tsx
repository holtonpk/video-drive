"use client";
import React, {useEffect, useState, useRef} from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import {wrap} from "@motionone/utils";
// import all 60 images
import Image1 from "@/public/hero-images/1.PNG";
import Image2 from "@/public/hero-images/2.PNG";
import Image3 from "@/public/hero-images/3.PNG";
import Image4 from "@/public/hero-images/4.PNG";
import Image5 from "@/public/hero-images/5.PNG";
import Image6 from "@/public/hero-images/6.PNG";
import Image7 from "@/public/hero-images/7.PNG";
import Image8 from "@/public/hero-images/8.PNG";
import Image9 from "@/public/hero-images/9.PNG";
import Image10 from "@/public/hero-images/10.PNG";
import Image11 from "@/public/hero-images/11.PNG";
import Image12 from "@/public/hero-images/12.PNG";
import Image13 from "@/public/hero-images/13.PNG";
import Image14 from "@/public/hero-images/14.PNG";
import Image15 from "@/public/hero-images/15.PNG";
import Image16 from "@/public/hero-images/16.PNG";
import Image17 from "@/public/hero-images/17.PNG";
import Image18 from "@/public/hero-images/18.PNG";
import Image19 from "@/public/hero-images/19.PNG";
import Image20 from "@/public/hero-images/20.PNG";
import Image21 from "@/public/hero-images/21.PNG";
import Image22 from "@/public/hero-images/22.PNG";
import Image23 from "@/public/hero-images/23.PNG";
import Image24 from "@/public/hero-images/24.PNG";
import Image25 from "@/public/hero-images/25.PNG";
import Image26 from "@/public/hero-images/26.PNG";
import Image27 from "@/public/hero-images/27.PNG";
import Image28 from "@/public/hero-images/28.PNG";
import Image29 from "@/public/hero-images/29.PNG";
import Image30 from "@/public/hero-images/30.PNG";
import Image31 from "@/public/hero-images/31.PNG";
import Image32 from "@/public/hero-images/32.PNG";
import Image33 from "@/public/hero-images/33.PNG";
import Image34 from "@/public/hero-images/34.PNG";
import Image35 from "@/public/hero-images/35.PNG";
import Image36 from "@/public/hero-images/36.PNG";
import Image37 from "@/public/hero-images/37.PNG";
import Image38 from "@/public/hero-images/38.PNG";
import Image39 from "@/public/hero-images/39.PNG";
import Image40 from "@/public/hero-images/40.PNG";
import Image41 from "@/public/hero-images/41.PNG";
import Image42 from "@/public/hero-images/42.PNG";
import Image43 from "@/public/hero-images/43.PNG";
import Image44 from "@/public/hero-images/44.PNG";
import Image45 from "@/public/hero-images/45.PNG";
import Image46 from "@/public/hero-images/46.PNG";
import Image47 from "@/public/hero-images/47.PNG";
import Image48 from "@/public/hero-images/48.PNG";
import Image49 from "@/public/hero-images/49.PNG";
import Image50 from "@/public/hero-images/50.PNG";
import Image51 from "@/public/hero-images/51.PNG";
import Image52 from "@/public/hero-images/52.PNG";
import Image53 from "@/public/hero-images/53.PNG";
import Image54 from "@/public/hero-images/54.PNG";
import Image55 from "@/public/hero-images/55.PNG";
import Image56 from "@/public/hero-images/56.PNG";
import Image57 from "@/public/hero-images/57.PNG";
import Image58 from "@/public/hero-images/58.PNG";
import Image59 from "@/public/hero-images/59.PNG";
import Image60 from "@/public/hero-images/60.PNG";

const IMAGES = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
  Image10,
  Image11,
  Image12,
  Image13,
  Image14,
  Image15,
  Image16,
  Image17,
  Image18,
  Image19,
  Image20,
  Image21,
  Image22,
  Image23,
  Image24,
  Image25,
  Image26,
  Image27,
  Image28,
  Image29,
  Image30,
  Image31,
  Image32,
  Image33,
  Image34,
  Image35,
  Image36,
  Image37,
  Image38,
  Image39,
  Image40,
  Image41,
  Image42,
  Image43,
  Image44,
  Image45,
  Image46,
  Image47,
  Image48,
  Image49,
  Image50,
  Image51,
  Image52,
  Image53,
  Image54,
  Image55,
  Image56,
  Image57,
  Image58,
  Image59,
  Image60,
];

export const ThumbnailCarousel = () => {
  const {scrollY} = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 100,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Helper to create a seamless marquee using pixel-based wrapping over measured width
  const useRowMarquee = (baseVelocity: number, rowDirection: 1 | -1) => {
    const baseX = useMotionValue(0);
    const groupRef = useRef<HTMLDivElement | null>(null);
    const [groupWidth, setGroupWidth] = useState(0);

    useEffect(() => {
      if (!groupRef.current) return;
      const element = groupRef.current;
      const measure = () =>
        setGroupWidth(element.getBoundingClientRect().width);
      measure();
      const ro = new ResizeObserver(() => measure());
      ro.observe(element);
      return () => ro.disconnect();
    }, []);

    const x = useTransform(baseX, (v) => {
      const width = Math.max(groupWidth, 1);
      return `${wrap(-width, 0, v)}px`;
    });

    useAnimationFrame((t, delta) => {
      const scrollDir =
        velocityFactor.get() === 0 ? 1 : velocityFactor.get() < 0 ? -1 : 1;
      const effectiveDirection = rowDirection * scrollDir;
      let moveBy = effectiveDirection * baseVelocity * (delta / 1000);
      moveBy += effectiveDirection * moveBy * Math.abs(velocityFactor.get());
      baseX.set(baseX.get() + moveBy);
    });

    return {x, groupRef};
  };

  // Different speeds per row; middle runs opposite direction
  const top = useRowMarquee(120, 1);
  const middle = useRowMarquee(70, -1);
  const bottom = useRowMarquee(180, 1);

  return (
    <div className="mt-4 w-full h-full  absolute top-0 overflow-hidden rounded-[12px]  grid grid-rows-3 gap-4">
      {/* Top row - framer motion */}
      <motion.div
        style={{x: top.x}}
        className="w-fit h-full flex gap-4 will-change-transform"
      >
        <div ref={top.groupRef} className="w-fit h-full flex gap-4">
          {IMAGES.slice(0, 20).map((img, index) => (
            <div
              key={`top-a-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color2 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={img}
                priority
                loading="eager"
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(0, 20).map((img, index) => (
            <div
              key={`top-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color2 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={img}
                priority
                loading="eager"
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Middle row - framer motion, opposite direction */}
      <motion.div
        style={{x: middle.x}}
        className="w-fit h-full flex gap-4 will-change-transform"
      >
        <div ref={middle.groupRef} className="w-fit h-full flex gap-4">
          {IMAGES.slice(20, 40).map((img, index) => (
            <div
              key={`middle-a-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color1 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={img}
                priority
                loading="eager"
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(20, 40).map((img, index) => (
            <div
              key={`middle-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color1 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={img}
                priority
                loading="eager"
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom row - framer motion */}
      <motion.div
        style={{x: bottom.x}}
        className="w-fit h-full flex gap-4 will-change-transform"
      >
        <div ref={bottom.groupRef} className="w-fit h-full flex gap-4">
          {IMAGES.slice(40, 60).map((img, index) => (
            <div
              key={`bottom-a-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color3 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                priority
                loading="eager"
                src={img}
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(40, 60).map((img, index) => (
            <div
              key={`bottom-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color3 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Image
                priority
                loading="eager"
                src={img}
                fill
                className="w-full h-full object-cover"
                alt="showcase thumbnail"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
