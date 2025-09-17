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
  useInView,
} from "framer-motion";
import Image, {StaticImageData} from "next/image";

// import all 60 images
import Image1 from "@/public/hero-images/1.PNG";
import Image1Small from "@/public/hero-images/1_small.png";
import Image2 from "@/public/hero-images/2.PNG";
import Image2Small from "@/public/hero-images/2_small.png";
import Image3 from "@/public/hero-images/3.PNG";
import Image3Small from "@/public/hero-images/3_small.png";
import Image4 from "@/public/hero-images/4.PNG";
import Image4Small from "@/public/hero-images/4_small.png";
import Image5 from "@/public/hero-images/5.PNG";
import Image5Small from "@/public/hero-images/5_small.png";
import Image6 from "@/public/hero-images/6.PNG";
import Image6Small from "@/public/hero-images/6_small.png";
import Image7 from "@/public/hero-images/7.PNG";
import Image7Small from "@/public/hero-images/7_small.png";
import Image8 from "@/public/hero-images/8.PNG";
import Image8Small from "@/public/hero-images/8_small.png";
import Image9 from "@/public/hero-images/9.PNG";
import Image9Small from "@/public/hero-images/9_small.png";
import Image10 from "@/public/hero-images/10.PNG";
import Image10Small from "@/public/hero-images/10_small.png";
import Image11 from "@/public/hero-images/11.PNG";
import Image11Small from "@/public/hero-images/11_small.png";
import Image12 from "@/public/hero-images/12.PNG";
import Image12Small from "@/public/hero-images/12_small.png";
import Image13 from "@/public/hero-images/13.PNG";
import Image13Small from "@/public/hero-images/13_small.png";
import Image14 from "@/public/hero-images/14.PNG";
import Image14Small from "@/public/hero-images/14_small.png";
import Image15 from "@/public/hero-images/15.PNG";
import Image15Small from "@/public/hero-images/15_small.png";
import Image16 from "@/public/hero-images/16.PNG";
import Image16Small from "@/public/hero-images/16_small.png";
import Image17 from "@/public/hero-images/17.PNG";
import Image17Small from "@/public/hero-images/17_small.png";
import Image18 from "@/public/hero-images/18.PNG";
import Image18Small from "@/public/hero-images/18_small.png";
import Image19 from "@/public/hero-images/19.PNG";
import Image19Small from "@/public/hero-images/19_small.png";
import Image20 from "@/public/hero-images/20.PNG";
import Image20Small from "@/public/hero-images/20_small.png";
import Image21 from "@/public/hero-images/21.PNG";
import Image21Small from "@/public/hero-images/21_small.png";
import Image22 from "@/public/hero-images/22.PNG";
import Image22Small from "@/public/hero-images/22_small.png";
import Image23 from "@/public/hero-images/23.PNG";
import Image23Small from "@/public/hero-images/23_small.png";
import Image24 from "@/public/hero-images/24.PNG";
import Image24Small from "@/public/hero-images/24_small.png";
import Image25 from "@/public/hero-images/25.PNG";
import Image25Small from "@/public/hero-images/25_small.png";
import Image26 from "@/public/hero-images/26.PNG";
import Image26Small from "@/public/hero-images/26_small.png";
import Image27 from "@/public/hero-images/27.PNG";
import Image27Small from "@/public/hero-images/27_small.png";
import Image28 from "@/public/hero-images/28.PNG";
import Image28Small from "@/public/hero-images/28_small.png";
import Image29 from "@/public/hero-images/29.PNG";
import Image29Small from "@/public/hero-images/29_small.png";
import Image30 from "@/public/hero-images/30.PNG";
import Image30Small from "@/public/hero-images/30_small.png";
import Image31 from "@/public/hero-images/31.PNG";
import Image31Small from "@/public/hero-images/31_small.png";
import Image32 from "@/public/hero-images/32.PNG";
import Image32Small from "@/public/hero-images/32_small.png";
import Image33 from "@/public/hero-images/33.PNG";
import Image33Small from "@/public/hero-images/33_small.png";
import Image34 from "@/public/hero-images/34.PNG";
import Image34Small from "@/public/hero-images/34_small.png";
import Image35 from "@/public/hero-images/35.PNG";
import Image35Small from "@/public/hero-images/35_small.png";
import Image36 from "@/public/hero-images/36.PNG";
import Image36Small from "@/public/hero-images/36_small.png";
import Image37 from "@/public/hero-images/37.PNG";
import Image37Small from "@/public/hero-images/37_small.png";
import Image38 from "@/public/hero-images/38.PNG";
import Image38Small from "@/public/hero-images/38_small.png";
import Image39 from "@/public/hero-images/39.PNG";
import Image39Small from "@/public/hero-images/39_small.png";
import Image40 from "@/public/hero-images/40.PNG";
import Image40Small from "@/public/hero-images/40_small.png";
import Image41 from "@/public/hero-images/41.PNG";
import Image41Small from "@/public/hero-images/41_small.png";
import Image42 from "@/public/hero-images/42.PNG";
import Image42Small from "@/public/hero-images/42_small.png";
import Image43 from "@/public/hero-images/43.PNG";
import Image43Small from "@/public/hero-images/43_small.png";
import Image44 from "@/public/hero-images/44.PNG";
import Image44Small from "@/public/hero-images/44_small.png";
import Image45 from "@/public/hero-images/45.PNG";
import Image45Small from "@/public/hero-images/45_small.png";
import Image46 from "@/public/hero-images/46.PNG";
import Image46Small from "@/public/hero-images/46_small.png";
import Image47 from "@/public/hero-images/47.PNG";
import Image47Small from "@/public/hero-images/47_small.png";
import Image48 from "@/public/hero-images/48.PNG";
import Image48Small from "@/public/hero-images/48_small.png";
import Image49 from "@/public/hero-images/49.PNG";
import Image49Small from "@/public/hero-images/49_small.png";
import Image50 from "@/public/hero-images/50.PNG";
import Image50Small from "@/public/hero-images/50_small.png";
import Image51 from "@/public/hero-images/51.PNG";
import Image51Small from "@/public/hero-images/51_small.png";
import Image52 from "@/public/hero-images/52.PNG";
import Image52Small from "@/public/hero-images/52_small.png";
import Image53 from "@/public/hero-images/53.PNG";
import Image53Small from "@/public/hero-images/53_small.png";
import Image54 from "@/public/hero-images/54.PNG";
import Image54Small from "@/public/hero-images/54_small.png";
import Image55 from "@/public/hero-images/55.PNG";
import Image55Small from "@/public/hero-images/55_small.png";
import Image56 from "@/public/hero-images/56.PNG";
import Image56Small from "@/public/hero-images/56_small.png";
import Image57 from "@/public/hero-images/57.PNG";
import Image57Small from "@/public/hero-images/57_small.png";
import Image58 from "@/public/hero-images/58.PNG";
import Image58Small from "@/public/hero-images/58_small.png";
import Image59 from "@/public/hero-images/59.PNG";
import Image59Small from "@/public/hero-images/59_small.png";
import Image60 from "@/public/hero-images/60.PNG";
import Image60Small from "@/public/hero-images/60_small.png";

