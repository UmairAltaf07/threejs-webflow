import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let mixer, model;

// Scene
const scene = new THREE.Scene();

// Renderer
const container = document.getElementById('container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.set(5, 2, 8);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.target.set(0, 0.7, 0);

// Sky (environment)
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

// Load Model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('models/gltf/LittlestTokyo.glb', (gltf) => {
  model = gltf.scene;

  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);

  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();

  animate();
});

// Mouse
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = scrollY / maxScroll;

  // Camera zoom effect
  camera.position.z = 8 - progress * 4;

  // Slight horizontal shift
  camera.position.x = 5 + progress * 2;
});

// Clock
const clock = new THREE.Clock();

// Animate
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  // Smooth mouse-based rotation
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
