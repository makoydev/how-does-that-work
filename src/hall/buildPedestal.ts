import * as THREE from 'three';
import type { Exhibit } from '../shared/exhibitContract';

export interface Pedestal {
  readonly exhibit: Exhibit;
  readonly object: THREE.Group;
  /** The mesh a look-at raycast should test. Labels are not hit targets. */
  readonly hitTarget: THREE.Mesh;
  setHighlighted(highlighted: boolean): void;
}

const PEDESTAL_HEIGHT = 1.0;
const PEDESTAL_WIDTH = 0.7;
const PLINTH_COLOR = 0xf8f7f3;
const HIGHLIGHT_COLOR = 0x2e6df6;
const HIGHLIGHT_STRENGTH = 0.35;
const LABEL_HEIGHT = PEDESTAL_HEIGHT + 0.35;

/**
 * A plain white plinth with the Exhibit's title and Category floating above
 * it. Highlighting tints the plinth so the Visitor can tell it can be opened.
 */
export function buildPedestal(exhibit: Exhibit): Pedestal {
  const object = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({ color: PLINTH_COLOR, roughness: 0.85 });
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(PEDESTAL_WIDTH, PEDESTAL_HEIGHT, PEDESTAL_WIDTH),
    material,
  );
  plinth.position.y = PEDESTAL_HEIGHT / 2;
  object.add(plinth);

  const label = buildLabel(exhibit.manifest.title, exhibit.manifest.category);
  label.position.y = LABEL_HEIGHT;
  object.add(label);

  return {
    exhibit,
    object,
    hitTarget: plinth,
    setHighlighted: (highlighted) => {
      material.emissive.setHex(highlighted ? HIGHLIGHT_COLOR : 0x000000);
      material.emissiveIntensity = highlighted ? HIGHLIGHT_STRENGTH : 0;
    },
  };
}

const LABEL_CANVAS_WIDTH = 512;
const LABEL_CANVAS_HEIGHT = 192;
/** Label width in Hall metres; the height follows the canvas aspect. */
const LABEL_WIDTH_METRES = 1.6;
const LABEL_FONT = 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

function buildLabel(title: string, category: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = LABEL_CANVAS_WIDTH;
  canvas.height = LABEL_CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not draw a pedestal label');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1f1f1f';
  ctx.font = `600 52px ${LABEL_FONT}`;
  ctx.fillText(title, LABEL_CANVAS_WIDTH / 2, LABEL_CANVAS_HEIGHT * 0.38, LABEL_CANVAS_WIDTH - 32);
  ctx.fillStyle = '#6b6b6b';
  ctx.font = `400 34px ${LABEL_FONT}`;
  ctx.fillText(category, LABEL_CANVAS_WIDTH / 2, LABEL_CANVAS_HEIGHT * 0.72, LABEL_CANVAS_WIDTH - 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(LABEL_WIDTH_METRES, (LABEL_WIDTH_METRES * LABEL_CANVAS_HEIGHT) / LABEL_CANVAS_WIDTH, 1);
  return sprite;
}
