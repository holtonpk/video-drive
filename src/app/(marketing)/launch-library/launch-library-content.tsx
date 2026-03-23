"use client";

import React, {useMemo} from "react";
import VideoRow from "./video-row";
import {VideoData} from "./data/types";
import {videoRowConfigs, buildVideoRows} from "./row-config";

export function LaunchLibraryContent({videos}: {videos: VideoData[]}) {
  const rows = useMemo(() => buildVideoRows(videos, videoRowConfigs), [videos]);

  return (
    <div className="flex flex-col gap-8 py-8">
      {rows
        .filter(({videos: rowVideos}) => rowVideos.length > 0)
        .map(({config, videos: rowVideos}) => (
          <VideoRow
            key={config.label}
            label={config.label}
            videos={rowVideos}
            href={config.href}
          />
        ))}
    </div>
  );
}
