"use client";
import React, {useEffect, useState, useRef} from "react";
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

// Custom hook for optimized video loading
const useOptimizedVideoLoading = (videos: string[], isMobile: boolean) => {
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadVideosSequentially = async () => {
      const maxConcurrent = isMobile ? 1 : 2; // Load fewer videos simultaneously on mobile
      const loadDelay = isMobile ? 1000 : 500; // Longer delay on mobile

      for (let i = 0; i < videos.length; i += maxConcurrent) {
        const batch = videos.slice(i, i + maxConcurrent);

        await Promise.allSettled(
          batch.map(async (videoSrc, batchIndex) => {
            const videoIndex = i + batchIndex;

            try {
              // Create a temporary video element to preload
              const tempVideo = document.createElement("video");
              tempVideo.muted = true;
              tempVideo.preload = "metadata";

              return new Promise<void>((resolve, reject) => {
                tempVideo.onloadedmetadata = () => {
                  setLoadedVideos((prev) => new Set([...prev, videoIndex]));
                  resolve();
                };

                tempVideo.onerror = () => {
                  setVideoErrors((prev) => new Set([...prev, videoIndex]));
                  reject(new Error(`Failed to load video ${videoIndex}`));
                };

                tempVideo.src = videoSrc;
              });
            } catch (error) {
              setVideoErrors((prev) => new Set([...prev, videoIndex]));
              console.warn(`Failed to preload video ${videoIndex}:`, error);
            }
          })
        );

        // Wait before loading next batch
        if (i + maxConcurrent < videos.length) {
          await new Promise((resolve) => setTimeout(resolve, loadDelay));
        }
      }
    };

    loadVideosSequentially();
  }, [videos, isMobile]);

  return {loadedVideos, videoErrors};
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
    <div id="hero" className="flex flex-col sm:h-screen sm:max-h-[800px]">
      {/* <div className="fixed z-[999999] h-screen w-1 bg-red-600 top-0 left-1/2 -translate-x-1/2"></div> */}

      <NavBar />
      <div className="container mx-auto relative flex flex-col items-center sm:pt-10 sm:mt-20 sm:pb-0 py-[150px] gap-4 lg:gap-6  ">
        <div className="relative max-w-[500px]  ">
          <h1
            className={`text-7xl sm:text-8xl  lg:text-9xl  uppercase text-center relative z-20  ${headingFont.className}`}
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
          // <MobileVideoDisplay pauseVideos={true} />
          <MobileVideoDisplay pauseVideos={!isInView} />
        ) : (
          // <MobileVideoDisplay pauseVideos={!isInView} />
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

  const {loadedVideos, videoErrors} = useOptimizedVideoLoading(videos, true);
  const [shouldPlayVideos, setShouldPlayVideos] = useState(false);

  // Only start playing videos after they're loaded and component is ready
  useEffect(() => {
    if (loadedVideos.size >= Math.min(3, videos.length)) {
      const timer = setTimeout(() => {
        setShouldPlayVideos(true);
      }, 500); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [loadedVideos, videos.length]);

  // Optimized video control
  useEffect(() => {
    if (!shouldPlayVideos) return;

    const videoElements = document.querySelectorAll(".hero-video");

    videoElements.forEach((video) => {
      const videoElement = video as HTMLVideoElement;
      const videoIndex = parseInt(videoElement.dataset.videoIndex || "0");

      // Only control videos that have loaded successfully
      if (loadedVideos.has(videoIndex) && !videoErrors.has(videoIndex)) {
        if (pauseVideos) {
          videoElement.pause();
        } else {
          videoElement.play().catch((error: Error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      }
    });
  }, [pauseVideos, shouldPlayVideos, loadedVideos, videoErrors]);

  const renderVideo = (
    videoIndex: number,
    className: string,
    ringColor: string
  ) => {
    const isLoaded = loadedVideos.has(videoIndex);
    const hasError = videoErrors.has(videoIndex);

    return (
      <motion.div
        initial={{scale: 0, opacity: 0, y: "0"}}
        animate={
          !pauseVideos && shouldPlayVideos
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
          !pauseVideos && shouldPlayVideos
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
        className={`overflow-hidden bg-muted rounded-[8px] ${className} ring-2 ${ringColor} ring-offset-2 ring-offset-background`}
      >
        {isLoaded && !hasError ? (
          <video
            src={videos[videoIndex]}
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
            data-video-index={videoIndex}
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-theme-color1 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="grid sm:hidden absolute top-0  grid-rows-[1fr_380px_1fr]  w-full h-full">
      <div className="w-full  relative h-full grid grid-cols-3 items-center px-12">
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(1, "h-[100px] aspect-[9/16]", "ring-theme-color1")}
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(0, "h-[125px] aspect-[9/16]", "ring-theme-color2")}
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(2, "h-[100px] aspect-[9/16]", "ring-theme-color3")}
        </div>
      </div>
      <div className="w-full  h-full" />
      <div className="w-full  relative h-full grid grid-cols-3">
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(
            4,
            "h-[100px] md:h-[200px] aspect-[9/16]",
            "ring-theme-color1"
          )}
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(
            3,
            "h-[125px] md:h-[250px] aspect-[9/16]",
            "ring-theme-color2"
          )}
        </div>
        <div className="w-full  relative h-full flex items-center justify-center">
          {renderVideo(
            5,
            "h-[100px] md:h-[200px] aspect-[9/16]",
            "ring-theme-color3"
          )}
        </div>
      </div>
    </div>
  );
};

const VideoDisplay = ({pauseVideos}: {pauseVideos: boolean}) => {
  const videos = [
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Money%20(Hero%20video).webm?alt=media&token=c7167aab-2156-4210-b1cf-9ee19c289fde",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCSG%20(Hero%20vidoe).webm?alt=media&token=6d8c1b97-4c96-47ea-ba2b-85d581a44a86",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/xyz%20(Hero%20video).webm?alt=media&token=2310a171-14b8-4641-9bf2-6332118d99ce",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Nikil%20(HeroVideo).webm?alt=media&token=6eca82a8-e3f4-412b-8794-2da34a3a0fea",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Morty%20(Hero%20Video).webm?alt=media&token=71ce8af2-e312-4f3c-b500-c70ee8a305eb",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/BCKAn%20(Hero%20video).webm?alt=media&token=61535221-f888-47b1-8045-549afe3dc0c9",
  ];

  const {loadedVideos, videoErrors} = useOptimizedVideoLoading(videos, false);

  useEffect(() => {
    const videoElements = document.querySelectorAll(".hero-video");

    videoElements.forEach((video) => {
      const videoElement = video as HTMLVideoElement;
      const videoIndex = parseInt(videoElement.dataset.videoIndex || "0");

      // Only control videos that have loaded successfully
      if (loadedVideos.has(videoIndex) && !videoErrors.has(videoIndex)) {
        if (pauseVideos) {
          videoElement.pause();
        } else {
          videoElement.play().catch((error: Error) => {
            // Handle autoplay restrictions
            console.log("Autoplay prevented:", error);
          });
        }
      }
    });
  }, [pauseVideos, loadedVideos, videoErrors]);

  const renderVideo = (
    videoIndex: number,
    className: string,
    ringColor: string,
    animationDelay: number = 0
  ) => {
    const isLoaded = loadedVideos.has(videoIndex);
    const hasError = videoErrors.has(videoIndex);

    return (
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
                delay: 2.1 + animationDelay,
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
            : {duration: 0}
        }
        className={`absolute overflow-hidden bg-muted rounded-[16px] ${className} ring-2 ${ringColor} ring-offset-2 ring-offset-background`}
      >
        {isLoaded && !hasError ? (
          <video
            src={videos[videoIndex]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover hero-video"
            playsInline
            data-video-index={videoIndex}
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-theme-color1 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="sm:grid hidden absolute  grid-cols-[1fr_300px_1fr] lg:grid-cols-[1fr_500px_1fr] gap-4 lg:gap-8 w-full h-full">
      <div className="w-full  relative">
        {renderVideo(
          0,
          "h-[200px] xl:h-[250px] aspect-[9/16] -top-10 right-[10%]",
          "ring-theme-color1",
          0
        )}
        {renderVideo(
          1,
          "h-[150px] xl:h-[200px] aspect-[9/16] top-1/2 left-[10%]",
          "ring-theme-color2",
          0.2
        )}
        {renderVideo(
          2,
          "h-[150px] xl:h-[200px] aspect-[9/16] bottom-0 right-[25%]",
          "ring-theme-color3",
          0.5
        )}
      </div>
      <div className="w-full" />
      <div className="w-full  relative">
        {renderVideo(
          3,
          "h-[200px] xl:h-[250px] aspect-[9/16] -top-10 left-[10%]",
          "ring-theme-color1",
          0.1
        )}
        {renderVideo(
          4,
          "h-[150px] xl:h-[200px] aspect-[9/16] top-1/2 right-[10%]",
          "ring-theme-color2",
          0.3
        )}
        {renderVideo(
          5,
          "h-[150px] xl:h-[200px] aspect-[9/16] bottom-0 left-[25%]",
          "ring-theme-color3",
          0.5
        )}
      </div>
    </div>
  );
};
