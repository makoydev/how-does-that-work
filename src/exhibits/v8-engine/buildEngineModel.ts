import * as THREE from 'three';
import { palette } from '../../shared/palette';
import {
  BANK_ANGLE,
  CRANK_PINS,
  CRANK_RADIUS,
  CYLINDERS,
  ROD_LENGTH,
  crankPin,
  pistonOffset,
  type CylinderSpec,
  type EnginePose,
  type Part,
} from './enginePose';

export interface EngineModel {
  readonly object: THREE.Group;
  /** Put every part where the pose says. Depends on nothing but the pose, so any order of Steps is safe. */
  applyPose(pose: EnginePose): void;
  dispose(): void;
}

const BORE_RADIUS = 0.13;
const PISTON_HEIGHT = 0.12;
/** Along the cylinder axis, from the crank axis: where the tube starts and where the head sits. */
const TUBE_BOTTOM = 0.28;
const HEAD = 0.92;
const VALVE_RADIUS = 0.05;
/** Where a shut valve's disc sits, just under the head. */
const VALVE_SEAT = HEAD - 0.01;
const VALVE_LIFT = 0.07;
/** Valves sit either side of the cylinder centre, along the crank axis. */
const VALVE_SPACING = 0.065;
const ENGINE_LENGTH = 2.6;
const JOURNAL_RADIUS = 0.05;

const ROD_WIDTH = 0.06;
const ROD_THICKNESS = 0.035;

const NEUTRAL = new THREE.Color(palette.neutral);
const ACTIVE = new THREE.Color(palette.activePart);
const WHITE = new THREE.Color(0xffffff);
const CHARGE_COLORS = {
  fresh: new THREE.Color(palette.freshAir),
  burning: new THREE.Color(palette.hot),
  burnt: new THREE.Color(palette.waste),
} as const;

interface LitMesh {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  /** Every name under which a pose may light this mesh. */
  parts: readonly Part[];
  baseColor: THREE.Color;
}

interface CylinderRig {
  spec: CylinderSpec;
  piston: THREE.Mesh;
  rod: THREE.Mesh;
  intakeValve: THREE.Object3D;
  exhaustValve: THREE.Object3D;
  charge: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial>;
}

/**
 * A schematic V8 from primitives: a translucent boxed V for the block,
 * see-through tubes for the cylinders, discs for pistons and valves, thin
 * boxes for rods, and a chain of offset cylinders for the crankshaft. The
 * near bank leans toward +Z; cylinder one is at the +X end of it.
 */
