import type { WalkthroughPhase } from '../shared/exhibitContract';

export interface WalkthroughShape {
  stepCount: number;
  hasFreePlay: boolean;
}

export interface WalkthroughState {
  readonly stepIndex: number;
  readonly phase: WalkthroughPhase;
}

export interface WalkthroughController extends WalkthroughState {
  /** False on the first Step, so the Previous button can be disabled honestly. */
  readonly canGoPrevious: boolean;
  /** False on the last Step of an Exhibit without Free Play. */
  readonly canGoNext: boolean;
  next(): void;
  previous(): void;
  /** Go straight to a Step. Out-of-range indexes are ignored. */
  jumpTo(stepIndex: number): void;
  /** Does nothing for an Exhibit without Free Play. */
  enterFreePlay(): void;
  /** Back to the last Step. */
  leaveFreePlay(): void;
  /** Hear about every change of Step or phase. Returns an unsubscribe. */
  onChange(listener: (state: WalkthroughState) => void): () => void;
}

/**
 * The pure state of paging through a Walkthrough. Knows only how many Steps
 * there are and whether Free Play exists; never touches the DOM or the model.
 */
export function createWalkthroughController(shape: WalkthroughShape): WalkthroughController {
  if (shape.stepCount < 1) throw new Error('A Walkthrough needs at least one Step');
  const lastStep = shape.stepCount - 1;
  let stepIndex = 0;
  let phase: WalkthroughPhase = 'walkthrough';
  const listeners = new Set<(state: WalkthroughState) => void>();

  const inWalkthrough = () => phase === 'walkthrough';
  const canGoPrevious = () => inWalkthrough() && stepIndex > 0;
  const canGoNext = () => inWalkthrough() && (stepIndex < lastStep || shape.hasFreePlay);

  const set = (nextStepIndex: number, nextPhase: WalkthroughPhase) => {
    if (nextStepIndex === stepIndex && nextPhase === phase) return;
    stepIndex = nextStepIndex;
    phase = nextPhase;
    const state = { stepIndex, phase };
    for (const listener of listeners) listener(state);
  };

  const enterFreePlay = () => {
    if (shape.hasFreePlay) set(lastStep, 'free play');
  };

  return {
    get stepIndex() {
      return stepIndex;
    },
    get phase() {
      return phase;
    },
    get canGoPrevious() {
      return canGoPrevious();
    },
    get canGoNext() {
      return canGoNext();
    },
    next: () => {
      if (!canGoNext()) return;
      if (stepIndex < lastStep) set(stepIndex + 1, phase);
      else enterFreePlay();
    },
    previous: () => {
      if (canGoPrevious()) set(stepIndex - 1, phase);
    },
    jumpTo: (target) => {
      if (Number.isInteger(target) && target >= 0 && target <= lastStep) set(target, 'walkthrough');
    },
    enterFreePlay,
    leaveFreePlay: () => set(lastStep, 'walkthrough'),
    onChange: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
