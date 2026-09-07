/**
 * The pure geometry and timeline of the V8: where every piston is for a given
 * crank angle, and what the engine looks like at any point of any Step. No
 * Three.js here, so it can be tested with plain numbers.
 *
 * Frame: the crankshaft runs along X. Each cylinder's axis lies in the YZ
 * plane, tilted `bankAngle` from straight up; the two banks tilt opposite
 * ways to make the V. Distances are in metres of model space.
 */

export interface CylinderSpec {
  /** Tilt of the cylinder axis from vertical, positive toward +Z (the near bank). */
  bankAngle: number;
  /** Where along the crankshaft the cylinder sits. */
  x: number;
  /** The angle of this cylinder's crankpin ahead of the crank's own angle. */
  throwOffset: number;
}

/** Half the piston's full travel: how far the crankpin sits from the crank axis. */
export const CRANK_RADIUS = 0.18;
/** Pin-to-pin length of a connecting rod. */
export const ROD_LENGTH = 0.55;
export const BANK_ANGLE = Math.PI / 4;

export interface CrankPinSpec {
  x: number;
  /** The angle of this crankpin ahead of the crank's own angle. */
  throwOffset: number;
}

/** The four crankpins of a cross-plane V8, from the +X end, each shared by one cylinder per bank. */
export const CRANK_PINS: readonly CrankPinSpec[] = [
  { x: 0.9, throwOffset: 0 },
  { x: 0.3, throwOffset: Math.PI / 2 },
  { x: -0.3, throwOffset: (3 * Math.PI) / 2 },
  { x: -0.9, throwOffset: Math.PI },
];
/** Each bank sits a little to one side of its shared crankpin, so two rods fit. */
const BANK_X_OFFSET = 0.04;

/** Eight cylinders: the near bank first, then the far bank, each pair sharing a crankpin. */
export const CYLINDERS: readonly CylinderSpec[] = [
  ...CRANK_PINS.map((pin) => ({ bankAngle: BANK_ANGLE, x: pin.x + BANK_X_OFFSET, throwOffset: pin.throwOffset })),
  ...CRANK_PINS.map((pin) => ({ bankAngle: -BANK_ANGLE, x: pin.x - BANK_X_OFFSET, throwOffset: pin.throwOffset })),
];

/** The cylinder the Walkthrough follows: nearest the camera on the near bank. */
export const CYLINDER_ONE: CylinderSpec = CYLINDERS[0] as CylinderSpec;

const TOP_DEAD_CENTRE = ROD_LENGTH + CRANK_RADIUS;
const BOTTOM_DEAD_CENTRE = ROD_LENGTH - CRANK_RADIUS;

/** Distance of the piston's centre from the crank axis, measured along the cylinder axis. */
export function pistonOffset(crankAngle: number, cylinder: CylinderSpec): number {
  const pinAngle = crankAngle + cylinder.throwOffset - cylinder.bankAngle;
  const along = CRANK_RADIUS * Math.cos(pinAngle);
  const across = CRANK_RADIUS * Math.sin(pinAngle);
  return along + Math.sqrt(ROD_LENGTH * ROD_LENGTH - across * across);
}

/** 0 with the piston at the top of its travel, 1 at the bottom. */
export function pistonTravel(crankAngle: number, cylinder: CylinderSpec): number {
  return (TOP_DEAD_CENTRE - pistonOffset(crankAngle, cylinder)) / (TOP_DEAD_CENTRE - BOTTOM_DEAD_CENTRE);
}

export type Part =
  | 'block'
  | 'cylinders'
  | 'pistons'
  | 'rods'
  | 'crankshaft'
  | 'valves'
  | 'piston-one'
  | 'rod-one'
  | 'intake-valve-one'
  | 'exhaust-valve-one';

/** What is in cylinder one: nothing, fresh mixture, burning gas, or burnt gas. */
export type Charge = 'none' | 'fresh' | 'burning' | 'burnt';

export interface CylinderOneState {
  /** 0 shut, 1 fully open. */
  intakeValve: number;
  exhaustValve: number;
  charge: Charge;
  /** How much of the space above the piston the charge takes up, 0 to 1. */
  fill: number;
  /** How pale the fresh mixture has gone from being squeezed, 0 to 1. */
  pale: number;
  /** Brightness of the spark flash, 0 to 1. */
  spark: number;
}

