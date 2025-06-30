"use client";

import Link from "next/link";
import {ArrowRight} from "lucide-react";

export const ContactUs = () => {
  return (
    <div className="container relative my-6 md:mt-0 md:mb-20">
      <Link
        href="/contact"
        className="relative w-[90%] mx-auto rounded-full h-[300px] md:h-[400px] aspect-square flex items-center justify-center text-4xl md:text-8xl font1  font-bold hover:bg-[#181818] bg-black md:bg-black/10 blurBack text-background md:text-primary hover:text-background transition-colors duration-500 group"
      >
        Let&apos;s get Started
        <ArrowRight className="h-8 w-8 md:h-16 md:w-16 ml-4 group-hover:translate-x-[50px] transition-transform duration-500" />
      </Link>
    </div>
  );
};
