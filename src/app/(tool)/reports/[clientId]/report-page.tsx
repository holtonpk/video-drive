"use client";

import {
  TiktokLogo,
  XLogo,
  YoutubeLogo,
  FaceBookLogo,
  InstagramLogo,
  LinkedInLogo,
  Icons,
} from "@/components/icons";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {db} from "@/config/firebase";
import {doc, getDoc, onSnapshot, query} from "firebase/firestore";
import {collection} from "firebase/firestore";
import {clients, ClientVideoData} from "@/config/data";
import VideoPlayer from "@/components/ui/video-player";
import {Eye, Heart, LinkIcon, MessageCircle, Share} from "lucide-react";
import Link from "next/link";
import {
  TikTokPost,
  YouTubePost,
  InstagramPost,
  FacebookPost,
  LinkedInPost,
  XPost,
} from "./data";
import {formatNumber} from "@/components/ui/chart";
import Background from "../background";
import ReportBody from "./report-body";
import {Button} from "@/components/ui/button";
import {Chart} from "./chart";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const getId = (data: any, platformId: string) => {
  return platformId === "facebook"
    ? data.postId || 0
    : platformId === "linkedin"
    ? data?.linkedinVideo?.videoPlayMetadata?.trackingId || 0
    : data.id;
};

const getViews = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.playCount || 0
    : platform === "youtube"
    ? post?.viewCount || 0
    : platform === "instagram"
    ? post?.videoPlayCount || 0
    : platform === "x"
    ? post?.viewCount || 0
    : platform === "facebook"
    ? post?.viewsCount || 0
    : platform === "linkedin"
    ? post?.numLikes || 0
    : "unavailable";
};

const getLikes = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.diggCount || 0
    : platform === "youtube"
    ? post?.likes || 0
    : platform === "instagram"
    ? post?.likesCount || 0
    : platform === "x"
    ? post?.likeCount || 0
    : platform === "facebook"
    ? post?.likes || 0
    : platform === "linkedin"
    ? post?.numLikes || 0
    : "unavailable";
};

const getComments = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.commentCount || 0
    : platform === "youtube"
    ? post?.commentsCount || 0
    : platform === "instagram"
    ? post?.commentsCount || 0
    : platform === "x"
    ? post?.replyCount || 0
    : platform === "facebook"
    ? post?.topReactionsCount || 0
    : platform === "linkedin"
    ? post?.numComments || 0
    : "unavailable";
};

const getShares = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.shareCount || 0
    : platform === "facebook"
    ? post?.shares || 0
    : platform === "linkedin"
    ? post?.numShares || 0
    : "unavailable";
};

const getFollowers = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.authorMeta.fans
    : platform === "youtube"
    ? post?.numberOfSubscribers
    : platform === "linkedin"
    ? post?.authorFollowersCount
    : 0;
};

