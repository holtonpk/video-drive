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
      <div className="flex w-full gap-[1px] items-center">
        {!isSub && <div className="h-1 w-[40px] bg-[#7F44F8] rounded-l-full" />}
        <h1
          className={`${h1Font.className} ${isSub ? "text-2xl text-[#7F44F8]" : "text-4xl text-[#7F44F8]"} whitespace-nowrap `}
        >
          {header}
        </h1>
        {!isSub && <div className="h-1 w-full bg-[#7F44F8] rounded-r-full" />}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
