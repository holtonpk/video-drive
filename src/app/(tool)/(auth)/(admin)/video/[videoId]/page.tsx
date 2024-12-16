import {constructMetadata} from "@/lib/utils";
import VideoPage from "./video-page";
import {Metadata} from "next";
import Background from "@/components/background";

export const generateMetadata = ({
  params,
}: {
  params: {videoId: string};
}): Metadata => {
  return {
    title: `Video - #${params.videoId}`,
    description: "Agency Video Sheet",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = ({params}: {params: {videoId: string}}) => {
  return (
    <>
      <VideoPage videoId={params.videoId} />
    </>
  );
};

export default Page;
