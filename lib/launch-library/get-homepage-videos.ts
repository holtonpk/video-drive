import {db} from "@/config/firebase";
import {collectHomepageVideoIds} from "@/lib/launch-library/homepage-ids";
import type {VideoData} from "@/src/app/(marketing)/launch-library/data/types";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const IN_CHUNK_SIZE = 10;

export async function getHomepageVideos(): Promise<VideoData[]> {
  const ids = collectHomepageVideoIds();
  const videos: VideoData[] = [];

  for (let i = 0; i < ids.length; i += IN_CHUNK_SIZE) {
    const chunk = ids.slice(i, i + IN_CHUNK_SIZE);

    const q = query(
      collection(db, "launch-library"),
      where(documentId(), "in", chunk),
    );

    const snapshot = await getDocs(q);

    for (const snap of snapshot.docs) {
      const raw = snap.data() as VideoData;
      videos.push({...raw, postId: snap.id});
    }
  }

  const byId = new Map(videos.map((video) => [video.postId, video]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as VideoData[];
}
