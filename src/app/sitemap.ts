import type {MetadataRoute} from "next";
import {BlogPost} from "@/config/data";
import {convertTimestampToDate} from "@/lib/utils";
type BlogPostResponse = {
  posts: BlogPost[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
    {
      cache: "no-cache",
    }
  );
  const {posts}: BlogPostResponse = await response.json();

  const livePosts = posts.filter((post) => post.published === true);

  const postEntries: MetadataRoute.Sitemap = livePosts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.path}`,
    lastModified: new Date(convertTimestampToDate(post.createdAt)),
    // changeFrequency: "yearly",
    // priority: 1,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/content-plan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/work-with-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/case-study/blaze`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/case-study/morty`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/case-study/founderCentral`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postEntries,
  ];
}
