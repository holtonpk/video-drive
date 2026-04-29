import localFont from "next/font/local";

import "./markdown.css";
import React from "react";

const h1Font = localFont({
  src: "../fonts/HeadingNow-56Bold.ttf",
});

export const Section = ({
  header,
  children,
  isSub = false,
  id,
  className,
}: {
  header: string;
  children: React.ReactNode;
  isSub?: boolean;
  id?: string;
  className?: string;
}) => {
  return (
    <div
      id={id}
      className={`${isSub ? "w-full" : "w-full"} mx-auto items-start flex flex-col  ${className}`}
    >
      <h1
        className={`${h1Font.className} ${isSub ? "text-2xl text-[#3A5AFF]" : "text-3xl text-[#7F44F8]"} ] `}
      >
        {header}
      </h1>
      <div className="w-full">{children}</div>
    </div>
  );
};
