import type { Step } from '../../shared/exhibitContract';
import type { V8StepId } from './enginePose';

export interface CameraPose {
  position: readonly [number, number, number];
  /** The point the camera looks at. */
  target: readonly [number, number, number];
}

export interface V8Step extends Step {
  id: V8StepId;
  /** Seconds the Step's one change takes to play. */
  duration: number;
  /** 'even' is steady; 'smooth' eases in and out; 'shove' starts fast and settles. */
  easing: 'even' | 'smooth' | 'shove';
  camera: CameraPose;
}

/** The middle of cylinder one's travel, which the stroke Steps keep in the centre of the picture. */
const CYLINDER_ONE_CENTRE = [0.92, 0.5, 0.45] as const;

const STROKE_SECONDS = 2.4;

/**
 * Steps one to five: meet the parts, then the four strokes of cylinder one.
 * Each Step animates exactly one change; the captions are at most two plain
 * sentences and define a technical word where it first appears.
 */
export const STEPS: readonly V8Step[] = [
  {
    id: 'parts',
    caption:
      'A V8 has eight cylinders, the tubes where fuel burns, set in two rows that meet in a V. ' +
      'Each part lights up as it is named, from the block that holds everything to the valves that let gas in and out.',
    duration: 7.2,
    easing: 'even',
    camera: { position: [3.1, 2.2, 3.7], target: [0, 0.5, 0] },
  },
  {
    id: 'intake',
    caption:
      'The intake valve, the door that lets fuel and air in, opens as the piston, the plug inside the cylinder, slides down. ' +
      'The drop pulls a blue mixture of fuel and air into the cylinder.',
    duration: STROKE_SECONDS,
    easing: 'smooth',
    camera: { position: [2.5, 1.05, 1.25], target: CYLINDER_ONE_CENTRE },
  },
  {
    id: 'compression',
    caption:
      'Both valves close and the piston rises, squeezing the mixture into a much smaller space. ' +
      'The mixture turns paler as it is packed tight, and packed mixture burns with far more force.',
    duration: STROKE_SECONDS,
    easing: 'smooth',
    camera: { position: [2.4, 1.25, 0.95], target: CYLINDER_ONE_CENTRE },
  },
  {
    id: 'power',
    caption:
      'A spark lights the squeezed mixture and the hot orange gas shoves the piston down hard. ' +
      'Of the four strokes, each one trip of the piston up or down, this is the only one that makes power.',
    duration: STROKE_SECONDS,
    easing: 'shove',
    camera: { position: [2.2, 1.0, 1.1], target: CYLINDER_ONE_CENTRE },
  },
  {
    id: 'exhaust',
    caption:
      'The exhaust valve, the door that lets burnt gas out, opens as the piston rises again. ' +
      'The grey waste gas is pushed out, and the cylinder is empty and ready to start over.',
    duration: STROKE_SECONDS,
    easing: 'smooth',
    camera: { position: [2.9, 1.3, 0.85], target: CYLINDER_ONE_CENTRE },
  },
];
