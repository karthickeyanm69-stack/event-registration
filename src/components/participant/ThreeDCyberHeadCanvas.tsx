import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Move3d } from 'lucide-react';

interface ThreeDCyberHeadCanvasProps {
  onRegisterClick?: () => void;
}

export const ThreeDCyberHeadCanvas: React.FC<ThreeDCyberHeadCanvasProps> = ({ onRegisterClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 650;
    const height = mount.clientHeight || 560;

    // 1. Scene, Camera & Renderer with Full Alpha Transparency
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // 2. High-Contrast Cyber Lighting for Light Background
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    scene.add(ambientLight);

    // Key front light (Royal SPIHER Blue)
    const keyLight = new THREE.PointLight(0x0077c8, 6.5, 70);
    keyLight.position.set(-8, 6, 12);
    scene.add(keyLight);

    // Rim light (Cyan #00f2fe)
    const rimLight = new THREE.PointLight(0x00f2fe, 5.5, 60);
    rimLight.position.set(8, 8, 4);
    scene.add(rimLight);

    // Electric Purple accent light
    const purpleLight = new THREE.PointLight(0x7c3aed, 4.5, 50);
    purpleLight.position.set(2, -8, 8);
    scene.add(purpleLight);

    // 3. Master Head Group
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Resting Position: Anchored so only the front half of the head is visible in the viewport,
    // while the back of the skull extends off-screen to the right (exactly matching user reference image).
    const RESTING_POS_X = 4.2; 
    const RESTING_POS_Y = 0.1;

    // Starts off-screen to the right (x: 14.0) for the initial slide-in entrance animation
    headGroup.position.set(14.0, RESTING_POS_Y, 0);

    // 4. Background Orbiting 3D Particle Cloud (Light Theme Cyber Dust)
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorBlue = new THREE.Color(0x0077c8);
    const colorCyan = new THREE.Color(0x00f2fe);
    const colorPurple = new THREE.Color(0x7c3aed);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.5 ? colorBlue : Math.random() > 0.25 ? colorCyan : colorPurple;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });
    const backgroundParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(backgroundParticles);

    // (Rings around the head completely removed as requested)

    // 5. Target Orientation: Profile facing towards the LEFT directly across at the text
    const BASE_ROTATION_Y = -Math.PI / 2.05; // ~ -88 degrees (facing left)
    const BASE_ROTATION_X = 0.02;

    // 6. Load & Scale Cyber Head Model (`cyber_head.glb`)
    const loader = new GLTFLoader();

    loader.load(
      '/cyber_head.glb',
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const originalMesh = child as THREE.Mesh;
            const geo = originalMesh.geometry.clone();
            geo.center(); // Center around pivot
            geo.computeVertexNormals();

            // Calculate bounding box and scale to span from top (SPIHER PRESENTS) to bottom (buttons)
            geo.computeBoundingBox();
            const bbox = geo.boundingBox!;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDimension = Math.max(size.x, size.y, size.z) || 1;

            // Target height of 11.5 units: Spans from top badge to bottom action buttons
            const targetHeight = 11.5;
            const scaleFactor = targetHeight / maxDimension;

            // Layer A: Semi-Translucent Ice-Glass Base Mesh (Light Theme Volume)
            const solidMat = new THREE.MeshStandardMaterial({
              color: 0xe6f4fb,
              roughness: 0.15,
              metalness: 0.25,
              transparent: true,
              opacity: 0.65,
            });
            const solidMesh = new THREE.Mesh(geo, solidMat);
            solidMesh.scale.set(scaleFactor * 0.99, scaleFactor * 0.99, scaleFactor * 0.99);
            headGroup.add(solidMesh);

            // Layer B: Vibrant Royal Blue Wireframe Grid (High Contrast on Light BG)
            const wireMat = new THREE.MeshBasicMaterial({
              color: 0x005fa3,
              wireframe: true,
              transparent: true,
              opacity: 0.88,
            });
            const wireMesh = new THREE.Mesh(geo, wireMat);
            wireMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            headGroup.add(wireMesh);

            // Layer C: Sparkling Purple & Cyan Vertex Nodes
            const pointsMat = new THREE.PointsMaterial({
              color: 0x7c3aed,
              size: 0.08,
              transparent: true,
              opacity: 0.92,
            });
            const pointsMesh = new THREE.Points(geo, pointsMat);
            pointsMesh.scale.set(scaleFactor * 1.004, scaleFactor * 1.004, scaleFactor * 1.004);
            headGroup.add(pointsMesh);
          }
        });

        headGroup.rotation.y = BASE_ROTATION_Y;
        headGroup.rotation.x = BASE_ROTATION_X;
        setModelLoaded(true);
      },
      undefined,
      (error) => {
        console.warn('GLTF fallback active:', error);
        const procGeo = new THREE.IcosahedronGeometry(5.2, 3);
        const procWireMat = new THREE.MeshBasicMaterial({ color: 0x005fa3, wireframe: true, transparent: true, opacity: 0.85 });
        const procMesh = new THREE.Mesh(procGeo, procWireMat);
        headGroup.add(procMesh);

        const procPointsMat = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.12, transparent: true, opacity: 0.9 });
        const procPoints = new THREE.Points(procGeo, procPointsMat);
        headGroup.add(procPoints);

        headGroup.rotation.y = BASE_ROTATION_Y;
        setModelLoaded(true);
      }
    );

    // 7. Interactive Mouse Tracking & Drag Orbit Physics
    let targetRotationX = BASE_ROTATION_X;
    let targetRotationY = BASE_ROTATION_Y;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!isDragging) {
        targetRotationY = BASE_ROTATION_Y + normX * 0.45;
        targetRotationX = BASE_ROTATION_X - normY * 0.3;
      } else {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    // 8. Scroll Tracking for Gentle Parallax Movement while scrolling
    let scrollY = window.scrollY || 0;
    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 9. Animation Loop with Smooth Entrance Lerp & Gentle Scroll Parallax
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // ── Smooth Entrance Animation: Slides from Right (x: 14.0) into Resting Position (x: 4.2) ──
      headGroup.position.x += (RESTING_POS_X - headGroup.position.x) * 0.045;

      // Subtle breathing floating physics + gentle scroll parallax
      const scrollFactor = Math.min(scrollY / 700, 1.2);
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.1;
      headGroup.position.y = (RESTING_POS_Y + floatOffset) - (scrollFactor * 0.8);

      // Inertial smooth rotation lerp towards target with gentle scroll deflection
      const effectiveTargetY = targetRotationY - (scrollFactor * 0.15);
      const effectiveTargetX = targetRotationX - (scrollFactor * 0.1);
      headGroup.rotation.y += (effectiveTargetY - headGroup.rotation.y) * 0.065;
      headGroup.rotation.x += (effectiveTargetX - headGroup.rotation.x) * 0.065;

      // Particle field drift
      backgroundParticles.rotation.y = elapsedTime * 0.035;
      backgroundParticles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.08;

      // Pulsing keylights
      keyLight.intensity = 6.0 + Math.sin(elapsedTime * 2.5) * 1.0;
      rimLight.intensity = 5.0 + Math.cos(elapsedTime * 2.0) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      mount.removeEventListener('mousedown', handleMouseDown);
      mount.removeEventListener('touchstart', handleTouchStart);
      mount.removeEventListener('touchmove', handleTouchMove);
      mount.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center select-none overflow-visible">
      {/* Three.js 3D WebGL Canvas (Free Floating, Zero Rings/Borders) */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Telemetry HUD Badges (Positioned near forehead matching reference image) */}
      <div className="absolute top-6 right-8 sm:right-16 flex flex-col items-end gap-1.5 pointer-events-none">
        <span className="px-3 py-1 rounded-xl bg-white/85 backdrop-blur-md border border-[#0077c8]/30 text-[#002b66] font-mono text-[11px] font-bold tracking-wider shadow-sm">
          1.00011 // 0.39
        </span>
        <span className="text-[9.5px] font-mono font-bold text-[#7c3aed] tracking-widest uppercase">
          mot.pos:c [SYS_OK]
        </span>
      </div>

      {/* Interactive 3D Orbit Drag Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#d4e8f5] shadow-xs text-[10px] font-mono font-bold text-[#002b66] pointer-events-none">
        <Move3d className="w-3.5 h-3.5 text-[#0077c8]" />
        <span>Drag to rotate 3D Head 360°</span>
      </div>
    </div>
  );
};

export default ThreeDCyberHeadCanvas;
