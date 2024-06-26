import React from "react";
import EditDashboard from "./editor-dashboard";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Editor Dashboard",
  description: "We specialize in organic marketing",
});

const Page = () => {
  return <EditDashboard />;
};

export default Page;
