import type { FloorPosition } from './moveVisitor';

export interface LayoutOptions {
  /** Distance between neighbouring pedestal centres. */
  spacing: number;
  /** Clear floor between the outermost pedestals and the walls. */
  margin: number;
  minWidth: number;
  minDepth: number;
}

export interface PedestalLayout {
  columns: number;
  rows: number;
  /** One floor position per pedestal, in the order the pedestals were given. */
  positions: FloorPosition[];
  hallWidth: number;
  hallDepth: number;
}

/**
 * A near-square grid centred on the origin. Pedestals fill it left to right
 * then front to back, where the front is the positive-Z side the Visitor
 * spawns on. The Hall grows to fit the grid plus a margin.
 */
export function layoutPedestals(count: number, options: LayoutOptions): PedestalLayout {
  const { spacing, margin, minWidth, minDepth } = options;
  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / columns));
  const left = -((columns - 1) * spacing) / 2;
  const front = ((rows - 1) * spacing) / 2;
  const positions = Array.from({ length: count }, (_, index) => ({
    x: left + (index % columns) * spacing,
    z: front - Math.floor(index / columns) * spacing,
  }));
  return {
    columns,
    rows,
    positions,
    hallWidth: Math.max(minWidth, (columns - 1) * spacing + 2 * margin),
    hallDepth: Math.max(minDepth, (rows - 1) * spacing + 2 * margin),
  };
}
