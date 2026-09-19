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

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 600;
    const isMobile = width < 650 || window.innerWidth < 1024;

    // 1. Scene, Camera & Renderer with Full Alpha Transparency
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobile ? 38 : 36, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 16.0 : 17);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.9);
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

    // Resting Position: Positioned on the right half, filling top-to-bottom gracefully
    const RESTING_POS_X = isMobile ? 2.4 : 3.8; 
    const RESTING_POS_Y = isMobile ? 0.05 : 0.05;

    // Starts off-screen for entrance animation
    headGroup.position.set(isMobile ? 8.0 : 14.0, RESTING_POS_Y, 0);

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
      size: isMobile ? 0.12 : 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });
    const backgroundParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(backgroundParticles);

    // 4B. Floating Cyber Planetary Orbs (Matching Reference Image)
    const orbsGroup = new THREE.Group();
    scene.add(orbsGroup);

    const orbDefinitions = [
      { x: isMobile ? -1.8 : -3.5, y: 1.0, z: 2.5, r: 0.65, color: 0x00f2fe, hasRing: true },
      { x: isMobile ? -2.8 : -4.8, y: 2.2, z: 1.2, r: 0.42, color: 0x7c3aed, hasRing: false },
      { x: isMobile ? -1.2 : -2.2, y: -1.6, z: 3.2, r: 0.75, color: 0x0077c8, hasRing: true },
      { x: isMobile ? -3.0 : -5.0, y: -0.6, z: 1.8, r: 0.35, color: 0x00a887, hasRing: false },
    ];

    const orbMeshes: THREE.Mesh[] = [];

    orbDefinitions.forEach((orb) => {
      const orbGeo = new THREE.SphereGeometry(orb.r, 24, 24);
      const orbMat = new THREE.MeshStandardMaterial({
        color: orb.color,
        roughness: 0.2,
        metalness: 0.7,
        emissive: orb.color,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.85,
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.set(orb.x, orb.y, orb.z);
      orbsGroup.add(orbMesh);
      orbMeshes.push(orbMesh);

      if (orb.hasRing) {
        const ringGeo = new THREE.RingGeometry(orb.r * 1.35, orb.r * 1.75, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x7af1fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.4;
        orbMesh.add(ringMesh);
      }
    });

    // 5. Target Orientation: Dynamic 3/4 front angle on mobile, profile facing left on desktop
    const BASE_ROTATION_Y = isMobile ? -Math.PI / 6.5 : -Math.PI / 2.05;
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

            // Calculate bounding box and dynamically scale to be BIG and completely unclipped
            geo.computeBoundingBox();
            const bbox = geo.boundingBox!;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDimension = Math.max(size.x, size.y, size.z) || 1;

            const vFOV = (camera.fov * Math.PI) / 180;
            const visibleFrustumHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
            const visibleFrustumWidth = visibleFrustumHeight * camera.aspect;

            // Target height: prominent and large, leaving safe top margin
            const targetHeight = isMobile
              ? Math.min(visibleFrustumHeight * 0.82, visibleFrustumWidth * 0.95, 10.0)
              : Math.min(visibleFrustumHeight * 0.76, 10.0);
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

      // Floating planetary orbs gentle breathing
      orbMeshes.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(elapsedTime * 1.5 + idx * 1.2) * 0.002;
        mesh.rotation.y += 0.008;
      });

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
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center select-none overflow-visible">
      {/* Three.js 3D WebGL Canvas (Free Floating, Zero Clipping/Borders) */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[360px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible"
      />

      {/* Floating 3D Telemetry HUD Badges */}
      <div className="absolute top-2 right-2 sm:top-6 sm:right-10 flex flex-col items-end gap-1 pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-[#0077c8]/30 text-[#002b66] font-mono text-[9px] sm:text-[11px] font-bold tracking-wider shadow-xs">
          1.00011 // 0.39
        </span>
        <span className="text-[8px] sm:text-[9.5px] font-mono font-bold text-[#7c3aed] tracking-widest uppercase">
          RAD.AI // [ACTIVE]
        </span>
      </div>

      {/* Interactive 3D Orbit Drag Hint */}
      <div className="absolute bottom-1 right-2 sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#d4e8f5] shadow-xs text-[9px] sm:text-[10px] font-mono font-bold text-[#002b66] pointer-events-none z-10">
        <Move3d className="w-3 h-3 text-[#0077c8]" />
        <span className="hidden sm:inline">Drag to rotate 3D Head 360°</span>
        <span className="sm:hidden">Drag to 3D Orbit</span>
      </div>
    </div>
  );
};

export default ThreeDCyberHeadCanvas;
