import React from "react";
import type {Metadata} from "next";
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
      {
        blogPath: path,
      }
    );

    const postData: BlogPost = res.data.response;

    if (!postData) notFound();
    return postData;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

export async function generateStaticParams() {
  // manually adding the blog posts for now --------------------------------------------
  return [
    {
      blogPath:
        "the-ultimate-guide-to-crafting-a-winning-social-media-marketing-strategy",
    },
    {
      blogPath:
        "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
    },
    {
      blogPath: "the-start-of-a-10m-impression-marketing-agency",
    },
  ];
  // --------------------------------------------------------------------
  // this is for auto generating the blog posts
  // try {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
  //     {
  //       cache: "no-cache",
  //     }
  //   );

  //   if (!res.ok) {
  //     console.error(
  //       `Failed to fetch blog posts: ${res.status} ${res.statusText}`
  //     );
  //     return []; // Return an empty array to avoid build failure
  //   }

  //   const posts = await res.json();

  //   return posts.posts.map((postId: any) => ({
  //     blogPath: postId.path,
  //   }));
  // } catch (error) {
  //   console.error("Error fetching blog posts:", error);
  //   return []; // Handle the case where fetch fails
  // }
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = props?.params?.then
    ? await props.params
    : props.params;
  const post = await getPost(resolvedParams.blogPath);

  return {
    title: `Ripple Media | ${post.title}`,
    description: `${post.description}`,
  };
}

export default async function Page({params}: {params: {blogPath: string}}) {
  console.log("params::", params);
  const postData = await getPost(params.blogPath);

  return (
    <div className="flex flex-col h-fit min-h-screen">
      <NavBar />
      <div className="   min-w-screen   flex flex-col  overflow-hidden">
        <BlogBody post={postData} />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
