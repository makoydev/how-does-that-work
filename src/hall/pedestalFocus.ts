import * as THREE from 'three';
import type { Pedestal } from './buildPedestal';

export interface PedestalFocus {
  /** The pedestal the camera is looking at from within reach, if any. */
  readonly focused: Pedestal | null;
  /** Re-run the look-at raycast for this frame. */
  update(): void;
  dispose(): void;
}

const SCREEN_CENTRE = new THREE.Vector2(0, 0);

/**
 * Each frame, casts a ray from the centre of the view and highlights the
 * pedestal it hits within `reach`, showing an "open" prompt for it. Looking
 * away clears both.
 */
export function createPedestalFocus(
  container: HTMLElement,
  camera: THREE.Camera,
  pedestals: readonly Pedestal[],
  reach: number,
): PedestalFocus {
  const pedestalByHitTarget = new Map(pedestals.map((p) => [p.hitTarget, p]));
  const hitTargets = pedestals.map((p) => p.hitTarget);

  const prompt = document.createElement('div');
  prompt.className = 'hall-prompt';
  prompt.hidden = true;
  prompt.innerHTML = 'Click or press <kbd>E</kbd> to open ';
  const promptTitle = document.createElement('strong');
  prompt.appendChild(promptTitle);
  container.appendChild(prompt);

  const raycaster = new THREE.Raycaster();
  raycaster.far = reach;
  let focused: Pedestal | null = null;

  const setFocused = (next: Pedestal | null) => {
    if (next === focused) return;
    focused?.setHighlighted(false);
    next?.setHighlighted(true);
    focused = next;
    promptTitle.textContent = next?.exhibit.manifest.title ?? '';
    prompt.hidden = next === null;
  };

  return {
    get focused() {
      return focused;
    },
    update: () => {
      raycaster.setFromCamera(SCREEN_CENTRE, camera);
      const hit = raycaster.intersectObjects(hitTargets, false)[0];
      setFocused(hit ? (pedestalByHitTarget.get(hit.object as THREE.Mesh) ?? null) : null);
    },
    dispose: () => {
      setFocused(null);
      prompt.remove();
    },
  };
}
