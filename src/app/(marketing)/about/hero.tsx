import {Smile} from "../icons";

export const Hero = () => {
  return (
    <div className="container mx-auto relative flex flex-col items-center pt-16 gap-6 ">
      <div className="flex max-w-[500px] flex-col gap-6 items-center">
        <div className="px-4 py-2 border-2 border-theme-color1 rounded-[8px] big-text text-2xl w-fit -rotate-6">
          About
        </div>
        <h1 className="text-7xl md:text-9xl md:leading-[100px]  text-center relative z-20  big-text">
          obsessed <br />
          with <br />
          <span className="text-theme-color3 relative z-20">
            short-form
            <Smile className="absolute bottom-3 right-0 translate-x-full w-[100px] fill-theme-color1" />
          </span>{" "}
        </h1>
        <p className="text-xl small-text text-primary/70 text-center">
          Every project starts with a team that gives a damn. Get to know the
          people behind the work—what drives us, how we think, and why it
          matters.
        </p>
      </div>
    </div>
  );
};
