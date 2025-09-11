import React from "react";
import ReportPage from "./report-page";
import {clients} from "@/config/data";
import {Metadata} from "next";

export const generateMetadata = (): Metadata => {
  // const clientInfo = clients.find((c: any) => c.value === params.clientId);

  return {
    title: `Blue Collar Keys | Report`,
    description: "Report",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
  };
};

const Page = () => {
  const params = {clientId: "blueCollarKeys"};
  return <ReportPage params={params} />;
};

export default Page;
