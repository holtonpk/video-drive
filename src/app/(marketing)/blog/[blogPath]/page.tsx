import React from "react";
import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import BlogBody from "@/src/app/(marketing)/blog/[blogPath]/blog-body";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";

async function getPost(path: string) {
  try {
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

    if (!res.ok) {
      console.error(
        `Failed to fetch blog post: ${res.status} ${res.statusText}`
      );
      notFound();
    }

    const resData = await res.json();
    const postData: BlogPost = resData.response;

    if (!postData) notFound();
    return postData;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

export async function generateStaticParams() {
  return [
    {
      blogPath:
        "the-ultimate-guide-to-crafting-a-winning-social-media-marketing-strategy",
    },
    {
      blogPath:
        "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
    },
  ];
}

export default async function Page({params}: {params: {blogPath: string}}) {
  console.log("params::", params);
  const postData = await getPost(params.blogPath);

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
