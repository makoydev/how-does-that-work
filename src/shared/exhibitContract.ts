import type * as THREE from 'three';

/** Somewhere to go for depth. Every Exhibit lists at least one. */
export interface ExhibitSource {
  label: string;
  url: string;
}

export interface ExhibitManifest {
  /** URL-safe identifier, also the Exhibit's folder name and hash route. */
  slug: string;
  title: string;
  /** Subject area, such as "Engines". The Hall orders pedestals by it. */
  category: string;
  /** One line, shown on the pedestal placard and in the overlay. */
  summary: string;
  sources: readonly ExhibitSource[];
}

/** One stage of a Walkthrough: a single change to the model plus a caption. */
export interface Step {
  id: string;
  /** At most two short plain sentences. Define any technical word inline. */
  caption: string;
}

export interface WalkthroughDefinition {
  steps: readonly Step[];
  /** Whether a Free Play button appears after the last Step. */
  hasFreePlay: boolean;
}

export type WalkthroughPhase = 'walkthrough' | 'free play';

/**
 * What a mounted Exhibit is handed so it can react to the Visitor paging
 * through the Walkthrough. Subscriptions return an unsubscribe function.
 */
export interface ExhibitHandle {
  readonly stepIndex: number;
  readonly phase: WalkthroughPhase;
  onStepChange(listener: (stepIndex: number) => void): () => void;
  onPhaseChange(listener: (phase: WalkthroughPhase) => void): () => void;
}

/**
 * The one object an Exhibit folder exports as its default. Exhibits import
 * only Three.js, the shared palette, and these types. See ADR 0001.
 */
export interface Exhibit {
  manifest: ExhibitManifest;
  walkthrough: WalkthroughDefinition;
  /**
   * Render into `container` and return a function that tears everything
   * down. The Exhibit creates its own canvas if it needs one and owns its
   * own render loop.
   */
  mount(container: HTMLElement, handle: ExhibitHandle): () => void;
  /** A small model for the pedestal. Without one the pedestal shows a placard only. */
  miniModel?(): THREE.Object3D;
}
