import type {HomepageVideoCardData} from "@/src/app/(marketing)/launch-library/data/types";

const MAX_COMMENTARY_CHARS = 500;

const SCORE_SET = new Set([1, 2, 3, 4, 5]);

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function toHomepageVideoCardData(
  raw: Record<string, unknown>,
  id: string,
): HomepageVideoCardData {
  const commentaryRaw =
    typeof raw.commentary === "string" ? raw.commentary : null;
  const commentary =
    commentaryRaw && commentaryRaw.length > MAX_COMMENTARY_CHARS
      ? `${commentaryRaw.slice(0, MAX_COMMENTARY_CHARS)}…`
      : commentaryRaw;

  const scoreRaw = raw.score;
  const score =
    typeof scoreRaw === "number" && SCORE_SET.has(scoreRaw)
      ? (scoreRaw as 1 | 2 | 3 | 4 | 5)
      : null;

  const viewCount =
    typeof raw.viewCount === "number" && Number.isFinite(raw.viewCount)
      ? raw.viewCount
      : 0;
  const likeCount =
    typeof raw.likeCount === "number" && Number.isFinite(raw.likeCount)
      ? raw.likeCount
      : 0;

  const createdAt =
    typeof raw.createdAt === "string" ? raw.createdAt : null;

  const thumb =
    typeof raw.thumbnail === "string" && raw.thumbnail
      ? raw.thumbnail
      : null;

  return {
    postId: id,
    slug: typeof raw.slug === "string" ? raw.slug : undefined,
    name: typeof raw.name === "string" ? raw.name : "",
    thumbnail: thumb,
    score,
    cohort: typeof raw.cohort === "string" ? raw.cohort : null,
    industry: parseStringArray(raw.industry),
    sector: parseStringArray(raw.sector),
    creativeFormat: parseStringArray(raw.creativeFormat),
    tone: parseStringArray(raw.tone),
    production: parseStringArray(raw.production),
    hook: parseStringArray(raw.hook),
    createdAt,
    viewCount,
    likeCount,
    videoUrl:
      typeof raw.videoUrl === "string" && raw.videoUrl ? raw.videoUrl : null,
    website:
      typeof raw.website === "string" && raw.website ? raw.website : null,
    commentary,
  };
}
