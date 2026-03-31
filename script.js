import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

// Renderer
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mesh
const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 200, 32);

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(2, 3, 4);

scene.add(ambient, point);

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

  mesh.rotation.y = progress * Math.PI * 2;
  camera.position.z = 2 + progress * 3;
});

// Clock
const clock = new THREE.Clock();

// Animate
function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Mouse smooth rotation
  mesh.rotation.x += (mouse.y * 0.5 - mesh.rotation.x) * 0.05;
  mesh.rotation.y += (mouse.x * 0.5 - mesh.rotation.y) * 0.05;

  // Controls update
  controls.update();

  renderer.render(scene, camera);
}

animate();
