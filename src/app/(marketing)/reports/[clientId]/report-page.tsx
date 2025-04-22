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
import Background from "@/src/app/(marketing)/components/background";
import ReportBody from "./report-body";
import {Button} from "@/components/ui/button";

const getId = (data: any, platformId: string) => {
  return platformId === "facebook"
    ? data.postId
    : platformId === "linkedin"
    ? data?.linkedinVideo?.videoPlayMetadata?.trackingId
    : data.id;
};

const getViews = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.playCount
    : platform === "youtube"
    ? post?.viewCount
    : platform === "instagram"
    ? post?.videoPlayCount
    : platform === "x"
    ? post?.viewCount
    : platform === "facebook"
    ? post?.viewsCount
    : platform === "linkedin"
    ? post?.numLikes
    : "unavailable";
};

const getLikes = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.diggCount
    : platform === "youtube"
    ? post?.likes
    : platform === "instagram"
    ? post?.likesCount
    : platform === "x"
    ? post?.likeCount
    : platform === "facebook"
    ? post?.likes
    : platform === "linkedin"
    ? post?.numLikes
    : "unavailable";
};

const getComments = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.commentCount
    : platform === "youtube"
    ? post?.commentsCount
    : platform === "instagram"
    ? post?.commentsCount
    : platform === "x"
    ? post?.replyCount
    : platform === "facebook"
    ? post?.topReactionsCount
    : platform === "linkedin"
    ? post?.numComments
    : "unavailable";
};

const getShares = (post: any, platform: string) => {
  return platform === "tiktok"
    ? post?.shareCount
    : platform === "facebook"
    ? post?.shares
    : platform === "linkedin"
    ? post?.numShares
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
  };

  const reports: Report[] = [
    {
      label: "Week 1 Report",
      date: "4-03-2025 - 4-13-2025",
      reportDate: "4-13-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we’ll consider launching a new series specifically optimized for Facebook.
`,
    },
    {
      label: "Week 2 Report",
      date: "4-13-2025 - 4-20-2025",
      reportDate: "4-20-2025",
      body: `## Content Performance & Strategy Update 

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we’ll consider launching a new series specifically optimized for Facebook.
`,
    },
  ];

  const [selectedReport, setSelectedReport] = useState<Report | null>(
    reports[1]
  );

  const tiktokData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_tiktok.json`) as TikTokPost[];
  const youtubeData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_youtube.json`) as YouTubePost[];
  const instagramData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_instagram.json`) as InstagramPost[];
  const facebookData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_facebook.json`).filter(
      (post: FacebookPost) => post?.isVideo === true
    ) as FacebookPost[];
  const linkedinData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_linkedin.json`) as LinkedInPost[];
  const xData =
    require(`@/public/reports/${params.clientId}/${selectedReport?.reportDate}/dataset_x.json`) as XPost[];

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
      followers: 18,
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
      followers: 3,
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
  };

  const clientInfo = clients.find((c: any) => c.value === params.clientId);

  const totalViews =
    Platforms.tiktok.totalViews +
    Platforms.youtube.totalViews +
    Platforms.instagram.totalViews +
    Platforms.facebook.totalViews +
    Platforms.linkedin.totalViews +
    Platforms.x.totalViews;
  const totalLikes =
    Platforms.tiktok.totalLikes +
    Platforms.youtube.totalLikes +
    Platforms.instagram.totalLikes +
    Platforms.facebook.totalLikes +
    Platforms.linkedin.totalLikes +
    Platforms.x.totalLikes;
  const totalComments =
    Platforms.tiktok.totalComments +
    Platforms.youtube.totalComments +
    Platforms.instagram.totalComments +
    Platforms.facebook.totalComments +
    Platforms.linkedin.totalComments +
    Platforms.x.totalComments;
  const totalShares =
    Platforms.tiktok.totalShares +
    Platforms.youtube.totalShares +
    Platforms.instagram.totalShares +
    Platforms.facebook.totalShares +
    Platforms.linkedin.totalShares +
    Platforms.x.totalShares;

  const totalFollowers =
    Platforms.tiktok.followers +
    Platforms.youtube.followers +
    Platforms.instagram.followers +
    Platforms.facebook.followers +
    Platforms.linkedin.followers +
    Platforms.x.followers;

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

  return (
    <>
      <Background />
      <div className="px-4 md:container pb-6">
        <div className="md:flex-row flex-col flex gap-4 items-center  justify-between p-4 top-0 left-0   w-full  z-20">
          <div className="flex gap-4 items-center">
            {clientInfo?.icon && (
              <clientInfo.icon className="h-8 w-8 ring-[2px] rounded-[8px] ring-white/10 ring-offset-[#0F1116] ring-offset-[4px] " />
            )}
            <h1 className="text-2xl md:text-4xl font-bold">
              {clientInfo?.label}
            </h1>
          </div>
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

          {/* <SettingsButtons /> */}
        </div>

        {selectedReport && <ReportBody selectedReport={selectedReport} />}

        <div className="flex flex-col gap-2 mt-6">
          <h1 className="text-2xl font-bold mb-2">Stats</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center">
              <h1 className="text-2xl ">Total Engagement</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {formatNumber(
                  totalViews + totalLikes + totalComments + totalShares
                )}
              </h1>
            </div>
            <div className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center">
              <h1 className="text-2xl ">Total Followers</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {formatNumber(totalFollowers)}
              </h1>
            </div>

            <div className="flex flex-col p-2 rounded-md border border-white/10 bg-white/5 w-full items-center">
              <h1 className="text-2xl ">Videos Posted</h1>
              <h1 className="text-2xl font-bold text-[rgba(52,244,175)]">
                {clientViewData.length}
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
                <p className="flex gap-2 items-center justify-center">
                  Followers:{" "}
                  <span className="font-bold text-[rgba(52,244,175)]">
                    {formatNumber(platform.followers)}
                  </span>
                </p>
                <p className="flex gap-2 items-center justify-center">
                  Posts:{" "}
                  <span className="font-bold text-[rgba(52,244,175)]">
                    {formatNumber(platform.posts)}
                  </span>
                </p>
                <p className="flex gap-2 items-center justify-center">
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
    clientViewData[0]
  );

  useEffect(() => {
    setSelectedVideo(clientViewData[0]);
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
          <div className="grid grid-cols-5  md:flex h-fit gap-2 ">
            {clientViewData.map((video) => (
              <div key={video.videoNumber} className="w-[50px] aspect-[9/16] ">
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
