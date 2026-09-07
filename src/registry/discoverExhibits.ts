import type { Exhibit } from '../shared/exhibitContract';

/**
 * The build-time folder scan. Vite resolves the glob when bundling, so
 * adding an Exhibit is creating one folder with an `index.ts` whose default
 * export is the Exhibit object. Nothing else needs editing.
 */
const modules = import.meta.glob<Exhibit>('../exhibits/*/index.ts', {
  eager: true,
  import: 'default',
});

export function discoverExhibits(): Exhibit[] {
  return Object.entries(modules).map(([modulePath, exhibit]) => {
    const folder = folderName(modulePath);
    if (exhibit?.manifest?.slug !== folder) {
      throw new Error(
        `The Exhibit in folder "${folder}" must use that folder name as its slug (found "${exhibit?.manifest?.slug}")`,
      );
    }
    return exhibit;
  });
}

function folderName(modulePath: string): string {
  return modulePath.split('/').at(-2) ?? '';
}