const ReportPage = ({params}: {params: {clientId: string}}) => {
  type Report = {
    label: string;
    date: string;
    reportDate: string;
    body: string;
    totalEngagement: number;
    totalFollowers: number;
    totalPosts: number;
  };

  const getDataFromWeek = (reportDate: string) => {
    const tiktokDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_tiktok.json`) as TikTokPost[];
    const youtubeDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_youtube.json`) as YouTubePost[];
    const instagramDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_instagram.json`) as InstagramPost[];
    const facebookDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_facebook.json`).filter(
        (post: FacebookPost) => post?.isVideo === true
      ) as FacebookPost[];
    const linkedinDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_linkedin.json`) as LinkedInPost[];
    const xDataLocal =
      require(`./${params.clientId}/${reportDate}/dataset_x.json`) as XPost[];

    const cleanedData = {
      tiktok: {
        value: "tiktok",
        data: tiktokDataLocal,
        icon: TiktokLogo,
        name: "TikTok",
        followers: Number(getFollowers(tiktokDataLocal[0], "tiktok")),
        posts: tiktokDataLocal.length,
        totalViews: Number(
          tiktokDataLocal.reduce(
            (acc, video) => acc + getViews(video, "tiktok"),
            0
          )
        ),
        totalLikes: Number(
          tiktokDataLocal.reduce(
            (acc, video) => acc + getLikes(video, "tiktok"),
            0
          )
        ),
        totalComments: Number(
          tiktokDataLocal.reduce(
            (acc, video) => acc + getComments(video, "tiktok"),
            0
          )
        ),
        totalShares: Number(
          tiktokDataLocal.reduce(
            (acc, video) => acc + getShares(video, "tiktok"),
            0
          )
        ),
      },
      youtube: {
        value: "youtube",
        data: youtubeDataLocal,
        icon: YoutubeLogo,
        name: "YouTube",
        followers: Number(getFollowers(youtubeDataLocal[0], "youtube")),
        posts: youtubeDataLocal.length,
        totalViews:
          Number(
            youtubeDataLocal.reduce(
              (acc, video) => acc + getViews(video, "youtube"),
              0
            )
          ) || 0,
        totalLikes:
          Number(
            youtubeDataLocal.reduce(
              (acc, video) => acc + getLikes(video, "youtube"),
              0
            )
          ) || 0,
        totalComments:
          Number(
            youtubeDataLocal.reduce(
              (acc, video) => acc + getComments(video, "youtube"),
              0
            )
          ) || 0,
        totalShares:
          Number(
            youtubeDataLocal.reduce(
              (acc, video) => acc + getShares(video, "youtube"),
              0
            )
          ) || 0,
      },
      instagram: {
        value: "instagram",
        data: instagramDataLocal,
        icon: InstagramLogo,
        name: "Instagram",
        followers: 40,
        posts: instagramDataLocal.length,
        totalViews:
          Number(
            instagramDataLocal.reduce(
              (acc, video) => acc + getViews(video, "instagram"),
              0
            )
          ) || 0,
        totalLikes:
          Number(
            instagramDataLocal.reduce(
              (acc, video) => acc + getLikes(video, "instagram"),
              0
            )
          ) || 0,
        totalComments:
          Number(
            instagramDataLocal.reduce(
              (acc, video) => acc + getComments(video, "instagram"),
              0
            )
          ) || 0,
        totalShares:
          Number(
            instagramDataLocal.reduce(
              (acc, video) => acc + getShares(video, "instagram"),
              0
            )
          ) || 0,
      },
      facebook: {
        value: "facebook",
        data: facebookDataLocal,
        icon: FaceBookLogo,
        name: "Facebook",
        followers: 6,
        posts: facebookDataLocal.length,
        totalViews:
          Number(
            facebookDataLocal.reduce(
              (acc, video) => acc + getViews(video, "facebook"),
              0
            )
          ) || 0,
        totalLikes:
          Number(
            facebookDataLocal.reduce(
              (acc, video) => acc + getLikes(video, "facebook"),
              0
            )
          ) || 0,
        totalComments:
          Number(
            facebookDataLocal.reduce(
              (acc, video) => acc + getComments(video, "facebook"),
              0
            )
          ) || 0,
        totalShares:
          Number(
            facebookDataLocal.reduce(
              (acc, video) => acc + getShares(video, "facebook"),
              0
            )
          ) || 0,
      },
      linkedin: {
        value: "linkedin",
        data: linkedinDataLocal,
        icon: LinkedInLogo,
        name: "LinkedIn",
        followers: Number(getFollowers(linkedinDataLocal[0], "linkedin")),
        posts: linkedinDataLocal.length,
        totalViews:
          Number(
            linkedinDataLocal.reduce(
              (acc, video) => acc + getViews(video, "linkedin"),
              0
            )
          ) || 0,
        totalLikes:
          Number(
            linkedinDataLocal.reduce(
              (acc, video) => acc + getLikes(video, "linkedin"),
              0
            )
          ) || 0,
        totalComments:
          Number(
            linkedinDataLocal.reduce(
              (acc, video) => acc + getComments(video, "linkedin"),
              0
            )
          ) || 0,
        totalShares:
          Number(
            linkedinDataLocal.reduce(
              (acc, video) => acc + getShares(video, "linkedin"),
              0
            )
          ) || 0,
      },
      x: {
        value: "x",
        data: xDataLocal,
        icon: XLogo,
        name: "Twitter",
        followers: Number(getFollowers(xDataLocal[0], "x")),
        posts: xDataLocal.length,
        totalViews:
          Number(
            xDataLocal.reduce((acc, post) => acc + getViews(post, "x"), 0)
          ) || 0,
        totalLikes:
          Number(
            xDataLocal.reduce((acc, post) => acc + getLikes(post, "x"), 0)
          ) || 0,
        totalComments:
          Number(
            xDataLocal.reduce((acc, post) => acc + getComments(post, "x"), 0)
          ) || 0,
        totalShares:
          Number(
            xDataLocal.reduce((acc, post) => acc + getShares(post, "x"), 0)
          ) || 0,
      },
    };

    const totalViews =
      cleanedData.tiktok.totalViews +
      cleanedData.youtube.totalViews +
      cleanedData.instagram.totalViews +
      cleanedData.facebook.totalViews +
      cleanedData.linkedin.totalViews +
      cleanedData.x.totalViews;
    const totalLikes =
      cleanedData.tiktok.totalLikes +
      cleanedData.youtube.totalLikes +
      cleanedData.instagram.totalLikes +
      cleanedData.facebook.totalLikes +
      cleanedData.linkedin.totalLikes +
      cleanedData.x.totalLikes;
    const totalComments =
      cleanedData.tiktok.totalComments +
      cleanedData.youtube.totalComments +
      cleanedData.instagram.totalComments +
      cleanedData.facebook.totalComments +
      cleanedData.linkedin.totalComments +
      cleanedData.x.totalComments;

    const totalShares =
      cleanedData.tiktok.totalShares +
      cleanedData.youtube.totalShares +
      cleanedData.instagram.totalShares +
      cleanedData.facebook.totalShares +
      cleanedData.linkedin.totalShares +
      cleanedData.x.totalShares;

    const totalFollowers =
      cleanedData.tiktok.followers +
      cleanedData.youtube.followers +
      cleanedData.instagram.followers +
      cleanedData.facebook.followers +
      cleanedData.linkedin.followers +
      cleanedData.x.followers;

    const totalPosts =
      cleanedData.tiktok.posts +
      cleanedData.youtube.posts +
      cleanedData.instagram.posts +
      cleanedData.facebook.posts +
      cleanedData.linkedin.posts +
      cleanedData.x.posts;

    const totalEngagement =
      totalViews + totalLikes + totalComments + totalShares;

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalFollowers,
      totalShares,
      totalEngagement,
      totalPosts,
    };
  };

  const reports: Report[] = [
    {
      label: "Week 1",
      date: "4-03-2025 - 4-13-2025",
      reportDate: "4-13-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we'll consider launching a new series specifically optimized for Facebook.
`,
      totalEngagement: getDataFromWeek("4-13-2025").totalEngagement,
      totalFollowers: getDataFromWeek("4-13-2025").totalFollowers,
      totalPosts: getDataFromWeek("4-13-2025").totalPosts,
    },
    {
      label: "Week 2",
      date: "4-13-2025 - 4-20-2025",
      reportDate: "4-20-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we'll consider launching a new series specifically optimized for Facebook.
`,
      totalEngagement: getDataFromWeek("4-20-2025").totalEngagement,
      totalFollowers: getDataFromWeek("4-20-2025").totalFollowers,
      totalPosts: getDataFromWeek("4-20-2025").totalPosts,
    },
    {
      label: "Week 3",
      date: "4-20-2025 - 4-27-2025",
      reportDate: "4-27-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we'll consider launching a new series specifically optimized for Facebook.
`,
      totalEngagement: getDataFromWeek("4-27-2025").totalEngagement,
      totalFollowers: getDataFromWeek("4-27-2025").totalFollowers,
      totalPosts: getDataFromWeek("4-27-2025").totalPosts,
    },
    {
      label: "Week 4",
      date: "4-27-2025 - 5-04-2025",
      reportDate: "5-4-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we'll consider launching a new series specifically optimized for Facebook.
`,
      totalEngagement: getDataFromWeek("5-4-2025").totalEngagement,
      totalFollowers: getDataFromWeek("5-4-2025").totalFollowers,
      totalPosts: getDataFromWeek("5-4-2025").totalPosts,
    },
    {
      label: "Week 5",
      date: "5-04-2025 - 5-11-2025",
      reportDate: "5-11-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we'll consider launching a new series specifically optimized for Facebook.
`,
      totalEngagement: getDataFromWeek("5-11-2025").totalEngagement,
      totalFollowers: getDataFromWeek("5-11-2025").totalFollowers,
      totalPosts: getDataFromWeek("5-11-2025").totalPosts,
    },
    {
      label: "Week 6",
      date: "5-11-2025 - 5-18-2025",
      reportDate: "5-18-2025",
      body: `## Content Performance & Strategy Update 
- **Facebook**: Since our last call, we’ve shifted our Facebook strategy from crossposting to uploading videos directly to the platform. We'll be tracking performance over the next few weeks. Alongside higher-quality content, we're planning secondary activations tailored for Facebook—like engaging with niche accounts, posting shorter videos more frequently, sharing stories, and eventually adding written content.
- **Interview Clips**: We are running low on footage so when ever you are able to get new footage please send it to us.
- **New series**: We’re also launching a new series that sources blue-collar UGC from the community to create more relatable, frequent content.
- **ICP focus**: You’ve probably noticed our animated series is now more directly aligned with Blue Collar Keys’ ideal customer profile—shifting focus from general construction stories to ones centered on home services and the trades.
`,
      totalEngagement: getDataFromWeek("5-18-2025").totalEngagement,
      totalFollowers: getDataFromWeek("5-18-2025").totalFollowers,
      totalPosts: getDataFromWeek("5-18-2025").totalPosts,
    },
    {
      label: "Week 7",
      date: "5-18-2025 - 5-25-2025",
      reportDate: "5-25-2025",
      body: `## Content Performance & Strategy Update 
- **Facebook**: Since our last call, we’ve shifted our Facebook strategy from crossposting to uploading videos directly to the platform. We'll be tracking performance over the next few weeks. Alongside higher-quality content, we're planning secondary activations tailored for Facebook—like engaging with niche accounts, posting shorter videos more frequently, sharing stories, and eventually adding written content.
- **Interview Clips**: We are running low on footage so when ever you are able to get new footage please send it to us.
- **New series**: We’re also launching a new series that sources blue-collar UGC from the community to create more relatable, frequent content.
- **ICP focus**: You’ve probably noticed our animated series is now more directly aligned with Blue Collar Keys’ ideal customer profile—shifting focus from general construction stories to ones centered on home services and the trades.
`,
      totalEngagement: getDataFromWeek("5-25-2025").totalEngagement,
      totalFollowers: getDataFromWeek("5-25-2025").totalFollowers,
      totalPosts: getDataFromWeek("5-25-2025").totalPosts,
    },
    {
      label: "Week 8",
      date: "5-25-2025 - 6-01-2025",
      reportDate: "6-1-2025",
      body: `## Content Performance & Strategy Update 


- **New Interview Clips**: We’ve updated the animation and hook style for interview clips. The new format is performing much better than older versions.

- **Written content**:
Launched two new written series to diversify content. These are designed to drive engagement and reach across platforms.

- **Account activity**:
We’ve been actively engaging with other accounts in our niche. This has helped boost visibility and engagement, especially on Instagram.

- **Instagram**:
Starting to see traction with our content. We recently hit our first 10k+ views on a video.

- **Facebook**:
Written content is expected to help grow our presence here. As Instagram picks up, we anticipate Facebook will follow.

- **YouTube**:
Animated story content is consistently performing well. Videos are averaging over 3k views.

- **TikTok**:
Content is regularly going viral. We’re seeing strong consistency in reach and shares.
`,
      totalEngagement: getDataFromWeek("6-1-2025").totalEngagement,
      totalFollowers: getDataFromWeek("6-1-2025").totalFollowers,
      totalPosts: getDataFromWeek("6-1-2025").totalPosts,
    },
    {
      label: "Week 9",
      date: "6-08-2025 - 6-14-2025",
      reportDate: "6-14-2025",
      body: `## Content Performance & Strategy Update 
- **Facebook**: First written posts have gone out. We are looking to increase volume here as well as adding images to the mix.
- **Interview Clips**: Based off 3 posts with the new style it's underperforming. We will create a new shooting outline for next round of content.
- **BOF vs TOF**: Will be posting more of the meme / worksite ugc to get more eyes on the higher value content.
- **Written stories**: Performing great on youtube and tiktok. We will continue with 3 of these a week.
`,
      totalEngagement: getDataFromWeek("6-14-2025").totalEngagement,
      totalFollowers: getDataFromWeek("6-14-2025").totalFollowers,
      totalPosts: getDataFromWeek("6-14-2025").totalPosts,
    },
    {
      label: "Week 10",
      date: "6-22-2025 - 6-28-2025",
      reportDate: "6-28-2025",
      body: `## Content Performance & Strategy Update 
- **Facebook & Instagram**: Views going up but still not as fast as we'd like. Let's look at verifying accounts and see if that helps. 1 more month and we will look at boosting/ collabs
- **Interview Clips**: New interactive approach will do great on Instagram & Facebook.
- **New series with character**: A new series to replicate the content made by American Blue Collar. Also using the humor from American Blue Collar and inject into meme content.
- **Animated Series**: Hook including blue collar has been proven to work. Double down here. 
- **Written content**: New series with visuals will go out this week. Contents been too vanilla going to take more chances.
`,
      totalEngagement: getDataFromWeek("6-28-2025").totalEngagement,
      totalFollowers: getDataFromWeek("6-28-2025").totalFollowers,
      totalPosts: getDataFromWeek("6-28-2025").totalPosts,
    },
    {
      label: "Week 11",
      date: "6-28-2025 - 7-13-2025",
      reportDate: "7-13-2025",
      body: `## Content Performance & Strategy Update 
- **Verification status**: Business name miss-match. Contacted meta support, will keep you updated
- **Facebook & Instagram**: Still not seeing the growth we want on facebook. Will start to look at collabs and boosting.
- **Youtube**: Animated series is seeing consistent numbers. ready to start adding CTA to videos.
- **Follower goals**: Double instagram followers, 50 on facebook. More Meme low value content to maximize reach. Boosting will help reach  
- **Content update**: 1 week of interview clips left. Ai series will replace this until we get more footage.   
`,
      totalEngagement: getDataFromWeek("7-13-2025").totalEngagement,
      totalFollowers: getDataFromWeek("7-13-2025").totalFollowers,
      totalPosts: getDataFromWeek("7-13-2025").totalPosts,
    },
    {
      label: "Week 12",
      date: "7-13-2025 - 7-27-2025",
      reportDate: "7-27-2025",
      body: `## Content Performance & Strategy Update 
- **Instagram, Tiktok, and Youtube**: Seeing improved reach with TOF content.
- **Facebook**: Boosted content is ready to be put out. Need control of payments on the platform.
`,
      totalEngagement: getDataFromWeek("7-13-2025").totalEngagement,
      totalFollowers: getDataFromWeek("7-13-2025").totalFollowers,
      totalPosts: getDataFromWeek("7-13-2025").totalPosts,
    },
  ];

  const [selectedReport, setSelectedReport] = useState<Report | null>(
    reports[11]
  );

  console.log("selectedReport", selectedReport);

  const tiktokData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_tiktok.json`) as TikTokPost[];
  const youtubeData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_youtube.json`) as YouTubePost[];
  const instagramData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_instagram.json`) as InstagramPost[];
  const facebookData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_facebook.json`).filter(
      (post: FacebookPost) => post?.isVideo === true
    ) as FacebookPost[];
  const linkedinData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_linkedin.json`) as LinkedInPost[];
  const xData =
    require(`./${params.clientId}/${selectedReport?.reportDate}/dataset_x.json`) as XPost[];

  const Platforms = {
    tiktok: {
      value: "tiktok",
      data: tiktokData,
      icon: TiktokLogo,
      name: "TikTok",
      followers: Number(getFollowers(tiktokData[0], "tiktok")),
      posts: tiktokData.length,
      totalViews: Number(
        tiktokData.reduce((acc, video) => acc + getViews(video, "tiktok"), 0)
      ),
      totalLikes: Number(
        tiktokData.reduce((acc, video) => acc + getLikes(video, "tiktok"), 0)
      ),
      totalComments: Number(
        tiktokData.reduce((acc, video) => acc + getComments(video, "tiktok"), 0)
      ),
      totalShares: Number(
        tiktokData.reduce((acc, video) => acc + getShares(video, "tiktok"), 0)
      ),
    },
    youtube: {
      value: "youtube",
      data: youtubeData,
      icon: YoutubeLogo,
      name: "YouTube",
      followers: Number(getFollowers(youtubeData[0], "youtube")),
      posts: youtubeData.length,
      totalViews:
        Number(
          youtubeData.reduce(
            (acc, video) => acc + getViews(video, "youtube"),
            0
          )
        ) || 0,
      totalLikes:
        Number(
          youtubeData.reduce(
            (acc, video) => acc + getLikes(video, "youtube"),
            0
          )
        ) || 0,
      totalComments:
        Number(
          youtubeData.reduce(
            (acc, video) => acc + getComments(video, "youtube"),
            0
          )
        ) || 0,
      totalShares:
        Number(
          youtubeData.reduce(
            (acc, video) => acc + getShares(video, "youtube"),
            0
          )
        ) || 0,
    },
    instagram: {
      value: "instagram",
      data: instagramData,
      icon: InstagramLogo,
      name: "Instagram",
      followers: 54,
      posts: instagramData.length,
      totalViews:
        Number(
          instagramData.reduce(
            (acc, video) => acc + getViews(video, "instagram"),
            0
          )
        ) || 0,
      totalLikes:
        Number(
          instagramData.reduce(
            (acc, video) => acc + getLikes(video, "instagram"),
            0
          )
        ) || 0,
      totalComments:
        Number(
          instagramData.reduce(
            (acc, video) => acc + getComments(video, "instagram"),
            0
          )
        ) || 0,
      totalShares:
        Number(
          instagramData.reduce(
            (acc, video) => acc + getShares(video, "instagram"),
            0
          )
        ) || 0,
    },
    facebook: {
      value: "facebook",
      data: facebookData,
      icon: FaceBookLogo,
      name: "Facebook",
      followers: 6,
      posts: facebookData.length,
      totalViews:
        Number(
          facebookData.reduce(
            (acc, video) => acc + getViews(video, "facebook"),
            0
          )
        ) || 0,
      totalLikes:
        Number(
          facebookData.reduce(
            (acc, video) => acc + getLikes(video, "facebook"),
            0
          )
        ) || 0,
      totalComments:
        Number(
          facebookData.reduce(
            (acc, video) => acc + getComments(video, "facebook"),
            0
          )
        ) || 0,
      totalShares:
        Number(
          facebookData.reduce(
            (acc, video) => acc + getShares(video, "facebook"),
            0
          )
        ) || 0,
    },

    x: {
      value: "x",
      data: xData,
      icon: XLogo,
      name: "Twitter",
      followers: Number(getFollowers(xData[0], "x")),
      posts: xData.length,
      totalViews:
        Number(xData.reduce((acc, post) => acc + getViews(post, "x"), 0)) || 0,
      totalLikes:
        Number(xData.reduce((acc, post) => acc + getLikes(post, "x"), 0)) || 0,
      totalComments:
        Number(xData.reduce((acc, post) => acc + getComments(post, "x"), 0)) ||
        0,
      totalShares:
        Number(xData.reduce((acc, post) => acc + getShares(post, "x"), 0)) || 0,
    },
    linkedin: {
      value: "linkedin",
      data: linkedinData,
      icon: LinkedInLogo,
      name: "LinkedIn",
      followers: Number(getFollowers(linkedinData[0], "linkedin")),
      posts: linkedinData.length,
      totalViews:
        Number(
          linkedinData.reduce(
            (acc, video) => acc + getViews(video, "linkedin"),
            0
          )
        ) || 0,
      totalLikes:
        Number(
          linkedinData.reduce(
            (acc, video) => acc + getLikes(video, "linkedin"),
            0
          )
        ) || 0,
      totalComments:
        Number(
          linkedinData.reduce(
            (acc, video) => acc + getComments(video, "linkedin"),
            0
          )
        ) || 0,
      totalShares:
        Number(
          linkedinData.reduce(
            (acc, video) => acc + getShares(video, "linkedin"),
            0
          )
        ) || 0,
    },
  };

  const clientInfo = clients.find((c: any) => c.value === params.clientId);

  const [clientViewData, setClientViewData] = useState<ClientVideoData[]>([]);

  useEffect(() => {
    const clientViewDataQuery = query(
      collection(db, `client-access/${clientInfo?.value}/videos`)
    );
    const unsubscribe = onSnapshot(clientViewDataQuery, (querySnapshot) => {
      const clientViewDataLocal: ClientVideoData[] = [];
      querySnapshot.forEach((doc) => {
        clientViewDataLocal.push(doc.data() as ClientVideoData);
      });
      setClientViewData(clientViewDataLocal);
    });
    return () => unsubscribe();
  }, [clientInfo]);

  const [clientLinkData, setClientLinkData] = useState<any[] | undefined>();

  useEffect(() => {
    const clientLinkDataQuery = doc(
      db,
      `client-access/${clientInfo?.value}/info/links`
    );
    getDoc(clientLinkDataQuery).then((doc) => {
      setClientLinkData(doc.data() as any[]);
    });
  }, [clientInfo]);

  const handleReportChange = (report: Report) => {
    setSelectedReport(report);
  };

  const isNextReport = () => {
    const index = reports.findIndex((r) => r.date === selectedReport?.date);
    if (index === reports.length - 1) {
      return reports[0];
    }
    return reports[index + 1];
  };

  const isPreviousReport = () => {
    const index = reports.findIndex((r) => r.date === selectedReport?.date);
    if (index === 0) {
      return reports[reports.length - 1];
    }
    return reports[index - 1];
  };

  const chartDataEngagement = reports.map((week) => ({
    week: week.label,
    data: getDataFromWeek(week.reportDate).totalEngagement,
  }));

  const chartDataFollowers = reports.map((week) => ({
    week: week.label,
    data: getDataFromWeek(week.reportDate).totalFollowers,
  }));

  const chartDataPosts = reports.map((week) => ({
    week: week.label,
    data: getDataFromWeek(week.reportDate).totalPosts,
  }));

  const exportAsCSV = () => {
    // Create CSV header
    const headers = [
      "Platform",
      "Followers",
      "Posts",
      "Views",
      "Likes",
      "Comments",
      "Shares",
    ];

    // Create CSV rows for each platform
    const rows = Object.values(Platforms).map((platform) => [
      platform.name,
      platform.followers,
      platform.posts,
      platform.totalViews,
      platform.totalLikes,
      platform.totalComments,
      platform.totalShares,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${clientInfo?.label}_report_${selectedReport?.reportDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    // Create JSON data structure
    const jsonData = {
      client: clientInfo?.label,
      reportDate: selectedReport?.reportDate,
      platforms: Object.values(Platforms).map((platform) => ({
        name: platform.name,
        followers: platform.followers,
        posts: platform.posts,
        totalViews: platform.totalViews,
        totalLikes: platform.totalLikes,
        totalComments: platform.totalComments,
        totalShares: platform.totalShares,
      })),
    };

    // Create and trigger download
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${clientInfo?.label}_report_${selectedReport?.reportDate}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateReport = {
    body: `## What does success look like in 3 months (End of October)?

