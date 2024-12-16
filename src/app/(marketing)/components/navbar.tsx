"use client";
import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {LucideProps} from "lucide-react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
const Navbar = ({show, isRelative}: {show: boolean; isRelative?: boolean}) => {
  const [showNavbar, setShowNavbar] = useState(show);

  useEffect(() => {
    // if scroll is greater than 100vh show navbar
    if (show) return;
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowNavbar(true);
      }
      if (window.scrollY < window.innerHeight * 0.8) {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isRelative ? (
          <div
            className={"relative py-4  h-[80px] w-screen px-4 md:px-8 z-[90] "}
          >
            <div className="absolute top-0 left-0  w-full h-[80px]"></div>
            <div className="items-center flex justify-between w-full  relative z-30  h-full ">
              {/* <Link
          className=" md:left-[18px] h-fit relative md:absolute z-30 md:bottom-2 md:translate-y-1/2"
          href="/"
        >
          <Logo className="fill-[#34F4AF] h-12 w-12 mb-1 " />
        </Link> */}
              <div className=" flex items-center gap-2 ">
                <Link className="  h-fit relative " href="/">
                  <Logo className="fill-[#34F4AF] h-8 w-8 mb-1 " />
                </Link>
                <span className="text-xl font1-bold">Whitespace Media</span>
              </div>

              <div className="flex gap-4 md:gap-8  items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/#stats" className=" capitalize font1">
                  process
                </Link>
                <Link href="/#stats" className=" capitalize font1">
                  about
                </Link>
                <button className="text-primary capitalize font1">
                  Resources
                </button>
              </div>

              <Link
                href="/work-with-us"
                className={cn(
                  buttonVariants({variant: "outline"}),
                  " capitalize rounded-[4px] bg-primary  font1 text-background hover:bg-primary hover:text-background transition-colors duration-500"
                )}
              >
                Get in touch
              </Link>
              {/* <div className=" flex justify-between items-center  w-fit md:right-0  relative md:absolute z-20 md:bottom-2 md:translate-y-1/2 ">
        <div className="flex gap-4 md:gap-8 ml-auto items-center ">
          <Link href="/#stats" className=" capitalize font1">
            about
          </Link>
          <button className="text-primary capitalize font1">
            Blog
          </button>

          <Link
            href="/work-with-us"
            className={cn(
              buttonVariants({variant: "outline"}),
              " capitalize rounded-[4px] bg-primary  font1 text-background hover:bg-primary hover:text-background transition-colors duration-500"
            )}
          >
            Contact
          </Link>
        </div>
      </div> */}
            </div>
          </div>
        ) : (
          <>
            {showNavbar && (
              <motion.div
                animate={{y: 0, opacity: 1}}
                initial={!show ? {y: -100, opacity: 0} : {y: 0, opacity: 1}}
                exit={{y: -100, opacity: 0}}
                className={
                  "fixed top-0  py-4  h-[80px] w-screen px-4 md:px-8 z-[90] "
                }
              >
                <div
                  className="w-full h-[80px]  absolute left-0 top-0 z-10"
                  style={{
                    opacity: 0.8,
                    backgroundColor: "transparent",
                    backgroundImage: `radial-gradient( transparent 1px,  #151618 1px)`,
                    backgroundSize: "4px 4px",
                    maskImage: `
                    linear-gradient(to top , rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%)
                  `,
                    WebkitMaskImage: `
                    linear-gradient(to top , rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%)
                  `,
                  }}
                />
                <div
                  className="w-full h-[80px]  absolute left-0 top-0 z-[5]"
                  //   style={{
                  //     opacity: 0.8,
                  //     backgroundColor: "transparent",
                  //     backgroundImage: `radial-gradient( transparent 1px,  #141516 0.4px)`,
                  //     backgroundSize: "4px 4px",
                  //     maskImage: `
                  //   linear-gradient(to top , rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%)
                  // `,
                  //     WebkitMaskImage: `
                  //   linear-gradient(to top , rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%)
                  // `,
                  //   }}
                  style={{
                    backgroundColor: "transparent",
                    // backgroundImage: `radial-gradient(transparent 1px, var(rgb(15, 17, 21), #ffffff) 1px)`,
                    backgroundSize: `4px 4px`,
                    backdropFilter: `blur(3px)`,
                    maskImage: ` linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)`,
                    WebkitMaskImage: ` linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)`,
                    opacity: 1,
                  }}
                />
                <div className="absolute top-0 left-0  w-full h-[80px]"></div>
                <div className="items-center flex justify-between w-full  relative z-30  h-full ">
                  {/* <Link
                    className=" md:left-[18px] h-fit relative md:absolute z-30 md:bottom-2 md:translate-y-1/2"
                    href="/"
                  >
                    <Logo className="fill-[#34F4AF] h-12 w-12 mb-1 " />
                  </Link> */}
                  <div className=" flex items-center gap-2 ">
                    <Link className="  h-fit relative " href="/">
                      <Logo className="fill-[#34F4AF] h-8 w-8 mb-1 " />
                    </Link>
                    <span className="text-xl font1-bold">Whitespace Media</span>
                  </div>

                  <div className=" gap-4 md:gap-8  items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                    <Link href="/#stats" className=" capitalize font1">
                      process
                    </Link>
                    <Link href="/#stats" className=" capitalize font1">
                      about
                    </Link>
                    <Link href="/blog" className=" capitalize font1">
                      Resources
                    </Link>
                  </div>

                  <Link
                    href="/work-with-us"
                    className={cn(
                      buttonVariants({variant: "outline"}),
                      " capitalize rounded-[4px] bg-primary  font1 text-background hover:bg-primary hover:text-background transition-colors duration-500"
                    )}
                  >
                    Get in touch
                  </Link>
                  {/* <div className=" flex justify-between items-center  w-fit md:right-0  relative md:absolute z-20 md:bottom-2 md:translate-y-1/2 ">
                  <div className="flex gap-4 md:gap-8 ml-auto items-center ">
                    <Link href="/#stats" className=" capitalize font1">
                      about
                    </Link>
                    <button className="text-primary capitalize font1">
                      Blog
                    </button>
  
                    <Link
                      href="/work-with-us"
                      className={cn(
                        buttonVariants({variant: "outline"}),
                        " capitalize rounded-[4px] bg-primary  font1 text-background hover:bg-primary hover:text-background transition-colors duration-500"
                      )}
                    >
                      Contact
                    </Link>
                  </div>
                </div> */}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

function Logo({...props}: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 1176 1176"
    >
      <circle cx="588" cy="588" r="588" fill="#34F4AF"></circle>
      <path
        fill="#141516"
        d="M219.863 442.106c39.909 3.98 80.703 20.013 113.647 44.561 11.498 8.514 31.95 28.638 40.794 39.917 13.266 16.917 20.452 30.076 61.135 112.453 44.11 88.901 43.889 88.569 57.708 97.857 18.351 12.274 45.879 12.495 64.341.664 6.08-3.871 17.799-15.812 18.794-19.24.442-1.438-5.307-14.264-17.357-38.48-9.95-20.014-30.291-61.036-45.105-91.112s-37.256-75.301-49.748-100.622c-12.603-25.211-22.663-46.219-22.442-46.551s20.341-.553 44.884-.332c47.537.221 54.612.774 79.707 6.635 44.774 10.283 87.778 37.042 118.843 73.973 17.467 20.677 19.457 24.437 86.673 160.663 17.246 35.052 19.236 38.479 25.758 45.446 11.94 12.605 24.985 18.134 42.563 18.244 20.23 0 38.25-8.956 49.084-24.547l2.985-4.312-18.793-38.038c-10.171-20.898-31.176-63.469-46.543-94.429-42.23-85.363-70.753-143.193-70.753-143.524 0-.111 65.889-.332 146.481-.332s146.481.442 146.481.885c0 .442-12.27 25.542-27.2 55.839-15.03 30.297-34.046 68.998-42.448 86.026-76.612 156.13-79.154 160.663-102.591 183.773-60.804 60.041-158.863 70.103-232.269 23.773-17.025-10.836-40.683-32.84-50.854-47.546-2.653-3.76-4.975-6.856-5.085-6.856-.221 0-3.317 4.091-6.965 9.178-7.517 10.394-25.537 28.196-38.03 37.484-22.994 17.36-54.502 30.408-83.466 34.609-52.623 7.63-100.713-4.644-144.602-36.931-10.06-7.408-30.07-28.086-38.472-39.917-7.185-10.062-31.286-57.277-80.923-158.673-7.407-15.259-26.09-52.964-41.347-83.814C139.492 467.98 127 442.327 127 441.774c0-1.106 81.366-.774 92.863.332"
      ></path>
      <path
        fill="#141516"
        d="M219.863 442.106c39.909 3.98 80.703 20.013 113.647 44.561 11.498 8.514 31.95 28.638 40.794 39.917 13.266 16.917 20.452 30.076 61.135 112.453 44.11 88.901 43.889 88.569 57.708 97.857 18.351 12.274 45.879 12.495 64.341.664 6.08-3.871 17.799-15.812 18.794-19.24.442-1.438-5.307-14.264-17.357-38.48-9.95-20.014-30.291-61.036-45.105-91.112s-37.256-75.301-49.748-100.622c-12.603-25.211-22.663-46.219-22.442-46.551s20.341-.553 44.884-.332c47.537.221 54.612.774 79.707 6.635 44.774 10.283 87.778 37.042 118.843 73.973 17.467 20.677 19.457 24.437 86.673 160.663 17.246 35.052 19.236 38.479 25.758 45.446 11.94 12.605 24.985 18.134 42.563 18.244 20.23 0 38.25-8.956 49.084-24.547l2.985-4.312-18.793-38.038c-10.171-20.898-31.176-63.469-46.543-94.429-42.23-85.363-70.753-143.193-70.753-143.524 0-.111 65.889-.332 146.481-.332s146.481.442 146.481.885c0 .442-12.27 25.542-27.2 55.839-15.03 30.297-34.046 68.998-42.448 86.026-76.612 156.13-79.154 160.663-102.591 183.773-60.804 60.041-158.863 70.103-232.269 23.773-17.025-10.836-40.683-32.84-50.854-47.546-2.653-3.76-4.975-6.856-5.085-6.856-.221 0-3.317 4.091-6.965 9.178-7.517 10.394-25.537 28.196-38.03 37.484-22.994 17.36-54.502 30.408-83.466 34.609-52.623 7.63-100.713-4.644-144.602-36.931-10.06-7.408-30.07-28.086-38.472-39.917-7.185-10.062-31.286-57.277-80.923-158.673-7.407-15.259-26.09-52.964-41.347-83.814C139.492 467.98 127 442.327 127 441.774c0-1.106 81.366-.774 92.863.332"
      ></path>
    </svg>
  );
}
