import { describe, expect, it } from 'vitest';
import { moveVisitor } from './moveVisitor';

const room = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
const noKeys = { forward: false, back: false, left: false, right: false };

describe('moveVisitor', () => {
  it('walks forward along the direction the camera faces', () => {
    const next = moveVisitor({ x: 0, z: 0 }, 0, { ...noKeys, forward: true }, 1, room, 3);
    expect(next.x).toBeCloseTo(0);
    expect(next.z).toBeCloseTo(-3);
  });
});

describe('moveVisitor with a turned camera', () => {
  it('strafes to the camera\'s right after a quarter turn to the left', () => {
    // Facing yaw = +90deg looks along negative X; the camera's right is negative Z.
    const next = moveVisitor({ x: 0, z: 0 }, Math.PI / 2, { ...noKeys, right: true }, 1, room, 2);
    expect(next.x).toBeCloseTo(0);
    expect(next.z).toBeCloseTo(-2);
  });

  it('walks diagonally no faster than straight', () => {
    const next = moveVisitor({ x: 0, z: 0 }, 0, { ...noKeys, forward: true, right: true }, 1, room, 4);
    expect(Math.hypot(next.x, next.z)).toBeCloseTo(4);
    expect(next.x).toBeGreaterThan(0);
    expect(next.z).toBeLessThan(0);
  });
});

describe('moveVisitor at the Hall walls', () => {
  it('stops at the wall instead of walking through it', () => {
    const next = moveVisitor({ x: 0, z: -9.5 }, 0, { ...noKeys, forward: true }, 1, room, 3);
    expect(next.z).toBe(-10);
  });

  it('slides along a wall when walking into it diagonally', () => {
    const next = moveVisitor({ x: 0, z: -10 }, 0, { ...noKeys, forward: true, right: true }, 1, room, 2);
    expect(next.z).toBe(-10);
    expect(next.x).toBeCloseTo(Math.SQRT2);
  });

  it('stays put with no keys held', () => {
    expect(moveVisitor({ x: 1, z: 2 }, 0.7, noKeys, 0.016, room, 3)).toEqual({ x: 1, z: 2 });
  });
});
