import type { Exhibit } from '../../shared/exhibitContract';

/**
 * The V8 engine. For now a stub that proves the open-and-page path: a full
 * manifest, placeholder Steps, and a mount that shows which Step the
 * Visitor is on. The model, the real captions, Free Play, and the mini model
 * arrive in later tickets.
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
      { id: 'parts', caption: 'Meet the parts. The model arrives in a later ticket.' },
      { id: 'intake', caption: 'Intake. The model arrives in a later ticket.' },
      { id: 'crankshaft', caption: 'Crankshaft. The model arrives in a later ticket.' },
    ],
    hasFreePlay: false,
  },
  mount(container, handle) {
    const note = document.createElement('p');
    const showStep = (stepIndex: number) => {
      const step = v8Engine.walkthrough.steps[stepIndex];
      note.textContent = `${v8Engine.manifest.summary} (Step ${stepIndex + 1}: ${step?.id})`;
    };
    showStep(handle.stepIndex);
    const unsubscribe = handle.onStepChange(showStep);
    container.appendChild(note);
    return () => {
      unsubscribe();
      note.remove();
    };
  },
};

export default v8Engine;
