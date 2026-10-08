import {cache} from "react";
import {unstable_cache} from "next/cache";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {baseSlugFromName} from "@/lib/slug";
import type {
  LaunchLibraryCatalogEntry,
  VideoData,
} from "@/src/app/(marketing)/launch-library/data/types";

/**
 * Server-side, cached access to the launch library.
 *
 * The raw collection is ~17MB because every doc embeds a base64 thumbnail, so we
 * never ship it to the browser and only scan it on the server once per
 * revalidation window, keeping a slim (~1MB) index for slug lookup and related videos.
 */

const COLLECTION = "launch-library";
const REVALIDATE_SECONDS = 600;
const MAX_COMMENTARY_CHARS = 300;

export const LAUNCH_LIBRARY_CACHE_TAG = "launch-library";

const SCORE_SET = new Set([1, 2, 3, 4, 5]);

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function parseScore(value: unknown): VideoData["score"] {
  return typeof value === "number" && SCORE_SET.has(value)
    ? (value as 1 | 2 | 3 | 4 | 5)
    : null;
}

/** Thumbnails are stored as data URIs; serve those through a cacheable image route. */
export function launchLibraryThumbnailUrl(
  postId: string,
  thumbnail: unknown,
): string | null {
  const value = str(thumbnail);
  if (!value) return null;
  if (value.startsWith("data:")) {
    return `/api/launch-library/thumbnail/${encodeURIComponent(postId)}`;
  }
  return value;
}

function toCatalogEntry(
  raw: Record<string, unknown>,
  docId: string,
): LaunchLibraryCatalogEntry {
  const postId = str(raw.postId) ?? docId;
  const name = str(raw.name) ?? "";
  const commentary = str(raw.commentary);

  return {
    docId,
    postId,
    name,
    slug: str(raw.slug)?.trim() || baseSlugFromName(name),
    score: parseScore(raw.score),
    commentary:
      commentary && commentary.length > MAX_COMMENTARY_CHARS
        ? `${commentary.slice(0, MAX_COMMENTARY_CHARS)}…`
        : commentary,
    logo: str(raw.logo),
    website: str(raw.website),
    thumbnailUrl: launchLibraryThumbnailUrl(postId, raw.thumbnail),
    videoSprite: str(raw.videoSprite),
    videoSpriteInterval: num(raw.videoSpriteInterval),
    videoSpriteColumns: num(raw.videoSpriteColumns),
    videoSpriteFrameWidth: num(raw.videoSpriteFrameWidth),
    videoSpriteFrameHeight: num(raw.videoSpriteFrameHeight),
    videoSpriteFrameCount: num(raw.videoSpriteFrameCount),
    cohort: str(raw.cohort),
    industry: strArray(raw.industry),
    sector: strArray(raw.sector),
    creativeFormat: strArray(raw.creativeFormat),
    tone: strArray(raw.tone),
    production: strArray(raw.production),
    hook: strArray(raw.hook),
    viewCount: num(raw.viewCount) ?? 0,
    likeCount: num(raw.likeCount) ?? 0,
    hasMedia: !!str(raw.videoUrl) && !!str(raw.thumbnail),
  };
}

/** Only the fields the video page uses (drops download/sprite bookkeeping fields). */
function toVideoData(raw: Record<string, unknown>, docId: string): VideoData {
  return {
    name: str(raw.name) ?? "",
    slug: str(raw.slug) ?? undefined,
    cohort: str(raw.cohort),
    industry: strArray(raw.industry),
    sector: strArray(raw.sector),
    creativeFormat: strArray(raw.creativeFormat),
    tone: strArray(raw.tone),
    production: strArray(raw.production),
    hook: strArray(raw.hook),
    score: parseScore(raw.score),
    commentary: str(raw.commentary),
    description: str(raw.description),
    authorUsername: str(raw.authorUsername) ?? "",
    createdAt: str(raw.createdAt) ?? "",
    postId: str(raw.postId) ?? docId,
    postUrl: str(raw.postUrl) ?? "",
    likeCount: num(raw.likeCount) ?? 0,
    replyCount: num(raw.replyCount) ?? 0,
    repostCount: num(raw.repostCount) ?? 0,
    viewCount: num(raw.viewCount) ?? 0,
    website: str(raw.website),
    ycUrl: str(raw.ycUrl),
    thumbnail: str(raw.thumbnail),
    videoUrl: str(raw.videoUrl),
    logo: str(raw.logo),
    videoSprite: str(raw.videoSprite),
    videoSpriteInterval: num(raw.videoSpriteInterval),
    videoSpriteColumns: num(raw.videoSpriteColumns),
    videoSpriteFrameWidth: num(raw.videoSpriteFrameWidth),
    videoSpriteFrameHeight: num(raw.videoSpriteFrameHeight),
    videoSpriteFrameCount: num(raw.videoSpriteFrameCount),
  };
}

export const getLaunchLibraryCatalog = cache(
  unstable_cache(
    async (): Promise<LaunchLibraryCatalogEntry[]> => {
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map((docSnap) =>
        toCatalogEntry(docSnap.data() as Record<string, unknown>, docSnap.id),
      );
    },
    ["launch-library-catalog-v1"],
    {revalidate: REVALIDATE_SECONDS, tags: [LAUNCH_LIBRARY_CACHE_TAG]},
  ),
);

const getVideoByDocIdCached = unstable_cache(
  async (docId: string): Promise<VideoData | null> => {
    const snap = await getDoc(doc(db, COLLECTION, docId));
    if (!snap.exists()) return null;
    return toVideoData(snap.data() as Record<string, unknown>, snap.id);
  },
  ["launch-library-video-v1"],
  {revalidate: REVALIDATE_SECONDS, tags: [LAUNCH_LIBRARY_CACHE_TAG]},
);

export const getLaunchVideoByPostId = cache(
  async (postId: string): Promise<VideoData | null> => {
    // Fast path: doc id === postId
    const byDocId = await getVideoByDocIdCached(postId);
    if (byDocId) return byDocId;

    // Fallback: postId stored as a field (doc id may differ)
    const catalog = await getLaunchLibraryCatalog();
    const entry = catalog.find((e) => e.postId === postId);
    return entry ? getVideoByDocIdCached(entry.docId) : null;
  },
);

/** Resolve a clean URL slug (stored `slug` field, or slug derived from the name). */
export const getLaunchVideoBySlug = cache(
  async (slug: string): Promise<VideoData | null> => {
    const decoded = decodeURIComponent(slug).trim();
    if (!decoded) return null;

    const catalog = await getLaunchLibraryCatalog();
    const entry = catalog.find((e) => e.slug === decoded);
    if (entry) return getVideoByDocIdCached(entry.docId);

    // Not in the cached index (e.g. added since the last revalidation):
    // cheap indexed lookup on the stored `slug` field.
    try {
      const qs = await getDocs(
        query(collection(db, COLLECTION), where("slug", "==", decoded), limit(1)),
      );
      if (!qs.empty) {
        const snap = qs.docs[0];
        return toVideoData(snap.data() as Record<string, unknown>, snap.id);
      }
    } catch (e) {
      console.error("[getLaunchVideoBySlug] slug query failed:", e);
    }

    return null;
  },
);
