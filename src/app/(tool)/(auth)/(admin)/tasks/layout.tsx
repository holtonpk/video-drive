import React from "react";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Tasks",
  description: "Agency Tasks ",
  image: "image/favicon.ico",
});

const Layout = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
};

export default Layout;