export function buildEngineModel(): EngineModel {
  const object = new THREE.Group();
  const litMeshes: LitMesh[] = [];
  const disposables: { dispose(): void }[] = [];

  const solid = (color: THREE.Color) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.15 });
    disposables.push(material);
    return material;
  };
  const glassy = (opacity: number) => {
    const material = new THREE.MeshStandardMaterial({
      color: NEUTRAL,
      roughness: 0.35,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    disposables.push(material);
    return material;
  };
  const geometry = <G extends THREE.BufferGeometry>(g: G) => {
    disposables.push(g);
    return g;
  };
  const register = (mesh: LitMesh['mesh'], parts: readonly Part[]) => {
    litMeshes.push({ mesh, parts, baseColor: mesh.material.color.clone() });
    return mesh;
  };

  // Block: one slab per bank, tilted with its cylinders, plus the crankcase below.
  for (const bankAngle of [BANK_ANGLE, -BANK_ANGLE]) {
    const slab = new THREE.Mesh(geometry(new THREE.BoxGeometry(ENGINE_LENGTH, HEAD - TUBE_BOTTOM, 0.42)), glassy(0.22));
    slab.position.y = (HEAD + TUBE_BOTTOM) / 2;
    const bank = new THREE.Group();
    bank.rotation.x = bankAngle;
    bank.add(slab);
    object.add(bank);
    register(slab, ['block']);
  }
  const crankcase = new THREE.Mesh(geometry(new THREE.BoxGeometry(ENGINE_LENGTH, 0.5, 0.7)), glassy(0.22));
  crankcase.position.y = -0.05;
  object.add(register(crankcase, ['block']));

  // Crankshaft: a main shaft along X with a web, pin, and web at each throw.
  const crankshaft = new THREE.Group();
  const shaft = new THREE.Mesh(geometry(new THREE.CylinderGeometry(JOURNAL_RADIUS, JOURNAL_RADIUS, ENGINE_LENGTH, 20)), solid(NEUTRAL));
  shaft.rotation.z = Math.PI / 2;
  crankshaft.add(register(shaft, ['crankshaft']));
  const pinGeometry = geometry(new THREE.CylinderGeometry(JOURNAL_RADIUS, JOURNAL_RADIUS, 0.18, 20));
  const webGeometry = geometry(new THREE.BoxGeometry(0.06, CRANK_RADIUS + JOURNAL_RADIUS * 2, 0.16));
  for (const pinSpec of CRANK_PINS) {
    const throwGroup = new THREE.Group();
    throwGroup.position.x = pinSpec.x;
    throwGroup.rotation.x = pinSpec.throwOffset;
    const pin = new THREE.Mesh(pinGeometry, solid(NEUTRAL));
    pin.rotation.z = Math.PI / 2;
    pin.position.y = CRANK_RADIUS;
    throwGroup.add(register(pin, ['crankshaft']));
    for (const side of [-1, 1]) {
      const web = new THREE.Mesh(webGeometry, solid(NEUTRAL));
      web.position.set(side * 0.09, CRANK_RADIUS / 2, 0);
      throwGroup.add(register(web, ['crankshaft']));
    }
    crankshaft.add(throwGroup);
  }
  object.add(crankshaft);

  // Cylinders: each in its own tilted group where local Y runs up the bore.
  const tubeGeometry = geometry(new THREE.CylinderGeometry(BORE_RADIUS, BORE_RADIUS, HEAD - TUBE_BOTTOM, 32, 1, true));
  const pistonGeometry = geometry(new THREE.CylinderGeometry(BORE_RADIUS * 0.92, BORE_RADIUS * 0.92, PISTON_HEIGHT, 24));
  const rodGeometry = geometry(new THREE.BoxGeometry(ROD_THICKNESS, ROD_LENGTH, ROD_WIDTH));
  const valveGeometry = geometry(new THREE.CylinderGeometry(VALVE_RADIUS, VALVE_RADIUS, 0.02, 20));
  const stemGeometry = geometry(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8));
  const chargeGeometry = geometry(new THREE.CylinderGeometry(BORE_RADIUS * 0.96, BORE_RADIUS * 0.96, 1, 24));

  const rigs: CylinderRig[] = CYLINDERS.map((spec, index) => {
    const isOne = index === 0;
    const tilted = new THREE.Group();
    tilted.position.x = spec.x;
    tilted.rotation.x = spec.bankAngle;
    object.add(tilted);

    const tube = new THREE.Mesh(tubeGeometry, glassy(0.3));
    tube.position.y = (HEAD + TUBE_BOTTOM) / 2;
    tilted.add(register(tube, ['cylinders']));

    const piston = new THREE.Mesh(pistonGeometry, solid(NEUTRAL));
    tilted.add(register(piston, isOne ? ['pistons', 'piston-one'] : ['pistons']));

    const rod = new THREE.Mesh(rodGeometry, solid(NEUTRAL));
    tilted.add(register(rod, ['rods']));

    const buildValve = (side: number, parts: readonly Part[]) => {
      const valve = new THREE.Group();
      valve.position.set(side * VALVE_SPACING, VALVE_SEAT, 0);
      const disc = new THREE.Mesh(valveGeometry, solid(NEUTRAL));
      const stem = new THREE.Mesh(stemGeometry, solid(NEUTRAL));
      stem.position.y = 0.09;
      valve.add(register(disc, parts), register(stem, parts));
      tilted.add(valve);
      return valve;
    };
    const intakeValve = buildValve(-1, isOne ? ['valves', 'intake-valve-one'] : ['valves']);
    const exhaustValve = buildValve(1, isOne ? ['valves', 'exhaust-valve-one'] : ['valves']);

    const chargeMaterial = new THREE.MeshStandardMaterial({
      color: CHARGE_COLORS.fresh,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      emissive: CHARGE_COLORS.burning,
      emissiveIntensity: 0,
    });
    disposables.push(chargeMaterial);
    const charge = new THREE.Mesh(chargeGeometry, chargeMaterial);
    charge.visible = false;
    tilted.add(charge);

    return { spec, piston, rod, intakeValve, exhaustValve, charge };
  });

  const placePiston = (rig: CylinderRig, crankAngle: number) => {
    const offset = pistonOffset(crankAngle, rig.spec);
    rig.piston.position.y = offset;
    // The rod runs from the crankpin, seen in this tilted group, up to the piston pin.
    const pin = crankPin(crankAngle, rig.spec);
    rig.rod.position.set(0, (pin.along + offset) / 2, pin.across / 2);
    rig.rod.rotation.x = Math.atan2(-pin.across, offset - pin.along);
  };

  const applyPose = (pose: EnginePose) => {
    crankshaft.rotation.x = pose.crankAngle;
    for (const rig of rigs) placePiston(rig, pose.crankAngle);

    const one = rigs[0];
    if (one) {
      const { cylinderOne } = pose;
      one.intakeValve.position.y = VALVE_SEAT - VALVE_LIFT * cylinderOne.intakeValve;
      one.exhaustValve.position.y = VALVE_SEAT - VALVE_LIFT * cylinderOne.exhaustValve;

      const crown = one.piston.position.y + PISTON_HEIGHT / 2;
      const height = Math.max(0.001, HEAD - crown);
      one.charge.scale.y = height;
      one.charge.position.y = crown + height / 2;
      const kind = cylinderOne.charge;
      one.charge.visible = kind !== 'none' && cylinderOne.fill > 0;
      if (kind !== 'none') {
        const material = one.charge.material;
        material.color.copy(CHARGE_COLORS[kind]).lerp(WHITE, cylinderOne.pale * 0.7);
        material.opacity = 0.35 + 0.45 * cylinderOne.fill;
        material.emissiveIntensity = kind === 'burning' ? 0.4 + 1.6 * cylinderOne.spark : 0;
      }
    }

    const lit = new Set(pose.lit);
    for (const { mesh, parts, baseColor } of litMeshes) {
      const active = parts.some((part) => lit.has(part));
      mesh.material.color.copy(active ? ACTIVE : baseColor);
      mesh.material.emissive.copy(active ? ACTIVE : baseColor);
      mesh.material.emissiveIntensity = active ? 0.35 : 0;
    }
  };

  return {
    object,
    applyPose,
    dispose: () => {
      for (const item of disposables) item.dispose();
    },
  };
}
