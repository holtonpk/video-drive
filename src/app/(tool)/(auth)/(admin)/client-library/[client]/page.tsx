"use client";

import React from "react";

import {Metadata} from "next";
import ClientPage from "./client-page";
import {clients} from "@/config/data";
import {useRouter} from "next/router";

export const generateMetadata = ({
  params,
}: {
  params: {client: string};
}): Metadata => {
  const clientInfo = clients.find((c: any) => c.value === params.client);

  return {
    title: `${clientInfo?.label} | Library`,
    description: "Agency Video Sheet",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = () => {
  const router = useRouter();
  const {client} = router.query;
  return <ClientPage client={client as string} />;
};

export default Page;
