import React from "react";
import {Chart} from "./chart";
import TiktokData from "./tiktok/tiktok";
import InstagramData from "./instagram/instagram";
const SocialAudit = () => {
  return (
    <div className=" grid md:grid-cols-2 gap-4 md:container b-b items-center">
      <TiktokData />
      <InstagramData />
    </div>
  );
};

export default SocialAudit;
