"use client";
import React from "react";
import {motion} from "framer-motion";

const DownArrow = () => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 4}}
      className="absolute h-fit w-fit z-30  bottom-10 left-1/2 -translate-x-1/2 flex gap-[3px]"
    >
      <span className="h-1 w-1 bg-white rounded-full -translate-y-[15px] animate-pulse"></span>
      <span className="h-1 w-1 bg-white rounded-full -translate-y-2 animate-pulse"></span>
      <span className="h-1 w-1 bg-white rounded-full animate-pulse"></span>
      <span className="h-1 w-1 bg-white rounded-full -translate-y-2 animate-pulse"></span>
      <span className="h-1 w-1 bg-white rounded-full -translate-y-[15px] animate-pulse"></span>
    </motion.div>
  );
};

export default DownArrow;
