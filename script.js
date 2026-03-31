import * as THREE from 'three';

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

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ✅ Mesh
const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 200, 32);

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ✅ Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(2, 3, 4);

scene.add(ambient, point);

// Clock
const clock = new THREE.Clock();

// ✅ ONE animation loop
function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // rotation
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.007;

  renderer.render(scene, camera);
}

animate();
