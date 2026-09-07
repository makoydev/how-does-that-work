export interface HallBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface WalkInput {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
}

export interface FloorPosition {
  x: number;
  z: number;
}

/**
 * Advances the Visitor across the Hall floor for one frame.
 *
 * `yaw` is the camera's rotation about the vertical axis in radians, with
 * zero facing negative Z as in Three.js. Only the horizontal plane moves, so
 * looking up or down never changes where the Visitor walks.
 */
export function moveVisitor(
  position: FloorPosition,
  yaw: number,
  input: WalkInput,
  dt: number,
  hall: HallBounds,
  speed: number,
): FloorPosition {
  const forwardX = -Math.sin(yaw);
  const forwardZ = -Math.cos(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);

  const ahead = Number(input.forward) - Number(input.back);
  const sideways = Number(input.right) - Number(input.left);
  const length = Math.hypot(ahead, sideways);
  if (length === 0) return { x: position.x, z: position.z };

  const step = (speed * dt) / length;
  const x = position.x + (forwardX * ahead + rightX * sideways) * step;
  const z = position.z + (forwardZ * ahead + rightZ * sideways) * step;
  return {
    x: clamp(x, hall.minX, hall.maxX),
    z: clamp(z, hall.minZ, hall.maxZ),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
