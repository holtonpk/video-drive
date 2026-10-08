import type {
  LaunchLibraryCatalogEntry,
  RelatedVideoCard,
  VideoData,
} from "./types";
import type {LaunchLibraryFieldCategory} from "./field-routing";
import {getVideoTags} from "./video-tags";

const RELATED_LIMIT = 20;

const RELATED_WEIGHTS = {
  cohort: 4,
  industry: 8,
  sector: 10,
  creativeFormat: 6,
  tone: 7,
  production: 6,
} as const;

type RankableVideo = Pick<
  VideoData,
  | "postId"
  | "cohort"
  | "industry"
  | "sector"
  | "creativeFormat"
  | "tone"
  | "production"
  | "hook"
  | "score"
  | "viewCount"
  | "likeCount"
>;

export type RelatedVideoFilter =
  | {type: "all"; label: "All"}
  | {
      type: "tag";
      label: string;
      fieldCategory: LaunchLibraryFieldCategory;
      value: string;
    };

/** Precomputed on the server: the 20 related videos for every filter chip. */
export type RelatedVideosPayload = {
  filters: RelatedVideoFilter[];
  idsByFilter: Record<string, string[]>;
  cards: Record<string, RelatedVideoCard>;
};

export function relatedFilterKey(filter: RelatedVideoFilter): string {
  return filter.type === "all" ? "all" : `${filter.fieldCategory}::${filter.value}`;
}

const getSharedCount = (a?: string[] | null, b?: string[] | null) => {
  if (!a?.length || !b?.length) return 0;
  const setB = new Set(b);
  return a.filter((item) => setB.has(item)).length;
};

const getRelatedScore = (source: RankableVideo, candidate: RankableVideo) => {
  if (source.postId === candidate.postId) return -1;

  let score = 0;

  if (source.cohort && candidate.cohort && source.cohort === candidate.cohort) {
    score += RELATED_WEIGHTS.cohort;
  }

  score +=
    getSharedCount(source.industry, candidate.industry) *
    RELATED_WEIGHTS.industry;

  score +=
    getSharedCount(source.sector, candidate.sector) * RELATED_WEIGHTS.sector;

  score +=
    getSharedCount(source.creativeFormat, candidate.creativeFormat) *
    RELATED_WEIGHTS.creativeFormat;

  score += getSharedCount(source.tone, candidate.tone) * RELATED_WEIGHTS.tone;

  score +=
    getSharedCount(source.production, candidate.production) *
    RELATED_WEIGHTS.production;

  // tie breakers
  if (source.score && candidate.score) {
    score += Math.max(0, 3 - Math.abs(source.score - candidate.score));
  }

  score += Math.min(candidate.viewCount / 100000, 3);
  score += Math.min(candidate.likeCount / 1000, 2);

  return score;
};

