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

  const averageLikes = Math.round(
    filteredInstagramData.reduce(
      (acc, instagram) => acc + instagram.likesCount,
      0
    ) / filteredInstagramData.length
  );
  const averageViews = Math.round(
    filteredInstagramData.reduce(
      (acc, instagram: any) => acc + instagram.videoViewCount,
      0
    ) / filteredInstagramData.length
  );
  const averageComments = Math.round(
    filteredInstagramData.reduce(
      (acc, instagram) => acc + instagram.commentsCount,
      0
    ) / filteredInstagramData.length
  );
  // const averageShares = Math.round(
  //   instagramData.reduce((acc, instagram) => acc + instagram.videoPlayCount, 0) /
  //     instagramData.length
  // );

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-4 border rounded-md p-4 border-[#00AE70] shadow-lg">
      <div className="flex gap-2 font-bold text-[#00AE70] border-[#00AE70] border rounded-md p-2 w-fit shadow-lg">
        <InstagramLogo className="w-10 h-10" />

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
          {/* <Share className="w-4 h-4" /> {averageShares} */}
        </h1>
      </div>
      <Chart />

      <div className="flex gap-1 flex-col">
        <h1 className="text-lg font-bold text-[#00AE70]">Top Videos</h1>
        <div className="grid grid-cols-6 gap-2 items-center">
          {filteredInstagramData
            .sort((a: any, b: any) => b.videoViewCount - a.videoViewCount)
            .slice(0, 6)
            .map((instagram) => (
              <button
                key={instagram.id}
                onClick={() => setSelectedPost(instagram)}
                className="relative overflow-hidden rounded-md shadow-lg border hover:border-[#00AE70] transition-all duration-300"
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
