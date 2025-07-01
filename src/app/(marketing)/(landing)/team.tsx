"use client";
import {LucideProps} from "lucide-react";
import React from "react";
import {Diamond, Eyes} from "../icons";
import {motion, useInView} from "framer-motion";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export const Team = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const diamondRef = React.useRef(null);
  const isDiamondInView = useInView(diamondRef, {once: true});
  const eyesRef = React.useRef(null);
  const isEyesInView = useInView(eyesRef, {once: true});

  const Flexes = [
    {
      title: "Driven by Results",
      description:
        "We create high-impact videos tailored to your brand’s goals—built to perform, not just look good.",
    },
    {
      title: "All In-House, All-In",
      description:
        "Our tight-knit team of 4 editors, writers, and digital marketers handles everything internally—no outsourcing, no compromises.",
    },
    {
      title: "Obsessed with Quality",
      description:
        "We sweat the details. Every frame, cut, and caption goes through our hands-on quality process to make sure it’s done right.",
    },
    {
      title: "Real Support, Real Relationships",
      description:
        "You’ll never get passed around. We keep it personal, providing one-on-one support and long-term partnership that grows with you.",
    },
  ];

  return (
    <div className="container mx-auto  flex flex-col gap-16 items-center py-16  ">
      <div className="flex flex-col items-center text-center gap-4 max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
        <h1
          className={`relative text-6xl sm:text-7xl md:text-8xl uppercase ${h1Font.className}`}
        >
          <span className="relative z-20">{title}</span>
          <Caption className="absolute -top-4 sm:top-0 -translate-y-3/4  right-4 h-[40px] w-[150px] z-10 rotate-12" />
          <motion.div
            ref={diamondRef}
            initial={{opacity: 0, scale: 0, rotate: 180}}
            animate={
              isDiamondInView
                ? {opacity: 1, scale: 1, rotate: 0}
                : {opacity: 0, scale: 0, rotate: 180}
            }
            transition={{duration: 1, delay: 0.5, ease: "easeInOut"}}
            className="absolute top-1/4 left-0"
          >
            <Diamond className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color2" />
          </motion.div>
          <motion.div
            ref={eyesRef}
            initial={{opacity: 0, scale: 0, rotate: -180}}
            animate={
              isEyesInView
                ? {opacity: 1, scale: 1, rotate: 0}
                : {opacity: 0, scale: 0, rotate: -180}
            }
            transition={{duration: 1, delay: 0.8, ease: "easeInOut"}}
            className="absolute bottom-[80px] right-0 translate-x-1/2"
          >
            <Eyes className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color1" />
          </motion.div>
        </h1>
        <p className={`text-primary/70 text-xl ${bodyFont.className}`}>
          {description}
        </p>
      </div>
      <div className=" grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-primary/40 lg:divide-dashed gap-6 lg:gap-4">
        {Flexes.map((flex, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 items-center text-center lg:p-4"
          >
            <Check className="h-[34px] w-[34px] " />
            <h2 className={`text-2xl uppercase font-bold ${h2Font.className}`}>
              {flex.title}
            </h2>
            <p className={`text-primary/70 text-xl ${bodyFont.className}`}>
              {flex.description}
            </p>
          </div>
        ))}
      </div>
      <button
        className={`bg-background text-3xl rounded-full uppercase border-2 border-theme-color1 text-white px-8 py-2 hover:ring-2 hover:ring-white hover:border-white ring-offset-4 ring-offset-background ${h2Font.className}`}
      >
        About Us
      </button>
    </div>
  );
};

