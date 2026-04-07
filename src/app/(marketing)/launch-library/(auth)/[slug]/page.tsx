import {notFound, permanentRedirect} from "next/navigation";
import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {constructMetadata} from "@/lib/utils";
import {baseSlugFromName, isNumericPostIdParam} from "@/lib/slug";
import ScrollToTop from "./scrollToTop"; // imported scroll to top

import VideoPage from "./video-page";
import {
  getLaunchLibraryVideoByPostId,
  getLaunchLibraryVideoBySlug,
} from "../../data/get-launch-video";
import {
  absoluteMediaUrl,
  buildLaunchVideoJsonLd,
  buildLaunchVideoMetaDescription,
  buildLaunchVideoOgDescription,
} from "../../data/video-seo";

type Props = {
  params: Promise<{slug: string}>;
};

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ripple-media.com"
  );
}

export async function generateMetadata({params}: Props) {
  const {slug: rawSlug} = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  let video = null;

  if (isNumericPostIdParam(slug)) {
    video = await getLaunchLibraryVideoByPostId(slug);
  } else {
    video = await getLaunchLibraryVideoBySlug(slug);
  }

  if (!video) {
    return constructMetadata({
      title: "Video not found — Launch Library",
      description: "Launch library video",
    });
  }

  const origin = siteOrigin();
  const pathSlug = video.slug?.trim() || slug;
  const canonicalUrl = `${origin}/launch-library/${pathSlug}`;
  const ogImage = absoluteMediaUrl(video.thumbnail, origin);
  const description = buildLaunchVideoMetaDescription(video);
  const openGraphDescription = buildLaunchVideoOgDescription(video);

  const base = constructMetadata({
    title: `${video.name} — Launch Library`,
    description,
    image: ogImage,
  });

  return {
    ...base,
    alternates: {canonical: canonicalUrl},
    openGraph: {
      ...base.openGraph,
      description: openGraphDescription,
      url: canonicalUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${video.name} — Launch Library`,
      description: openGraphDescription,
      images: [ogImage],
    },
  };
}

export default async function Page({params}: Props) {
  const {slug: rawSlug} = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  if (isNumericPostIdParam(slug)) {
    const byId = await getLaunchLibraryVideoByPostId(slug);

    if (byId) {
      const canonical = byId.slug?.trim() || baseSlugFromName(byId.name);
      permanentRedirect(`/launch-library/${canonical}`);
    }

    notFound();
  }

  // const [video, allVideos] = await Promise.all([
  //   getLaunchLibraryVideoBySlug(slug),
  //   getLaunchLibraryVideos(),
  // ]);

  const [video] = await Promise.all([getLaunchLibraryVideoBySlug(slug)]);

  if (!video) {
    notFound();
  }

  const origin = siteOrigin();
  const pathSlug = video.slug?.trim() || slug;
  const canonicalUrl = `${origin}/launch-library/${pathSlug}`;
  const jsonLd = buildLaunchVideoJsonLd(video, canonicalUrl, origin);

  return (
    <>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <VideoPage video={video} />
        <Footer />
      </div>
    </>
  );
}
