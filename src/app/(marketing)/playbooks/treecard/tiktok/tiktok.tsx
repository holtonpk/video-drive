"use client";
import {useState} from "react";

import {Heart, Eye, MessageCircle, Share} from "lucide-react";
import Image from "next/image";
import {TiktokLogo} from "@/components/icons";
import {ScrollArea} from "@/components/ui/scroll-area";
import {formatNumber} from "../instagram/instagram";
import tiktokData from "../data/tiktok.json";
import {Chart} from "./chart";
import PostDisplay from "../post-display";
const TiktokData = () => {
  console.log("tiktokData", tiktokData);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  return (
    <div className="flex  w-full flex-col gap-4 border rounded-md  border-[#00AE70] shadow-lg">
      <Chart data={tiktokData} />

      <div className="flex gap-1 flex-col p-6 pt-0">
        <h1 className="text-lg font-bold text-[#00AE70]">Top Videos</h1>
        <div className="flex flex-wrap md:grid  md:grid-cols-6 gap-2 items-center">
          {tiktokData
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 6)
            .map((tiktok) => (
              <button
                key={tiktok.id}
                onClick={() => setSelectedPost(tiktok)}
                className="relative overflow-hidden w-fit rounded-md shadow-lg border hover:border-[#00AE70] transition-all duration-300"
              >
                <Image
                  className="rounded-md"
                  src={tiktok.videoMeta.coverUrl}
                  alt={tiktok.text}
                  width={100}
                  height={100}
                />
                <p className="text-sm text-center absolute bottom-0 flex p-1 gap-1 items-center bg-black/50 rounded-tr-md blurBack ">
                  <Eye className="w-4 h-4" />
                  {formatNumber(tiktok.playCount)}
                </p>
              </button>
            ))}
        </div>
      </div>

      {selectedPost && (
        <PostDisplay
          onClose={() => setSelectedPost(null)}
          caption={selectedPost.text}
          likes={selectedPost.diggCount}
          views={selectedPost.playCount}
          comments={selectedPost.commentCount}
          postDate={selectedPost.createTimeISO}
          type="tiktok"
          postUrl={selectedPost.webVideoUrl}
        />
      )}
    </div>
  );
};

export default TiktokData;
