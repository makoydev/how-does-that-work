import * as THREE from 'three';
import type { ExhibitRegistry } from '../registry/exhibitRegistry';
import type { Exhibit } from '../shared/exhibitContract';
import { buildLighting, buildWalls, walkableBounds } from './buildWalls';
import { buildPedestal, type Pedestal } from './buildPedestal';
import { createFirstPersonControls, type FirstPersonControls } from './firstPersonControls';
import { layoutPedestals } from './layoutPedestals';

export interface Hall {
  readonly controls: FirstPersonControls;
  /** The Exhibit whose pedestal the Visitor is looking at from within reach. */
  readonly focusedExhibit: Exhibit | null;
  /** Start rendering frames. Safe to call more than once. */
  start(): void;
  /** Stop rendering frames, leaving the last frame on screen. */
  stop(): void;
  dispose(): void;
}

const EYE_HEIGHT = 1.6;
const HALL_HEIGHT = 4;
const WALK_SPEED = 3;
const BODY_RADIUS = 0.4;
const MAX_FRAME_SECONDS = 0.1;
/** How close the Visitor must be for a pedestal to highlight. */
const REACH = 3;
const LAYOUT = { spacing: 4, margin: 4, minWidth: 12, minDepth: 12 };
const SCREEN_CENTRE = new THREE.Vector2(0, 0);

/**
 * The walkable Hall: one pedestal per Exhibit in the registry, on a grid the
 * Hall grows to fit. The Hall owns its canvas, camera, and render loop.
 */
export function createHall(container: HTMLElement, registry: ExhibitRegistry): Hall {
  const layout = layoutPedestals(registry.exhibits.length, LAYOUT);
  const size = { width: layout.hallWidth, depth: layout.hallDepth, height: HALL_HEIGHT };

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfbfbf9);
  scene.add(buildWalls(size));
  scene.add(buildLighting(size));

  const pedestals: Pedestal[] = registry.exhibits.map((exhibit, index) => {
    const pedestal = buildPedestal(exhibit);
    const position = layout.positions[index];
    if (position) pedestal.object.position.set(position.x, 0, position.z);
    scene.add(pedestal.object);
    return pedestal;
  });
  const pedestalByHitTarget = new Map(pedestals.map((p) => [p.hitTarget, p]));
  const hitTargets = pedestals.map((p) => p.hitTarget);

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

  const prompt = document.createElement('div');
  prompt.className = 'hall-prompt';
  prompt.hidden = true;
  prompt.innerHTML = 'Click or press <kbd>E</kbd> to open ';
  const promptTitle = document.createElement('strong');
  prompt.appendChild(promptTitle);
  container.appendChild(prompt);

  const raycaster = new THREE.Raycaster();
  raycaster.far = REACH;
  let focused: Pedestal | null = null;

  const setFocused = (next: Pedestal | null) => {
    if (next === focused) return;
    focused?.setHighlighted(false);
    next?.setHighlighted(true);
    focused = next;
    promptTitle.textContent = next?.exhibit.manifest.title ?? '';
    prompt.hidden = next === null;
  };

  const updateFocus = () => {
    raycaster.setFromCamera(SCREEN_CENTRE, camera);
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    setFocused(hit ? (pedestalByHitTarget.get(hit.object as THREE.Mesh) ?? null) : null);
  };

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
    updateFocus();
    renderer.render(scene, camera);
  };

  return {
    controls,
    get focusedExhibit() {
      return focused?.exhibit ?? null;
    },
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
      prompt.remove();
    },
  };
}
