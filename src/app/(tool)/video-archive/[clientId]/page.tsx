import {constructMetadata} from "@/lib/utils";

import {Metadata} from "next";
import VideoArchive from "./video-archive2";
import {clients} from "@/config/data";

import Background from "@/src/app/(tool)/(auth)/(admin)/components/background";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{clientId: string}>;
}): Promise<Metadata> => {
  const {clientId} = await params;
  const clientInfo = clients.find((c: any) => c.value === clientId);

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

const Page = async ({params}: {params: Promise<{clientId: string}>}) => {
  const {clientId} = await params;
  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <Background />
      <VideoArchive clientId={clientId} />
    </div>
  );
};

export default Page;
