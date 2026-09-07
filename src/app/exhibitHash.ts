/**
 * The shape of an Exhibit's address: `#/<slug>`. This module only reads
 * and writes that shape; the registry decides whether a slug is known.
 */

const EXHIBIT_HASH = /^#\/([^/]+)$/;

/** The slug in an Exhibit hash, or nothing for an empty or malformed hash. */
export function slugFromHash(hash: string): string | null {
  return EXHIBIT_HASH.exec(hash)?.[1] ?? null;
}

/** The hash that opens the Exhibit with this slug. */
export function hashForSlug(slug: string): string {
  return `#/${slug}`;
}
