import {constructMetadata} from "@/lib/utils";
import VideoPage from "./video-page";
import {Metadata} from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{videoId: string}>;
}): Promise<Metadata> => {
  const {videoId} = await params;
  return {
    title: `Video - #${videoId}`,
    description: "Agency Video Sheet",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = async ({params}: {params: Promise<{videoId: string}>}) => {
  const {videoId} = await params;
  return (
    <div className=" bg-background overflow-scroll ">
      <VideoPage videoId={videoId} />
    </div>
  );
};

export default Page;
