import type { PartLabel } from './enginePose';

/** The label that names a part while the model lights it up. */
export function createPartLabel(viewport: HTMLElement) {
  const box = document.createElement('div');
  Object.assign(box.style, {
    position: 'absolute',
    top: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: '26rem',
    padding: '0.6rem 1.1rem',
    borderRadius: '0.75rem',
    background: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    lineHeight: '1.4',
    pointerEvents: 'none',
  });
  const name = document.createElement('strong');
  Object.assign(name.style, { display: 'block', fontSize: '1.2rem' });
  const meaning = document.createElement('span');
  Object.assign(meaning.style, { display: 'block', fontSize: '0.95rem', color: '#4a4a4a' });
  box.append(name, meaning);
  box.hidden = true;
  viewport.appendChild(box);

  let shown: PartLabel | null = null;
  return {
    show(next: PartLabel | null) {
      if (next === shown || (next && shown && next.name === shown.name)) return;
      shown = next;
      box.hidden = next === null;
      if (next) {
        name.textContent = next.name;
        meaning.textContent = next.meaning;
      }
    },
  };
}
