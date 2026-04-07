import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

/**
 * Fixes deep links that put `&t=seconds` in the path instead of the query string.
 * Browsers treat that as one path segment, so the slug becomes `alloy&t=21` → 404.
 * Redirect: `/launch-library/acme&t=21` → `/launch-library/acme?t=21`
 */
export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const match = pathname.match(
    /^\/launch-library\/(.+)&t=(\d+(?:\.\d+)?)$/i,
  );
  if (!match) {
    return NextResponse.next();
  }

  const [, slug, seconds] = match;
  const url = request.nextUrl.clone();
  url.pathname = `/launch-library/${slug}`;
  url.searchParams.set("t", seconds);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/launch-library/:path*"],
};
