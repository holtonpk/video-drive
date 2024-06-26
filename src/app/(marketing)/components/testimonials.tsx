"use client";
import React, {useEffect} from "react";
import {BlazeLogo, FcLogo, MortyLogo} from "@/components/icons";
import {Star} from "lucide-react";
import {motion} from "framer-motion";

export const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = React.useState(0);

  useEffect(() => {
    // change testimonial every 4 seconds
    const interval = setInterval(() => {
      setSelectedTestimonial((selectedTestimonial) => {
        if (selectedTestimonial === testimonials.length - 1) {
          return 0;
        } else {
          return selectedTestimonial + 1;
        }
      });
    }, 3500);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTestimonial]);

  return (
    <div className="relative w-screen md:h-[600px]  h-[550px]">
      <div className="flex flex-col z-30 gap-4 md:gap-10  items-center pb-20  pt-6 mt-20">
        <div className="flex gap-4">
          <Star className="h-8 w-8 md:h-12 md:w-12 fill-primary text-primary" />
          <Star className="h-8 w-8 md:h-12 md:w-12 fill-primary text-primary" />
          <Star className="h-8 w-8 md:h-12 md:w-12 fill-primary text-primary" />
          <Star className="h-8 w-8 md:h-12 md:w-12 fill-primary text-primary" />
          <Star className="h-8 w-8 md:h-12 md:w-12 fill-primary text-primary" />
        </div>
        <h1 className="text-7xl md:text-[10rem] md:leading-[160px] font1 text-primary">
          Testimonials
        </h1>

        {/* <div className="grid grid-cols-2 container gap-10 mt-6"> */}
        {/* {testimonials.map((testimonial, index) => ( */}
        <motion.div
          animate={{
            x: ["100%", "10%", "-10%", "-120%"],
            // filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(2px)"],
          }}
          transition={{duration: 3.5, times: [0, 0.1, 0.9, 1]}}
          key={testimonials[selectedTestimonial].text}
          className={`h-fit w-[80vw] md:w-[800px] bg-white/40  atestimonial-animation blurBack rounded-2xl text-2xl p-8 flex flex-col`}
        >
          <p className="font-bold">{testimonials[selectedTestimonial].text}</p>
          <div className="flex gap-2 items-center mt-6">
            <div className="h-10 w-10 relative rounded-full bg-card overflow-hidden">
              {testimonials[selectedTestimonial].logo}
            </div>
            <div className=" w-fit ">
              {testimonials[selectedTestimonial].creator}
            </div>
          </div>
        </motion.div>
        {/* ))} */}
        {/* </div> */}
      </div>
    </div>
  );
};

const testimonials = [
  {
    text: "that red bull video was fire!! Literally just got done sending the videos to the entire company during our all hands. GREAT week guys!",
    creator: "-Matt Blaze AI ",
    logo: <BlazeLogo className="h-10 w-10" />,
  },
  {
    text: "Thanks for being so on top of stuff. It's always nice working with professionals!",
    creator: "-Andy Morty App",
    logo: <MortyLogo className="h-10 w-10" />,
  },
  {
    text: " The accounts are growing fast, loving the content. keep doing your thing",
    creator: "-Founder Central",
    logo: <FcLogo className="h-10 w-10" />,
  },
];
