import {NextRequest, NextResponse} from "next/server";
import type {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {getAdminDb} from "@/lib/firebase/admin";
import {
  LAUNCH_LIBRARY_FILTER_FIELDS,
  type LaunchLibraryActiveFilters,
  type LaunchLibraryFilterField,
} from "@/src/app/(marketing)/launch-library/data/types";
import type {LaunchLibrarySearchHit} from "@/lib/launch-library/search-hit-to-video";

export const runtime = "nodejs";

type Filters = LaunchLibraryActiveFilters;

// Fast prefix candidates
const PREFIX_FETCH = 60;
// Big fallback pool so fuzzy matching always has enough candidates
const FALLBACK_FETCH = 300;
// Filter-only / browse pool
const FILTER_FETCH = 120;
// Always try to return at least this many
const MIN_RESULTS = 20;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
}

function matchesFilters(doc: Record<string, unknown>, filters: Filters) {
  return LAUNCH_LIBRARY_FILTER_FIELDS.every(
    (field: LaunchLibraryFilterField) => {
      const selected = filters[field];
      if (!selected?.length) return true;

      const value = doc[field];
      if (value == null) return false;

      if (Array.isArray(value)) {
        return selected.some((item: string) => value.includes(item));
      }

      return selected.includes(String(value));
    },
  );
}

function slimResult(doc: QueryDocumentSnapshot): LaunchLibrarySearchHit {
  const data = doc.data();

  return {
    postId: doc.id,
    slug: typeof data.slug === "string" ? data.slug : "",
    name: typeof data.name === "string" ? data.name : "",
    authorUsername:
      typeof data.authorUsername === "string" ? data.authorUsername : null,
    cohort: typeof data.cohort === "string" ? data.cohort : null,
    industry: asStringArray(data.industry),
    sector: asStringArray(data.sector),
    creativeFormat: asStringArray(data.creativeFormat),
    tone: asStringArray(data.tone),
    production: asStringArray(data.production),
    hook: asStringArray(data.hook),
    score: typeof data.score === "number" ? data.score : null,
    thumbnailUrl:
      (typeof data.thumbnailUrl === "string" && data.thumbnailUrl) ||
      (typeof data.thumbnail === "string" && data.thumbnail) ||
      null,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : null,
  };
}

function rowForFilterMatch(
  doc: QueryDocumentSnapshot,
): Record<string, unknown> {
  return {postId: doc.id, ...doc.data()};
}

function dedupeDocs(docs: QueryDocumentSnapshot[]): QueryDocumentSnapshot[] {
  const seen = new Set<string>();
  const result: QueryDocumentSnapshot[] = [];

  for (const doc of docs) {
    if (seen.has(doc.id)) continue;
    seen.add(doc.id);
    result.push(doc);
  }

  return result;
}

function getNameLower(doc: QueryDocumentSnapshot): string {
  const data = doc.data();

  if (typeof data.nameLower === "string" && data.nameLower.trim()) {
    return normalize(data.nameLower);
  }

  if (typeof data.name === "string") {
    return normalize(data.name);
  }

  return "";
}

function getSearchBlob(doc: QueryDocumentSnapshot): string {
  const data = doc.data();

  return [
    typeof data.name === "string" ? data.name : "",
    typeof data.nameLower === "string" ? data.nameLower : "",
    typeof data.cohort === "string" ? data.cohort : "",
    ...asStringArray(data.industry),
    ...asStringArray(data.sector),
    ...asStringArray(data.creativeFormat),
    ...asStringArray(data.tone),
    ...asStringArray(data.production),
    ...asStringArray(data.hook),
  ]
    .join(" ")
    .toLowerCase();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }

    for (let j = 0; j <= b.length; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
}

function similarityFromEditDistance(a: string, b: string): number {
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - dist / maxLen;
}

function bigrams(input: string): string[] {
  const s = input.replace(/\s+/g, " ").trim();
  if (s.length < 2) return s ? [s] : [];
  const out: string[] = [];
  for (let i = 0; i < s.length - 1; i += 1) {
    out.push(s.slice(i, i + 2));
  }
  return out;
}

function diceCoefficient(a: string, b: string): number {
  const aBigrams = bigrams(a);
  const bBigrams = bigrams(b);

  if (!aBigrams.length || !bBigrams.length) return 0;

  const counts = new Map<string, number>();
  for (const gram of aBigrams) {
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }

  let overlap = 0;
  for (const gram of bBigrams) {
    const count = counts.get(gram) ?? 0;
    if (count > 0) {
      overlap += 1;
      counts.set(gram, count - 1);
    }
  }

  return (2 * overlap) / (aBigrams.length + bBigrams.length);
}

