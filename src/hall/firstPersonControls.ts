import * as THREE from 'three';
import { moveVisitor, type RoomBounds, type WalkInput } from './moveVisitor';

export interface FirstPersonControls {
  /** Ask the browser to capture the mouse. Must be called from a user gesture. */
  lock(): void;
  /** Whether the mouse is currently captured by this control's element. */
  readonly isLocked: boolean;
  /** Advance the Visitor for one frame. Does nothing while the mouse is free. */
  update(dt: number): void;
  /** Subscribe to the mouse being captured or released. Returns an unsubscribe. */
  onLockChange(listener: (locked: boolean) => void): () => void;
  dispose(): void;
}

const LOOK_SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.05;

/**
 * Pointer-lock mouse look plus WASD walking in the camera's horizontal plane.
 * Escape is handled by the browser: it releases pointer lock, and we hear
 * about that through `pointerlockchange`.
 */
export function createFirstPersonControls(
  camera: THREE.PerspectiveCamera,
  element: HTMLElement,
  bounds: RoomBounds,
  walkSpeed: number,
): FirstPersonControls {
  const euler = new THREE.Euler(0, 0, 0, 'YXZ');
  const keys: WalkInput = { forward: false, back: false, left: false, right: false };
  const lockListeners = new Set<(locked: boolean) => void>();

  const isLocked = () => document.pointerLockElement === element;

  const onMouseMove = (event: MouseEvent) => {
    if (!isLocked()) return;
    euler.setFromQuaternion(camera.quaternion);
    euler.y -= event.movementX * LOOK_SENSITIVITY;
    euler.x -= event.movementY * LOOK_SENSITIVITY;
    euler.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, euler.x));
    camera.quaternion.setFromEuler(euler);
  };

  const setKey = (code: string, down: boolean) => {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.forward = down;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.back = down;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = down;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = down;
        break;
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (isLocked()) setKey(event.code, true);
  };
  const onKeyUp = (event: KeyboardEvent) => setKey(event.code, false);

  const releaseAllKeys = () => {
    keys.forward = keys.back = keys.left = keys.right = false;
  };

  const onPointerLockChange = () => {
    const locked = isLocked();
    if (!locked) releaseAllKeys();
    for (const listener of lockListeners) listener(locked);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('pointerlockchange', onPointerLockChange);

  return {
    lock: () => {
      // The browser refuses lock when the tab is hidden or the click was not
      // a real gesture. The start screen stays up, so the Visitor just clicks
      // again; there is nothing else to do with the rejection.
      Promise.resolve(element.requestPointerLock()).catch(() => undefined);
    },
    get isLocked() {
      return isLocked();
    },
    update: (dt) => {
      if (!isLocked()) return;
      euler.setFromQuaternion(camera.quaternion);
      const next = moveVisitor(
        { x: camera.position.x, z: camera.position.z },
        euler.y,
        keys,
        dt,
        bounds,
        walkSpeed,
      );
      camera.position.x = next.x;
      camera.position.z = next.z;
    },
    onLockChange: (listener) => {
      lockListeners.add(listener);
      return () => lockListeners.delete(listener);
    },
    dispose: () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      lockListeners.clear();
    },
  };
}
