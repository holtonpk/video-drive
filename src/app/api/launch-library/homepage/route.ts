import {NextResponse} from "next/server";
import {getHomepageVideos} from "@/lib/launch-library/get-homepage-videos";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orderedVideos = await getHomepageVideos();
    return NextResponse.json({videos: orderedVideos});
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
