import type {VideoData, VideoRowConfig, RowCriterion} from "./data/types";

function matchesCriterion(video: VideoData, criterion: RowCriterion): boolean {
  const fieldValue = video[criterion.field];

  if ("value" in criterion) {
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(String(criterion.value));
    }
    return fieldValue === criterion.value;
  }

  if (!Array.isArray(fieldValue)) {
    return false;
  }

  const matches = criterion.values.filter((value) =>
    fieldValue.includes(String(value)),
  ).length;

  switch (criterion.match) {
    case "all":
      return matches === criterion.values.length;
    case "any":
      return matches > 0;
    case "atLeast":
      return matches >= (criterion.minCount ?? 1);
    default:
      return false;
  }
}

export const videoRowConfigs: VideoRowConfig[] = [
  {
    label: "Best hooks",
    href: "/launch-library/hooks/great",
    criteria: [{field: "hook", values: ["Great"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Best abstract",
    href: "/launch-library/creative-format/abstract",
    criteria: [{field: "creativeFormat", values: ["Abstract"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Best DIY",
    href: "/launch-library/creative-format/diy",
    criteria: [{field: "creativeFormat", values: ["DIY"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "AI Generated",
    href: "/launch-library/production/ai-generated",
    criteria: [{field: "production", values: ["AI Generated"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Best B 2 B",
    href: "/launch-library/industry/b2b",
    criteria: [{field: "industry", values: ["B2B"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Best B 2 C",
    href: "/launch-library/industry/b2c",
    criteria: [{field: "industry", values: ["B2C", "Consumer"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Live Action",
    href: "/launch-library/production/live-action",
    criteria: [{field: "production", values: ["Live Action"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Animated Motion Graphics",
    href: "/launch-library/production/animated-motion-graphics",
    criteria: [
      {
        field: "production",
        values: ["Motion Graphics", "3D Animation", "Animated"],
        match: "any",
      },
    ],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
  {
    label: "Humor",
    href: "/launch-library/tone/humor",
    criteria: [{field: "tone", values: ["Humor"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
  },
];

function sortVideos(
  videos: VideoData[],
  sortBy?: keyof VideoData,
  direction: "asc" | "desc" = "desc",
): VideoData[] {
  if (!sortBy) return [...videos];

  return [...videos].sort((a, b) => {
    const aVal = a[sortBy] as string | number | null | undefined;
    const bVal = b[sortBy] as string | number | null | undefined;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "desc" ? bVal - aVal : aVal - bVal;
    }

    const aStr = aVal != null ? String(aVal) : "";
    const bStr = bVal != null ? String(bVal) : "";
    const cmp = aStr.localeCompare(bStr, undefined, {numeric: true});

    return direction === "desc" ? -cmp : cmp;
  });
}

function getVideoKey(video: VideoData): string {
  return String(video.postId ?? video.name);
}

export function getVideosForRow(
  videos: VideoData[],
  config: VideoRowConfig,
): VideoData[] {
  let result = videos.filter((video) =>
    config.criteria.every((criterion) => matchesCriterion(video, criterion)),
  );

  result = sortVideos(
    result,
    config.sortBy as keyof VideoData | undefined,
    config.sortDirection ?? "desc",
  );

  if (config.limit != null && config.limit > 0) {
    result = result.slice(0, config.limit);
  }

  return result;
}

export function buildVideoRows(
  videos: VideoData[],
  configs: VideoRowConfig[] = videoRowConfigs,
): Array<{config: VideoRowConfig; videos: VideoData[]}> {
  const usedVideoKeys = new Set<string>();

  return configs.map((config) => {
    const rankedMatches = getVideosForRow(videos, {
      ...config,
      limit: undefined,
    });

    const uniqueMatches = rankedMatches.filter(
      (video) => !usedVideoKeys.has(getVideoKey(video)),
    );

    const limit =
      config.limit != null && config.limit > 0
        ? config.limit
        : rankedMatches.length;

    let selected = uniqueMatches.slice(0, limit);

    if (selected.length < limit) {
      const selectedKeys = new Set(selected.map(getVideoKey));

      const fallbackMatches = rankedMatches.filter(
        (video) => !selectedKeys.has(getVideoKey(video)),
      );

      selected = [...selected, ...fallbackMatches].slice(0, limit);
    }

    selected.forEach((video) => {
      usedVideoKeys.add(getVideoKey(video));
    });

    return {
      config,
      videos: selected,
    };
  });
}
