import React from "react";
import Link from "next/link";
import {Smile} from "./icons";

export const Footer = () => {
  return (
    <div className="w-screen p-2">
      <div className="w-full bg-[#1A1A1A] dark rounded-[12px] p-8 xl:p-16 flex flex-col">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="flex flex-col">
            <h1 className="text-7xl sm:text-8xl  xl:text-10xl big-text-bold flex flex-col">
              Let&apos;s work <br />{" "}
              <span className="relative w-fit ">
                together{" "}
                <Smile className="absolute bottom-0 -right-0 translate-x-full h-16 w-16 md:w-20 xl:w-28 md:h-20  xl:h-28 ml-4 hover:rotate-12 transition-all duration-300  fill-theme-color3" />
              </span>
            </h1>
            <Link
              href="/contact"
              className="mt-6 w-fit flex gap-4 items-center bg-theme-color1 text-background hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background py-2 px-6 rounded-full big-text text-3xl"
            >
              <div className="flex">
                <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/IMG_0878.jpg?alt=media&token=0b2bed83-d3ca-47c3-9c43-1a7a0158a1f2"
                    alt="profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/profile.png?alt=media&token=a973ee0a-ff42-43a5-86e1-d52325696d14"
                    alt="profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                  <img
                    src="https://lh3.googleusercontent.com/a/ACg8ocKrWZ-yNhXDVCODwyNgxuqmB7vjv523Cx-55i1yMnuGLjKGUDHI=s96-c"
                    alt="profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </div>
              Let&apos;s talk
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-12 md:mt-0">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl big-text-bold ">Explore</h1>
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className=" text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  Work
                </Link>
                <Link
                  href="/"
                  className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  Services
                </Link>
                <Link
                  href="/"
                  className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  Blog
                </Link>
                <Link
                  href="/"
                  className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl big-text-bold">Say hello</h1>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:team@ripple-media.co"
                  className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  team@ripple-media.co
                </a>
                <a
                  href="tel:+17206482708"
                  className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary text-xl"
                >
                  +1 (720)-648-2708
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-1 border-b border-[#BBBBBB] border-dashed my-8"></div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
          <p className="text-[#BBBBBB] small-text">
            © 2025 Ripple Media All rights reserved
          </p>
          {/* add privacy policy and terms of service */}
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary "
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#BBBBBB] small-text underline hover:no-underline hover:text-primary "
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
