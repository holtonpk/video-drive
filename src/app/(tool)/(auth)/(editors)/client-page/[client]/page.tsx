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
    title: `Client - ${clientInfo?.label}`,
    description: "Agency Video Sheet",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = async ({params}: {params: Promise<{client: string}>}) => {
  const {client} = await params;
  return <ClientPage client={client} />;
};

export default Page;