const Caption = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 708 185"
    >
      <rect width="708" height="127" fill="#FFB3DB" rx="8"></rect>
      <path
        fill="#FFB3DB"
        d="M582 96h46l-44.112 85.346c-.481.931-1.888.589-1.888-.459z"
      ></path>
      <path
        fill="#111"
        d="M31.064 44.736h-11.04v-7.488q4.512 0 7.2-.768 2.784-.768 4.416-2.496 1.632-1.824 2.88-5.184h7.104V96h-10.56zM69.98 96.96q-7.776 0-11.904-4.416t-4.128-12.48V44.736q0-8.064 4.128-12.48t11.904-4.416 11.904 4.416 4.128 12.48v35.328q0 8.064-4.128 12.48T69.981 96.96m0-9.6q5.472 0 5.472-6.624V44.064q0-6.624-5.472-6.624t-5.472 6.624v36.672q0 6.624 5.472 6.624m34.694-21.216H91.811v-7.488h12.864v-12.96h7.488v12.96h12.864v7.488h-12.864v13.152h-7.488zm51.988 1.248L143.895 28.8h11.232l7.2 24.672h.192l7.2-24.672h10.272l-12.768 38.592V96h-10.56zM184.749 28.8h28.8v9.6h-18.24v17.76h14.496v9.6h-14.496V86.4h18.24V96h-28.8zm43.035 0h14.304L253.032 96h-10.56l-1.92-13.344v.192h-12L226.632 96h-9.792zm11.52 44.928L234.6 40.512h-.192l-4.609 33.216zM258.155 28.8h15.648q8.16 0 11.904 3.84 3.744 3.744 3.744 11.616v4.128q0 10.464-6.912 13.248v.192q3.84 1.152 5.376 4.704 1.632 3.552 1.632 9.504V87.84q0 2.88.192 4.704.192 1.728.96 3.456h-10.752q-.576-1.632-.768-3.072t-.192-5.184V75.456q0-4.608-1.536-6.432-1.44-1.824-5.088-1.824h-3.648V96h-10.56zm14.4 28.8q3.168 0 4.704-1.632 1.632-1.632 1.632-5.472v-5.184q0-3.648-1.344-5.28-1.248-1.632-4.032-1.632h-4.8v19.2zm38.047 39.36q-7.68 0-11.616-4.32-3.936-4.416-3.936-12.576v-3.84h9.984v4.608q0 6.528 5.472 6.528 2.688 0 4.032-1.536 1.44-1.632 1.44-5.184 0-4.224-1.92-7.392-1.92-3.264-7.104-7.776-6.528-5.76-9.12-10.368-2.592-4.704-2.592-10.56 0-7.968 4.031-12.288 4.033-4.416 11.713-4.416 7.584 0 11.424 4.416 3.936 4.32 3.936 12.48v2.784h-9.984v-3.456q0-3.456-1.344-4.992-1.344-1.632-3.936-1.632-5.28 0-5.28 6.432 0 3.648 1.92 6.816 2.016 3.168 7.2 7.68 6.624 5.76 9.12 10.464t2.496 11.04q0 8.256-4.128 12.672-4.032 4.416-11.808 4.416m37.365-68.16h28.8v9.6h-18.24v17.76h14.496v9.6h-14.496V86.4h18.24V96h-28.8zm44.375 32.832L380.726 28.8h11.136l7.104 21.696h.192l7.296-21.696h9.984l-11.616 32.832L417.014 96h-11.136l-7.68-23.424h-.192L390.134 96h-9.984zM422.03 28.8h15.552q7.872 0 11.808 4.224t3.936 12.384v6.624q0 8.16-3.936 12.384t-11.808 4.224h-4.992V96h-10.56zm15.552 30.24q2.592 0 3.84-1.44 1.344-1.44 1.344-4.896v-7.968q0-3.456-1.344-4.896-1.248-1.44-3.84-1.44h-4.992v20.64zm21.479-30.24h28.8v9.6h-18.24v17.76h14.496v9.6h-14.496V86.4h18.24V96h-28.8zm34.875 0h15.648q8.16 0 11.904 3.84 3.744 3.744 3.744 11.616v4.128q0 10.464-6.912 13.248v.192q3.84 1.152 5.376 4.704 1.632 3.552 1.632 9.504V87.84q0 2.88.192 4.704.192 1.728.96 3.456h-10.752q-.576-1.632-.768-3.072t-.192-5.184V75.456q0-4.608-1.536-6.432-1.44-1.824-5.088-1.824h-3.648V96h-10.56zm14.4 28.8q3.168 0 4.704-1.632 1.632-1.632 1.632-5.472v-5.184q0-3.648-1.344-5.28-1.248-1.632-4.032-1.632h-4.8v19.2zm24.319-28.8h10.56V96h-10.56zm18.469 0h28.8v9.6h-18.24v17.76h14.496v9.6h-14.496V86.4h18.24V96h-28.8zm34.875 0h13.248l10.272 40.224h.192V28.8h9.408V96h-10.848l-12.672-49.056h-.192V96h-9.408zm55.848 68.16q-7.584 0-11.616-4.32-3.936-4.32-3.936-12.192V44.352q0-7.872 3.936-12.192 4.032-4.32 11.616-4.32t11.52 4.32q4.032 4.32 4.032 12.192v7.104h-9.984V43.68q0-6.24-5.28-6.24t-5.28 6.24v37.536q0 6.144 5.28 6.144t5.28-6.144V70.944h9.984v9.504q0 7.872-4.032 12.192-3.936 4.32-11.52 4.32m21.87-68.16h28.8v9.6h-18.24v17.76h14.496v9.6h-14.496V86.4h18.24V96h-28.8z"
      ></path>
    </svg>
  );
};

export const Check = (props: LucideProps) => {
  return (
    <svg
      {...props}
      viewBox="0 0 34 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.948242" width="34" height="34" rx="10" fill="#FFB3DB"></rect>
      <path
        d="M27 12.4373L13.4367 25.9919L7 19.5552L9.48907 17.0662L13.4367 21.0137L24.5109 9.94824L27 12.4373Z"
        fill="#111111"
      ></path>
    </svg>
  );
};
