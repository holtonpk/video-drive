import React from "react";

import {Metadata} from "next";
import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import BlogBody from "@/src/app/(marketing)/blog/[blogPath]/blog-body";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";

async function getPost(path: string) {
  // Call an external API endpoint to get posts
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

  const resData = await res.json();

  const postData: BlogPost = resData.response;

  if (!postData) notFound();
  return postData;
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
    {
      cache: "no-cache",
    }
  );
  const posts = await res.json();

  return posts.posts.map((postId: any) => ({
    blogPath: postId.path,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{blogPath: string}>;
}) {
  const {blogPath} = await params;
  const post = await getPost(blogPath);

  return {
    title: `Whitespace | ${post.title}`,
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
