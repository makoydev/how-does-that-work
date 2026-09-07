import type { Exhibit, ExhibitHandle } from '../shared/exhibitContract';
import {
  createWalkthroughController,
  type WalkthroughController,
  type WalkthroughState,
} from '../walkthrough/walkthroughController';
import { createWalkthroughView } from '../walkthrough/walkthroughView';

export interface OpenedExhibit {
  /** Unmount the Exhibit and remove the overlay. Calls the `onClose` given at open. */
  close(): void;
}

/**
 * The full-screen overlay that hosts one open Exhibit: a container the
 * Exhibit mounts into and owns, and the Walkthrough panel beneath it. The
 * caller pauses the Hall behind it and resumes it on close.
 */
export function openExhibit(
  container: HTMLElement,
  exhibit: Exhibit,
  onClose: () => void,
): OpenedExhibit {
  const overlay = document.createElement('div');
  overlay.className = 'exhibit-overlay';

  const exhibitContainer = document.createElement('div');
  exhibitContainer.className = 'exhibit-overlay__exhibit';
  overlay.appendChild(exhibitContainer);

  const controller = createWalkthroughController({
    stepCount: exhibit.walkthrough.steps.length,
    hasFreePlay: exhibit.walkthrough.hasFreePlay,
  });

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    view.dispose();
    unmount();
    overlay.remove();
    onClose();
  };

  // Attach first so an Exhibit that sizes a canvas from its container sees real dimensions.
  container.appendChild(overlay);
  const unmount = exhibit.mount(exhibitContainer, createExhibitHandle(controller));
  const view = createWalkthroughView(overlay, exhibit, controller, close);

  return { close };
}

/** Lets a mounted Exhibit follow the controller without being able to drive it. */
function createExhibitHandle(controller: WalkthroughController): ExhibitHandle {
  const onFieldChange = <T>(pick: (state: WalkthroughState) => T, listener: (value: T) => void) => {
    let last = pick(controller);
    return controller.onChange((state) => {
      const value = pick(state);
      if (value === last) return;
      last = value;
      listener(value);
    });
  };
  return {
    get stepIndex() {
      return controller.stepIndex;
    },
    get phase() {
      return controller.phase;
    },
    onStepChange: (listener) => onFieldChange((state) => state.stepIndex, listener),
    onPhaseChange: (listener) => onFieldChange((state) => state.phase, listener),
  };
}
