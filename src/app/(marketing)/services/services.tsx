import React from "react";
import {Process} from "../landing2/process";
import {Slash} from "../icons";

export const Services = () => {
  return (
    <div className="bg-background dark py-40">
      <Process
        Heading={
          <>
            <h1 className="text-8xl big-text-bold text-center relative">
              <span className="relative ">
                Explore
                <Slash className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[110%] fill-theme-color3" />
              </span>{" "}
              More
            </h1>
            <p className="text-center text-xl small-text text-primary/70 max-w-[400px] mx-auto">
              Bold ideas. Smarter strategies. Game-changing results. Let’s
              elevate your marketing and unlock its full potential.
            </p>
          </>
        }
      />
    </div>
  );
};
