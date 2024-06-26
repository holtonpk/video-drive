"use client";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
export const Banner = () => {
  return (
    <div className="w-[100vw] relative overflow-hidden   h-[140px] -rotate-[0deg]">
      <div className="flex absolute left-0 gap-6 cred-carousel-animation top-1/2">
        {skills.map((skill, index) => (
          <h1
            key={index}
            className={`text-6xl md:text-[150px] whitespace-nowrap  font-bold
            ${index % 2 === 0 ? "normal" : "stroke"}
            
            `}
          >
            {skill}.
          </h1>
        ))}
      </div>
    </div>
  );
};

export const Hero = () => {
  const router = useRouter();

  const goToContact = () => {
    router.push("/contact");
  };
  return (
    <div className="container z-30 relative  flex flex-col items-center gap-10   md:w-[700px]">
      <div className="flex flex-col items-center ">
        <h1 className="text-5xl md:text-[6rem] md:leading-[6rem] bg-clip-text text-center text-transparent bg-gradient-to-l bg-black   py-2   font1">
          Organically grow
          <br /> your startup
        </h1>
        <p className="max-w-[80%] md:text-xl text-center w-full">
          We elevate your brand&apos;s social media presence with organic
          content that drives real impressions and builds lasting communities.
        </p>
        <div className=" relative group  mt-4">
          <svg
            className=" bg-transparent hero-animate-spin group-hover:duration-1000 h-[180px] w-[180px]"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="circlePath"
              d="
        M 10, 50
        a 40,40 0 1,1 80,0
        40,40 0 1,1 -80,0
      "
              fill="none"
            />

            <text>
              <textPath href="#circlePath" className="text-[12px] font-bold ">
                Book a call today ★ Book a call today ★
              </textPath>
            </text>
          </svg>

          <motion.button
            onClick={goToContact}
            initial={{scale: 1, translateX: "-50%", translateY: "-50%"}}
            whileHover={{scale: 1.1, translateX: "-50%", translateY: "-50%"}}
            whileTap={{scale: 0.9}}
            className="rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-black text-white font-bold uppercase flex items-center justify-center"
          >
            {" "}
            Book Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const skills = [
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
  "Content Marketing",
  "Short Form Video",
  "Social Media",
  "Brand awareness",
];
