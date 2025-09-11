// app/(marketing)/blog/[blogPath]/page.tsx
import type {Metadata} from "next";
import React from "react";
import {NavBar} from "../../navbar";
import {Footer} from "../../footer";
import BlogBody from "@/src/app/(marketing)/blog/[blogPath]/blog-body";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";
import axios from "axios";

async function getPost(path: string) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-post`,
      {blogPath: path}
    );
    const postData: BlogPost = res.data.response;
    if (!postData) notFound();
    return postData;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

// export function generateStaticParams(): {blogPath: string}[] {
//   return [
//     {
//       blogPath:
//         "the-ultimate-guide-to-crafting-a-winning-social-media-marketing-strategy",
//     },
//     {
//       blogPath:
//         "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
//     },
//     {blogPath: "the-start-of-a-10m-impression-marketing-agency"},
//   ];
// }

// ✅ Properly type params; do NOT await it
export async function generateMetadata({
  params,
}: {
  params: {blogPath: string};
}): Promise<Metadata> {
  const post = await getPost(params.blogPath);
  return {
    title: `Ripple Media | ${post.title}`,
    description: `${post.description}`,
  };
}

// ✅ Page props: plain object, not a Promise
const Page = async ({params}: {params: {blogPath: string}}) => {
  const postData = await getPost(params.blogPath);
  return (
    <div className="flex flex-col h-fit min-h-screen">
      <NavBar />
      <div className="min-w-screen flex flex-col overflow-hidden">
        <BlogBody post={postData} />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};
