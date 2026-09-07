import * as THREE from 'three';
import type { Exhibit } from '../../shared/exhibitContract';
import { buildEngineModel } from './buildEngineModel';
import { createPartLabel } from './createPartLabel';
import { poseAt } from './enginePose';
import { STEPS, type V8Step } from './steps';

const MAX_FRAME_SECONDS = 0.1;
/** How quickly the camera glides to a Step's pose: larger settles sooner. */
const CAMERA_GLIDE = 4;

const easings = {
  even: (t: number) => t,
  smooth: (t: number) => t * t * (3 - 2 * t),
  shove: (t: number) => 1 - (1 - t) ** 3,
} as const;

/**
 * The V8 engine: a schematic engine from primitives, and a Walkthrough that
 * meets the parts then follows cylinder one through its four strokes. Every
 * frame is drawn from the current Step and how far into it we are, so paging
 * in any order always lands on a sane pose.
 */
const v8Engine: Exhibit = {
  manifest: {
    slug: 'v8-engine',
    title: 'V8 Engine',
    category: 'Engines',
    summary: 'Eight pistons take turns pushing on one crankshaft to make it spin.',
    sources: [
      { label: 'Four-stroke engine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Four-stroke_engine' },
      { label: 'Animated four-stroke engine (Animated Engines)', url: 'https://animatedengines.com/otto.html' },
      { label: 'V8 engine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/V8_engine' },
      {
        label: 'Internal Combustion Engines, MIT OpenCourseWare 2.61',
        url: 'https://ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/',
      },
    ],
  },
  walkthrough: {
    steps: STEPS,
    hasFreePlay: false,
  },
  mount(container, handle) {
    const viewport = document.createElement('div');
    Object.assign(viewport.style, { position: 'absolute', inset: '0' });
    container.appendChild(viewport);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    viewport.appendChild(renderer.domElement);

    const partLabel = createPartLabel(viewport);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa3ad, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(3, 6, 4);
    scene.add(sun);
    const model = buildEngineModel();
    scene.add(model.object);

    const camera = new THREE.PerspectiveCamera(42, viewport.clientWidth / viewport.clientHeight, 0.1, 50);
    const lookingAt = new THREE.Vector3();

    let step: V8Step = stepAt(handle.stepIndex);
    let elapsed = 0;
    const play = (stepIndex: number) => {
      step = stepAt(stepIndex);
      elapsed = 0;
    };
    // The first frame starts on the Step's camera rather than gliding in from nowhere.
    camera.position.fromArray(step.camera.position);
    lookingAt.fromArray(step.camera.target);

    // The viewport changes size when the Walkthrough panel grows or shrinks
    // beneath it, not only on window resize. Resizing clears the canvas, so
    // draw again straight away rather than leave a blank until the next frame.
    const fit = () => {
      const { clientWidth, clientHeight } = viewport;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(viewport);

    const timer = new THREE.Timer();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      timer.update();
      const dt = Math.min(timer.getDelta(), MAX_FRAME_SECONDS);
      elapsed += dt;

      const progress = easings[step.easing](Math.min(1, elapsed / step.duration));
      const pose = poseAt(step.id, progress);
      model.applyPose(pose);
      partLabel.show(pose.label);

      const glide = 1 - Math.exp(-CAMERA_GLIDE * dt);
      camera.position.lerp(new THREE.Vector3().fromArray(step.camera.position), glide);
      lookingAt.lerp(new THREE.Vector3().fromArray(step.camera.target), glide);
      camera.lookAt(lookingAt);
      renderer.render(scene, camera);
    };
    tick();

    const unsubscribe = handle.onStepChange(play);
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      model.dispose();
      renderer.dispose();
      viewport.remove();
    };
  },
};

function stepAt(stepIndex: number): V8Step {
  const step = STEPS[stepIndex];
  if (!step) throw new Error(`The V8 has no Step ${stepIndex + 1}`);
  return step;
}

export default v8Engine;