const getRelatedVideos = (
  video: RankableVideo,
  catalog: LaunchLibraryCatalogEntry[],
) => {
  return catalog
    .filter((candidate) => candidate.hasMedia)
    .map((candidate) => ({
      video: candidate,
      score: getRelatedScore(video, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.video);
};

function dedupeVideos(videos: LaunchLibraryCatalogEntry[]) {
  const seen = new Set<string>();

  return videos.filter((v) => {
    const key = v.postId || v.slug || v.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getVideoFieldValuesByCategory(
  video: RankableVideo,
  fieldCategory: LaunchLibraryFieldCategory,
): string[] {
  switch (fieldCategory) {
    case "cohort":
      return video.cohort ? [video.cohort] : [];
    case "industry":
      return video.industry ?? [];
    case "sector":
      return video.sector ?? [];
    case "creative-format":
      return video.creativeFormat ?? [];
    case "tone":
      return video.tone ?? [];
    case "production":
      return video.production ?? [];
    case "hook":
      return video.hook ?? [];
    case "score":
      return video.score != null ? [String(video.score)] : [];
    default:
      return [];
  }
}

function getFilterBoost(
  candidate: RankableVideo,
  filter: RelatedVideoFilter,
): number {
  if (filter.type === "all") return 0;

  const values = getVideoFieldValuesByCategory(candidate, filter.fieldCategory);

  if (!values.includes(filter.value)) return Number.NEGATIVE_INFINITY;

  let boost = 100;

  switch (filter.fieldCategory) {
    case "sector":
      boost += 20;
      break;
    case "creative-format":
    case "tone":
    case "production":
      boost += 12;
      break;
    case "industry":
      boost += 10;
      break;
    case "cohort":
      boost += 8;
      break;
    case "hook":
      boost += 6;
      break;
    case "score":
      boost += 4;
      break;
    default:
      break;
  }

  return boost;
}

function getUniqueRelatedFilters(video: VideoData): RelatedVideoFilter[] {
  const tags = getVideoTags(video);
  const seen = new Set<string>();

  const dynamicFilters: RelatedVideoFilter[] = tags
    .map((tag) => {
      const normalizedValue = tag.label.replace(/ hook$/i, "");
      const key = `${tag.category}::${normalizedValue}`;

      if (seen.has(key)) return null;
      seen.add(key);

      return {
        type: "tag" as const,
        label: tag.label,
        fieldCategory: tag.category,
        value: normalizedValue,
      };
    })
    .filter(Boolean) as RelatedVideoFilter[];

  return [{type: "all", label: "All"}, ...dynamicFilters];
}

function getResultsForFilter(
  baseRelated: LaunchLibraryCatalogEntry[],
  filter: RelatedVideoFilter,
): LaunchLibraryCatalogEntry[] {
  const allResults = baseRelated.slice(0, RELATED_LIMIT);

  if (filter.type === "all") {
    return allResults;
  }

  type Ranked = {video: LaunchLibraryCatalogEntry; score: number};

  const ranked: Ranked[] = baseRelated
    .map((candidate, index) => {
      const boost = getFilterBoost(candidate, filter);

      if (boost === Number.NEGATIVE_INFINITY) return null;

      return {
        video: candidate,
        score: boost + (1000 - index),
      };
    })
    .filter((item): item is Ranked => item != null)
    .sort((a, b) => b.score - a.score);

  const filteredRanked = ranked.map((item) => item.video);
  const filteredResults = filteredRanked.slice(0, RELATED_LIMIT);

  const sameAsAll =
    filteredResults.length === allResults.length &&
    filteredResults.every(
      (item, index) => item.postId === allResults[index]?.postId,
    );

  if (sameAsAll) {
    const allIds = new Set(allResults.map((item) => item.postId));
    const uniqueToFilter = filteredRanked.filter(
      (item) => !allIds.has(item.postId),
    );

    if (uniqueToFilter.length > 0) {
      return uniqueToFilter.slice(0, RELATED_LIMIT);
    }
  }

  return filteredResults;
}

function toRelatedVideoCard(entry: LaunchLibraryCatalogEntry): RelatedVideoCard {
  return {
    postId: entry.postId,
    slug: entry.slug,
    name: entry.name,
    score: entry.score,
    commentary: entry.commentary,
    logo: entry.logo,
    website: entry.website,
    thumbnailUrl: entry.thumbnailUrl,
    videoSprite: entry.videoSprite,
    videoSpriteInterval: entry.videoSpriteInterval,
    videoSpriteColumns: entry.videoSpriteColumns,
    videoSpriteFrameWidth: entry.videoSpriteFrameWidth,
    videoSpriteFrameHeight: entry.videoSpriteFrameHeight,
    videoSpriteFrameCount: entry.videoSpriteFrameCount,
  };
}

export function buildRelatedVideos(
  video: VideoData,
  catalog: LaunchLibraryCatalogEntry[],
): RelatedVideosPayload {
  const baseRelated = dedupeVideos(getRelatedVideos(video, catalog));
  const filters = getUniqueRelatedFilters(video);

  const idsByFilter: Record<string, string[]> = {};
  const cards: Record<string, RelatedVideoCard> = {};

  for (const filter of filters) {
    const results = getResultsForFilter(baseRelated, filter);
    idsByFilter[relatedFilterKey(filter)] = results.map((entry) => {
      cards[entry.postId] ??= toRelatedVideoCard(entry);
      return entry.postId;
    });
  }

  return {filters, idsByFilter, cards};
}
