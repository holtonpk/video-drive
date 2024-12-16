import React from "react";

import {Metadata} from "next";
import ClientPage from "./client-page";
import {clients} from "@/config/data";

export const generateMetadata = ({
  params,
}: {
  params: {client: string};
}): Metadata => {
  const clientInfo = clients.find((c: any) => c.value === params.client);

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

const Page = ({params}: {params: {client: string}}) => {
  return <ClientPage client={params.client} />;
};

export default Page;
