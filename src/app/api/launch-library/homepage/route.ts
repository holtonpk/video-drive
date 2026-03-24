import {NextResponse} from "next/server";
import {getAdminDb} from "@/lib/firebase/admin";
import {collectHomepageVideoIds} from "@/lib/launch-library/homepage-ids";
import type {VideoData} from "@/src/app/(marketing)/launch-library/data/types";

export const runtime = "nodejs";

/**
 * Loads only the `launch-library` documents referenced by hardcoded TopTen + row
 * configs (batched getAll). No full collection scan.
 */
export async function GET() {
  try {
    const db = getAdminDb();
    const ids = collectHomepageVideoIds();
    const videos: VideoData[] = [];

    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      const refs = chunk.map((id) => db.collection("launch-library").doc(id));
      const snaps = await db.getAll(...refs);
      for (const snap of snaps) {
        if (!snap.exists) continue;
        const raw = snap.data() as VideoData;
        videos.push({...raw, postId: snap.id});
      }
    }

    return NextResponse.json({videos});
  } catch (e) {
    console.error("launch-library homepage", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to load homepage videos",
      },
      {status: 500},
    );
  }
}
