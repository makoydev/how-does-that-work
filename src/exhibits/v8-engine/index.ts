import type { Exhibit } from '../../shared/exhibitContract';

/**
 * The V8 engine. For now a stub that proves the discovery path: a full
 * manifest and a mount that shows the summary. The model, the Steps, Free
 * Play, and the mini model arrive in later tickets.
 */
const v8Engine: Exhibit = {
  manifest: {
    slug: 'v8-engine',
    title: 'V8 Engine',
    category: 'Engines',
    summary: 'Eight pistons take turns pushing on one crankshaft to make it spin.',
    sources: [
      { label: 'Four-stroke engine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Four-stroke_engine' },
      { label: 'V8 engine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/V8_engine' },
    ],
  },
  walkthrough: {
    steps: [{ id: 'placeholder', caption: 'The V8 engine Walkthrough is coming soon.' }],
    hasFreePlay: false,
  },
  mount(container) {
    const note = document.createElement('p');
    note.textContent = v8Engine.manifest.summary;
    container.appendChild(note);
    return () => note.remove();
  },
};

export default v8Engine;
