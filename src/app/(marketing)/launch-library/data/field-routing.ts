import type {VideoData} from "./types";

export const FIELD_CATEGORY_MAP = {
  cohort: "cohort",
  industry: "industry",
  sector: "sector",
  "creative-format": "creativeFormat",
  tone: "tone",
  production: "production",
  hook: "hook",
  score: "score",
} as const;

export type LaunchLibraryFieldCategory = keyof typeof FIELD_CATEGORY_MAP;
export type VideoFilterField =
  (typeof FIELD_CATEGORY_MAP)[LaunchLibraryFieldCategory];

export const isValidFieldCategory = (
  value: string,
): value is LaunchLibraryFieldCategory => {
  console.log("value======", value);
  return value in FIELD_CATEGORY_MAP;
};

export const slugifyFieldValue = (value: string | number) => {
  return String(value)
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const deslugifyFieldValue = (value: string) => {
  return decodeURIComponent(value).trim().toLowerCase();
};

export const videoMatchesFieldRoute = (
  video: VideoData,
  field: VideoFilterField,
  fieldValueSlug: string,
) => {
  const normalizedTarget = deslugifyFieldValue(fieldValueSlug);
  const fieldValue = video[field];

  if (fieldValue == null) return false;

  if (Array.isArray(fieldValue)) {
    return fieldValue.some(
      (item) => slugifyFieldValue(item) === normalizedTarget,
    );
  }

  return slugifyFieldValue(fieldValue) === normalizedTarget;
};

export const getDisplayFieldLabel = (
  fieldCategory: LaunchLibraryFieldCategory,
) => {
  const labels: Record<LaunchLibraryFieldCategory, string> = {
    cohort: "Cohort",
    industry: "Industry",
    sector: "Sector",
    "creative-format": "Creative Format",
    tone: "Tone",
    production: "Production",
    hook: "Hook",
    score: "Score",
  };

  return labels[fieldCategory];
};

export const getFieldValueDisplayName = (valueSlug: string) => {
  return decodeURIComponent(valueSlug)
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
};
