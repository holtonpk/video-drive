import React from "react";
import Tasks from "./tasks";

const Page = () => {
  return <Tasks />;
};

export default Page;

const categories = [
  {
    label: "Acquisition",
    value: "acquisition",
  },
  {
    label: "Branding",
    value: "branding",
  },
  {
    label: "Finance",
    value: "finance",
  },
  {
    label: "Client management",
    value: "client-management",
  },
  {
    label: "Videos",
    value: "videos",
  },
];
