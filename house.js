import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let mixer, model;

// Canvas
const canvas = document.getElementById('webgl-canvas');

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Camera
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 2, 8);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.target.set(0, 0.7, 0);

// Sky (lighting)
const sky = new Sky();
const uniforms = sky.material.uniforms;

uniforms['turbidity'].value = 0;
uniforms['rayleigh'].value = 3;
uniforms['mieDirectionalG'].value = 0.7;
uniforms['sunPosition'].value.set(-0.8, 0.19, 0.56);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const environment = pmremGenerator.fromScene(sky).texture;

scene.environment = environment;
scene.background = environment;

// Load model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/'
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load(
  'https://threejs.org/examples/models/gltf/LittlestTokyo.glb', // ✅ use full URL for Webflow
  (gltf) => {
    model = gltf.scene;

    model.position.set(1, 1, 0);
    model.scale.set(0.01, 0.01, 0.01);

    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();

    animate();
  },
  undefined,
  (error) => {
    console.error('Model failed to load:', error);
  }
);

// Mouse interaction
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Scroll interaction
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = scrollY / maxScroll;

  camera.position.z = 8 - progress * 4;
  camera.position.x = 5 + progress * 2;
});

// Clock
const clock = new THREE.Clock();

// Animate
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  if (model) {
    model.rotation.y += (mouse.x * 0.5 - model.rotation.y) * 0.05;
    model.rotation.x += (mouse.y * 0.2 - model.rotation.x) * 0.05;
  }

  controls.update();
  renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
