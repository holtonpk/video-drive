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
  const averageLikes = Math.round(
    tiktokData.reduce((acc, tiktok) => acc + tiktok.diggCount, 0) /
      tiktokData.length
  );
  const averageViews = Math.round(
    tiktokData.reduce((acc, tiktok) => acc + tiktok.playCount, 0) /
      tiktokData.length
  );
  const averageComments = Math.round(
    tiktokData.reduce((acc, tiktok) => acc + tiktok.commentCount, 0) /
      tiktokData.length
  );
  const averageShares = Math.round(
    tiktokData.reduce((acc, tiktok) => acc + tiktok.shareCount, 0) /
      tiktokData.length
  );
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  return (
    <div className="flex  w-full flex-col gap-4 border rounded-md p-4 border-[#00AE70] shadow-lg">
      <div className="flex gap-2 font-bold text-[#00AE70] border border-[#00AE70] rounded-md p-2 w-fit shadow-lg">
        <TiktokLogo className="w-10 h-10" />
        <h1 className="flex items-center gap-1">
          <Heart className="w-4 h-4" /> {formatNumber(averageLikes)}
        </h1>
        <h1 className="flex items-center gap-1">
          <Eye className="w-4 h-4" /> {formatNumber(averageViews)}
        </h1>
        <h1 className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" /> {formatNumber(averageComments)}
        </h1>
        <h1 className="flex items-center gap-1">
          <Share className="w-4 h-4" /> {formatNumber(averageShares)}
        </h1>
      </div>
      <Chart />

      <div className="flex gap-1 flex-col">
        <h1 className="text-lg font-bold text-[#00AE70]">Top Videos</h1>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
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