- Average reach of 5,000 on high-value videos (i.e., videos where we can plug or educate about Reins).
- Consistent community engagement (e.g., blue-collar professionals actively commenting and engaging with high value content).
- Clear awareness target signals (webinar signups, website visits, interest emails, or free resource requests).

## What does success look like in 6 months (End of January)?
- Evidence that our content can generate new customers.
- Lead consideration (Meeting schedules, Demo request or Email response)
- To break even on the investment. With an estimated LTV of $10K–$20K, that means Reins has to land 3–6 new customers attributed to BCK within 10 months. (April 2025 to January 2026)
- Calculate target based on expected conversion rate from demo to customer.
- 10k Followers across the big 3 channels (More of a vanity metric but aligns with the goal growth rate and gives us social proof for leads)

## What if we don’t get 3–6 customers within 6 months?
- We’re fully committed to delivering a return on your investment. If we fall short, we’ll continue creating content at no cost until we hit that goal. 
- In addition to these macro goals, we’ll set monthly micro-goals to ensure we’re tracking toward the bigger picture and can make real-time optimizations.

## New Pricing:
- 3-month commitment at $6K, with a performance review and reevaluation at the end of the term.
  `,
  };

  return (
    <>
      <Background />
      <div className="px-4 md:container pb-6 text-white">
        <div className="md:flex-row flex-col flex gap-4 items-center  justify-between p-4 px-0 top-0 left-0   w-full  z-20">
          <div className="flex gap-4 items-center">
            {clientInfo?.icon && (
              <clientInfo.icon className="h-8 w-8 ring-[2px] rounded-[8px] ring-white/10 ring-offset-[#0F1116] ring-offset-[4px] " />
            )}
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {clientInfo?.label}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-white/15 hover:bg-white/15 gap-2 border border-white/10 hover:border-[rgba(52,244,175)] transition-all duration-300  focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 ring-offset-0 ">
                Export Data
                <Icons.download2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/10 blurBack text-white border-white/10">
              <DropdownMenuLabel>Export as</DropdownMenuLabel>
              <DropdownMenuItem onClick={exportAsCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsJSON}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <SettingsButtons /> */}
        </div>
        <div className="mb-4">
          <ReportBody selectedReport={updateReport as Report} />
        </div>
        {selectedReport && <ReportBody selectedReport={selectedReport} />}
        <div className="grid md:grid-cols-3 gap-4">
          <Chart
            chartData={chartDataEngagement}
            title="Engagement"
            description="Combined Engagement by week"
            label="Engagement"
          />
          <Chart
            chartData={chartDataFollowers}
            title="Followers"
            description="Combined Followers by week"
            label="Followers"
          />
          <Chart
            chartData={chartDataPosts}
            title="Posts"
            description="Combined Post volume by week"
            label="Posts"
          />
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex flex-col md:flex-row justify-between w-full">
            <h1 className="text-2xl font-bold mb-2">Stats</h1>
            <div className="flex gap-1 items-center">
              <Button
                variant="ghost"
                onClick={() => handleReportChange(isPreviousReport())}
              >
                <Icons.chevronLeft className="h-5 w-5" />
              </Button>

              <h1 className="text-lg md:text-2xl whitespace-nowrap font-bold flex items-center gap-2">
                {selectedReport?.label}
                <span className="text-sm text-white/40">
                  ({selectedReport?.date})
                </span>
              </h1>

              <Button
                variant="ghost"
                onClick={() => handleReportChange(isNextReport())}
              >
                <Icons.chevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div
              id="total-engagement"
              className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center"
            >
              <h1 className="text-2xl ">Total Engagement</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {selectedReport &&
                  formatNumber(
                    getDataFromWeek(selectedReport.reportDate).totalEngagement
                  )}
              </h1>
            </div>
            <div className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center">
              <h1 className="text-2xl ">Total Followers</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {selectedReport &&
                  formatNumber(
                    getDataFromWeek(selectedReport.reportDate).totalFollowers
                  )}
              </h1>
            </div>

            <div className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center">
              <h1 className="text-2xl ">Total Posts</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {selectedReport &&
                  formatNumber(
                    getDataFromWeek(selectedReport.reportDate).totalPosts
                  )}
              </h1>
            </div>
          </div>
        </div>
        <div defaultValue="videos" className="w-full relative z-10 mt-4">
          <PlatformView Platforms={Platforms} clientLinkData={clientLinkData} />
          <VideoTab
            clientInfo={clientInfo}
            Platforms={Platforms}
            clientViewData={clientViewData}
          />
        </div>
      </div>
    </>
  );
};

export default ReportPage;

const PlatformView = ({
  Platforms,
  clientLinkData,
}: {
  Platforms: any;
  clientLinkData: any[] | undefined;
}) => {
  console.log("clientLinkData", clientLinkData);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Stats by Platform</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.values(Platforms).map((platform: any) => (
            <Link
              key={platform.name}
              href={clientLinkData ? clientLinkData[platform.value] : ""}
              target="_blank"
              className="p-4 rounded-lg md:flex-row flex-col flex justify-between border border-white/10 bg-white/5 h-fit items-start md:items-center hover:border-[rgba(52,244,175)] transition-all duration-300 gap-2"
            >
              <div className="flex items-center gap-2 ">
                {React.createElement(platform.icon, {
                  className: "h-5 w-5  fill-foreground",
                })}
                <h3 className="font-semibold ">{platform.name}</h3>
              </div>
              <div className=" text-sm text-white grid grid-cols-3 gap-2">
                <p className="flex gap-1 items-center justify-center">
                  Followers:{" "}
                  <span className="font-bold text-[rgba(52,244,175)]">
                    {formatNumber(platform.followers)}
                  </span>
                </p>
                <p className="flex gap-1 items-center justify-center">
                  Posts:{" "}
                  <span className="font-bold text-[rgba(52,244,175)]">
                    {formatNumber(platform.posts)}
                  </span>
                </p>
                <p className="flex gap-1 items-center justify-center">
                  Views:{" "}
                  <span className="font-bold text-[rgba(52,244,175)]">
                    {formatNumber(platform.totalViews)}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoTab = ({
  clientInfo,
  Platforms,
  clientViewData,
}: {
  clientInfo: any;
  Platforms: any;
  clientViewData: ClientVideoData[];
}) => {
  const [selectedVideo, setSelectedVideo] = useState<ClientVideoData | null>(
    clientViewData[clientViewData.length - 1]
  );

  useEffect(() => {
    setSelectedVideo(clientViewData[clientViewData.length - 1]);
  }, [clientViewData]);

  console.log("clientViewData", clientViewData[0], selectedVideo);

  const getTotalViews = () => {
    let totalViews = 0;
    Object.keys(Platforms).forEach((platform) => {
      const platformData = Platforms[platform];

      const postData = platformData.data.find(
        (post: any) =>
          getId(post, platform) ===
          (
            selectedVideo?.[platform as keyof ClientVideoData] as
              | {id: string; link: string}
              | undefined
          )?.id
      );
      const views = getViews(postData, platform);
      console.log("views", views);
      console.log("postData", postData);
      totalViews += Number(views) || 0;
    });
    return totalViews;
  };

  const getTotalLikes = () => {
    let totalLikes = 0;
    Object.keys(Platforms).forEach((platform) => {
      const platformData = Platforms[platform];
      const postData = platformData.data.find(
        (post: any) =>
          getId(post, platform) ===
          (
            selectedVideo?.[platform as keyof ClientVideoData] as
              | {id: string; link: string}
              | undefined
          )?.id
      );
      const likes = getLikes(postData, platform);
      totalLikes += Number(likes) || 0;
    });
    return totalLikes;
  };

  const getTotalComments = () => {
    let totalComments = 0;
    Object.keys(Platforms).forEach((platform) => {
      const platformData = Platforms[platform];
      const postData = platformData.data.find(
        (post: any) =>
          getId(post, platform) ===
          (
            selectedVideo?.[platform as keyof ClientVideoData] as
              | {id: string; link: string}
              | undefined
          )?.id
      );
      const comments = getComments(postData, platform);
      totalComments += Number(comments) || 0;
    });
    return totalComments;
  };

  const getTotalShares = () => {
    let totalShares = 0;
    Object.keys(Platforms).forEach((platform) => {
      const platformData = Platforms[platform];
      const postData = platformData.data.find(
        (post: any) =>
          getId(post, platform) ===
          (
            selectedVideo?.[platform as keyof ClientVideoData] as
              | {id: string; link: string}
              | undefined
          )?.id
      );
      const shares = getShares(postData, platform);
      totalShares += Number(shares) || 0;
    });
    return totalShares;
  };
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold mb-2 h-full ">
        Video Library ({clientViewData.length})
      </h1>

      <div className="flex flex-col gap-2  ">
        <div className="max-w-full bg-white/5 p-2 rounded-md overflow-x-auto w-full md:w-fit">
          <div className=" max-w-full overflow-x-auto h-[200px] md:h-fit gap-2 ">
            <div className="grid grid-cols-5 md:flex gap-2 w-full md:w-fit">
              {[...clientViewData].reverse().map((video) => (
                <div
                  key={video.videoNumber}
                  className="w-full md:min-w-[80px]  aspect-[9/16] "
                >
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full aspect-[9/16] rounded-sm overflow-hidden  transition-all duration-300 ${
                      selectedVideo?.videoNumber === video.videoNumber
                        ? "border-2 border-[rgba(52,244,175)]"
                        : "hover:scale-105 border-2 border-white/10"
                    }`}
                  >
                    <Image
                      alt={video.title || "Video thumbnail"}
                      src={video.thumbnail || ""}
                      title={video.title || ""}
                      className="w-full h-full object-cover "
                      width={50}
                      height={50}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-[300px_1fr] gap-4">
          <div className="w-full aspect-[9/16] relative hidden md:block">
            <VideoPlayer
              videoUrl={selectedVideo?.videoURL || ""}
              title={selectedVideo?.title || ""}
            />
          </div>

          <div className=" h-full">
            <h1 className="text-2xl font-bold mb-2">Selected Video Stats</h1>
            <div className="w-full h-full flex flex-col gap-2">
              <div className="grid md:grid-cols-4 gap-2">
                <div className="flex flex-col p-2 rounded-md bg-white/5 border border-white/10 w-full items-center">
                  <h1 className="text-2xl flex gap-2 items-center">
                    <Eye className="h-4 w-4 text-white" />
                    Views
                  </h1>
                  <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                    {formatNumber(getTotalViews())}
                  </h1>
                </div>
                <div className="flex flex-col p-2 rounded-md bg-white/5 border border-white/10 w-full items-center">
                  <h1 className="text-2xl flex gap-2 items-center">
                    <Heart className="h-4 w-4 text-white" />
                    Likes
                  </h1>
                  <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                    {formatNumber(getTotalLikes())}
                  </h1>
                </div>
                <div className="flex flex-col p-2 rounded-md bg-white/5 border border-white/10 w-full items-center">
                  <h1 className="text-2xl flex gap-2 items-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                    Comments
                  </h1>
                  <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                    {formatNumber(getTotalComments())}
                  </h1>
                </div>
                <div className="flex flex-col p-2 rounded-md bg-white/5 border border-white/10 w-full items-center">
                  <h1 className="text-2xl flex gap-2 items-center">
                    <Share className="h-4 w-4 text-white" />
                    Shares
                  </h1>
                  <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                    {formatNumber(getTotalShares())}
                  </h1>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.keys(Platforms).map((platform: any) => {
                  if (!selectedVideo?.[platform as keyof ClientVideoData])
                    return null;

                  const platformData = Platforms[platform];
                  const Icon = platformData.icon;

                  const postData = platformData.data.find(
                    (post: any) =>
                      getId(post, platform) ===
                      (
                        selectedVideo?.[platform as keyof ClientVideoData] as
                          | {id: string; link: string}
                          | undefined
                      )?.id
                  );

                  const views = getViews(postData, platform);
                  const likes = getLikes(postData, platform);
                  const comments = getComments(postData, platform);
                  const shares = getShares(postData, platform);

                  return (
                    <Link
                      href={
                        (
                          selectedVideo?.[platform as keyof ClientVideoData] as
                            | {id: string; link: string}
                            | undefined
                        )?.link || ""
                      }
                      target="_blank"
                      key={platform}
                      className="group"
                    >
                      <div className="flex md:flex-row flex-col justify-between gap-2 text-white border border-white/10 p-2 rounded-md group-hover:border-[rgba(52,244,175)] transition-all duration-300">
                        <div className="flex gap-2 items-center">
                          <Icon className="h-5 w-5 fill-white" />
                          <h1 className="text-lg font-bold">
                            {platformData.name}
                          </h1>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="flex gap-1 items-center">
                            <Eye className="h-4 w-4 text-white" />
                            <span className="text-sm ">{views}</span>
                          </span>
                          <span className="flex gap-1 items-center">
                            <Heart className="h-4 w-4 text-white" />
                            <span className="text-sm ">{likes}</span>
                          </span>
                          <span className="flex gap-1 items-center">
                            <MessageCircle className="h-4 w-4 text-white" />
                            <span className="text-sm ">{comments}</span>
                          </span>

                          {shares !== "unavailable" && (
                            <span className="flex gap-1 items-center">
                              <Share className="h-4 w-4 text-white" />
                              <span className="text-sm ">{shares}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
