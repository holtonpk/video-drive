import {constructMetadata} from "@/lib/utils";

import {Metadata} from "next";
import VideoArchive from "./video-archive2";
import {clients} from "@/config/data";

import Background from "@/src/app/(tool)/(auth)/(admin)/components/background";

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
    <div className="dark flex flex-col h-fit min-h-screen">
      <Background />
      <VideoArchive clientId={params.clientId} />
    </div>
  );
};

export default Page;
