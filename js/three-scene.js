import * as THREE from 'three';

let scene, camera, renderer, particles;
const particleCount = 800;
let isDystopia = false;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

function init() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  // Custom Shader Material for glowing particles
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      colorUtopia: { value: new THREE.Color(0x5cdb95) },
      colorDystopia: { value: new THREE.Color(0xd94f4f) },
      mixFactor: { value: 0.0 }
    },
    vertexShader: `
      attribute float aScale;
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // Float animation
        pos.y += sin(time * 0.3 + pos.x) * 2.5;
        pos.x += cos(time * 0.2 + pos.y) * 2.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 45.0 * aScale * (15.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 colorUtopia;
      uniform vec3 colorDystopia;
      uniform float mixFactor;
      
      void main() {
        // Circle shape with soft edge
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if (ll > 0.5) discard;
        
        // Majestic Glow effect
        float alpha = pow((0.5 - ll) * 2.0, 1.8);
        
        vec3 color = mix(colorUtopia, colorDystopia, mixFactor);
        gl_FragColor = vec4(color, alpha * 0.5);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Resize handler
  window.addEventListener('resize', onWindowResize, false);
  
  // Mouse movement handler for parallax
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  // Track toggle
  const toggle = document.getElementById('mode-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      isDystopia = document.body.classList.contains('dystopia');
    });
    // Init state
    isDystopia = document.body.classList.contains('dystopia');
  }

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  if (particles) {
    particles.material.uniforms.time.value = elapsedTime;
    particles.rotation.y = elapsedTime * 0.03;
    
    // Smooth transition between colors
    let currentMix = particles.material.uniforms.mixFactor.value;
    const targetMix = isDystopia ? 1.0 : 0.0;
    particles.material.uniforms.mixFactor.value += (targetMix - currentMix) * 0.015;
  }

  // Majestic Parallax: smooth damping towards mouse target
  targetX = mouseX * 2.5;
  targetY = mouseY * 2.5;
  
  // Parallax based on scroll (using window.scrollY safely)
  const scrollY = window.scrollY || 0;
  
  camera.position.x += (targetX - camera.position.x) * 0.02;
  camera.position.y += (-targetY - (scrollY * 0.008) - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

// Ensure it runs after body is parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
