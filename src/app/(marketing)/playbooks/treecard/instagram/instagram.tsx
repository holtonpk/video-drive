"use client";
import Image from "next/image";
import {InstagramLogo} from "@/components/icons";
import {Heart, Eye, MessageCircle} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";
import instagramData from "../data/instagram.json";
import PostDisplay from "../post-display";
import {useState} from "react";
import {Chart} from "./chart";
const InstagramData = () => {
  const filteredInstagramData = instagramData.filter(
    (instagram) => instagram.type === "Video"
  );

  // const averageShares = Math.round(
  //   instagramData.reduce((acc, instagram) => acc + instagram.videoPlayCount, 0) /
  //     instagramData.length
  // );

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-4 border rounded-md  border-[#00AE70] shadow-lg">
      <Chart data={filteredInstagramData} />

      <div className="flex gap-1 flex-col p-6 pt-0">
        <h1 className="text-lg font-bold text-[#00AE70]">Top Videos</h1>
        <div className="flex flex-wrap md:grid md:grid-cols-6 gap-2 items-center">
          {filteredInstagramData
            .sort((a: any, b: any) => b.videoViewCount - a.videoViewCount)
            .slice(0, 6)
            .map((instagram) => (
              <button
                key={instagram.id}
                onClick={() => setSelectedPost(instagram)}
                className="relative overflow-hidden w-fit rounded-md shadow-lg border hover:border-[#00AE70] transition-all duration-300"
              >
                <Image
                  className="rounded-md"
                  src={instagram.displayUrl}
                  alt={instagram.caption}
                  width={100}
                  height={100}
                />
                <p className="text-sm text-center absolute bottom-0 flex p-1 gap-1 items-center bg-black/50 rounded-tr-md blurBack ">
                  <Eye className="w-4 h-4" />
                  {formatNumber(Number(instagram.videoViewCount))}
                </p>
              </button>
            ))}
        </div>
      </div>
      {selectedPost && (
        <PostDisplay
          videoUrl={selectedPost.videoUrl}
          onClose={() => setSelectedPost(null)}
          caption={selectedPost.caption}
          likes={selectedPost.likesCount}
          views={selectedPost.videoViewCount}
          comments={selectedPost.commentsCount}
          postDate={selectedPost.timestamp}
          type="instagram"
          postUrl={selectedPost.url}
        />
      )}
    </div>
  );
};
export default InstagramData;

// a function that turns a number like 2132 into 2.1k and 2132132 into 2.1m and 121 into 121
export const formatNumber = (number: number) => {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
};