type ImageGroup = {
  big: StaticImageData;
  small: StaticImageData;
};

const IMAGES: ImageGroup[] = [
  {
    big: Image1,
    small: Image1Small,
  },
  {
    big: Image2,
    small: Image2Small,
  },
  {
    big: Image3,
    small: Image3Small,
  },
  //  add all images here
  {
    big: Image4,
    small: Image4Small,
  },
  {
    big: Image5,
    small: Image5Small,
  },
  {
    big: Image6,
    small: Image6Small,
  },
  {
    big: Image7,
    small: Image7Small,
  },
  {
    big: Image8,
    small: Image8Small,
  },
  {
    big: Image9,
    small: Image9Small,
  },
  {
    big: Image10,
    small: Image10Small,
  },
  {
    big: Image11,
    small: Image11Small,
  },
  {
    big: Image12,
    small: Image12Small,
  },
  {
    big: Image13,
    small: Image13Small,
  },
  {
    big: Image14,
    small: Image14Small,
  },
  {
    big: Image15,
    small: Image15Small,
  },
  {
    big: Image16,
    small: Image16Small,
  },
  {
    big: Image17,
    small: Image17Small,
  },
  {
    big: Image18,
    small: Image18Small,
  },
  {
    big: Image19,
    small: Image19Small,
  },
  {
    big: Image20,
    small: Image20Small,
  },
  {
    big: Image21,
    small: Image21Small,
  },
  {
    big: Image22,
    small: Image22Small,
  },
  {
    big: Image23,
    small: Image23Small,
  },
  {
    big: Image24,
    small: Image24Small,
  },
  {
    big: Image25,
    small: Image25Small,
  },
  {
    big: Image26,
    small: Image26Small,
  },
  {
    big: Image27,
    small: Image27Small,
  },
  {
    big: Image28,
    small: Image28Small,
  },
  {
    big: Image29,
    small: Image29Small,
  },
  {
    big: Image30,
    small: Image30Small,
  },
  {
    big: Image31,
    small: Image31Small,
  },
  {
    big: Image32,
    small: Image32Small,
  },
  {
    big: Image33,
    small: Image33Small,
  },
  {
    big: Image34,
    small: Image34Small,
  },
  {
    big: Image35,
    small: Image35Small,
  },
  {
    big: Image36,
    small: Image36Small,
  },
  {
    big: Image37,
    small: Image37Small,
  },
  {
    big: Image38,
    small: Image38Small,
  },
  {
    big: Image39,
    small: Image39Small,
  },
  {
    big: Image40,
    small: Image40Small,
  },
  {
    big: Image41,
    small: Image41Small,
  },
  {
    big: Image42,
    small: Image42Small,
  },
  {
    big: Image43,
    small: Image43Small,
  },
  {
    big: Image44,
    small: Image44Small,
  },
  {
    big: Image45,
    small: Image45Small,
  },
  {
    big: Image46,
    small: Image46Small,
  },
  {
    big: Image47,
    small: Image47Small,
  },
  {
    big: Image48,
    small: Image48Small,
  },
  {
    big: Image49,
    small: Image49Small,
  },
  {
    big: Image50,
    small: Image50Small,
  },
  {
    big: Image51,
    small: Image51Small,
  },
  {
    big: Image52,
    small: Image52Small,
  },
  {
    big: Image53,
    small: Image53Small,
  },
  {
    big: Image54,
    small: Image54Small,
  },
  {
    big: Image55,
    small: Image55Small,
  },
  {
    big: Image56,
    small: Image56Small,
  },
  {
    big: Image57,
    small: Image57Small,
  },
  {
    big: Image58,
    small: Image58Small,
  },
  {
    big: Image59,
    small: Image59Small,
  },
  {
    big: Image60,
    small: Image60Small,
  },
];

