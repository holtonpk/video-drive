export type videoSchema = {
  name: string;
  cohort: string;

  description: string;
  commentary: string;
  score: number | null;

  tags: {
    industry: string[];
    sector: string[];
    creativeFormat: string[];
    tone: string[];
    production: string[];
    hook: string[];
  };

  meta: {};
};


export type VideoData = {
  name: string;
  /**
   * Unique URL segment (e.g. random-company, random-company-2).
   * Should be set when saving; navigation falls back to slugified name only for migration.
   */
  slug?: string;
  cohort: string | null;
  industry: string[];
  sector: string[];
  creativeFormat: string[];
  tone: string[];
  production: string[];
  hook: string[];
  score: 1 | 2 | 3 | 4 | 5 | null;
  commentary: string | null;
  description: string | null;
  authorUsername: string;
  createdAt: string;
  postId: string;
  postUrl: string;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  website: string | null;
  ycUrl: string | null;
  thumbnail: string | null;
  videoUrl: string | null;
};

export type ScalarField = "cohort" | "score";

export type ArrayField =
  | "industry"
  | "sector"
  | "creativeFormat"
  | "tone"
  | "production"
  | "hook";

export type ArrayMatchMode = "all" | "any" | "atLeast";

export type RowCriterion =
  | {
      field: ScalarField;
      value: string | number;
    }
  | {
      field: ArrayField;
      values: string[];
      match: ArrayMatchMode;
      minCount?: number;
    };

export type SortField = "viewCount" | "likeCount" | "score" | "createdAt";

export type VideoRowConfig = {
  label: string;
  href: string;
  criteria: RowCriterion[];
  sortBy?: SortField;
  sortDirection?: "asc" | "desc";
  limit?: number;
  videoIds?: string[];
  /** When false, skip hardcoded `videoIds` even if production mode is on (use criteria ranking). */
  useHardcodedIds?: boolean;
};

/** Fields exposed in launch library search / filter UI */
export type LaunchLibraryFilterField =
  | "cohort"
  | "industry"
  | "sector"
  | "creativeFormat"
  | "tone"
  | "production"
  | "hook"
  | "score";

export type LaunchLibraryActiveFilters = Partial<
  Record<LaunchLibraryFilterField, string[]>
>;

export const LAUNCH_LIBRARY_FILTER_FIELDS: LaunchLibraryFilterField[] = [
  "cohort",
  "industry",
  "sector",
  "creativeFormat",
  "tone",
  "production",
  "hook",
  "score",
];