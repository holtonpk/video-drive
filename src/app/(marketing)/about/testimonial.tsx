import React from "react";
import {Quote, LucideProps} from "lucide-react";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

const bodyBoldFont = localFont({
  src: "../fonts/proximanova_bold.otf",
});

export const Testimonial = () => {
  return (
    <div className="container mx-auto relative flex flex-col items-center pt-16 gap-6 ">
      <div className="flex max-w-[800px] flex-col gap-6 items-center bg-[#1A1A1A] p-8 md:p-16 rounded-[20px] relative">
        <Quote className="w-[80px] h-[80px] text-theme-color1 rotate-[-1]" />
        <h1 className="text-6xl  text-center relative z-20  big-text text-theme-color1">
          Creativity and curiosity drive everything we build
        </h1>
        <p className={`text-center  text-xl ${bodyFont.className}`}>
          &quot;At Ripple Media, our edge comes from blending creativity with
          precision—and moving fast without sacrificing quality. I&apos;ve seen
          how our team&apos;s energy, cultural fluency, and obsession with
          results turn simple ideas into content that cuts through the noise.
          It&apos;s inspiring to work with a crew that truly understands
          today&apos;s digital landscape, and I&apos;m proud of the impact we
          make for our clients every day.&quot;
        </p>
        <h2 className={`text-center  text-xl ${bodyBoldFont.className}`}>
          - Patrick Holton, CO Founder / Creative Director
        </h2>
        {/* <Peace className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" /> */}
      </div>
    </div>
  );
};

const Peace = (props: LucideProps) => {
  return (
    <svg
      {...props}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1_199)">
        <circle cx="49.9785" cy="50.2372" r="50" fill="#CAF291"></circle>
        <path
          d="M70.836 18.7301C69.1985 18.2343 67.4618 18.4096 65.9458 19.2233C64.4294 20.0369 63.3213 21.3874 62.8238 23.0277L58.1037 37.4966L54.5555 22.0074C54.1713 20.3301 53.1537 18.902 51.6899 17.9853C50.2317 17.0721 48.5106 16.7808 46.8445 17.1655C43.392 17.9622 41.2275 21.4248 42.0159 24.8874L44.2883 35.4023C43.3561 34.8744 42.2811 34.5715 41.1364 34.5715C38.4333 34.5715 36.116 36.2532 35.1657 38.6271C34.0455 37.681 32.5997 37.1092 31.0221 37.1092C27.4754 37.1092 24.5899 39.9946 24.5899 43.5414V48.635V51.191V61.3236C24.5899 73.276 34.2812 83.0001 46.1934 83.0001C58.1057 83.0001 67.797 73.276 67.797 61.3236V50.1151L75.1309 26.7832C75.1327 26.7776 75.1343 26.772 75.1361 26.7666C76.1589 23.3623 74.2299 19.7573 70.836 18.7301ZM47.4626 19.845C48.4123 19.626 49.3951 19.7932 50.2305 20.316C51.0709 20.8422 51.6549 21.661 51.875 22.6215L56.3565 42.1846H48.5673L44.702 24.2985C44.7008 24.293 44.6997 24.2874 44.6983 24.282C44.2426 22.2922 45.4827 20.3019 47.4626 19.845ZM37.4541 43.5414V41.0219C37.4541 38.9814 39.106 37.3216 41.1363 37.3216C43.1666 37.3216 44.8184 38.9816 44.8184 41.0219V42.1848H42.4005C40.248 42.1848 38.497 43.94 38.497 46.0974C38.497 48.517 39.4569 50.7148 41.0127 52.3323C39.0394 52.2664 37.4541 50.6339 37.4541 48.6352V43.5414ZM27.3398 48.635V43.5414C27.3398 41.5111 28.9917 39.8592 31.022 39.8592C33.0523 39.8592 34.7041 41.5111 34.7041 43.5414V48.635V51.191C34.7041 53.2213 33.0523 54.8732 31.022 54.8732C28.9917 54.8732 27.3398 53.2213 27.3398 51.191V48.635ZM65.0469 49.8925C65.0469 49.898 65.0469 49.9034 65.0469 49.9089V61.3236C65.0469 71.7597 56.5893 80.2502 46.1933 80.2502C35.7973 80.2502 27.3397 71.7597 27.3397 61.3236V56.4602C28.3837 57.192 29.6531 57.6232 31.0219 57.6232C33.7293 57.6232 36.0498 55.9409 36.997 53.5672C38.1166 54.5136 39.5607 55.0854 41.1362 55.0854C42.1455 55.0854 43.1281 54.8484 44.0199 54.3965C45.0791 54.8396 46.2401 55.0854 47.4575 55.0854H47.9896C44.5345 57.6493 42.2898 61.7661 42.2898 66.3989V68.9366C42.2898 69.696 42.9055 70.3116 43.6647 70.3116C44.424 70.3116 45.0397 69.6959 45.0397 68.9366V66.3989C45.0397 60.1606 50.0945 55.0854 56.3075 55.0854C57.0669 55.0854 57.6824 54.4697 57.6824 53.7105C57.6824 52.9512 57.0667 52.3355 56.3075 52.3355H47.4575C46.473 52.3355 45.5417 52.1031 44.7138 51.6919C44.6361 51.6409 44.5543 51.5979 44.4691 51.564C42.5501 50.5014 41.2468 48.4497 41.2468 46.0975C41.2468 45.4564 41.7643 44.9348 42.4004 44.9348H47.45C47.4521 44.9348 47.4542 44.9351 47.4561 44.9351C47.4578 44.9351 47.4595 44.9348 47.4612 44.9348H57.5503C57.553 44.9348 57.5556 44.9348 57.5584 44.9348H61.3647C63.3951 44.9348 65.0468 46.5948 65.0468 48.6352V49.8925H65.0469ZM72.5046 25.9674L66.5689 44.8508C65.3987 43.2367 63.5025 42.1846 61.3649 42.1846H59.4668L65.4428 23.8661C65.4462 23.8559 65.4494 23.8456 65.4525 23.8354C65.7358 22.8922 66.3727 22.1148 67.2459 21.6463C68.114 21.1804 69.1059 21.0796 70.0393 21.362C71.9822 21.95 73.0867 24.0148 72.5046 25.9674Z"
          fill="black"
          stroke="black"
          stroke-width="0.4"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_1_199">
          <rect width="100" height="100" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  );
};
