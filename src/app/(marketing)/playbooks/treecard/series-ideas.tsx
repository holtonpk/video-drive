"use client";

import {Clapperboard, Lightbulb, Pause, Play} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {Icons} from "@/components/icons";
import {LucideProps} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";
import Link from "next/link";

type DescriptionItem = {
  content: string;
  type: "heading" | "paragraph" | "list-item" | "link";
  href?: string;
};

export const SeriesIdeas = () => {
  const [selectedSeries, setSelectedSeries] = useState<number | undefined>(
    undefined
  );

  type video = {
    videoUrl: string;
    accountUrl?: string;
    accountLabel?: string;
  };

  type Series = {
    id: number;
    title: string;
    description: DescriptionItem[];
    videos: video[];
    videos2?: video[];
  };

  const series: Series[] = [
    {
      id: 1,
      title:
        "Man on the street - Inspired by Humans of NY and Soft White Underbelly",
      description: [
        {
          content:
            "To create high quality man on the street content, future interviews should be shot with a stronger focus on storytelling, structure, and setting. We will provide detailed directions for this and exactly what we think we need to get the best shots.",
          type: "paragraph",
        },
        {
          content:
            "Pre-Planned Strategy: Before filming, we will define the *key themes* and angles that will resonate with the audience. Having a clear strategy ensures each interview serves a larger purpose rather than just being a collection of isolated moments.",
          type: "list-item",
        },
        {
          content:
            "A More Intimate Setting: A quieter, controlled environment will significantly improve audio quality and overall production value. Reducing background noise and distractions keeps the focus on the speaker, making their message more impactful.",
          type: "list-item",
        },
        {
          content:
            "Structured Storytelling and Questions: Instead of disconnected soundbites, interviews should guide subjects through a clear beginning, middle and end. Questions should be designed to build a cohesive narrative, allowing clips to be seamlessly stitched together into a full story.",
          type: "list-item",
        },
        {
          content:
            "And in addition to the 2 formats above, every month we will sprinkle in experiments testing new formats that are trending (see examples below for a few more unique street interview formats we can try to replicate)",
          type: "heading",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc3.mp4",
          accountLabel: "Soft White Underbelly",
          accountUrl: "https://www.instagram.com/soft_white_underbelly/",
        },
        {
          videoUrl: "/bcc/bcc4.mp4",
          accountLabel: "Humans of NY",
          accountUrl: "https://www.instagram.com/humansofny/",
        },
      ],
      videos2: [
        {
          videoUrl: "/bcc/bcc13.mp4",
          accountLabel: "Ramen on the Street",
          accountUrl: "https://www.instagram.com/ramenonthestreet/",
        },
        {
          videoUrl: "/bcc/bcc14.mp4",
          accountLabel: "We're Not Really Strangers",
          accountUrl: "https://www.instagram.com/werenotreallystrangers/",
        },
        {
          videoUrl: "/bcc/bcc15.mp4",
          accountLabel: "Get Ahead",
          accountUrl: "https://www.instagram.com/getahead.app/",
        },
        {
          videoUrl: "/bcc/bcc16.mp4",
          accountLabel: "Salary Transparent Street",
          accountUrl: "https://www.instagram.com/salarytransparentstreet/",
        },
        {
          videoUrl: "/bcc/bcc17.mp4",
          accountLabel: "School of Hard Knockz",
          accountUrl: "https://www.instagram.com/theschoolofhardknockz/",
        },
        {
          videoUrl: "/bcc/bcc18.mp4",
          accountLabel: "Emma Finance",
          accountUrl: "https://www.instagram.com/emma_finance/",
        },
        {
          videoUrl: "/bcc/bcc19.mp4",
          accountLabel: "Tavolo",
          accountUrl: "https://www.instagram.com/itstavolo",
        },
      ],
    },
    {
      id: 8,
      title: "Man on the street - Interactive Series Trivia ",
      description: [
        {
          content:
            "Inspired by accounts like ([Street Interviews](https://www.instagram.com/streetinterviewsofficial/) and [Brady Your Tudor](https://www.youtube.com/@BradyYourTutor/shorts))",
          type: "paragraph",
        },
        {
          content:
            "A high-retention, audience-driven trivia series focused on blue-collar industries. Viewers stay engaged by playing along, making it a guaranteed-value format that doesn't depend on participants answering correctly.",
          type: "list-item",
        },
        {
          content:
            "Blue collar related trivia. Does great with retention because the viewer plays long. Guaranteed value doesn't rely on the person answering the questions well. With very tailored questions about the industry, this series will target the demo we are looking for",
          type: "list-item",
        },
        {
          content:
            "Questions will include; guessing the logo/company and trivia on different trade techniques or tools and insider lingo.",
          type: "list-item",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc1.mp4",
          accountLabel: "Brady Your Tudor",
          accountUrl: "https://www.youtube.com/@BradyYourTutor/shorts",
        },
        {
          videoUrl: "/bcc/bcc2.mp4",
          accountLabel: "Street Interviews",
          accountUrl: "https://www.instagram.com/streetinterviewsofficial/",
        },
      ],
    },
    {
      id: 2,
      title: "Animated Stories",
      description: [
        {
          content:
            "Drawing inspiration from the storytelling approach of [OurFuture](https://www.instagram.com/ourfuturehq/) and [Founder Central](https://www.instagram.com/attentionmarketers/), we'll create deep-dive narratives about the history of blue-collar industries, success stories and highlight the workers  that built these businesses from the ground up. This is a very scalable format for short form. We can use some b-roll shot at conferences but 99% of this will be original editing.",
          type: "paragraph",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc5.mp4",
          accountLabel: "OurFuture",
          accountUrl: "https://www.instagram.com/ourfuturehq/",
        },
        {
          videoUrl: "/bcc/bcc6.mp4",
          accountLabel: "Founder Central",
          accountUrl: "https://www.instagram.com/attentionmarketers/",
        },
      ],
    },
    {
      id: 3,
      title: "Satisfying Work with voice over story",
      description: [
        {
          content:
            "ASMR/Satisfying videos of blue collar work is a sub-genre of content that we can naturally use. These videos are inherently viral thanks to the long retention rates and it fits perfectly into our brand. The idea here is to source videos we can use in the background and overlay with engaging story voice overs.",
          type: "paragraph",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc7.mp4",
          accountLabel: "Plumber John",
          accountUrl: "https://www.youtube.com/@Plumberjohn/shorts",
        },
        {
          videoUrl: "/bcc/bcc8.mp4",
          accountLabel: "NYC Hvac",
          accountUrl: "https://www.youtube.com/@NYCHvac/shorts",
        },
      ],
    },
    {
      id: 4,
      title: "Blue collar bloopers / memes ",
      description: [
        {
          content:
            "Add some humor with short, lighthearted content that captures funny moments and bloopers from the blue-collar world. Designed to be relatable and bring a wider audience to boost view count.",
          type: "paragraph",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc9.mp4",
          accountLabel: "Blue Collar Rebellion",
          accountUrl: "https://www.instagram.com/bluecollarrebellion/",
        },
        {
          videoUrl: "/bcc/bcc10.mp4",
          accountLabel: "Blue Collar Rebellion",
          accountUrl: "https://www.instagram.com/bluecollarrebellion/",
        },
      ],
    },
    {
      id: 5,
      title: "Crazy stories",
      description: [
        {
          content:
            "Take the audience behind the scenes with crazy, larger-than-life blue-collar stories. These will be scripted but crafted to feel authentic, bringing a raw and real element to the content. ",
          type: "paragraph",
        },
      ],
      videos: [
        {
          videoUrl: "/bcc/bcc11.mp4",
          accountLabel: "Morty app",
          accountUrl: "https://www.youtube.com/@mortyapp/shorts",
        },
        {
          videoUrl: "/bcc/bcc12.mp4",
          accountLabel: "Renzo Fortini",
          accountUrl: "https://www.tiktok.com/@renzo.fortini",
        },
      ],
    },
  ];

  return (
    <div className="flex gap-2 flex-col  w-fit">
      <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
        <Clapperboard className="w-5 h-5" />
        Short Form Series Concepts
      </h2>
      <div className="grid  max-w-[1000px] gap-4">
        <div className=" flex flex-col gap-2 rounded-md h-fit border-black/10  order-2 md:order-1">
          {series.map((series) => {
            return (
              <div
                key={series.id}
                className={`flex relative flex-col gap-2 border text-left  p-2 px-4 bg-white rounded-md  shadow-md group transition-all duration-300 ${
                  selectedSeries === series.id
                    ? "border-[#00AE70] pb-4"
                    : " border-black/10 hover:border-[#00AE70]/50"
                }`}
              >
                <button
                  onClick={() =>
                    series.id === selectedSeries
                      ? setSelectedSeries(undefined)
                      : setSelectedSeries(series.id)
                  }
                  className="absolute w-full h-full  top-0 left-0"
                ></button>
                <div className="flex items-center text-black justify-between mt-2 ">
                  <h1
                    className={`font-bold text-lg capitalize transition-all duration-300 
                    ${
                      selectedSeries === series.id
                        ? "text-[#0D5153]"
                        : "text-black"
                    }
                    `}
                  >
                    {series.title}
                  </h1>

                  <Icons.chevronDown
                    className={`w-4 h-4 ml-auto  text-[#00AE70]
                      ${
                        selectedSeries === series.id
                          ? "block rotate-180"
                          : "hidden group-hover:block "
                      }
                    `}
                  />
                </div>
                <div
                  className={`grid transition-all  duration-300 ${
                    selectedSeries === series.id
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="text-sm text-black/50 flex flex-col gap-2">
                      {series.description.map((description) => (
                        <div key={description.content}>
                          <StyledMarkdown {...description} />
                        </div>
                      ))}
                    </div>
                    <div className="flex  flex-col">
                      <h1 className="text-sm text-[#00AE70] font-bold mt-4">
                        Examples
                      </h1>
                      <div className="flex gap-4 w-fit ">
                        <Arrow1 className="w-[50px] h-[50px] hidden md:block -rotate-[10deg] ml-10 fill-[#00AE70] scale-x-[-1] " />
                        {series.videos.map((video) => (
                          <Video
                            accountUrl={video.accountUrl}
                            accountLabel={video.accountLabel}
                            key={video.videoUrl}
                            src={video.videoUrl}
                            isOpen={selectedSeries === series.id}
                          />
                        ))}
                      </div>
                    </div>
                    {series.videos2 && (
                      <div className="flex gap-1  flex-col">
                        <h1 className="text-sm text-[#00AE70] font-bold mt-4">
                          Best in class examples
                        </h1>
                        <div className="flex gap-4 flex-wrap  w-full ">
                          {series.videos2.map((video) => (
                            <Video
                              accountUrl={video.accountUrl}
                              accountLabel={video.accountLabel}
                              key={video.videoUrl}
                              src={video.videoUrl}
                              isOpen={selectedSeries === series.id}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <span className="text-center text-black/70">
        *These are all just starting points.
      </span> */}
    </div>
  );
};

const Video = ({
  src,
  isOpen,
  accountUrl,
  accountLabel,
}: {
  src: string;
  isOpen: boolean;
  accountUrl?: string;
  accountLabel?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      videoRef.current?.pause();
    }
  }, [isOpen]);

  return (
    <div className="relative z-30 aspect-[9/16] rounded-[12px] overflow-hidden shadow-md bg-blue-200 h-[250px] group/video">
      <button
        className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full items-center justify-center flex "
        onClick={handlePlay}
      >
        {!isPlaying && <Play className="w-12 h-12 fill-white text-white" />}
      </button>
      <video
        ref={videoRef}
        className="relative z-30"
        src={src}
        autoPlay={isPlaying}
        loop
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && accountUrl && accountLabel && (
        <Link
          href={accountUrl}
          target="_blank"
          className="text-black hover:underline px-2 blurBack  overflow-hidden min-h-10 text-ellipsis font-bold h-fit w-full absolute bottom-0 left-0 z-50 bg-white/60 flex items-center justify-center whitespacse-nowrap text-[12px]"
        >
          {accountLabel}
        </Link>
      )}
    </div>
  );
};

const Arrow1 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 243 236"
    >
      <g clipPath="url(#clip0_374_487)" opacity="1">
        <path d="M31.972 206.562a8.429 8.429 0 01-.394-5.722 108.646 108.646 0 013.266-11.07 157.197 157.197 0 019.542-22.703 4.055 4.055 0 014.174-.807 4.058 4.058 0 012.597 3.367 70.57 70.57 0 01-3.797 11.701c-1.544 3.968-4.196 12.443-5.712 17.49l.217-.073c.541-.252 2.354-.84 3.258-1.124 6.653-2.966 13.039-6.5 19.502-9.854 38.41-19.981 70.033-40.642 101.374-69.707a236.058 236.058 0 004.413-4.106c-10.331 4.164-20.604 8.471-30.898 12.726-3.203 1.318-6.416 2.617-9.682 3.774a10.333 10.333 0 01-6.422.858c-10.307-4.285 3.778-16.066 6.811-21.427a338.92 338.92 0 0030.713-45.62 172.783 172.783 0 0018.512-58.507 4.182 4.182 0 015.864-3.665c4.28 1.945 1.737 7.315 1.559 10.907a157.428 157.428 0 01-7.547 29.994 196.402 196.402 0 01-26.483 50.795c-6.354 9.186-13.439 17.86-20.026 26.874 12.878-4.734 29.048-12.39 43.096-17.263 3.567-1.481 10.117-2.764 10.105 2.923-.77 4.173-4.725 6.988-7.272 10.177a417.839 417.839 0 01-106.097 76.514c-6.66 3.766-17.99 8.999-23.075 11.073a234.315 234.315 0 0028.302 4.005 4.022 4.022 0 013.674 3.035 4.034 4.034 0 01-5.055 4.856c-10.76-.898-21.47-2.344-32.1-4.236a56.549 56.549 0 01-7.732-1.672 7.889 7.889 0 01-4.687-3.513zm97.868-76.111l-.008.003-.02.007.028-.01zm.172-.064c.73-.268.882-.332 0 0zm0 0l-.172.064.051-.018.121-.046z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_487">
          <path
            d="M0 0H252.316V85.835H0z"
            transform="rotate(136.764 108.918 79.34)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

const Arrow2 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 346 330"
    >
      <g clipPath="url(#clip0_374_489)" opacity="1">
        <path d="M337.368 231.622c.11 5.125-3.94 38.107-14.119 50.391a11.291 11.291 0 01-15.816-.81c-7.89-7.097-15.519-14.479-23.26-21.737-3.549-4.338-10.849-7.341-10.538-13.65a7.026 7.026 0 014.939-5.848 7.041 7.041 0 013.994-.023 7.02 7.02 0 013.36 2.154c9.2 8.388 17.592 16.871 25.226 23.708a530.509 530.509 0 00-33.393-83.143c-12.695-24.769-23.152-45.315-43.03-59.621a86.749 86.749 0 00-42.148-16.644 41.555 41.555 0 01-4.288 35.821 18.386 18.386 0 01-12.857 9.377 18.4 18.4 0 01-15.362-4.156 34.082 34.082 0 01-11.15-19.412 27.089 27.089 0 01-.195-13.922 27.126 27.126 0 016.746-12.186 38.994 38.994 0 0118.489-7.48C149.771 63.509 95.347 49.679 56.13 54.305a242.533 242.533 0 00-41.525 7.474c-.254.068-.504.15-.763.2 2.915-1.002-1.36.429-3.86 1.144a7.273 7.273 0 01-2.546.527 5.024 5.024 0 01-4.099-1.537 5.81 5.81 0 011.493-9.49c1.905-.738 3.796-1.53 5.73-2.195a163.109 163.109 0 0129.509-7.583 171.45 171.45 0 01109.225 17.037 96.656 96.656 0 0137.211 33.481 95.19 95.19 0 0163.02 26.915c19.636 19.106 30.885 44.8 42.572 69.14a455.178 455.178 0 0126.638 69.776c2.452-8.083 4.832-17.867 6.937-24.889 1.068-2.962.575-2.354 1.38-4.228a5.665 5.665 0 011.801-3.008 5.264 5.264 0 015.759-.524 5.246 5.246 0 012.756 5.078zM181.602 106.291a65.227 65.227 0 00-8.037 1.183c-9.339 2.018-11.854 4.727-13.193 12.299-.549 9.055 5.87 20.438 11.44 20.693 8.192 2.589 17.193-18.411 9.79-34.175z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_489">
          <path
            fill="#fff"
            d="M0 0H303.37V283.954H0z"
            transform="scale(1 -1) rotate(9.384 2031.224 117.244)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

const commonMarkdownComponents = {
  a: ({node, children, ...props}: any) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#00AE70] underline hover:text-[#00AE70]/80 relative z-30"
    >
      {children}
    </a>
  ),
};

const StyledMarkdown = ({content, type, href}: DescriptionItem) => {
  switch (type) {
    case "heading":
      return (
        <div className="relative z-30">
          <ReactMarkdown
            components={{
              ...commonMarkdownComponents,
              h2: ({node, children, ...props}: any) => (
                <h2
                  className="text-md text-[#233461] font-bold mt-4"
                  {...props}
                >
                  {children}
                </h2>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    case "paragraph":
      return (
        <ReactMarkdown
          components={{
            ...commonMarkdownComponents,
            p: ({node, children, ...props}: any) => (
              <div className="text-[#00AE70] relative z-30" {...props}>
                {children}
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      );
    case "list-item":
      return (
        <div className="ml-4 relative z-30 flex gap-1">
          •
          <ReactMarkdown components={commonMarkdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      );
    case "link":
      return (
        <div className="relative z-30">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00AE70] hover:underline"
          >
            <ReactMarkdown components={commonMarkdownComponents}>
              {content}
            </ReactMarkdown>
          </a>
        </div>
      );
    default:
      return null;
  }
};
