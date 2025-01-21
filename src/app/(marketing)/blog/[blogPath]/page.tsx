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
  //   return   {  author: {
  //     name: 'Adam Holton',
  //     id: 'x9h3UepduwQHoCkwUh7bPGqEeTj2',
  //     avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLamLj6u8Uclu3ysiE8A9FAgW9m0PFP7HJqJe637_VTQJQfdT8l=s96-c'
  //   },
  //   createdAt: { seconds: 1734323052, nanoseconds: 89000000 },
  //   content: { version: '2.29.1', time: 1734330200177, blocks: [Array] },
  //   description: 'In today’s 8-second attention economy, capturing consumer focus is harder than ever, with social media and short-form video dominating the digital landscape. Platforms like TikTok, Instagram Reels, and YouTube Shorts offer startups a cost-effective way to compete, delivering high ROI with creative, engaging content. To stay relevant and thrive, businesses must act now to leverage these tools and connect authentically with audiences.',
  //   id: 'kN4mJuWXJuR0q8sVhF0o',
  //   image: 'https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video-concepts%2Fpatty_a_dark_green_blue_purple_pink_neon_style_illustration_o_b157dab4-c9a8-42b3-9c9b-21e1f67bcec4_2.png?alt=media&token=57acb587-5f0f-4f15-810a-54712070ab22',
  //   title: 'Consumers have smaller attention spans than Goldfish: How to Win at Marketing',
  //   length: 5,
  //   category: 'Marketing',
  //   published: true,

  //   updatedAt: {
  //     seconds: 1734330200,
  //     nanoseconds: 386000000
  //   } ,
  // tags: ['marketing', 'social media', 'startups'],
  // path: 'consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing'
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
