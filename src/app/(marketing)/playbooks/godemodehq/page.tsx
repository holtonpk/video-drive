"use client";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Image from "next/image";
import {Lightbulb, Brain, Goal} from "lucide-react";
import {motion} from "framer-motion";
import JSZip from "jszip";
import {Phone} from "lucide-react";
import Link from "next/link";
const Page = () => {
  return (
    <div className="flex flex-col items-center px-4  md:container mx-auto gap-8 py-6">
      <Link
        href="https://calendly.com/holtonpk/30min"
        target="_blank"
        className="fixed bottom-4 right-4 bg-[#34F4AF] text-[#0f1115] px-4 py-2 rounded-md flex items-center z-[999]"
      >
        <Phone className="w-4 h-4 mr-2" />
        Let's chat
      </Link>
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 rounded-md overflow-hidden">
          <Image
            src="/godmodehq_logo.jpeg"
            alt="Godmode HQ"
            width={100}
            height={100}
          />
        </div>
        <h1 className="text-4xl font-bold text-center text-[#34F4AF]">
          Godmode HQ social media playbook
        </h1>
        <p className="max-w-[500px] text-center">
          We've developed this playbook to help you kickstart your social media
          journey. At the bottom of this page you will find 6 videos that we've
          created to help you guys out.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#34F4AF]">
            <Brain className="w-5 h-5" />
            Our Thoughts
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              - Sales, SMBs, and Founders are great niches for all platforms.
            </p>
            <p>
              - Although memes help with follower retention, the space is too
              saturated for fast growth. Custom content is king.
            </p>
            <p>
              - Avoid collaborations until you have a solid content base and at
              least 1,000 followers.
            </p>
            <p>
              - 80% TOF (Top of Funnel) content to grow a qualified audience.
            </p>
            <p>
              - 20% BOF (Bottom of Funnel) content to convert your audience into
              customers.
            </p>
          </div>
        </div>
        <SeriesIdeas />
        <Videos />
      </div>
    </div>
  );
};

export default Page;

