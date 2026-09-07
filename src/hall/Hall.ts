import * as THREE from 'three';
import { buildLighting, buildWalls, walkableBounds, type HallSize } from './buildWalls';
import { createFirstPersonControls, type FirstPersonControls } from './firstPersonControls';

export interface Hall {
  readonly controls: FirstPersonControls;
  /** Start rendering frames. Safe to call more than once. */
  start(): void;
  /** Stop rendering frames, leaving the last frame on screen. */
  stop(): void;
  dispose(): void;
}

const EYE_HEIGHT = 1.6;
const WALK_SPEED = 3;
const BODY_RADIUS = 0.4;
const MAX_FRAME_SECONDS = 0.1;

/**
 * The walkable Hall. For now it is empty: pedestals arrive with the Exhibit
 * registry. The Hall owns its canvas, camera, and render loop.
 */
export function createHall(container: HTMLElement, size: HallSize): Hall {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfbfbf9);
  scene.add(buildWalls(size));
  scene.add(buildLighting(size));

  const camera = new THREE.PerspectiveCamera(
    70,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, EYE_HEIGHT, size.depth / 2 - 2);

  const controls = createFirstPersonControls(
    camera,
    renderer.domElement,
    walkableBounds(size, BODY_RADIUS),
    WALK_SPEED,
  );

  const onResize = () => {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  };
  window.addEventListener('resize', onResize);

  const timer = new THREE.Timer();
  let frame: number | null = null;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    timer.update();
    const dt = Math.min(timer.getDelta(), MAX_FRAME_SECONDS);
    controls.update(dt);
    renderer.render(scene, camera);
  };

  return {
    controls,
    start: () => {
      if (frame !== null) return;
      timer.reset();
      tick();
    },
    stop: () => {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
    },
    dispose: () => {
      cancelAnimationFrame(frame ?? 0);
      frame = null;
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
