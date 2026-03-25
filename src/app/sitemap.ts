import type {MetadataRoute} from "next";
import {BlogPost} from "@/config/data";
import {convertTimestampToDate} from "@/lib/utils";
import fieldDescriptions from "./(marketing)/launch-library/data/field-descriptions.json";

type BlogPostResponse = {
  posts: BlogPost[];
};

type FieldDescriptions = Record<
  string,
  Record<
    string,
    {
      label: string;
      description: string;
    }
  >
>;

const typedFieldDescriptions = fieldDescriptions as FieldDescriptions;

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-site.com";
}

function buildLaunchLibraryFieldEntries(
  siteUrl: string,
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const [fieldCategory, values] of Object.entries(
    typedFieldDescriptions,
  )) {
    for (const slug of Object.keys(values)) {
      entries.push({
        url: `${siteUrl}/launch-library/${fieldCategory}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

async function buildLaunchLibrarySlugEntries(
  siteUrl: string,
): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${siteUrl}/api/fetch-launch-library-slugs`, {
    cache: "no-cache",
  });

  if (!response.ok) return [];

  const data = (await response.json()) as {
    entries?: Array<{
      slug: string;
      lastModified: string | null;
    }>;
  };

  return (data.entries ?? []).map((entry) => ({
    url: `${siteUrl}/launch-library/${entry.slug}`,
    lastModified: entry.lastModified
      ? new Date(entry.lastModified)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [blogResponse, launchLibrarySlugEntries] = await Promise.all([
    fetch(`${siteUrl}/api/fetch-blog-posts`, {
      cache: "no-cache",
    }),
    buildLaunchLibrarySlugEntries(siteUrl),
  ]);

  const {posts}: BlogPostResponse = await blogResponse.json();

  const livePosts = posts.filter((post) => post.published === true);

  const postEntries: MetadataRoute.Sitemap = livePosts.map((post) => ({
    url: `${siteUrl}/blog/${post.path}`,
    lastModified: new Date(convertTimestampToDate(post.createdAt)),
  }));

  const launchLibraryFieldEntries = buildLaunchLibraryFieldEntries(siteUrl);

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/content-plan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/work-with-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/launch-library`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...launchLibraryFieldEntries,
    ...launchLibrarySlugEntries,
    ...postEntries,
  ];
}
