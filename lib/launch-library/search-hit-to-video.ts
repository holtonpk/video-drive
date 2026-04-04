import type {VideoData} from "@/src/app/(marketing)/launch-library/data/types";

/** Payload row from `/api/launch-library/search` (mirrors `launch-library-search`). */
export type LaunchLibrarySearchHit = {
  postId: string;
  slug: string;
  name: string;
  nameLower?: string;
  authorUsername: string | null;
  authorUsernameLower?: string;
  cohort: string | null;
  industry: string[];
  sector: string[];
  creativeFormat: string[];
  tone: string[];
  production: string[];
  hook: string[];
  score: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  createdAt: string | null;
  updatedAt?: string;
  searchText?: string;
  website: string | null;
  logo?: string | null;
};

export function searchHitToVideoData(hit: LaunchLibrarySearchHit): VideoData {
  const s = hit.score;
  const validScore =
    s === 1 || s === 2 || s === 3 || s === 4 || s === 5 ? s : null;

  return {
    postId: hit.postId,
    slug: hit.slug,
    name: hit.name,
    authorUsername: hit.authorUsername ?? "",
    cohort: hit.cohort,
    industry: hit.industry,
    sector: hit.sector,
    creativeFormat: hit.creativeFormat,
    tone: hit.tone,
    production: hit.production,
    hook: hit.hook,
    score: validScore,
    commentary: null,
    description: null,
    createdAt: hit.createdAt ?? "",
    postUrl: "",
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    viewCount: 0,
    website: hit.website,
    ycUrl: null,
    thumbnail: hit.thumbnailUrl,
    videoUrl: hit.videoUrl,
  };
}
