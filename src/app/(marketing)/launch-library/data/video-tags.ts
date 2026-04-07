import type {VideoCardDisplay} from "./types";
import type {LaunchLibraryFieldCategory} from "./field-routing";

const TAG_FIELDS = [
  // {field: "cohort" as const, category: "cohort"},
  {field: "industry" as const, category: "industry"},
  {field: "sector" as const, category: "sector"},
  {field: "creativeFormat" as const, category: "creative-format"},
  {field: "tone" as const, category: "tone"},
  {field: "production" as const, category: "production"},
  {field: "hook" as const, category: "hook"},
  // {field: "score" as const, category: "score"},
] as const;

export type VideoTag = {
  label: string;
  category: LaunchLibraryFieldCategory;
};

export const getVideoTags = (video: VideoCardDisplay): VideoTag[] => {
  const tags: VideoTag[] = [];

  for (const {field, category} of TAG_FIELDS) {
    const value = video[field];

    if (value == null) continue;

    const formatLabel = (val: any) =>
      field === "hook" ? `${val} hook` : String(val);

    if (Array.isArray(value)) {
      tags.push(
        ...value.filter(Boolean).map((item) => ({
          label: formatLabel(item),
          category,
        })),
      );
    } else {
      tags.push({
        label: formatLabel(value),
        category,
      });
    }
  }

  return tags.filter(
    (tag, index, arr) =>
      arr.findIndex(
        (other) => other.label === tag.label && other.category === tag.category,
      ) === index,
  );
};
