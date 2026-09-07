import { describe, expect, it } from 'vitest';
import v8Engine from '../exhibits/v8-engine';
import { createWalkthroughController } from './walkthroughController';

/** The first real Exhibit's Step list, so it is covered without a special test. */
const v8 = {
  stepCount: v8Engine.walkthrough.steps.length,
  hasFreePlay: v8Engine.walkthrough.hasFreePlay,
};

describe('createWalkthroughController', () => {
  it('starts on the first Step in the walkthrough phase', () => {
    const controller = createWalkthroughController(v8);
    expect(controller.stepIndex).toBe(0);
    expect(controller.phase).toBe('walkthrough');
  });
});

describe('createWalkthroughController paging', () => {
  it('moves forward one Step on next', () => {
    const controller = createWalkthroughController(v8);
    controller.next();
    expect(controller.stepIndex).toBe(1);
  });

  it('moves back one Step on previous', () => {
    const controller = createWalkthroughController(v8);
    controller.next();
    controller.next();
    controller.previous();
    expect(controller.stepIndex).toBe(1);
  });
});

describe('createWalkthroughController at the first Step', () => {
  it('ignores previous and reports that it cannot go back', () => {
    const controller = createWalkthroughController(v8);
    controller.previous();
    expect(controller.stepIndex).toBe(0);
    expect(controller.canGoPrevious).toBe(false);
  });

  it('reports that it can go back once past the first Step', () => {
    const controller = createWalkthroughController(v8);
    controller.next();
    expect(controller.canGoPrevious).toBe(true);
  });
});

describe('createWalkthroughController at the last Step without Free Play', () => {
  it('ignores next and stays in the walkthrough phase', () => {
    const controller = createWalkthroughController({ stepCount: 2, hasFreePlay: false });
    controller.next();
    controller.next();
    expect(controller.stepIndex).toBe(1);
    expect(controller.phase).toBe('walkthrough');
    expect(controller.canGoNext).toBe(false);
  });
});

describe('createWalkthroughController at the last Step with Free Play', () => {
  it('enters Free Play on next', () => {
    const controller = createWalkthroughController({ stepCount: 2, hasFreePlay: true });
    controller.next();
    controller.next();
    expect(controller.phase).toBe('free play');
  });

  it('returns to the last Step on leaving Free Play', () => {
    const controller = createWalkthroughController({ stepCount: 2, hasFreePlay: true });
    controller.next();
    controller.enterFreePlay();
    controller.leaveFreePlay();
    expect(controller.phase).toBe('walkthrough');
    expect(controller.stepIndex).toBe(1);
  });

  it('reports being on the last Step in both phases', () => {
    const controller = createWalkthroughController({ stepCount: 2, hasFreePlay: true });
    expect(controller.isOnLastStep).toBe(false);
    controller.next();
    expect(controller.isOnLastStep).toBe(true);
    controller.enterFreePlay();
    expect(controller.isOnLastStep).toBe(true);
  });
});

describe('createWalkthroughController guarding Free Play', () => {
  it('ignores entering Free Play before the last Step', () => {
    const controller = createWalkthroughController({ stepCount: 3, hasFreePlay: true });
    controller.enterFreePlay();
    expect(controller.phase).toBe('walkthrough');
    expect(controller.stepIndex).toBe(0);
  });

  it('ignores entering Free Play when the Exhibit has none', () => {
    const controller = createWalkthroughController(v8);
    controller.jumpTo(v8.stepCount - 1);
    controller.enterFreePlay();
    expect(controller.phase).toBe('walkthrough');
  });

  it('ignores leaving Free Play while still in the walkthrough phase', () => {
    const controller = createWalkthroughController({ stepCount: 3, hasFreePlay: true });
    controller.leaveFreePlay();
    expect(controller.stepIndex).toBe(0);
  });
});

describe('createWalkthroughController jumping to a Step', () => {
  it('lands on the chosen Step', () => {
    const controller = createWalkthroughController(v8);
    controller.jumpTo(2);
    expect(controller.stepIndex).toBe(2);
  });

  it('rejects a Step past the end and stays put', () => {
    const controller = createWalkthroughController(v8);
    controller.next();
    controller.jumpTo(v8.stepCount);
    expect(controller.stepIndex).toBe(1);
  });

  it('rejects a negative Step and stays put', () => {
    const controller = createWalkthroughController(v8);
    controller.jumpTo(-1);
    expect(controller.stepIndex).toBe(0);
  });

  it('returns to the walkthrough phase when jumping from Free Play', () => {
    const controller = createWalkthroughController({ stepCount: 3, hasFreePlay: true });
    controller.jumpTo(2);
    controller.enterFreePlay();
    controller.jumpTo(1);
    expect(controller.phase).toBe('walkthrough');
    expect(controller.stepIndex).toBe(1);
  });
});

describe('createWalkthroughController telling listeners about changes', () => {
  it('reports the new Step and phase after each change', () => {
    const controller = createWalkthroughController({ stepCount: 2, hasFreePlay: true });
    const seen: string[] = [];
    controller.onChange((state) => seen.push(`${state.stepIndex}/${state.phase}`));
    controller.next();
    controller.next();
    controller.leaveFreePlay();
    expect(seen).toEqual(['1/walkthrough', '1/free play', '1/walkthrough']);
  });

  it('stays quiet when a move is a no-op', () => {
    const controller = createWalkthroughController(v8);
    const seen: number[] = [];
    controller.onChange((state) => seen.push(state.stepIndex));
    controller.previous();
    controller.jumpTo(99);
    expect(seen).toEqual([]);
  });

  it('stops reporting after unsubscribing', () => {
    const controller = createWalkthroughController(v8);
    const seen: number[] = [];
    const unsubscribe = controller.onChange((state) => seen.push(state.stepIndex));
    controller.next();
    unsubscribe();
    controller.next();
    expect(seen).toEqual([1]);
  });
});
