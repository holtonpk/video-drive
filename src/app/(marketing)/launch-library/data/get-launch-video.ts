import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {baseSlugFromName} from "@/lib/slug";
import type {VideoData} from "./types";

const COLLECTION = "launch-library";

/** Full launch library dataset (for related videos, etc.). */
export async function getLaunchLibraryVideos(): Promise<VideoData[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((docSnap) => docSnap.data() as VideoData);
}

export async function getLaunchLibraryVideoByPostId(
  postId: string,
): Promise<VideoData | null> {
  // Fast path: doc id === postId
  const byDocId = await getDoc(doc(db, COLLECTION, postId));
  if (byDocId.exists()) {
    return byDocId.data() as VideoData;
  }

  // Fallback: postId stored as a field (doc id may differ)
  try {
    const q = query(
      collection(db, COLLECTION),
      where("postId", "==", postId),
      limit(1),
    );
    const qs = await getDocs(q);
    if (!qs.empty) {
      return qs.docs[0].data() as VideoData;
    }
  } catch {
    // e.g. missing Firestore index for postId
  }

  return null;
}

/** Resolve by stored `slug` field (clean URLs). */
export async function getLaunchLibraryVideoBySlug(
  slug: string,
): Promise<VideoData | null> {
  const decoded = decodeURIComponent(slug).trim();
  if (!decoded) return null;

  try {
    const q = query(
      collection(db, COLLECTION),
      where("slug", "==", decoded),
      limit(1),
    );
    const qs = await getDocs(q);
    if (!qs.empty) {
      return qs.docs[0].data() as VideoData;
    }
  } catch (e) {
    // e.g. missing Firestore index for slug, or rules — log so 404s are debuggable
    console.error("[getLaunchLibraryVideoBySlug] slug query failed:", e);
  }

  // Many docs were saved without a `slug` field; the UI still links using
  // `baseSlugFromName(name)`. Match that so `/launch-library/acme` works.
  try {
    const all = await getDocs(collection(db, COLLECTION));
    for (const docSnap of all.docs) {
      const data = docSnap.data() as VideoData;
      if (!data?.name) continue;
      const stored = data.slug?.trim();
      if (stored && stored === decoded) return data;
      if (baseSlugFromName(data.name) === decoded) return data;
    }
  } catch (e) {
    console.error("[getLaunchLibraryVideoBySlug] name/slug fallback scan failed:", e);
  }

  return null;
}