function tokenPrefixScore(name: string, query: string): number {
  const nameWords = name.split(/[\s\-_/]+/).filter(Boolean);
  const queryWords = query.split(/[\s\-_/]+/).filter(Boolean);

  if (!nameWords.length || !queryWords.length) return 0;

  let score = 0;

  for (const qWord of queryWords) {
    for (const nWord of nameWords) {
      if (nWord === qWord) {
        score += 1.5;
        break;
      }
      if (nWord.startsWith(qWord) || qWord.startsWith(nWord)) {
        score += 1.0;
        break;
      }
    }
  }

  return score;
}

function scoreDoc(doc: QueryDocumentSnapshot, queryText: string): number {
  const data = doc.data();
  const name = getNameLower(doc);
  const blob = getSearchBlob(doc);
  const businessScore = typeof data.score === "number" ? data.score : 0;

  if (!queryText) {
    return businessScore;
  }

  // Strong exact / prefix / substring boosts
  if (name === queryText) return 20000 + businessScore;
  if (name.startsWith(queryText)) return 15000 + businessScore;
  if (queryText.startsWith(name) && name.length >= 4)
    return 14000 + businessScore;
  if (name.includes(queryText)) return 11000 + businessScore;
  if (blob.includes(queryText)) return 7000 + businessScore;

  const editSim = similarityFromEditDistance(name, queryText);
  const diceSim = diceCoefficient(name, queryText);
  const tokenScore = tokenPrefixScore(name, queryText);

  // Weighted fuzzy score
  const fuzzy = editSim * 4000 + diceSim * 3000 + tokenScore * 500;

  // Small reward if individual query words appear somewhere in blob
  const queryWords = queryText.split(/\s+/).filter(Boolean);
  const wordMatches = queryWords.filter((word) => blob.includes(word)).length;
  const wordScore = wordMatches * 150;

  return fuzzy + wordScore + businessScore;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      q?: string;
      filters?: Filters;
      cursor?: string | null;
      limit?: number;
    };

    const qRaw = String(body.q ?? "");
    const filters = (body.filters ?? {}) as Filters;
    const requestedLimit = Math.min(
      Math.max(Number(body.limit ?? 24), MIN_RESULTS),
      30,
    );
    const cursor = body.cursor ? String(body.cursor) : null;

    const queryText = normalize(qRaw);
    const db = getAdminDb();
    const col = db.collection("launch-library-search");

    let cursorSnap: DocumentSnapshot | null = null;
    if (cursor) {
      const c = await col.doc(cursor).get();
      if (c.exists) cursorSnap = c;
    }

    const hasActiveFilters = LAUNCH_LIBRARY_FILTER_FIELDS.some(
      (field) => (filters[field]?.length ?? 0) > 0,
    );

    // Typed search: always return best fuzzy matches, even for typos
    if (queryText.length >= 1) {
      let prefixQuery = col
        .orderBy("nameLower")
        .startAt(queryText)
        .endAt(queryText + "\uf8ff");

      if (cursorSnap) {
        prefixQuery = prefixQuery.startAfter(cursorSnap);
      }

      const [prefixSnapshot, fallbackSnapshot] = await Promise.all([
        prefixQuery.limit(PREFIX_FETCH).get(),
        col.orderBy("score", "desc").limit(FALLBACK_FETCH).get(),
      ]);

      let candidates = dedupeDocs([
        ...prefixSnapshot.docs,
        ...fallbackSnapshot.docs,
      ]);

      if (hasActiveFilters) {
        candidates = candidates.filter((doc) =>
          matchesFilters(rowForFilterMatch(doc), filters),
        );
      }

      const ranked = candidates
        .map((doc) => ({
          doc,
          rank: scoreDoc(doc, queryText),
        }))
        .sort((a, b) => b.rank - a.rank);

      const results = ranked
        .slice(0, requestedLimit)
        .map((item) => slimResult(item.doc));

      const lastPrefixDoc =
        prefixSnapshot.docs[prefixSnapshot.docs.length - 1] ?? null;
      const nextCursor =
        prefixSnapshot.docs.length >= PREFIX_FETCH && lastPrefixDoc
          ? lastPrefixDoc.id
          : null;

      return NextResponse.json({
        results,
        nextCursor,
      });
    }

    // Filters only / browse
    let browseQuery = col.orderBy("score", "desc");

    if (cursorSnap) {
      browseQuery = browseQuery.startAfter(cursorSnap);
    }

    const snapshot = await browseQuery.limit(FILTER_FETCH).get();

    let docs = snapshot.docs;

    if (hasActiveFilters) {
      docs = docs.filter((doc) =>
        matchesFilters(rowForFilterMatch(doc), filters),
      );
    }

    const hits = docs.slice(0, requestedLimit).map(slimResult);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor =
      snapshot.docs.length >= FILTER_FETCH && lastDoc ? lastDoc.id : null;

    return NextResponse.json({
      results: hits,
      nextCursor,
    });
  } catch (e) {
    console.error("launch-library search", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Search failed — check credentials and Firestore indexes.",
      },
      {status: 500},
    );
  }
}
