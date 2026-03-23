/**
 * Clean URL slugs for launch library (no postId in the path).
 * Uniqueness must be enforced in Firestore (`slug` field), e.g. random-company, random-company-2.
 */

export const slugifyCompanyName = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/** Base slug from display name only (not guaranteed unique until saved). */
export function baseSlugFromName(name: string): string {
  const base = slugifyCompanyName(name);
  return base || "video";
}

/**
 * When saving a video, pick a unique slug against existing slugs in the library.
 * Produces: acme, acme-2, acme-3, ...
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  const normalizedBase = baseSlug || "video";
  if (!existingSlugs.includes(normalizedBase)) return normalizedBase;

  let i = 2;
  while (existingSlugs.includes(`${normalizedBase}-${i}`)) {
    i += 1;
  }
  return `${normalizedBase}-${i}`;
}

/** Route segment looks like a raw Firestore/post id (digits only). */
export function isNumericPostIdParam(segment: string): boolean {
  const decoded = decodeURIComponent(segment).trim();
  return /^\d{10,}$/.test(decoded);
}
