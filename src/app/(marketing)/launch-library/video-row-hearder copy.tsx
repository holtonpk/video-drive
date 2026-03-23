"use client";
import React, {useState} from "react";
import localFont from "next/font/local";

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const VideoRowHeader = () => {
  const sortCategories = [
    "Recent",
    "Most Viewed",
    "Most Liked",
    "Most Shared",
    "Most Replied",
  ];

  const [filter, setFilter] = useState("Recent");

  return (
    <div className="flex flex-row gap-4 mt-6 w-fit mx-auto">
      {sortCategories.map((category) => (
        <button
          key={category}
          className={`px-6 py-2  text-[20px]  font1 border-2  rounded-full hover:border-theme-color1 hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background ${
            h2Font.className
          } ${
            filter === category
              ? "bg-theme-color1  border-theme-color1 text-background"
              : "border-[#EAEAEA] bg-transparent text-primary "
          }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default VideoRowHeader;
