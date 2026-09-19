import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Zap, Sparkles, Orbit, Compass, Move3d } from 'lucide-react';

interface ThreeDHeroExperienceProps {
  onRegisterClick: () => void;
}

export const ThreeDHeroExperience: React.FC<ThreeDHeroExperienceProps> = ({ onRegisterClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D View Mode: 'avatar' (Holographic Cybernetic Avatar with 3D particles & rings) or 'quantum' (Full 3D WebGL Interactive Core)
  const [viewMode, setViewMode] = useState<'avatar' | 'quantum'>('avatar');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const manualRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup
    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 4, 60);
    pointLight1.position.set(10, 10, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 3, 60);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x0077c8, 3.5, 60);
    pointLight3.position.set(0, 12, 10);
    scene.add(pointLight3);

    // 3. 3D Meshes Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 3A. Central Quantum Icosahedron Core (Wireframe + Solid Glow)
    const coreGeo = new THREE.IcosahedronGeometry(6.2, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x002b66,
      wireframe: true,
      emissive: 0x0077c8,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // 3B. Concentric Gyroscopic Orbiting Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const ringGeo1 = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const ringGeo2 = new THREE.TorusGeometry(10.2, 0.06, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    rootGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x00a887,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const ringGeo3 = new THREE.TorusGeometry(11.8, 0.05, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 3;
    rootGroup.add(ring3);

    // 3C. 3D Particle Swarm (1,800 points with spherical distribution)
    const particleCount = 1800;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00f2fe);
    const color2 = new THREE.Color(0x0077c8);
    const color3 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const radius = 7 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const mixedColor = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // 4. Mouse Interactive Coordinates
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotationY = x * 0.8;
      targetRotationX = y * 0.6;
      setTilt({ x: y * -15, y: x * 15 });

      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMousePos.current.x;
        const deltaY = e.clientY - prevMousePos.current.y;
        manualRotation.current.y += deltaX * 0.01;
        manualRotation.current.x += deltaY * 0.01;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('mousedown', handleMouseDown);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous ambient rotation
      coreMesh.rotation.y = elapsedTime * 0.25 + manualRotation.current.y;
      coreMesh.rotation.x = elapsedTime * 0.18 + manualRotation.current.x;

      innerMesh.rotation.y = -elapsedTime * 0.4;
      innerMesh.rotation.z = elapsedTime * 0.2;

      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.x = elapsedTime * 0.28;
      ring3.rotation.y = elapsedTime * 0.22;

      particleSystem.rotation.y = elapsedTime * 0.08 + manualRotation.current.y * 0.5;

      // Smooth Camera / Scene Lerp towards cursor
      rootGroup.rotation.y += (targetRotationY + manualRotation.current.y - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetRotationX + manualRotation.current.x - rootGroup.rotation.x) * 0.06;

      // Pulse light
      pointLight1.intensity = 3.5 + Math.sin(elapsedTime * 2.5) * 1.2;
      pointLight2.intensity = 2.8 + Math.cos(elapsedTime * 2.0) * 0.9;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D WebGL Canvas Layer (Always active in background and foreground) */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 w-full h-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Holographic Avatar Layer with Organic Seamless Blend (NO BOX FRAME!) */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: [0, -10, 0],
        }}
        transition={{
          rotateX: { duration: 0.15, ease: 'easeOut' },
          rotateY: { duration: 0.15, ease: 'easeOut' },
          y: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
        }}
        className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Seamless Masked Cyber Face (Feathered edges blend into 3D space) */}
        <div
          className={`relative transition-all duration-700 ${
            viewMode === 'avatar' ? 'opacity-95 scale-100' : 'opacity-20 scale-95 blur-sm'
          }`}
          style={{
            maskImage:
              'radial-gradient(circle at 50% 50%, black 50%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.3) 85%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 50%, black 50%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.3) 85%, transparent 100%)',
          }}
        >
          <img
            src="/radianza-hero-face.jpg"
            alt="RADIANZA 26 Holographic Cybernetic Avatar"
            className="w-full h-auto object-cover aspect-[3/4] drop-shadow-[0_0_35px_rgba(0,242,254,0.45)]"
          />

          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2fe]/10 to-transparent bg-[length:100%_8px] pointer-events-none opacity-40 mix-blend-overlay" />
        </div>

        {/* 3D Floating Holographic HUD Chips (Multiplane Parallax at different Z-depths) */}
        <div
          className="absolute -top-3 -right-2 sm:-right-4 px-3.5 py-1.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-[#00f2fe]/60 shadow-[0_10px_30px_rgba(0,119,200,0.25)] flex items-center gap-2 pointer-events-auto"
          style={{ transform: 'translateZ(65px)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
          <span className="text-[10px] font-mono font-bold text-[#002b66] tracking-wider uppercase">
            3D QUANTUM NEXUS
          </span>
        </div>

        <div
          className="absolute top-1/2 -left-3 sm:-left-6 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#d4e8f5] shadow-[0_15px_35px_rgba(0,43,102,0.2)] flex items-center gap-2.5 pointer-events-auto"
          style={{ transform: 'translateZ(85px)' }}
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#002b66] to-[#0077c8] text-white flex items-center justify-center">
            <Orbit className="w-4 h-4 text-[#00f2fe] animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#002b66]">12+ TRACKS</div>
            <div className="text-[9px] text-slate-500 font-semibold">Live Interactive Arena</div>
          </div>
        </div>

        <div
          className="absolute -bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(0,43,102,0.25)] flex items-center justify-between pointer-events-auto"
          style={{ transform: 'translateZ(95px)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#001f4d] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#00f2fe]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#001f4d]">₹50,000+ Prize Pool</h4>
              <p className="text-[10px] text-slate-500 font-medium">Cash Awards &amp; Official Trophies</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            REGISTER LIVE
          </span>
        </div>
      </motion.div>

      {/* 3D Mode Switcher Button (Allows user to toggle full 3D WebGL Quantum Core view or Avatar view) */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-[#d4e8f5] shadow-xs">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'avatar' ? 'quantum' : 'avatar')}
          className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 bg-[#002b66] text-white shadow-xs cursor-pointer hover:bg-[#0077c8]"
        >
          <Move3d className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>{viewMode === 'avatar' ? 'Inspect 3D Core' : 'View Hologram'}</span>
        </button>
        <span className="text-[9px] font-mono text-slate-400 px-2 hidden sm:inline">
          Drag to rotate 3D
        </span>
      </div>
    </div>
  );
};

export default ThreeDHeroExperience;
