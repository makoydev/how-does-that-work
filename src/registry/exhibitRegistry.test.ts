import { describe, expect, it } from 'vitest';
import type { Exhibit } from '../shared/exhibitContract';
import { createExhibitRegistry } from './exhibitRegistry';

function exhibit(overrides: Partial<Exhibit['manifest']>): Exhibit {
  return {
    manifest: {
      slug: 'v8-engine',
      title: 'V8 Engine',
      category: 'Engines',
      summary: 'Eight pistons turn burning fuel into a spinning shaft.',
      sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/V8_engine' }],
      ...overrides,
    },
    walkthrough: { steps: [{ id: 'parts', caption: 'Meet the parts.' }], hasFreePlay: false },
    mount: () => () => {},
  };
}

describe('createExhibitRegistry', () => {
  it('accepts a valid manifest', () => {
    const registry = createExhibitRegistry([exhibit({})]);
    expect(registry.exhibits.map((e) => e.manifest.slug)).toEqual(['v8-engine']);
  });
});

describe('createExhibitRegistry rejecting incomplete manifests', () => {
  it('names the slug and the field when the title is missing', () => {
    expect(() => createExhibitRegistry([exhibit({ title: '' })])).toThrow(
      'Exhibit "v8-engine" is missing its title',
    );
  });

  it('names the slug and the field when the Category is missing', () => {
    expect(() => createExhibitRegistry([exhibit({ category: '' })])).toThrow(
      'Exhibit "v8-engine" is missing its category',
    );
  });

  it('names the slug and the field when the summary is missing', () => {
    expect(() => createExhibitRegistry([exhibit({ summary: '' })])).toThrow(
      'Exhibit "v8-engine" is missing its summary',
    );
  });

  it('names the slug and the field when the sources list is empty', () => {
    expect(() => createExhibitRegistry([exhibit({ sources: [] })])).toThrow(
      'Exhibit "v8-engine" needs at least one source',
    );
  });

  it('names the field when the slug itself is missing', () => {
    expect(() => createExhibitRegistry([exhibit({ slug: '' })])).toThrow(
      'An Exhibit is missing its slug',
    );
  });
});

describe('createExhibitRegistry with clashing Exhibits', () => {
  it('rejects two Exhibits sharing a slug', () => {
    expect(() =>
      createExhibitRegistry([exhibit({}), exhibit({ title: 'Another V8' })]),
    ).toThrow('Two Exhibits share the slug "v8-engine"');
  });
});

describe('createExhibitRegistry ordering', () => {
  it('orders Exhibits by Category and then by title', () => {
    const registry = createExhibitRegistry([
      exhibit({ slug: 'v8-engine', title: 'V8 Engine', category: 'Engines' }),
      exhibit({ slug: 'landing-gear', title: 'Landing Gear', category: 'Aircraft' }),
      exhibit({ slug: 'diesel-engine', title: 'Diesel Engine', category: 'Engines' }),
      exhibit({ slug: 'jet-engine', title: 'Jet Engine', category: 'Aircraft' }),
    ]);
    expect(registry.exhibits.map((e) => e.manifest.slug)).toEqual([
      'jet-engine',
      'landing-gear',
      'diesel-engine',
      'v8-engine',
    ]);
  });
});

describe('createExhibitRegistry resolving a slug', () => {
  const registry = createExhibitRegistry([
    exhibit({ slug: 'v8-engine', title: 'V8 Engine' }),
    exhibit({ slug: 'landing-gear', title: 'Landing Gear', category: 'Aircraft' }),
  ]);

  it('returns the Exhibit for a known slug', () => {
    expect(registry.resolve('landing-gear')?.manifest.title).toBe('Landing Gear');
  });

  it('returns nothing for an unknown slug', () => {
    expect(registry.resolve('steam-engine')).toBeUndefined();
  });

  it('returns nothing for an empty slug', () => {
    expect(registry.resolve('')).toBeUndefined();
  });
});

describe('createExhibitRegistry checking each source', () => {
  it('names the slug when a source has no label', () => {
    expect(() =>
      createExhibitRegistry([exhibit({ sources: [{ label: '', url: 'https://example.com' }] })]),
    ).toThrow('Exhibit "v8-engine" has a source without a label');
  });

  it('names the slug and the source when a source has no URL', () => {
    expect(() =>
      createExhibitRegistry([exhibit({ sources: [{ label: 'Wikipedia', url: '' }] })]),
    ).toThrow('Exhibit "v8-engine" source "Wikipedia" has no URL');
  });
});
