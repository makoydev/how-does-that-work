import { describe, expect, it } from 'vitest';
import { CYLINDER_ONE, CYLINDER_ONE_TOP, pistonTravel, poseAt, type V8StepId } from './enginePose';

describe('pistonTravel', () => {
  it('is 0 at top dead centre, where the crankpin points up the cylinder', () => {
    expect(pistonTravel(CYLINDER_ONE_TOP, CYLINDER_ONE)).toBeCloseTo(0);
  });

  it('is 1 at bottom dead centre, half a turn later', () => {
    expect(pistonTravel(CYLINDER_ONE_TOP + Math.PI, CYLINDER_ONE)).toBeCloseTo(1);
  });

  it('is strictly between the two a quarter turn after the top', () => {
    const travel = pistonTravel(CYLINDER_ONE_TOP + Math.PI / 2, CYLINDER_ONE);
    expect(travel).toBeGreaterThan(0.2);
    expect(travel).toBeLessThan(0.8);
  });
});

const travelOfCylinderOne = (crankAngle: number) => pistonTravel(crankAngle, CYLINDER_ONE);

describe('poseAt during intake', () => {
  it('starts with the piston at the top, the intake valve shut, and nothing in the cylinder', () => {
    const pose = poseAt('intake', 0);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeCloseTo(0);
    expect(pose.cylinderOne.intakeValve).toBe(0);
    expect(pose.cylinderOne.charge).toBe('none');
  });

  it('has the intake valve open and blue mixture filling as the piston drops', () => {
    const pose = poseAt('intake', 0.5);
    expect(pose.cylinderOne.intakeValve).toBe(1);
    expect(pose.cylinderOne.exhaustValve).toBe(0);
    expect(pose.cylinderOne.charge).toBe('fresh');
    expect(pose.cylinderOne.fill).toBeGreaterThan(0);
    expect(pose.cylinderOne.fill).toBeLessThan(1);
  });

  it('ends with the piston at the bottom and the cylinder full', () => {
    const pose = poseAt('intake', 1);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeCloseTo(1);
    expect(pose.cylinderOne.fill).toBe(1);
  });

  it('lights the piston and the intake valve as the parts moving now', () => {
    expect(poseAt('intake', 0.5).lit).toEqual(['piston-one', 'intake-valve-one']);
  });
});

describe('poseAt during compression', () => {
  it('shuts both valves and raises the piston while the mixture goes pale', () => {
    const pose = poseAt('compression', 0.5);
    expect(pose.cylinderOne.intakeValve).toBe(0);
    expect(pose.cylinderOne.exhaustValve).toBe(0);
    expect(pose.cylinderOne.charge).toBe('fresh');
    expect(travelOfCylinderOne(pose.crankAngle)).toBeGreaterThan(0);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeLessThan(1);
    expect(pose.cylinderOne.pale).toBeCloseTo(0.5);
  });

  it('ends at the top with fully pale mixture and only the piston lit', () => {
    const pose = poseAt('compression', 1);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeCloseTo(0);
    expect(pose.cylinderOne.pale).toBe(1);
    expect(pose.lit).toEqual(['piston-one']);
  });
});

describe('poseAt during power', () => {
  it('flashes a spark at the start and turns the charge to burning gas', () => {
    const pose = poseAt('power', 0.02);
    expect(pose.cylinderOne.spark).toBeGreaterThan(0.5);
    expect(pose.cylinderOne.charge).toBe('burning');
  });

  it('has shoved the piston to the bottom with the spark gone by the end', () => {
    const pose = poseAt('power', 1);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeCloseTo(1);
    expect(pose.cylinderOne.spark).toBe(0);
    expect(pose.cylinderOne.charge).toBe('burning');
    expect(pose.cylinderOne.fill).toBe(1);
  });
});

describe('poseAt during exhaust', () => {
  it('opens the exhaust valve and lets grey gas out as the piston rises', () => {
    const pose = poseAt('exhaust', 0.5);
    expect(pose.cylinderOne.exhaustValve).toBe(1);
    expect(pose.cylinderOne.intakeValve).toBe(0);
    expect(pose.cylinderOne.charge).toBe('burnt');
    expect(pose.cylinderOne.fill).toBeCloseTo(0.5);
    expect(pose.lit).toEqual(['piston-one', 'exhaust-valve-one']);
  });

  it('ends with the piston at the top and the cylinder empty', () => {
    const pose = poseAt('exhaust', 1);
    expect(travelOfCylinderOne(pose.crankAngle)).toBeCloseTo(0);
    expect(pose.cylinderOne.fill).toBe(0);
  });
});

describe('poseAt across the four strokes', () => {
  it.each<[V8StepId, V8StepId]>([
    ['intake', 'compression'],
    ['compression', 'power'],
    ['power', 'exhaust'],
  ])('leaves %s exactly where %s begins', (earlier, later) => {
    const end = poseAt(earlier, 1);
    const start = poseAt(later, 0);
    expect(travelOfCylinderOne(start.crankAngle)).toBeCloseTo(travelOfCylinderOne(end.crankAngle));
    expect(start.cylinderOne.intakeValve).toBe(end.cylinderOne.intakeValve);
    expect(start.cylinderOne.exhaustValve).toBe(end.cylinderOne.exhaustValve);
    expect(start.cylinderOne.fill).toBe(end.cylinderOne.fill);
  });

  it('turns the crank two full turns from the start of intake to the end of exhaust', () => {
    const turned = poseAt('exhaust', 1).crankAngle - poseAt('intake', 0).crankAngle;
    expect(turned).toBeCloseTo(4 * Math.PI);
  });
});

describe('poseAt while meeting the parts', () => {
  it('names the block first, lighting only the block', () => {
    const pose = poseAt('parts', 0);
    expect(pose.label?.name).toBe('Block');
    expect(pose.lit).toEqual(['block']);
  });

  it('moves on to the next part as time passes, with a plain meaning for each', () => {
    const named = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => poseAt('parts', t).label?.name);
    expect(named).toEqual(['Block', 'Cylinders', 'Pistons', 'Connecting rods', 'Crankshaft', 'Valves']);
    for (const t of [0, 0.2, 0.4, 0.6, 0.8, 1]) expect(poseAt('parts', t).label?.meaning).toBeTruthy();
  });

  it('keeps the engine still, at rest, and empty', () => {
    const start = poseAt('parts', 0);
    const end = poseAt('parts', 1);
    expect(end.crankAngle).toBe(start.crankAngle);
    expect(travelOfCylinderOne(end.crankAngle)).toBeCloseTo(0);
    expect(end.cylinderOne.charge).toBe('none');
  });

  it('shows no part label once the strokes begin', () => {
    expect(poseAt('intake', 0).label).toBeNull();
  });
});

describe('poseAt with awkward input', () => {
  it('holds the end pose when asked for progress past 1', () => {
    expect(poseAt('intake', 7)).toEqual(poseAt('intake', 1));
  });

  it('holds the start pose when asked for negative progress', () => {
    expect(poseAt('exhaust', -3)).toEqual(poseAt('exhaust', 0));
  });

  it('refuses a Step it does not know by name', () => {
    expect(() => poseAt('warp-drive' as V8StepId, 0)).toThrow('warp-drive');
  });
});
