"use client";
import React, {useEffect, useState} from "react";
import {NavBar} from "../navbar";
import {animationControls, motion} from "framer-motion";
import {Smile} from "../icons";
import localFont from "next/font/local";

const headingFont = localFont({
  src: "../fonts/HeadingNowTrial-57Extrabold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

// Custom hook to detect screen size
const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the 'sm' breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

export const Hero = () => {
  const [isInView, setIsInView] = useState(true);
  const isMobile = useScreenSize();

  // if #hero is in view isInView is true
  useEffect(() => {
    const heroElement = document.getElementById("hero");

    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(heroElement);

    return () => {
      observer.unobserve(heroElement);
    };
  }, []);

  return (
    <div id="hero" className="flex flex-col lg:min-h-screen">
      <NavBar />
      <div className="container mx-auto relative flex flex-col items-center sm:pt-10 sm:mt-20 sm:pb-0 py-[150px] gap-4 lg:gap-6  ">
        <div className="relative max-w-[500px]  ">
          <h1
            className={`text-8xl leading-[80px] lg:text-9xl lg:leading-[100px] uppercase text-center relative z-20  ${headingFont.className}`}
          >
            <span className="relative z-20">Content</span> <br />
            <span className="text-theme-color3 relative z-10 bg-background ">
              <span className="relative z-20 pointer-events-none ">
                Creation
              </span>
              <div className=" w-full h-full bg-background absolute right-[6px] top-0 z-[15]"></div>
              <motion.div
                initial={{
                  rotate: -60,
                  translateX: "0",
                  translateY: "-50%",
                }}
                animate={{
                  rotate: 0,
                  translateY: "-50%",
                  translateX: "75%",
                }}
                transition={{duration: 0.75, delay: 3.5, ease: "easeInOut"}}
                className="absolute top-1/2 -translate-y-1/2 right-0 z-10"
              >
                <Smile className=" w-[60px] h-[60px] md:w-[100px] md:h-[100px] z-10 hover:rotate-12 transition-all duration-300 fill-theme-color1" />
              </motion.div>
            </span>{" "}
            <br />
            <span className="relative z-20 whitespace-nowrap"> Made Easy </span>
          </h1>
        </div>
        <p
          className={`sm:max-w-[300px] lg:max-w-[500px] text-center text-xl text-primary/70 ${bodyFont.className}`}
        >
          We specialize in creating viral, short-form content for fast-growing
          brands helping them capture attention, spark engagement, and connect
          with audiences at scale.
        </p>

        {/* Conditionally render only the appropriate video display */}
        {isMobile ? (
          <MobileVideoDisplay pauseVideos={!isInView} />
        ) : (
          <VideoDisplay pauseVideos={!isInView} />
        )}
      </div>
    </div>
  );
};

const MobileVideoDisplay = ({pauseVideos}: {pauseVideos: boolean}) => {
  const videos = [
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Money%20(Hero%20video).webm?alt=media&token=c7167aab-2156-4210-b1cf-9ee19c289fde",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCSG%20(Hero%20vidoe).webm?alt=media&token=6d8c1b97-4c96-47ea-ba2b-85d581a44a86",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/xyz%20(Hero%20video).webm?alt=media&token=2310a171-14b8-4641-9bf2-6332118d99ce",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Nikil%20(HeroVideo).webm?alt=media&token=6eca82a8-e3f4-412b-8794-2da34a3a0fea",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Morty%20(Hero%20Video).webm?alt=media&token=71ce8af2-e312-4f3c-b500-c70ee8a305eb",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCKAn%20(Hero%20video).webm?alt=media&token=61535221-f888-47b1-8045-549afe3dc0c9",
  ];
  useEffect(() => {
    const videoElements = document.querySelectorAll(".hero-video");

    videoElements.forEach((video) => {
      const videoElement = video as HTMLVideoElement;
      if (pauseVideos) {
        videoElement.pause();
      } else {
        videoElement.play().catch((error: Error) => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented:", error);
        });
      }
    });
  }, [pauseVideos]);

  return (
    <div className="grid sm:hidden absolute top-0  grid-rows-[1fr_360px_1fr]  w-full h-full">
      <div className="w-full  relative h-full grid grid-cols-3 items-center px-12">
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0, y: "0"}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,

                    opacity: 1,
                    y: [0, -8, 0],
                    x: [0, 5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.3,
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9,
                    },
                    x: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9,
                    },
                  }
                : {duration: 0}
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[100px] aspect-[9/16]  ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[1]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -8, 0],
                    x: [0, 5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.1,
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7,
                    },
                    x: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7,
                    },
                  }
                : {duration: 0} // no movement if paused
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[125px]  aspect-[9/16]  ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[0]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -8, 0],
                    x: [0, 5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.5,
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.1,
                    },
                    x: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.1,
                    },
                  }
                : {duration: 0}
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[100px]  aspect-[9/16]  ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[2]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
      </div>
      <div className="w-full  h-full" />
      <div className="w-full  relative h-full grid grid-cols-3">
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0, y: "-50%"}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -8, 0],
                    x: [0, 5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.4,
                    y: {
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.0,
                    },
                    x: {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.0,
                    },
                  }
                : {duration: 0}
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[100px] md:h-[200px] aspect-[9/16] top-1/2 right-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[4]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -8, 0],
                    x: [0, -4, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.2,
                    y: {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    },
                    x: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    },
                  }
                : {duration: 0}
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[125px] md:h-[250px] aspect-[9/16] -top-10 left-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[3]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -6, 0],
                    x: [0, -5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 0.6,
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
                    x: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
                  }
                : {duration: 0}
            }
            className=" overflow-hidden bg-muted rounded-[8px] h-[100px] md:h-[200px] aspect-[9/16] bottom-0 left-[25%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background "
          >
            <video
              src={videos[5]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const VideoDisplay = ({pauseVideos}: {pauseVideos: boolean}) => {
  // const videos = [
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FBCSG%20-%20Video%205%20-%20Brandon.mp4?alt=media&token=8091d920-4bd9-4e50-8ec3-6068f395717e",
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2Fdemo1.mp4?alt=media&token=14488796-d78d-4363-82a5-10550fe4db62",
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2Fdemo2.mp4?alt=media&token=3833f855-561f-4b74-93dc-4d68ab5f4fef",
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2Fdemo4.mp4?alt=media&token=aab44878-b996-4617-a8ec-7e3d00d3c99c",
  //   "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FVideo%206003%20V2.mp4?alt=media&token=9410007c-3eac-40c3-8072-ff8201e8055f",
  // ];

  const videos = [
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Money%20(Hero%20video).webm?alt=media&token=c7167aab-2156-4210-b1cf-9ee19c289fde",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCSG%20(Hero%20vidoe).webm?alt=media&token=6d8c1b97-4c96-47ea-ba2b-85d581a44a86",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/xyz%20(Hero%20video).webm?alt=media&token=2310a171-14b8-4641-9bf2-6332118d99ce",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Nikil%20(HeroVideo).webm?alt=media&token=6eca82a8-e3f4-412b-8794-2da34a3a0fea",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Morty%20(Hero%20Video).webm?alt=media&token=71ce8af2-e312-4f3c-b500-c70ee8a305eb",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCKAn%20(Hero%20video).webm?alt=media&token=61535221-f888-47b1-8045-549afe3dc0c9",
  ];

  useEffect(() => {
    const videoElements = document.querySelectorAll(".hero-video");

    videoElements.forEach((video) => {
      const videoElement = video as HTMLVideoElement;
      if (pauseVideos) {
        videoElement.pause();
      } else {
        videoElement.play().catch((error: Error) => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented:", error);
        });
      }
    });
  }, [pauseVideos]);

  return (
    <div className="sm:grid hidden absolute  grid-cols-[1fr_300px_1fr] lg:grid-cols-[1fr_500px_1fr] gap-4 lg:gap-8 w-full h-full">
      <div className="w-full  relative">
        <motion.div
          initial={{scale: 0, opacity: 0}}
          animate={
            !pauseVideos
              ? {
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={
            !pauseVideos
              ? {
                  duration: 0.6,
                  delay: 2.1,
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  },
                  x: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  },
                }
              : {duration: 0} // no movement if paused
          }
          className="absolute overflow-hidden bg-muted rounded-[16px] h-[200px] xl:h-[250px] aspect-[9/16] -top-10 right-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        >
          <video
            src={videos[0]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
          />
        </motion.div>
        <motion.div
          initial={{scale: 0, opacity: 0, y: "-50%"}}
          animate={
            !pauseVideos
              ? {
                  scale: 1,
                  opacity: 1,
                  y: [-50, -58, -50],
                  x: [0, -6, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={
            !pauseVideos
              ? {
                  duration: 0.6,
                  delay: 2.3,
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.9,
                  },
                  x: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.9,
                  },
                }
              : {duration: 0}
          }
          className="absolute overflow-hidden bg-muted rounded-[16px] h-[150px] xl:h-[200px] aspect-[9/16] top-1/2 left-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        >
          <video
            src={videos[1]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
          />
        </motion.div>
        <div className="w-full  relative h-full flex items-center justify-center">
          <motion.div
            initial={{scale: 0, opacity: 0}}
            animate={
              !pauseVideos
                ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -6, 0],
                    x: [0, -5, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                  }
            }
            transition={
              !pauseVideos
                ? {
                    duration: 0.6,
                    delay: 2.6,
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
                    x: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
                  }
                : {duration: 0}
            }
            className="absolute overflow-hidden bg-muted rounded-[16px] h-[150px] xl:h-[200px] aspect-[9/16] bottom-0 right-[25%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
          >
            <video
              src={videos[2]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hero-video"
              playsInline
            />
          </motion.div>
        </div>
      </div>
      <div className="w-full" />
      <div className="w-full  relative">
        <motion.div
          initial={{scale: 0, opacity: 0}}
          animate={
            !pauseVideos
              ? {
                  scale: 1,
                  opacity: 1,
                  y: [0, -8, 0],
                  x: [0, -4, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={
            !pauseVideos
              ? {
                  duration: 0.6,
                  delay: 2.2,
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  },
                  x: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  },
                }
              : {duration: 0}
          }
          className="absolute overflow-hidden bg-muted rounded-[16px] h-[200px] xl:h-[250px] aspect-[9/16] -top-10 left-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        >
          <video
            src={videos[3]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
          />
        </motion.div>
        <motion.div
          initial={{scale: 0, opacity: 0, y: "-50%"}}
          animate={
            !pauseVideos
              ? {
                  scale: 1,
                  opacity: 1,
                  y: [-50, -60, -50],
                  x: [0, 7, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={
            !pauseVideos
              ? {
                  duration: 0.6,
                  delay: 2.4,
                  y: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.0,
                  },
                  x: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.0,
                  },
                }
              : {duration: 0}
          }
          className="absolute overflow-hidden bg-muted rounded-[16px] h-[150px] xl:h-[200px] aspect-[9/16] top-1/2 right-[10%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        >
          <video
            src={videos[4]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
          />
        </motion.div>
        <motion.div
          initial={{scale: 0, opacity: 0}}
          animate={
            !pauseVideos
              ? {
                  scale: 1,
                  opacity: 1,
                  y: [0, -6, 0],
                  x: [0, -5, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={
            !pauseVideos
              ? {
                  duration: 0.6,
                  delay: 2.6,
                  y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  },
                  x: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  },
                }
              : {duration: 0}
          }
          className="absolute overflow-hidden bg-muted rounded-[16px] h-[150px] xl:h-[200px] aspect-[9/16] bottom-0 left-[25%] ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        >
          <video
            src={videos[5]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
          />
        </motion.div>
      </div>
    </div>
  );
};
