import React from "react";
import {PlaybookPage} from "./playbook-page";
import {Metadata} from "next";

export const generateMetadata = (): Metadata => {
  // const clientInfo = clients.find((c: any) => c.value === params.clientId);
  return {
    title: `Zing - Organic Content playbook`,
    description: "Report",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = () => {
  return <PlaybookPage />;
};

export default Page;
