window.addEventListener('DOMContentLoaded', () => {

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let mixer, model;

const canvas = document.getElementById('webgl-canvas');

if (!canvas) {
  console.error('Canvas not found');
  return;
}

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 2, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

const sky = new Sky();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(sky).texture;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/'
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load(
  'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();

    animate();
  }
);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (mixer) mixer.update(clock.getDelta());

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

});
