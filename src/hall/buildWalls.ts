import * as THREE from 'three';
import type { HallBounds } from './moveVisitor';

export interface HallSize {
  width: number;
  depth: number;
  height: number;
}

const FLOOR = 0xe3e0d8;
const WALL = 0xf4f3ee;
const CEILING = 0xffffff;
const SKIRTING = 0xcfcbc2;
const SKIRTING_HEIGHT = 0.12;

/**
 * The Hall's floor, walls, and ceiling: bright, flat-coloured, centred on the
 * origin. Walls are single-sided so the Visitor never sees them from outside.
 */
export function buildWalls(size: HallSize): THREE.Group {
  const walls = new THREE.Group();
  const { width, depth, height } = size;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: FLOOR, roughness: 0.95 }),
  );
  floor.rotation.x = -Math.PI / 2;
  walls.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: CEILING, roughness: 1 }),
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  walls.add(ceiling);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: WALL, roughness: 0.9 });
  const skirtingMaterial = new THREE.MeshStandardMaterial({ color: SKIRTING, roughness: 0.9 });

  const sides: { length: number; x: number; z: number; rotationY: number }[] = [
    { length: width, x: 0, z: -depth / 2, rotationY: 0 },
    { length: width, x: 0, z: depth / 2, rotationY: Math.PI },
    { length: depth, x: -width / 2, z: 0, rotationY: Math.PI / 2 },
    { length: depth, x: width / 2, z: 0, rotationY: -Math.PI / 2 },
  ];

  for (const { length, x, z, rotationY } of sides) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, height), wallMaterial);
    wall.position.set(x, height / 2, z);
    wall.rotation.y = rotationY;
    walls.add(wall);

    const skirting = new THREE.Mesh(new THREE.PlaneGeometry(length, SKIRTING_HEIGHT), skirtingMaterial);
    skirting.position.set(x, SKIRTING_HEIGHT / 2, z);
    skirting.rotation.y = rotationY;
    // Sit a hair in front of the wall so the two planes never z-fight.
    skirting.translateZ(0.005);
    walls.add(skirting);
  }

  return walls;
}

export function buildLighting(size: HallSize): THREE.Group {
  const lights = new THREE.Group();

  // Bright and even, like a gallery with skylights: the ambient and
  // hemisphere lights do most of the work and the two directionals only add
  // enough shading to tell the walls apart.
  lights.add(new THREE.AmbientLight(0xffffff, 0.9));
  lights.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.3));

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(size.width * 0.3, size.height, size.depth * 0.2);
  lights.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-size.width * 0.4, size.height * 0.8, -size.depth * 0.3);
  lights.add(fill);

  return lights;
}

/** Where the camera may stand: the Hall inset by a little body radius. */
export function walkableBounds(size: HallSize, bodyRadius: number): HallBounds {
  return {
    minX: -size.width / 2 + bodyRadius,
    maxX: size.width / 2 - bodyRadius,
    minZ: -size.depth / 2 + bodyRadius,
    maxZ: size.depth / 2 - bodyRadius,
  };
}
