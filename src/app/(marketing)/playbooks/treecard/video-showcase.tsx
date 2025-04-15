import VideoPlayer from "@/components/ui/video-player";
import {Brain, Clapperboard} from "lucide-react";
import {MortyLogo, LearnXYZLogo} from "@/components/icons";

import React from "react";

const VideoShowcase = () => {
  const videos = [
    {
      id: 1,
      title: "Morty",
      icon: MortyLogo,
      info: "This video was created for Morty app. A consumer app that help people find escape rooms and other imerssive experiences. This particular video is a BOF video that has done over 5 million organic views",
      url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F0415.mov?alt=media&token=a469b248-2e71-42d4-979f-15bcbd35388f",
    },
    {
      id: 2,
      icon: LearnXYZLogo,
      title: "Learn XYZ",
      info: "This video was created for Learn XYZ. A consumer app that help people learn about the world. This particular video is a BOF video that has done over 5 million organic views",
      url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FVideo%204005.mp4%20%20%2B%20%22.%22%20%2B%20mp4?alt=media&token=ead99631-5380-44af-b17a-9bc3997b66b5",
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-[1000px]">
      <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
        <Clapperboard className="w-5 h-5" />
        Example work
      </h2>
      <p className="text-black">
        Some videos we have done for other consumer products. Both of these
        videos are heavily animated not the particular style we will be doing
        for Treecard.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        {videos.map((video) => (
          <div className="grid grid-cols-2 gap-4 border rounded-md shadow-md">
            <div className="flex flex-col p-4 gap-4">
              <div className=" flex items-center  gap-2">
                <video.icon className="w-8 h-8 rounded-[8px]" />
                <h3 className="text-xl font-bold text-black">{video.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{video.info}</p>
            </div>
            <div className="  overflow-hidden rounded-r-md">
              <VideoPlayer
                key={video.id}
                videoUrl={video.url}
                title={video.title}
                className="rounded-l-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoShowcase;
