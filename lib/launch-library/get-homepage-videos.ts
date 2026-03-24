import {db} from "@/config/firebase";
import {collectHomepageVideoIds} from "@/lib/launch-library/homepage-ids";
import {toHomepageVideoCardData} from "@/lib/launch-library/to-homepage-video-card";
import type {HomepageVideoCardData} from "@/src/app/(marketing)/launch-library/data/types";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const IN_CHUNK_SIZE = 10;

export async function getHomepageVideos(): Promise<HomepageVideoCardData[]> {
  const ids = collectHomepageVideoIds();
  const videos: HomepageVideoCardData[] = [];

  for (let i = 0; i < ids.length; i += IN_CHUNK_SIZE) {
    const chunk = ids.slice(i, i + IN_CHUNK_SIZE);

    const q = query(
      collection(db, "launch-library"),
      where(documentId(), "in", chunk),
    );

    const snapshot = await getDocs(q);

    for (const snap of snapshot.docs) {
      const raw = snap.data() as Record<string, unknown>;
      videos.push(toHomepageVideoCardData(raw, snap.id));
    }
  }

  const byId = new Map(videos.map((video) => [video.postId, video]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as HomepageVideoCardData[];
}
