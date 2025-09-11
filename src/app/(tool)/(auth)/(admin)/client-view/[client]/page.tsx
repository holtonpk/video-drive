import React from "react";

import {Metadata} from "next";
import ClientPage from "./client-page";
import {clients} from "@/config/data";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{client: string}>;
}): Promise<Metadata> => {
  const {client} = await params;
  const clientInfo = clients.find((c: any) => c.value === client);

  return {
    title: `${clientInfo?.label} | Video Planning`,
    description: "Agency Video Sheet",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = async ({params}: {params: Promise<{client: string}>}) => {
  const {client} = await params;
  return <ClientPage client={client} />;
};

export default Page;
