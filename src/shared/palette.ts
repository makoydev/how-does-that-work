/**
 * The color code every Exhibit shares, so a Visitor learns it once:
 * fresh air is blue, hot or burning things are orange, waste is grey, the
 * part that is moving right now is yellow, and everything else is neutral.
 *
 * Values are Three.js-style hex numbers.
 */
export const palette = {
  freshAir: 0x4da3ff,
  hot: 0xff6a1a,
  waste: 0x8c8c8c,
  activePart: 0xffd21f,
  neutral: 0xb9b5ad,
} as const;
