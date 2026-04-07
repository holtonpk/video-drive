import type {VideoData} from "./types";
import {getVideoTags} from "./video-tags";

const SERP_DESC_MAX = 158;
const OG_DESC_MAX = 320;

function truncate(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function primaryBody(video: VideoData): string {
  return (
    video.description?.trim() ||
    video.commentary?.trim() ||
    "YC launch video breakdown and analysis in the Launch Library."
  );
}

/**
 * Meta description for SERPs: primary copy plus tag phrases when they fit.
 */
export function buildLaunchVideoMetaDescription(video: VideoData): string {
  const tags = getVideoTags(video);
  const tagStr = tags
    .map((t) => t.label)
    .slice(0, 10)
    .join(", ");

  const base = primaryBody(video);

  if (!tagStr) {
    return truncate(base, SERP_DESC_MAX);
  }

  const suffix = ` · ${tagStr}`;
  if (base.length + suffix.length <= SERP_DESC_MAX) {
    return base + suffix;
  }

  const room = SERP_DESC_MAX - suffix.length;
  if (room > 48) {
    return truncate(base, room) + suffix;
  }

  return truncate(base, SERP_DESC_MAX);
}

/**
 * Longer Open Graph / Twitter description: description, commentary, and tags.
 */
export function buildLaunchVideoOgDescription(video: VideoData): string {
  const parts: string[] = [];

  if (video.description?.trim()) {
    parts.push(video.description.trim());
  }
  if (video.commentary?.trim()) {
    parts.push(video.commentary.trim());
  }

  const tags = getVideoTags(video);
  if (tags.length) {
    parts.push(tags.map((t) => t.label).join(", "));
  }

  return truncate(parts.join(" — ") || primaryBody(video), OG_DESC_MAX);
}

export function absoluteMediaUrl(
  url: string | null | undefined,
  siteOrigin: string,
): string {
  const fallback = `${siteOrigin.replace(/\/$/, "")}/image/favicon.ico`;
  if (!url?.trim()) return fallback;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const origin = siteOrigin.replace(/\/$/, "");
  return u.startsWith("/") ? `${origin}${u}` : `${origin}/${u}`;
}

export function buildLaunchVideoJsonLd(
  video: VideoData,
  canonicalUrl: string,
  siteOrigin: string,
): Record<string, unknown> {
  const description = buildLaunchVideoOgDescription(video);
  const thumbnailUrl = video.thumbnail
    ? absoluteMediaUrl(video.thumbnail, siteOrigin)
    : undefined;

  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description,
    url: canonicalUrl,
  };

  if (thumbnailUrl) node.thumbnailUrl = thumbnailUrl;
  if (video.createdAt?.trim()) node.uploadDate = video.createdAt.trim();
  if (video.videoUrl?.trim()) node.contentUrl = video.videoUrl.trim();

  return node;
}
