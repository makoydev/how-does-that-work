import type { Exhibit } from '../shared/exhibitContract';
import type { WalkthroughController } from './walkthroughController';

export interface WalkthroughView {
  dispose(): void;
}

const FREE_PLAY_CAPTION =
  'Free Play. Try the controls, and come back to the Walkthrough any time to re-read a Step.';

/**
 * The panel under an open Exhibit: caption, Step dots, Previous, Next, Free
 * Play, Close, and the Learn More sources. Everything it shows comes from the
 * controller; it never autoplays. Left and right arrows page Steps and
 * Escape closes.
 */
export function createWalkthroughView(
  container: HTMLElement,
  exhibit: Exhibit,
  controller: WalkthroughController,
  onClose: () => void,
): WalkthroughView {
  const { steps, hasFreePlay } = exhibit.walkthrough;

  const panel = document.createElement('section');
  panel.className = 'walkthrough';
  panel.setAttribute('aria-label', `${exhibit.manifest.title} Walkthrough`);
  panel.innerHTML = `
    <header class="walkthrough__header">
      <h2 class="walkthrough__title"></h2>
      <button type="button" class="walkthrough__close">Close <kbd>Esc</kbd></button>
    </header>
    <p class="walkthrough__caption" aria-live="polite"></p>
    <nav class="walkthrough__nav">
      <button type="button" class="walkthrough__previous">&larr; Previous</button>
      <ol class="walkthrough__dots" aria-label="Steps"></ol>
      <button type="button" class="walkthrough__next">Next &rarr;</button>
    </nav>
    <div class="walkthrough__extras">
      <button type="button" class="walkthrough__free-play" hidden>Free Play</button>
      <button type="button" class="walkthrough__leave-free-play" hidden>Back to the Walkthrough</button>
      <div class="walkthrough__learn-more" hidden>
        <h3>Learn more</h3>
        <ul></ul>
      </div>
    </div>
  `;

  const find = <T extends HTMLElement>(selector: string): T => {
    const element = panel.querySelector<T>(selector);
    if (!element) throw new Error(`Walkthrough view is missing ${selector}`);
    return element;
  };
  const title = find<HTMLHeadingElement>('.walkthrough__title');
  const caption = find<HTMLParagraphElement>('.walkthrough__caption');
  const previous = find<HTMLButtonElement>('.walkthrough__previous');
  const next = find<HTMLButtonElement>('.walkthrough__next');
  const dots = find<HTMLOListElement>('.walkthrough__dots');
  const freePlay = find<HTMLButtonElement>('.walkthrough__free-play');
  const leaveFreePlay = find<HTMLButtonElement>('.walkthrough__leave-free-play');
  const learnMore = find<HTMLDivElement>('.walkthrough__learn-more');
  const sources = find<HTMLUListElement>('.walkthrough__learn-more ul');
  const close = find<HTMLButtonElement>('.walkthrough__close');

  title.textContent = exhibit.manifest.title;

  const dotButtons = steps.map((step, index) => {
    const item = document.createElement('li');
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'walkthrough__dot';
    dot.setAttribute('aria-label', `Step ${index + 1} of ${steps.length}: ${step.id}`);
    dot.addEventListener('click', () => controller.jumpTo(index));
    item.appendChild(dot);
    dots.appendChild(item);
    return dot;
  });

  for (const source of exhibit.manifest.sources) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.label;
    item.appendChild(link);
    sources.appendChild(item);
  }

  const render = () => {
    const { stepIndex, phase, isOnLastStep: onLastStep } = controller;
    const inFreePlay = phase === 'free play';

    caption.textContent = inFreePlay ? FREE_PLAY_CAPTION : (steps[stepIndex]?.caption ?? '');
    previous.disabled = !controller.canGoPrevious;
    next.disabled = !controller.canGoNext;
    dotButtons.forEach((dot, index) => {
      const current = index === stepIndex && !inFreePlay;
      dot.classList.toggle('is-current', current);
      dot.setAttribute('aria-current', current ? 'step' : 'false');
    });
    freePlay.hidden = !(hasFreePlay && onLastStep && !inFreePlay);
    leaveFreePlay.hidden = !inFreePlay;
    learnMore.hidden = !onLastStep;
  };

  previous.addEventListener('click', () => controller.previous());
  next.addEventListener('click', () => controller.next());
  freePlay.addEventListener('click', () => controller.enterFreePlay());
  leaveFreePlay.addEventListener('click', () => controller.leaveFreePlay());
  close.addEventListener('click', onClose);

  const onKeyDown = (event: KeyboardEvent) => {
    // In Free Play the arrows belong to the Exhibit's own controls.
    const paging = controller.phase === 'walkthrough';
    switch (event.key) {
      case 'ArrowLeft':
        if (!paging) return;
        controller.previous();
        break;
      case 'ArrowRight':
        if (!paging) return;
        controller.next();
        break;
      case 'Escape':
        onClose();
        break;
      default:
        return;
    }
    event.preventDefault();
  };
  document.addEventListener('keydown', onKeyDown);
  const unsubscribe = controller.onChange(render);

  render();
  container.appendChild(panel);

  return {
    dispose: () => {
      unsubscribe();
      document.removeEventListener('keydown', onKeyDown);
      panel.remove();
    },
  };
}
