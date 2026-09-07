import type { Exhibit, ExhibitHandle } from '../shared/exhibitContract';
import {
  createWalkthroughController,
  type WalkthroughController,
} from '../walkthrough/walkthroughController';
import { createWalkthroughView } from '../walkthrough/walkthroughView';

export interface OpenExhibit {
  /** Unmount the Exhibit and remove the overlay. Calls the `onClose` given at open. */
  close(): void;
}

/**
 * The full-screen overlay that hosts one open Exhibit: a stage the Exhibit
 * mounts into and owns, and the Walkthrough panel beneath it. The caller
 * pauses the Hall behind it and resumes it on close.
 */
export function openExhibit(container: HTMLElement, exhibit: Exhibit, onClose: () => void): OpenExhibit {
  const overlay = document.createElement('div');
  overlay.className = 'exhibit-overlay';
  overlay.tabIndex = -1;

  const stage = document.createElement('div');
  stage.className = 'exhibit-overlay__stage';
  overlay.appendChild(stage);

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

  const unmount = exhibit.mount(stage, createExhibitHandle(controller));
  const view = createWalkthroughView(overlay, exhibit, controller, close);

  container.appendChild(overlay);
  overlay.focus();

  return { close };
}

/** Lets a mounted Exhibit follow the controller without being able to drive it. */
function createExhibitHandle(controller: WalkthroughController): ExhibitHandle {
  return {
    get stepIndex() {
      return controller.stepIndex;
    },
    get phase() {
      return controller.phase;
    },
    onStepChange: (listener) => {
      let last = controller.stepIndex;
      return controller.onChange(({ stepIndex }) => {
        if (stepIndex === last) return;
        last = stepIndex;
        listener(stepIndex);
      });
    },
    onPhaseChange: (listener) => {
      let last = controller.phase;
      return controller.onChange(({ phase }) => {
        if (phase === last) return;
        last = phase;
        listener(phase);
      });
    },
  };
}
