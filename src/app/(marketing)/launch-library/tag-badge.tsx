"use client";

import {
  slugifyFieldValue,
  type LaunchLibraryFieldCategory,
} from "./data/field-routing";

const defaultRowClass =
  "inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs leading-none text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/20 hover:underline";

export const TagBadge = ({
  tag,
  fieldCategory,
  className,
}: {
  tag: string;
  fieldCategory: LaunchLibraryFieldCategory;
  className?: string;
}) => {
  return (
    <a
      href={`/launch-library/${fieldCategory}/${slugifyFieldValue(tag)}`}
      data-interactive="true"
      onClick={(e) => e.stopPropagation()}
      className={className ?? defaultRowClass}
    >
      {tag}
    </a>
  );
};