const SeriesIdeas = () => {
  const [selectedSeries, setSelectedSeries] = useState<number | undefined>(
    undefined
  );

  const series = [
    {
      id: 1,
      title: "Crazy sales strategy (TOF)",
      description: [
        "In this series, we’ll stories of out-of-the-box sales strategies that startups and founders have used. These outrageous stories are naturally attention grabbing so they’ll make the perfect hook. We then end every video with a relevant CTA that ties that specific story to a unique value proposition of Godmode HQ",
        "Branded as GodMode (look and voice)",
      ],
    },
    {
      id: 2,
      title: "Godmode educational (BOF)",
      description: [
        "This series will provide actionable tips and advice for businesses covering how to make the most of Godmode’s platform, showcasing the features that help you find the leads and then turn them into customers. For businesses on the verge of making a decision, this content provides the final push they need. It’s practical, to the point, and shows exactly how Godmode will solve their pain points.",
      ],
    },
    {
      id: 3,
      title: "Day in the life (BOF)",
      description: [
        "Here we are taking the lessons we get from the TOF memes and bring them to life with engaging stories showcasing a day in the life of a typical sales rep or team. Episodes will cover the different aspects of the job, from cold outreach struggles to follow-up fatigue and even contrasting the old-school and manual approach with the efficiency of AI-powered outreach. Sales teams will see themselves in these relatable (and slightly exaggerated) scenarios, making the content highly engaging and shareable.",
      ],
    },
    {
      id: 4,
      title: "How to sell (TOF)",
      description: [
        "We’ll curate short, practical tips from well-known founders or sales experts, highlighting their insights on cold outreach, customer engagement, and conversion strategies. The familiar faces coupled with us subtly integrating how Godmode can elevate these tactics even further, will position it as an essential tool for the modern day sales team.",
      ],
    },
  ];

  return (
    <div className="flex gap-2 flex-col w-full">
      <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#34F4AF]">
        <Lightbulb className="w-5 h-5" />
        Short Form Series Ideas
      </h2>
      <div className="grid  max-w-[1000px] gap-4">
        <div className=" flex flex-col gap-2 rounded-md h-fit border-white/10 order-2 md:order-1">
          {series.map((series) => {
            return (
              <button
                className={`flex flex-col gap-2 border text-left p-2 px-4 rounded-md group transition-all duration-300 ${
                  selectedSeries === series.id
                    ? "border-[#34F4AF] "
                    : " border-white/10 hover:border-[#34F4AF]/50"
                }`}
                onClick={() =>
                  setSelectedSeries(
                    selectedSeries === series.id ? undefined : series.id
                  )
                }
              >
                <div className="flex items-center mt-2">
                  {series.title}
                  <Icons.chevronDown
                    className={`w-4 h-4 ml-auto   
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
                    <p className="text-sm text-white/50">
                      {series.description.map((description) => (
                        <p>- {description}</p>
                      ))}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <span className="text-center text-[#34F4AF]/70">
        *These are all just starting points.
      </span>
    </div>
  );
};

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number>(1);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      const zip = new JSZip();

      // Wait for all fetch operations to complete
      await Promise.all(
        videos.map(async (video) => {
          const response = await fetch(video?.video);
          const blob = await response.blob();
          zip.file(video?.title + ".mp4", blob);
        })
      );

      // Generate and download the zip
      const content = await zip.generateAsync({type: "blob"});
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(content);
      a.download = "videos.zip";
      a.click();
      window.URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error("Error downloading videos:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[1000px]">
      <h2 className="text-2xl font-bold mt-10 text-center md:text-left text-[#34F4AF]">
        Your videos{" "}
        <span className="text-white/50">(feel free to post these)</span>
      </h2>
      <div className=" w-full gap-4 md:grid-cols-[350px_1fr] hidden md:grid">
        <div className="flex flex-col w-full h-full border rounded-md border-white/10 p-2 ">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold px-2">Your Videos</h1>
            <Button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="bg-[#34F4AF] hover:bg-[#34F4AF]/80 text-[#0f1115] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingAll ? (
                <>
                  <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                  <p>Downloading...</p>
                </>
              ) : (
                <>
                  <Icons.download className="w-4 h-4 mr-2" />
                  Download All
                </>
              )}
            </Button>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {videos.map((video) => {
              return (
                <button
                  className={`flex items-center gap-2 py-1 w-full border group rounded-sm px-4 transition-all duration-300 ${
                    selectedVideo === video.id
                      ? "bg-[#34F4AF]/10 border-[#34F4AF]"
                      : " hover:border-[#34F4AF]/50 border-white/10"
                  }`}
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <p>{video.title}</p>

                  <Icons.chevronRight
                    className={`w-4 h-4 ml-auto  
                    ${
                      selectedVideo === video.id
                        ? "block"
                        : "hidden group-hover:block "
                    }

                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <VideoCard video={videos.find((video) => video.id === selectedVideo)} />
      </div>
      <div className="md:hidden flex flex-col gap-4 mt-2">
        {videos.map((video) => {
          return <VideoCard video={video} />;
        })}
      </div>
    </div>
  );
};

const VideoCard = ({video}: {video: any}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(video?.caption);
    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const response = await fetch(video?.video);

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = video?.title + ".mp4";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
    setIsDownloading(false);
  };

  return (
    <div className="grid items-center md:grid-cols-[200px_1fr] gap-4 w-full border rounded-md border-white/10 p-2">
      <h1 className="md:hidden text-2xl font-bold text-center">
        {video?.title}
      </h1>

      <div className="w-full md:w-[200px] mx-auto md:mx-0 aspect-[9/16] bg-muted/10 overflow-hidden rounded-md border  relative ">
        <video
          src={video?.video}
          controls
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="hidden md:block text-2xl font-bold">{video?.title}</h1>
        <div className="grid gap-1">
          <h2 className=" ">Caption</h2>
          <div
            className={`
            border border-white/10 p-2 w-full rounded-md overflow-hidden transition-all duration-300 pb-2 text-ellipsis relative h-fit flex flex-col `}
          >
            {video?.caption.split("\n").map((line: string) => (
              <p>{line}</p>
            ))}
            <button className="absolute bottom-0 left-0 w-full blurBack bg-[#0f1115] text-white/50 px-2 py-1 rounded-md flex items-center justify-center"></button>
          </div>
        </div>
        <Button onClick={handleCopy} disabled={isCopying}>
          {!isCopying ? (
            <>
              <Icons.copy className="w-4 h-4 mr-2" />
              Copy Caption
            </>
          ) : (
            <>
              <Icons.check className="w-4 h-4 mr-2" />
              Copied
            </>
          )}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-[#34F4AF] hover:bg-[#34F4AF]/80 text-[#0f1115] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <>
              <Icons.download className="w-4 h-4 mr-2" />
              Download Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const videos = [
  {
    id: 1,
    title: "Meme 1 (GPT Closer)",
    caption:
      "Are you a gigacloser?\nScale your sales for $1/lead with AI-powered prospecting. Get your first leads at godmodehq.com ",

    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FGPT%20Closer%20(meme).mov?alt=media&token=1067388e-1433-440c-8ee7-60d8338bc0ac",
  },
  {
    id: 2,
    title: "Meme 2 (New Job)",
    caption:
      "We've all been there, right? \nScale your sales for $1/lead with AI-powered prospecting. Get your first leads at godmodehq.com ",

    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FMeme%201.mp4?alt=media&token=a896bc40-0c3c-4cdb-9528-f3a0d4d03898",
  },
  {
    id: 3,
    title: "Meme 3 (Life in sales)",
    caption:
      "I cant be the only one who's felt this way\nPay $1 per qualified lead, let AI do the work. Get started at godmodehq.com",

    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FMeme%202.mp4?alt=media&token=b00e76d9-2a8e-4926-bf52-f8c91047f63c",
  },

  {
    id: 4,
    title: "Meme 4 (Ghosted)",
    caption:
      "I love getting ghosted, it's so much fun \nPay $1 per qualified lead, let AI do the work. Get started at godmodehq.com",
    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FMeme%203.mov?alt=media&token=c0496e59-1ab5-4c29-8693-ef0fceac4847",
  },
  {
    id: 5,
    title: "Meme 5 (Quota)",
    caption:
      "I'm so close to my quota, but I'm not quite there yet\nAI finds your perfect leads for $1 each. Start scaling at godmodehq.com",
    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FMeme%204.mov?alt=media&token=af8fecfa-80a4-41d8-8dfb-de4178a98f8f",
  },

  {
    id: 6,
    title: "Meme 6 (What we really do)",
    caption: `We are the unwilling 😂 \nAI finds your perfect leads for $1 each. Start scaling at godmodehq.com`,
    video:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/godemode%2FMeme%205.mov?alt=media&token=4a1cde3f-7c3e-4e45-8f7c-4ab61171f75f",
  },
];
