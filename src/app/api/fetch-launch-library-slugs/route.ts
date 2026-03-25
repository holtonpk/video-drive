import {NextResponse} from "next/server";
import {db} from "@/config/firebase";
import {collection, getDocs} from "firebase/firestore";
import {baseSlugFromName} from "@/lib/slug";

export const runtime = "nodejs";

type LaunchLibraryDoc = {
  name?: string | null;
  slug?: string | null;
  createdAt?: string | null;
};

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "launch-library"));

    const seen = new Set<string>();

    const entries = snapshot.docs
      .map((doc) => {
        const data = doc.data() as LaunchLibraryDoc;

        const name = typeof data.name === "string" ? data.name.trim() : "";
        const storedSlug =
          typeof data.slug === "string" ? data.slug.trim() : "";

        const slug = storedSlug || (name ? baseSlugFromName(name) : "");

        if (!slug || seen.has(slug)) return null;
        seen.add(slug);

        return {
          slug,
          lastModified: data.createdAt ?? null,
        };
      })
      .filter(Boolean);

    return NextResponse.json({entries});
  } catch (error) {
    console.error("fetch-launch-library-slugs", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch launch library slugs",
      },
      {status: 500},
    );
  }
}
