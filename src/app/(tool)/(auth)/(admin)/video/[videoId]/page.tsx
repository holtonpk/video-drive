import VideoPage from "./video-page";
import {Metadata} from "next";
import Background from "@/components/background";

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
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = async ({params}: {params: Promise<{videoId: string}>}) => {
  const {videoId} = await params;
  return <VideoPage videoId={videoId} />;
};

export default Page;
