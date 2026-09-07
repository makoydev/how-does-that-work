import type { Exhibit } from '../../shared/exhibitContract';

/**
 * The V8 engine. For now a stub that proves the discovery path: a full
 * manifest and Step list, and a mount that shows the summary. The model,
 * the animated Steps, Free Play, and the mini model arrive in later tickets.
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
    steps: [
      { id: 'parts', caption: 'Meet the parts.' },
      { id: 'intake', caption: 'Intake: the piston drops and pulls in fuel and air.' },
      { id: 'compression', caption: 'Compression: the piston rises and squeezes the mixture.' },
      { id: 'power', caption: 'Power: a spark burns the mixture and shoves the piston down.' },
      { id: 'exhaust', caption: 'Exhaust: the piston rises and pushes the burnt gas out.' },
      { id: 'crankshaft', caption: 'The crankshaft turns up-and-down into round-and-round.' },
      { id: 'all-eight', caption: 'All eight cylinders take turns, so the crank spins smoothly.' },
    ],
    hasFreePlay: true,
  },
  mount(container) {
    const note = document.createElement('p');
    note.textContent = v8Engine.manifest.summary;
    container.appendChild(note);
    return () => note.remove();
  },
};

export default v8Engine;
