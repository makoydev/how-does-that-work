/**
 * True for phones and tablets: devices with a coarse pointer and no hover.
 * Laptops with touch screens still have a mouse or trackpad, so they count
 * as computers and get the Hall.
 */
export function isTouchDevice(win: Pick<Window, 'matchMedia'> = window): boolean {
  return win.matchMedia('(hover: none) and (pointer: coarse)').matches;
}
