import type { Exhibit } from '../shared/exhibitContract';

export interface ExhibitRegistry {
  /** Every Exhibit, ordered by Category then title. */
  readonly exhibits: readonly Exhibit[];
  /** The Exhibit with this slug, or nothing for an unknown or empty slug. */
  resolve(slug: string): Exhibit | undefined;
}

export function createExhibitRegistry(discovered: readonly Exhibit[]): ExhibitRegistry {
  const seen = new Set<string>();
  for (const exhibit of discovered) {
    validateManifest(exhibit);
    const { slug } = exhibit.manifest;
    if (seen.has(slug)) throw new Error(`Two Exhibits share the slug "${slug}"`);
    seen.add(slug);
  }
  const exhibits = [...discovered].sort(byCategoryThenTitle);
  const bySlug = new Map(exhibits.map((exhibit) => [exhibit.manifest.slug, exhibit]));
  return {
    exhibits,
    resolve: (slug) => bySlug.get(slug),
  };
}

function byCategoryThenTitle(a: Exhibit, b: Exhibit): number {
  return (
    a.manifest.category.localeCompare(b.manifest.category) ||
    a.manifest.title.localeCompare(b.manifest.title)
  );
}

function validateManifest(exhibit: Exhibit): void {
  const { slug, title, category, summary, sources } = exhibit.manifest;
  if (!slug) throw new Error('An Exhibit is missing its slug');
  if (!title) throw new Error(`Exhibit "${slug}" is missing its title`);
  if (!category) throw new Error(`Exhibit "${slug}" is missing its category`);
  if (!summary) throw new Error(`Exhibit "${slug}" is missing its summary`);
  if (!sources || sources.length === 0) {
    throw new Error(`Exhibit "${slug}" needs at least one source`);
  }
}
