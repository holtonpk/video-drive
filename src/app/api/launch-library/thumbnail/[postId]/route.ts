import {NextResponse} from "next/server";
import {getLaunchVideoByPostId} from "@/lib/launch-library/catalog";

export const runtime = "nodejs";

const DATA_URI_RE = /^data:([^;,]+)(;base64)?,([^]*)$/;

/**
 * Serves a launch library thumbnail as a real image. Thumbnails are stored in
 * Firestore as base64 data URIs; inlining them bloats every page, so cards
 * reference this URL instead and the browser/CDN can cache it.
 */
export async function GET(
  _request: Request,
  {params}: {params: Promise<{postId: string}>},
) {
  const {postId} = await params;
  const video = await getLaunchVideoByPostId(decodeURIComponent(postId));
  const thumbnail = video?.thumbnail;

  if (!thumbnail) {
    return new NextResponse(null, {status: 404});
  }

  const match = DATA_URI_RE.exec(thumbnail);
  if (!match) {
    return NextResponse.redirect(thumbnail);
  }

  const [, contentType, isBase64, data] = match;
  const body = isBase64
    ? Buffer.from(data, "base64")
    : Buffer.from(decodeURIComponent(data));

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control":
        "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
    },
  });
}
