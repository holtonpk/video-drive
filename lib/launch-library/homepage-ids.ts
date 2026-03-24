import {
  TOP_TEN_VIDEO_IDS,
  videoRowConfigs,
} from "@/src/app/(marketing)/launch-library/row-config";

/** All post IDs needed for TopTen + hardcoded homepage rows (deduped). */
export function collectHomepageVideoIds(): string[] {
  const ids = new Set<string>(TOP_TEN_VIDEO_IDS.map(String));
  for (const config of videoRowConfigs) {
    if (config.videoIds) {
      for (const id of config.videoIds) {
        ids.add(String(id));
      }
    }
  }
  return [...ids];
}
