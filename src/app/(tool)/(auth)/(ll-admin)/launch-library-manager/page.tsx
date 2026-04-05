import React from "react";
import VideoManager from "./video-manager";

const Page = () => {
  return (
    <div className="max-w-screen max-h-screen overflow-hidden">
      <VideoManager />
    </div>
  );
};

export default Page;

// search/filter results by any field
// sync data with firebase (firebase should be automatically updated when data is changed)
// download video from the twitter video url (don't build out the api route quite yet)
// manage and update all fields
// set the video thumbnail using a frame from the video url
