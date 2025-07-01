import {Smile} from "../icons";
import localFont from "next/font/local";

const bigFont = localFont({
  src: "../fonts/HeadingNowTrial-57Extrabold.ttf",
});

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export const Hero = () => {
  return (
    <div className="container mx-auto relative flex flex-col items-center pt-16 gap-6 ">
      <div className="flex max-w-[500px] flex-col gap-6 items-center">
        <div
          className={`px-3 py-2 border-2 border-theme-color1 uppercase rounded-[8px] text-2xl w-fit -rotate-6 ${h1Font.className}`}
        >
          ABOUT
        </div>
        <h1
          className={`text-7xl md:text-8xl  uppercase text-center relative z-20  big-text ${bigFont.className}`}
        >
          obsessed <br />
          with <br />
          <span className="text-theme-color3 relative z-20">
            short-form
            <Smile className="absolute bottom-3 right-0 translate-x-full w-[100px] fill-theme-color1" />
          </span>{" "}
        </h1>
        <p
          className={`text-xl small-text text-primary/70 text-center ${bodyFont.className}`}
        >
          Every project starts with a team that gives a damn. Get to know the
          people behind the work—what drives us, how we think, and why it
          matters.
        </p>
      </div>
    </div>
  );
};
