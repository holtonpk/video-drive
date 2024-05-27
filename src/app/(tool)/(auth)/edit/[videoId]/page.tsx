import {constructMetadata} from "@/lib/utils";
import VideoPage from "./video-page";
import {Metadata} from "next";

export const generateMetadata = ({
  params,
}: {
  params: {videoId: string};
}): Metadata => {
  return {
    title: `Video - #${params.videoId}`,
    description: "Agency Video Sheet",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = ({params}: {params: {videoId: string}}) => {
  return (
    <div className="dark bg-background overflow-scroll">
      <VideoPage videoId={params.videoId} />
    </div>
  );
};

export default Page;
