import {Smile} from "../icons";

export const Hero = () => {
  return (
    <div className="container mx-auto relative flex flex-col items-center pt-16 gap-6 ">
      <div className="flex max-w-[500px] flex-col gap-6 items-center">
        <div className="px-4 py-2 border-2 border-theme-color1 rounded-[8px] big-text text-2xl w-fit -rotate-6">
          Services
        </div>
        <h1 className="text-7xl md:text-9xl md:leading-[100px]  text-center relative z-20  big-text ">
          <span className="relative z-20">Delivering</span> <br />
          <span className="text-theme-color3 relative z-20">Results</span>{" "}
          <Smile className="absolute top-1/4 -translate-y-1/2  right-0 translate-x-1/2  w-[100px] fill-theme-color1" />
          <span className="relative z-20">for Top Brands</span>
        </h1>
        <p className="text-xl small-text text-primary/70 text-center">
          Bold ideas. Smarter strategies. Game-changing results. Let’s elevate
          your brand and unlock its full potential.
        </p>
      </div>
    </div>
  );
};
