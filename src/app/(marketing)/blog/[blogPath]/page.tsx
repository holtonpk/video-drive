import React from "react";
import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import BlogBody from "@/src/app/(marketing)/blog/[blogPath]/blog-body";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";

async function getPost(path: string) {
  console.log("R%%%%%%%:", path);
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