export const ThumbnailCarousel = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {amount: 0});
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
  const useRowMarquee = (
    baseVelocity: number,
    rowDirection: 1 | -1,
    isActive: boolean
  ) => {
    const x = useMotionValue(0);
    const offset = useMotionValue(0);
    const groupRef = useRef<HTMLDivElement | null>(null);
    const [groupWidth, setGroupWidth] = useState(0);

    useEffect(() => {
      if (!groupRef.current) return;
      const element = groupRef.current;
      const measure = () => {
        const w = element.getBoundingClientRect().width;
        setGroupWidth(Math.round(w));
      };
      measure();
      const ro = new ResizeObserver(() => measure());
      ro.observe(element);
      return () => ro.disconnect();
    }, []);

    // Normalize offset if width changes to keep it within [0, width)
    useEffect(() => {
      const width = Math.max(groupWidth, 1);
      const current = offset.get();
      const normalized = ((current % width) + width) % width;
      offset.set(normalized);
    }, [groupWidth]);

    useAnimationFrame((t, delta) => {
      if (!isActive || groupWidth === 0) return;
      const width = Math.max(groupWidth, 1);
      const scrollDir =
        velocityFactor.get() === 0 ? 1 : velocityFactor.get() < 0 ? -1 : 1;
      const effectiveDirection = rowDirection * scrollDir;

      const deltaPx =
        effectiveDirection *
        baseVelocity *
        (delta / 1000) *
        (1 + Math.abs(velocityFactor.get()));
      let nextOffset = offset.get() + deltaPx;
      nextOffset = ((nextOffset % width) + width) % width;
      offset.set(nextOffset);

      // Always map visual x as -offset so content continuity is preserved regardless of direction
      x.set(-Math.round(nextOffset));
    });

    return {x, groupRef};
  };

  // Different speeds per row; middle runs opposite direction
  const top = useRowMarquee(120, 1, isInView);
  const middle = useRowMarquee(70, -1, isInView);
  const bottom = useRowMarquee(180, 1, isInView);

  return (
    <div
      ref={containerRef}
      className="sm:mt-4 w-full h-full  absolute top-0 overflow-hidden rounded-[12px]  grid grid-rows-3 gap-4"
    >
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
              <Thumbnail img={img} isFirstRow={true} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(0, 20).map((img, index) => (
            <div
              key={`top-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color2 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(0, 20).map((img, index) => (
            <div
              key={`top-c-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color2 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
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
              <Thumbnail img={img} isFirstRow={true} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(20, 40).map((img, index) => (
            <div
              key={`middle-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color1 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(20, 40).map((img, index) => (
            <div
              key={`middle-c-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color1 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
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
              <Thumbnail img={img} isFirstRow={true} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(40, 60).map((img, index) => (
            <div
              key={`bottom-b-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color3 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
            </div>
          ))}
        </div>
        <div className="w-fit h-full flex gap-4">
          {IMAGES.slice(40, 60).map((img, index) => (
            <div
              key={`bottom-c-${index}`}
              className="aspect-[9/16] h-full relative border border-theme-color3 rounded-[12px] overflow-hidden flex-shrink-0"
            >
              <Thumbnail img={img} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Thumbnail = ({
  img,
  isFirstRow,
}: {
  img: ImageGroup;
  isFirstRow?: boolean;
}) => {
  const [blurred, setBlurred] = useState(true);

  return (
    <>
      {/* <div
        className="blurred-img w-full aspect-[195/422] -mt-3"
        style={{
          backgroundImage: `url(${img.small.src})`,
          filter: blurred ? "blur(6px)" : "none",
        }}
      >
        <Image
          loading="lazy"
          src={img.big}
          //   fill
          className="object-cover -mt-3 opacity-0 transition-all duration-300"
          alt="showcase thumbnail"
          onLoad={() => setBlurred(false)}
          style={{
            opacity: blurred ? 0 : 1,
          }}
        />
      </div> */}
      <Image
        loading={isFirstRow ? "eager" : "lazy"}
        src={img.small}
        className="w-full aspect-[195/422] object-cover -mt-3 blur-[6px] z-10 absolute"
        alt="showcase thumbnail"
      />
      <Image
        loading="lazy"
        src={img.big}
        // fill
        className="w-full aspect-[195/422] object-cover -mt-3 opacity-0 transition-all duration-300 ease-in-out z-20 absolute"
        alt="showcase thumbnail"
        onLoad={() => setBlurred(false)}
        style={{
          opacity: blurred ? 0 : 1,
        }}
      />
    </>
  );
};
