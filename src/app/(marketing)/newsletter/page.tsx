import Link from "next/link";
import React from "react";
import {constructMetadata} from "@/lib/utils";
import {NewsletterCard} from "./newsletter-card";
import "../marketing-style.css";
import {NavBar} from "../navbar";

export const metadata = constructMetadata({
  title: "Ripple Media - Newsletter",
  description:
    "Get the Latest Trends and Insights Delivered straight to Your Inbox",
});

const Page = () => {
  return (
    <div className="container mx-auto min-h-screen ">
      <NavBar />
      <NewsletterCard />
    </div>
  );
};

export default Page;