export interface NameTag {
  name: string;
  meaning: string;
}

export interface EnginePose {
  crankAngle: number;
  cylinderOne: CylinderOneState;
  /** The parts drawn in the active-part yellow: whatever is moving or being named now. */
  lit: readonly Part[];
  /** Shown over the model while a Step is naming parts. */
  nameTag: NameTag | null;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** 0 until `from`, 1 from `to` on, straight in between. */
const ramp = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));

const RESTING_CYLINDER: CylinderOneState = {
  intakeValve: 0,
  exhaustValve: 0,
  charge: 'none',
  fill: 0,
  pale: 0,
  spark: 0,
};

/** How long, as a share of a stroke, a valve takes to open or shut. */
const VALVE_SWING = 0.25;
/** How long, as a share of the power stroke, the spark flash takes to fade. */
const SPARK_FADE = 0.2;

/** The cast, in the order the "meet the parts" Step names them. */
const PARTS_IN_ORDER: readonly { part: Part; name: string; meaning: string }[] = [
  { part: 'block', name: 'Block', meaning: 'The metal body that holds every other part.' },
  { part: 'cylinders', name: 'Cylinders', meaning: 'Eight tubes, in two rows that meet in a V.' },
  { part: 'pistons', name: 'Pistons', meaning: 'Plugs that slide up and down inside the cylinders.' },
  { part: 'rods', name: 'Connecting rods', meaning: 'Arms that link each piston to the crankshaft.' },
  { part: 'crankshaft', name: 'Crankshaft', meaning: 'The bent shaft the pistons push around and around.' },
  { part: 'valves', name: 'Valves', meaning: 'Small doors in the top of each cylinder that let gas in and out.' },
];

/** The crank angle putting cylinder one at the top of its travel. */
const CYLINDER_ONE_TOP = CYLINDER_ONE.bankAngle - CYLINDER_ONE.throwOffset;

/** Crank angle `progress` of the way through one of cylinder one's four strokes. */
const strokeCrankAngle = (stroke: number, progress: number) =>
  CYLINDER_ONE_TOP + (stroke + progress) * Math.PI;

/** The engine at `progress` (0 to 1) through the Step named `stepId`. */
export function poseAt(stepId: string, progress: number): EnginePose {
  const t = clamp01(progress);
  switch (stepId) {
    case 'parts': {
      const named = PARTS_IN_ORDER[Math.min(PARTS_IN_ORDER.length - 1, Math.floor(t * PARTS_IN_ORDER.length))];
      if (!named) throw new Error('The V8 has no parts to name');
      return {
        crankAngle: CYLINDER_ONE_TOP,
        cylinderOne: RESTING_CYLINDER,
        lit: [named.part],
        nameTag: { name: named.name, meaning: named.meaning },
      };
    }
    case 'intake':
      return {
        crankAngle: strokeCrankAngle(0, t),
        cylinderOne: {
          ...RESTING_CYLINDER,
          intakeValve: ramp(t, 0, VALVE_SWING),
          charge: t > 0 ? 'fresh' : 'none',
          fill: t,
        },
        lit: ['piston-one', 'intake-valve-one'],
        nameTag: null,
      };
    case 'compression':
      return {
        crankAngle: strokeCrankAngle(1, t),
        cylinderOne: {
          ...RESTING_CYLINDER,
          intakeValve: 1 - ramp(t, 0, VALVE_SWING),
          charge: 'fresh',
          fill: 1,
          pale: t,
        },
        lit: ['piston-one'],
        nameTag: null,
      };
    case 'power':
      return {
        crankAngle: strokeCrankAngle(2, t),
        cylinderOne: {
          ...RESTING_CYLINDER,
          charge: 'burning',
          fill: 1,
          spark: 1 - ramp(t, 0, SPARK_FADE),
        },
        lit: ['piston-one'],
        nameTag: null,
      };
    case 'exhaust':
      return {
        crankAngle: strokeCrankAngle(3, t),
        cylinderOne: {
          ...RESTING_CYLINDER,
          exhaustValve: ramp(t, 0, VALVE_SWING),
          charge: 'burnt',
          fill: 1 - t,
        },
        lit: ['piston-one', 'exhaust-valve-one'],
        nameTag: null,
      };
    default:
      throw new Error(`The V8 has no Step "${stepId}"`);
  }
}
