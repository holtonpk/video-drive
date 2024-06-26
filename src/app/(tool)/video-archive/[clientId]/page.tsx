import {constructMetadata} from "@/lib/utils";

import {Metadata} from "next";
import VideoArchive from "./video-archive";
import {clients} from "@/config/data";
import Background from "@/components/background";

export const generateMetadata = ({
  params,
}: {
  params: {clientId: string};
}): Metadata => {
  const clientInfo = clients.find((c: any) => c.value === params.clientId);

  return {
    title: `${clientInfo?.label} - Video Archive`,
    description: `${clientInfo?.label} video archive`,
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = ({params}: {params: {clientId: string}}) => {
  return (
    <div className="bg-background dark">
      <VideoArchive clientId={params.clientId} />
      <Background />
    </div>
  );
};

export default Page;
