import {notFound, permanentRedirect} from "next/navigation";
import ReactDOM from "react-dom";
import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {constructMetadata} from "@/lib/utils";
import {baseSlugFromName, isNumericPostIdParam} from "@/lib/slug";
import ScrollToTop from "./scrollToTop"; // imported scroll to top

import VideoPage from "./video-page";
import {
  getLaunchLibraryCatalog,
  getLaunchVideoByPostId,
  getLaunchVideoBySlug,
  launchLibraryThumbnailUrl,
} from "@/lib/launch-library/catalog";
import {buildRelatedVideos} from "../../data/related-videos";
import type {VideoData} from "../../data/types";
import {
  absoluteMediaUrl,
  buildLaunchVideoJsonLd,
  buildLaunchVideoMetaDescription,
  buildLaunchVideoOgDescription,
} from "../../data/video-seo";

// Cache rendered video pages (ISR); pages are generated on first visit.
export const revalidate = 600;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{slug: string}>;
};

/** SEO tags need a real image URL, not the stored base64 data URI. */
function withSeoThumbnail(video: VideoData): VideoData {
  return {
    ...video,
    thumbnail: launchLibraryThumbnailUrl(video.postId, video.thumbnail),
  };
}

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
    video = await getLaunchVideoByPostId(slug);
  } else {
    video = await getLaunchVideoBySlug(slug);
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
  const ogImage = absoluteMediaUrl(withSeoThumbnail(video).thumbnail, origin);
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
    const byId = await getLaunchVideoByPostId(slug);

    if (byId) {
      const canonical = byId.slug?.trim() || baseSlugFromName(byId.name);
      permanentRedirect(`/launch-library/${canonical}`);
    }

    notFound();
  }

  const [video, catalog] = await Promise.all([
    getLaunchVideoBySlug(slug),
    getLaunchLibraryCatalog(),
  ]);

  if (!video) {
    notFound();
  }

  // Open the connection to the video host while the page is still loading.
  if (video.videoUrl) {
    ReactDOM.preconnect(new URL(video.videoUrl).origin, {
      crossOrigin: "anonymous",
    });
  }

  const related = buildRelatedVideos(video, catalog);

  const origin = siteOrigin();
  const pathSlug = video.slug?.trim() || slug;
  const canonicalUrl = `${origin}/launch-library/${pathSlug}`;
  const jsonLd = buildLaunchVideoJsonLd(
    withSeoThumbnail(video),
    canonicalUrl,
    origin,
  );

  return (
    <>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <VideoPage video={video} related={related} />
        <Footer />
      </div>
    </>
  );
}
