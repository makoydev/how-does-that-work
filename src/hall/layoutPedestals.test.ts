import { describe, expect, it } from 'vitest';
import { layoutPedestals } from './layoutPedestals';

const options = { spacing: 4, margin: 4, minWidth: 12, minDepth: 12 };

describe('layoutPedestals', () => {
  it('puts a single pedestal at the centre of a minimum-size Hall', () => {
    const layout = layoutPedestals(1, options);
    expect(layout.columns).toBe(1);
    expect(layout.rows).toBe(1);
    expect(layout.positions).toEqual([{ x: 0, z: 0 }]);
    expect(layout.hall).toEqual({ width: 12, depth: 12 });
  });
});

describe('layoutPedestals with several pedestals', () => {
  it('fills a two-by-two grid left to right, then front to back', () => {
    const layout = layoutPedestals(4, options);
    expect(layout.columns).toBe(2);
    expect(layout.rows).toBe(2);
    // The front row is the positive-Z side, where the Visitor spawns.
    expect(layout.positions).toEqual([
      { x: -2, z: 2 },
      { x: 2, z: 2 },
      { x: -2, z: -2 },
      { x: 2, z: -2 },
    ]);
  });

  it('adds a row before it adds a fourth column', () => {
    const layout = layoutPedestals(5, options);
    expect(layout.columns).toBe(3);
    expect(layout.rows).toBe(2);
    expect(layout.positions).toHaveLength(5);
    expect(layout.positions[3]).toEqual({ x: -4, z: -2 });
    expect(layout.positions[4]).toEqual({ x: 0, z: -2 });
  });

  it('grows the Hall to fit the grid plus the margin', () => {
    const layout = layoutPedestals(9, options);
    expect(layout.hall).toEqual({ width: 16, depth: 16 });
  });

  it('keeps the Hall at its minimum size with no Exhibits', () => {
    const layout = layoutPedestals(0, options);
    expect(layout.positions).toEqual([]);
    expect(layout.hall).toEqual({ width: 12, depth: 12 });
  });
});
