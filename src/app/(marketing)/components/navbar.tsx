"use client";
import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {LucideProps} from "lucide-react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
const Navbar = ({show, isRelative}: {show: boolean; isRelative?: boolean}) => {
  const [showNavbar, setShowNavbar] = useState(show);

  // useEffect(() => {
  //   // if scroll is greater than 100vh show navbar
  //   if (show) return;
  //   const handleScroll = () => {
  //     if (window.scrollY > window.innerHeight * 0.8) {
  //       setShowNavbar(true);
  //     }
  //     if (window.scrollY < window.innerHeight * 0.8) {
  //       setShowNavbar(false);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

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
              <Link className="  h-fit relative " href="/">
                <div className=" flex items-center gap-2 ">
                  <Logo className="fill-[#34F4AF] h-8 w-8 mb-1 " />
                  <span className="text-lg md:text-xl font1-bold">
                    Ripple Media
                  </span>
                </div>
              </Link>

              <div className="md:flex gap-4 md:gap-8 hidden  items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/#compare" className=" capitalize font1">
                  why Ripple?
                </Link>
                <Link href="/#about" className=" capitalize font1">
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
            <motion.div
              animate={{y: 0, opacity: 1}}
              initial={!show ? {y: -100, opacity: 0} : {y: 0, opacity: 1}}
              transition={!show ? {delay: 1.8, duration: 1} : {delay: 0}}
              exit={{y: -100, opacity: 0}}
              className={
                "fixed top-0  py-4  h-[80px] w-screen px-4 md:px-8 z-[100] "
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
                <Link className="  h-fit relative " href="/">
                  <div className=" flex items-center gap-2 ">
                    <Logo className="fill-[#34F4AF] h-8 w-8  " />
                    <span className="text-2xl font1-bold">ripple media</span>
                  </div>
                </Link>

                <div className=" gap-4 md:gap-8  items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                  <Link href="/#compare" className=" capitalize font1 ">
                    Why Ripple?
                  </Link>
                  <Link href="/#about" className=" capitalize font1 ">
                    about
                  </Link>
                  <Link href="/blog" className=" capitalize font1 ">
                    Resources
                  </Link>
                </div>

                <Link
                  href="/work-with-us"
                  className={cn(
                    buttonVariants({variant: "outline"}),
                    " capitalize rounded-[4px]  text-[#34F4AF] bg-transparent blurBack border-[#34F4AF] hover:bg-[#34F4AF]  font1   hover:text-background transition-colors duration-500"
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
      viewBox="0 0 906 905"
    >
      <g clipPath="url(#clip0_14_19)">
        <path
          fill="#34F4AF"
          d="M906 164.974v4.858c-5.432 4.235-9.07 6.781-14.605.831L736.094 15.406c-6.913-4.754-4.054-13.613 4.002-13.873 11.616-.364 47.375 19.07 58.368 25.928 51.039 31.774 88.955 80.305 107.562 137.513z"
        ></path>
        <path
          fill="#DCEFE3"
          d="M744.228 902.523v1.611h-8.082v-1.611c2.261-4.598 5.743-4.339 8.082 0"
        ></path>
        <path
          fill="#34F4AF"
          d="M325.389 721.572c-3.613 5.689 7.432 17.224 11.148 21.589 14.995 17.511 34.771 32.709 49.896 50.375 4.236 7.353.598 16.498-6.731 20.343-19.308 10.106-77.988 3.169-100.155-2.416-9.668-2.442-38.566-16.134-45.634-11.016-2.053 1.481-1.17 9.067-.104 11.483 3.092 6.937 23.778 20.005 29.963 26.63 11.253 12.055 14.787 33.047-5.639 34.917-16.268 1.507-44.179-7.326-59.979-12.99-75.909-27.149-138.15-92.879-158.861-171.131-3.119-11.769-11.045-42.633-2.859-52.064 17.932-20.706 46.44 28.942 58.42 35.333 5.067 2.702 10.889 2.806 11.954-3.923.962-6.105-11.59-40.529-13.773-50.843-4.704-22.083-7.51-47.803-5.613-70.354 1.299-15.588 5.275-34.398 25.441-27.097l58.732 57.727c29.47 12.185 6.185-28.162 2.417-39.619-17.568-53.389-15.775-113.17-.416-166.871 2.833-9.898 15.488-37.073 11.668-44.919-3.456-7.093-12.058.104-16.138 3.273-13.773 10.678-46.128 53.415-58.628 56.247-19.516 4.391-22.219-17.069-23.18-31.124-2.001-29.072 2.988-61.547 10.966-89.449 2.469-8.574 12.63-25.643 7.069-33.411-7.614-10.652-33.212 25.824-38.981 30.605-20.296 16.835-36.46 9.95-33.55-17.355 10.005-93.424 90.826-180.146 179.495-205.503 16.398-4.702 70.764-19.952 59.382 14.082-4.626 13.847-42.568 37.073-40.125 46.634 3.17 12.496 20.608 1.221 27.625-.935 31.652-9.691 82.692-19.927 114.526-10.055 42.672 13.224-23.207 56.169-35.551 69.601-5.509 5.975-23.83 28.812-4.521 26.344 12.967-1.663 31.47-11.172 44.932-15.069 49.74-14.445 111.772-14.107 161.044 2.339 8.134 2.702 16.762 8.131 25.052 10.547 10.863 3.144 20.764 5.041 16.918-10.443l-59.33-60.352c-8.549-16.264 5.25-22.733 19.101-25.227 35.109-6.287 79.47 3.845 113.149 14.315 5.796 1.793 10.318 7.067 16.866 4.105 8.368-3.819 3.561-10.73-.234-15.874-10.187-13.743-37.811-24.733-36.018-45.023 1.585-17.875 22.375-14.108 34.771-11.951 94.075 16.341 199.817 113.585 205.353 211.971 1.247 21.98-10.057 36.996-30.743 21.044-9.07-6.988-24.636-30.396-32.355-33.982-4.963-2.312-9.745-.493-11.746 4.521-1.871 4.728 6.991 22.213 8.966 28.994 8.134 27.824 12.967 60.429 10.966 89.449-1.221 17.641-5.665 40.269-28.378 28.241l-58.446-58.014c-24.948-7.145-4.314 28.033-.987 38.165 16.45 50.037 18.711 112.935 4.418 163.778-2.729 9.691-19.361 45.154-14.657 51.857 1.819 2.598 10.473 2.182 13.123 0l58.368-58.118c23.155-9.509 25.468 14.341 26.559 31.254 1.43 21.979-1.221 47.024-6.029 68.51-2.287 10.184-15.904 43.828-12.656 50.427.884 1.793 2.937 3.092 4.912 3.274 14.449 1.377 33.056-41.361 53.326-41.257 30.276.156 6.341 64.977.416 80.435-29.262 76.355-94.023 132.732-172.713 154.062-11.59 3.143-46.283 12.99-51.039-2.338-8.004-25.721 29.028-37.594 37.89-54.507 12.786-24.395-39.007-1.273-46.388.572-22.219 5.508-80.691 12.548-100.155 2.416-10.785-5.612-10.005-14.835-3.743-23.798l56.419-56.792c9.044-27.903-32.406-3.819-43.815-.156-50.233 16.159-115.54 15.432-165.903-.052-7.147-2.208-41.035-18.55-45.478-11.535zM7.615 731.34c2.754-.805 5.56-.649 7.848 1.273 45.608 49.752 99.791 94.828 144.75 144.788 12.318 13.691 28.248 31.098-5.224 23.018C99.74 887.117 39.501 823.05 15.047 773.454c-3.612-7.3-19.62-38.528-7.407-42.114zM164.63 1.949c5.951-.806 13.514 2.494 10.525 8.885L16.216 170.663c-11.564 9.067-14.709-.727-12.266-12.262 5.613-26.422 37.656-72.485 56.704-92.1 20.92-21.59 74.403-60.3 103.976-64.352M744.228 902.523c-2.598.338-5.457-.234-8.082 0-10.083-9.093 3.379-15.432 8.94-20.992 49.298-49.362 98.648-98.698 147.946-148.06 20.426-15.744 6.809 24.629 3.561 32.657-20.582 50.947-96.232 128.887-152.365 136.369z"
        ></path>
        <path
          fill="#141516"
          d="M346.641 337.518c.096-25.401 27.655-41.172 49.608-28.389l197.324 114.905c21.955 12.784 21.836 44.537-.213 57.155L395.175 594.602c-22.049 12.617-49.491-3.364-49.395-28.767z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_14_19">
          <path fill="#fff" d="M0 0h906v904.134H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
