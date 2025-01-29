import React from "react";
import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import BlogBody from "@/src/app/(marketing)/blog/[blogPath]/blog-body";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";

async function getPost(path: string) {
  console.log(
    "R%%%%%%%:",
    process.env.NEXT_PUBLIC_SITE_URL + "/api/fetch-blog-post"
  );
  // return {
  //   author: {
  //     name: "Adam Holton",
  //     id: "x9h3UepduwQHoCkwUh7bPGqEeTj2",
  //     avatar:
  //       "https://lh3.googleusercontent.com/a/ACg8ocLamLj6u8Uclu3ysiE8A9FAgW9m0PFP7HJqJe637_VTQJQfdT8l=s96-c",
  //   },
  //   createdAt: {seconds: 1734323052, nanoseconds: 89000000},
  //   content: {version: "2.29.1", time: 1734330200177, blocks: [Array]},
  //   description:
  //     "In today’s 8-second attention economy, capturing consumer focus is harder than ever, with social media and short-form video dominating the digital landscape. Platforms like TikTok, Instagram Reels, and YouTube Shorts offer startups a cost-effective way to compete, delivering high ROI with creative, engaging content. To stay relevant and thrive, businesses must act now to leverage these tools and connect authentically with audiences.",
  //   id: "kN4mJuWXJuR0q8sVhF0o",
  //   image:
  //     "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video-concepts%2Fpatty_a_dark_green_blue_purple_pink_neon_style_illustration_o_b157dab4-c9a8-42b3-9c9b-21e1f67bcec4_2.png?alt=media&token=57acb587-5f0f-4f15-810a-54712070ab22",
  //   title:
  //     "Consumers have smaller attention spans than Goldfish: How to Win at Marketing",
  //   length: 5,
  //   category: "Marketing",
  //   published: true,

  //   updatedAt: {
  //     seconds: 1734330200,
  //     nanoseconds: 386000000,
  //   },
  //   tags: ["marketing", "social media", "startups"],
  //   path: "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
  // };

  // return {
  //   id: "kN4mJuWXJuR0q8sVhF0o",
  //   author: {
  //     name: "Adam Holton",
  //     id: "x9h3UepduwQHoCkwUh7bPGqEeTj2",
  //     avatar:
  //       "https://lh3.googleusercontent.com/a/ACg8ocLamLj6u8Uclu3ysiE8A9FAgW9m0PFP7HJqJe637_VTQJQfdT8l=s96-c",
  //   },
  //   tags: ["social media", "startups", "marketing"],
  //   description:
  //     "In today’s 8-second attention economy, capturing consumer focus is harder than ever, with social media and short-form video dominating the digital landscape. Platforms like TikTok, Instagram Reels, and YouTube Shorts offer startups a cost-effective way to compete, delivering high ROI with creative, engaging content. To stay relevant and thrive, businesses must act now to leverage these tools and connect authentically with audiences.",
  //   length: 10,
  //   title:
  //     "Consumers have smaller attention spans than Goldfish: How to Win at Marketing",
  //   createdAt: {seconds: 1734323052, nanoseconds: 89000000},
  //   content: {
  //     time: 1737085593535,
  //     blocks: [
  //       {
  //         data: {level: 1, text: "The 8 Second Attention Economy"},
  //         id: "TMq5BSYkOS",
  //         type: "header",
  //       },
  //       {
  //         data: {
  //           text: "In a world of infinite scrolling and constant notifications, the average human attention span has shrunk to just 8 seconds—shorter than the infamous 9-second attention span of a goldfish. This startling comparison demonstrates underscores how modern distractions, from social media to streaming platforms, have reprogrammed the way we consume content. We are bombarded with information, and the competition for attention has never been fiercer.",
  //         },
  //         id: "ntvDR45tnl",
  //         type: "paragraph",
  //       },
  //       {
  //         type: "paragraph",
  //         id: "tnBqdQCdwN",
  //         data: {
  //           text: "The culprit? Our hyper-connected digital lifestyles. Studies show that the average person spends over 4.5 hours daily on their mobile devices, with over a third of that time devoted to social media​. Each scroll, click, and swipe adds to the cacophony of content fighting for a sliver of our focus.&nbsp;",
  //         },
  //       },
  //       {
  //         type: "header",
  //         data: {
  //           text: "The Rise of Social Media and the Dominance of Video Content&nbsp;",
  //           level: 2,
  //         },
  //         id: "t9tWWs6mm7",
  //       },
  //       {
  //         type: "paragraph",
  //         id: "8uc-0-NUIl",
  //         data: {
  //           text: "Social media platforms have quickly become the epicenter of this attention economy. Year after year, social media usage continues to rise, with platforms like TikTok, Instagram, and YouTube leading the charge. In 2023, 87% of U.S. adults reported using social media, with a growing majority spending more time than ever engaging with content​.",
  //         },
  //       },
  //       {
  //         type: "paragraph",
  //         data: {
  //           text: "Within this landscape, video content reigns supreme. Short-form videos, in particular, have become the fastest-growing component of social media, commanding higher engagement rates and longer view times than any other content type. On TikTok, for example, users spend an average of 52 minutes daily, engaging primarily with video content​. Similarly, YouTube Shorts and Instagram Reels are seeing explosive growth, as consumers are enamored by the endless novelty of scrolling their feed.&nbsp;",
  //         },
  //         id: "uVa6_mwHNU",
  //       },
  //       {
  //         type: "header",
  //         id: "pj2pA1Yrj5",
  //         data: {level: 2, text: "Why StartUps Must Act Now"},
  //       },
  //       {
  //         data: {
  //           text: "For startups, short-form video content offers a unique opportunity to compete in the crowded attention economy—without requiring massive budgets. Unlike traditional advertising methods, which can be expensive and time-consuming, short-form content allows startups to connect with audiences quickly, authentically, and at scale.",
  //         },
  //         type: "paragraph",
  //         id: "GVVzke1YHA",
  //       },
  //       {
  //         id: "slsUAMnVNo",
  //         type: "header",
  //         data: {
  //           level: 2,
  //           text: "Cost-Effective Marketing with High ROI - The Virality Factor",
  //         },
  //       },
  //       {
  //         data: {
  //           text: "Short-form videos deliver exceptional returns in comparison to traditional marketing spend. According to the 2024 HubSpot State of Marketing Report, short-form videos provide the highest ROI of all content formats, with 56% of marketers planning to increase their investment in the coming year​.&nbsp;",
  //         },
  //         type: "paragraph",
  //         id: "uhIEeApXa2",
  //       },
  //       {
  //         id: "P_fttvIvAH",
  //         type: "paragraph",
  //         data: {
  //           text: "Platforms like TikTok, Instagram Reels, and YouTube Shorts reward creativity over production budgets. A single well-executed video can reach millions, as these algorithms prioritize engaging content regardless of the creator's follower count. This levels the playing field for startups, enabling them to compete with larger brands and gain visibility without paying for ads.",
  //         },
  //       },
  //       {
  //         id: "KRnI6GGWmL",
  //         type: "header",
  //         data: {level: 2, text: "Engaging Today’s Consumers Where They Are"},
  //       },
  //       {
  //         id: "xchlB_12__",
  //         data: {
  //           text: "Consumers are spending more time on mobile devices than ever, with social media serving as the primary discovery channel. In fact, 33% of consumers say they use social media to learn about new products, and 87% of social media users have made purchases based on platform recommendations in the past year​​. Startups that fail to establish a presence risk missing out on this massive, engaged audience.",
  //         },
  //         type: "paragraph",
  //       },
  //       {
  //         data: {level: 2, text: "The Cost of Inaction"},
  //         id: "pTHi4gIwlm",
  //         type: "header",
  //       },
  //       {
  //         id: "RLnuNeFSop",
  //         data: {
  //           text: "The attention economy waits for no one. As larger brands continue to allocate more resources to short-form content, startups that hesitate risk losing visibility and relevance in an increasingly competitive market. Now is the time to capitalize on this fast-growing medium, build organic audiences, and establish a foothold in the digital landscape.",
  //         },
  //         type: "paragraph",
  //       },
  //       {
  //         id: "q3jRZGbamS",
  //         data: {
  //           level: 2,
  //           text: "Ready to Transform Your Marketing? Let’s Talk.",
  //         },
  //         type: "header",
  //       },
  //       {
  //         data: {
  //           text: "In the past six months, White Space Media has helped our clients generate over 10,000,000 impressions and gain 250,000+ new followers through strategic short-form content. Our talented team of video creators has mastered the art of creating engaging, culturally relevant content that not only stops the scroll but drives real results.",
  //         },
  //         id: "XF9zDkOBKi",
  //         type: "paragraph",
  //       },
  //       {
  //         id: "AUDuQbJj5b",
  //         data: {
  //           text: "Whether you’re looking to amplify your brand awareness, build a loyal audience, or drive conversions, we’re here to help. At White Space Media, we craft content that thrives in today’s attention economy—fast, impactful, and impossible to ignore.",
  //         },
  //         type: "paragraph",
  //       },
  //       {
  //         id: "erjx1Dw-2Z",
  //         type: "paragraph",
  //         data: {
  //           text: "Don’t miss out on the power of short-form content. Schedule a consultation today and discover how we can help you stand out in the crowded digital landscape and unlock your brand’s growth potential",
  //         },
  //       },
  //       {
  //         data: {text: "Sources:&nbsp;", level: 3},
  //         type: "header",
  //         id: "5VNeBCisvM",
  //       },
  //       {
  //         id: "0cNChTzmlA",
  //         type: "paragraph",
  //         data: {text: "2024 HubSpot State of Marketing Report"},
  //       },
  //       {
  //         id: "j9WJuIePGN",
  //         type: "paragraph",
  //         data: {
  //           text: '<a href="https://www.pewresearch.org/internet/2024/01/31/americans-social-media-use/">https://www.pewresearch.org/internet/2024/01/31/americans-social-media-use/</a>',
  //         },
  //       },
  //       {
  //         type: "paragraph",
  //         id: "hqP0bF9viN",
  //         data: {
  //           text: '<a href="https://www.forbes.com/sites/forbesagencycouncil/2017/02/03/video-marketing-the-future-of-content-marketing/#:~:text=According%20to%20YouTube%2C%20mobile%20video%20consumption%20grows,video%20content%20in%20their%20digital%20marketing%20strategies.">Forbes Article</a>',
  //         },
  //       },
  //       {
  //         data: {
  //           text: '<a href="https://datareportal.com/reports/digital-2024-deep-dive-the-time-we-spend-on-social-media#:~:text=Meanwhile%2C%20analysis%20from%20data.ai,category%20rather%20than%20social%20media">https://datareportal.com/reports/digital-2024-deep-dive-the-time-we-spend-on-social-media#:~:text=Meanwhile%2C%20analysis%20from%20data.ai,category%20rather%20than%20social%20media</a>.',
  //         },
  //         id: "8zWIOv4J-x",
  //         type: "paragraph",
  //       },
  //       {
  //         type: "paragraph",
  //         data: {
  //           text: '<a href="https://explodingtopics.com/blog/smartphone-usage-stats">https://explodingtopics.com/blog/smartphone-usage-stats</a>',
  //         },
  //         id: "cYNcv35y02",
  //       },
  //     ],
  //     version: "2.29.1",
  //   },
  //   updatedAt: {seconds: 1737085593, nanoseconds: 635000000},
  //   category: "Marketing",
  //   image:
  //     "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video-concepts%2Fpatty_a_dark_green_blue_purple_pink_neon_style_illustration_o_b157dab4-c9a8-42b3-9c9b-21e1f67bcec4_2.png?alt=media&token=57acb587-5f0f-4f15-810a-54712070ab22",
  //   published: true,
  //   path: "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
  // }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({blogPath: path}),
    }
  );
  console.log("abc####:", res);

  if (!res.ok) {
    console.error(`Failed to fetch blog post: ${res.status} ${res.statusText}`);
    notFound(); // Trigger Next.js 404 page
  }

  try {
    const resData = await res.json();
    const postData: BlogPost = resData.response;

    if (!postData) notFound();
    return postData;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    notFound(); // Trigger 404 if response isn't valid JSON
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
      {
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch blog posts: ${res.status} ${res.statusText}`
      );
      return []; // Return an empty array to avoid build failure
    }

    const posts = await res.json();
    return posts.posts.map((postId: any) => ({
      blogPath: postId.path,
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return []; // Handle the case where fetch fails
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{blogPath: string}>;
}) {
  const {blogPath} = await params;
  const post = await getPost(blogPath);

  return {
    title: `Ripple Media| ${post.title}`,
    description: `${post.description}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{blogPath: string}>;
}) {
  const {blogPath} = await params;
  const postData = await getPost(blogPath);

  console.log("postData===>", postData);

  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <Background />
      <div className="   min-w-screen   flex flex-col  overflow-hidden">
        <Navbar show={true} />
        <BlogBody post={postData} />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
