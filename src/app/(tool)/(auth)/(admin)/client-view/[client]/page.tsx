"use client";
import React from "react";
import ClientPage from "./client-page";

// export const generateMetadata = ({
//   params,
// }: {
//   params: {client: string};
// }): Metadata => {
//   const {client} = params;
//   const clientInfo = clients.find((c: any) => c.value === client);

//   return {
//     title: `${clientInfo?.label} | Video Planning`,
//     description: "Agency Video Sheet",
//     icons: {
//       icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
//       shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
//       apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
//     },
//   };
// };

const Page = ({params}: {params: {client: string}}) => {
  return <ClientPage client={params.client} />;
};
export default Page;
