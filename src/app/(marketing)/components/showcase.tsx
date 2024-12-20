"use client";
import React, {useRef} from "react";
import {motion} from "framer-motion";
import {Icons} from "@/components/icons";
import {set} from "date-fns";

export const Showcase = () => {
  const text =
    "All your videos will be written, edited and posted by our in house team".split(
      " "
    );

  const videos = [
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000181562.mp4%20%20%2B%20%22.%22%20%2B%20mp4?alt=media&token=0ba98bd3-f3fb-4ce1-b6e3-97f494356310",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
    "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F1000183285.mp4?alt=media&token=568a0ab1-ba29-47b9-ab9f-ef81cd3e2dcc",
  ];

  return (
    <div className="flex flex-col pb-20 gap-8 mt-20">
      <h1 className="text-primary font1-bold text-4xl md:text-6xl text-center">
        Showcase
      </h1>
      <div className="flex flex-col gap-2 md:gap-4 md:w-[600px] w-[80%] items-start md:mx-auto ">
        <div className="flex gap-1 md:gap-2 w-full flex-wrap">
          {text.map((el, i) => (
            <motion.span
              variants={{
                hidden: {opacity: 0},
                visible: {
                  opacity: 1,
                  transition: {
                    delay: i / 10,
                    duration: 0.25,
                  },
                },
              }}
              initial="hidden" // Start in the hidden state
              whileInView="visible" // Animate to the visible state when in view
              viewport={{once: true}} // Ensures animation only plays once
              className="font1-light text-xl md:text-2xl text-white  "
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <p className="font1-light text-2xl text-white  w-full h-fit md:max-w-[400px] "></p>
        <motion.div
          variants={{
            hidden: {opacity: 0},
            visible: {
              opacity: 1,
              transition: {
                delay: 2,
                duration: 0.5,
              },
            },
          }}
          initial="hidden" // Start in the hidden state
          whileInView="visible" // Animate to the visible state when in view
          viewport={{once: true}} // Ensures animation only plays once
          className="font1-light text-xl md:text-2xl text-white  w-full h-fit md:max-w-[500px]  "
        >
          Here are some of our best work. Custom made for some of the amazing
          companies we have worked with.
        </motion.div>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-6 gap-2 mt-10 justify-between smd:max-w-[800px] mx-auto ">
        {videos.map((video, i) => (
          <VideoPlayer video={video} key={i} />
        ))}
      </div>
    </div>
  );
};

const VideoPlayer = ({video}: {video: string}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(true);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      style={{
        opacity: 0.8,
        backgroundColor: "transparent",
        backgroundImage: `radial-gradient( #F51085 1px, transparent 0.4px)`,
        backgroundSize: "8px 8px",
      }}
      className="w-full aspect-[9/16] p-4"
    >
      <div className="w-full relative  h-full bg-muted rounded-[6px] border">
        <button
          onClick={togglePlay}
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-transparent"
        >
          {/* {!isPlaying ? <Icons.play className="h-8 w-8 text-white" />} */}
        </button>
        {/* <video
          ref={videoRef}
          src={video}
          className="w-full h-full object-cover rounded-[6px]"
          // controls
          autoPlay
          muted
          loop
        ></video> */}
      </div>
    </div>
  );
};
