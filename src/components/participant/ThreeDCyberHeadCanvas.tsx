import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Move3d, Sparkles } from 'lucide-react';
import { SpiherStarburstLogo } from '../common/CollegeLogo';

interface ThreeDCyberHeadCanvasProps {
  onRegisterClick?: () => void;
}

export const ThreeDCyberHeadCanvas: React.FC<ThreeDCyberHeadCanvasProps> = ({ onRegisterClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Helper: test if WebGL is available
    const checkWebGLAvailability = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGLAvailability()) {
      console.warn('WebGL is not supported or restricted in this environment.');
      setWebglSupported(false);
      return;
    }

    const initialWidth = mount.clientWidth || window.innerWidth || 650;
    const initialHeight = mount.clientHeight || (window.innerWidth < 1024 ? 600 : 560);
    const isMobileInitial = window.innerWidth < 1024;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    // 2. Safe WebGL Renderer Creation with try/catch
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobileInitial, // Disable antialiasing on mobile to save GPU memory
        powerPreference: 'default',
        precision: isMobileInitial ? 'mediump' : 'highp',
      });
    } catch (err) {
      console.error('Failed to create WebGLRenderer:', err);
      setWebglSupported(false);
      return;
    }

    renderer.setSize(initialWidth, initialHeight);
    // Strict DPR capping: 1.25 on mobile prevents high-resolution buffer crashes, 1.75 max on desktop
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileInitial ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // Prevent Chrome from permanently replacing canvas with [x_x] on context loss
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL Context Lost - handled gracefully.');
    };
    const handleContextRestored = () => {
      console.info('WebGL Context Restored.');
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    // 3. High-Contrast Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x0077c8, 5.5, 60);
    keyLight.position.set(-8, 6, 12);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00f2fe, 4.5, 50);
    rimLight.position.set(8, 8, 4);
    scene.add(rimLight);

    const purpleLight = new THREE.PointLight(0x7c3aed, 3.8, 45);
    purpleLight.position.set(2, -8, 8);
    scene.add(purpleLight);

    // 4. Master Head Group & Adaptive Frustum Calculations
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Calculate camera visible bounds at z=0
    const vFOV = (camera.fov * Math.PI) / 180;
    const frustumHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const frustumWidth = frustumHeight * (initialWidth / initialHeight);

    // Dynamic Resting Position:
    // On mobile portrait (frustumWidth ~ 5.5): position at ~ +1.4 so head sits nicely on right facing text
    // On desktop: position at ~ +3.8
    let restingPosX = isMobileInitial ? Math.min(frustumWidth * 0.28, 1.55) : 3.8;
    let restingPosY = isMobileInitial ? -0.15 : 0.1;

    // Starts slightly to the right for initial entrance
    headGroup.position.set(restingPosX + 4.0, restingPosY, 0);

    // 5. Optimized Particle Swarm (Reduced count for mobile memory efficiency)
    const particleCount = isMobileInitial ? 350 : 650;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorBlue = new THREE.Color(0x0077c8);
    const colorCyan = new THREE.Color(0x00f2fe);
    const colorPurple = new THREE.Color(0x7c3aed);

    for (let i = 0; i < particleCount; i++) {
      const radius = 4.5 + Math.random() * 7.5;
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
      size: isMobileInitial ? 0.11 : 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
    });
    const backgroundParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(backgroundParticles);

    // 6. Base Target Orientation: Profile facing left towards text
    const BASE_ROTATION_Y = -Math.PI / 2.05; // ~ -88 degrees
    const BASE_ROTATION_X = 0.02;

    // Track allocated geometries and materials for complete leak-free cleanup
    const disposables: Array<{ dispose: () => void }> = [
      particleGeo,
      particleMat,
      ambientLight,
      keyLight,
      rimLight,
      purpleLight,
    ];

    // 7. Load Model with Shared Geometry Optimization
    const loader = new GLTFLoader();

    loader.load(
      '/cyber_head.glb',
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const originalMesh = child as THREE.Mesh;
            // Use SINGLE geometry instance instead of cloning 3 separate times (66% GPU memory savings!)
            const geo = originalMesh.geometry;
            geo.center();
            geo.computeVertexNormals();
            disposables.push(geo);

            geo.computeBoundingBox();
            const bbox = geo.boundingBox!;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDimension = Math.max(size.x, size.y, size.z) || 1;

            // Target height: dynamically fits mobile without clipping or overflowing
            const targetHeight = isMobileInitial
              ? Math.min(frustumHeight * 0.75, frustumWidth * 1.15, 8.5)
              : 11.2;
            const scaleFactor = targetHeight / maxDimension;

            // Layer A: Semi-Translucent Ice-Glass Base Mesh
            const solidMat = new THREE.MeshStandardMaterial({
              color: 0xe6f4fb,
              roughness: 0.2,
              metalness: 0.2,
              transparent: true,
              opacity: 0.62,
            });
            disposables.push(solidMat);
            const solidMesh = new THREE.Mesh(geo, solidMat);
            solidMesh.scale.set(scaleFactor * 0.99, scaleFactor * 0.99, scaleFactor * 0.99);
            headGroup.add(solidMesh);

            // Layer B: Vibrant Royal Blue Wireframe Grid
            const wireMat = new THREE.MeshBasicMaterial({
              color: 0x005fa3,
              wireframe: true,
              transparent: true,
              opacity: 0.88,
            });
            disposables.push(wireMat);
            const wireMesh = new THREE.Mesh(geo, wireMat);
            wireMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            headGroup.add(wireMesh);

            // Layer C: Sparkling Purple & Cyan Vertex Nodes
            const pointsMat = new THREE.PointsMaterial({
              color: 0x7c3aed,
              size: isMobileInitial ? 0.065 : 0.08,
              transparent: true,
              opacity: 0.9,
            });
            disposables.push(pointsMat);
            const pointsMesh = new THREE.Points(geo, pointsMat);
            pointsMesh.scale.set(scaleFactor * 1.003, scaleFactor * 1.003, scaleFactor * 1.003);
            headGroup.add(pointsMesh);
          }
        });

        headGroup.rotation.y = BASE_ROTATION_Y;
        headGroup.rotation.x = BASE_ROTATION_X;
        setModelLoaded(true);
      },
      undefined,
      (error) => {
        console.warn('GLTF load failed, using procedural cyber polyhedron:', error);
        const procGeo = new THREE.IcosahedronGeometry(isMobileInitial ? 3.4 : 4.6, 2);
        disposables.push(procGeo);

        const procWireMat = new THREE.MeshBasicMaterial({
          color: 0x005fa3,
          wireframe: true,
          transparent: true,
          opacity: 0.85,
        });
        disposables.push(procWireMat);
        const procMesh = new THREE.Mesh(procGeo, procWireMat);
        headGroup.add(procMesh);

        const procPointsMat = new THREE.PointsMaterial({
          color: 0x7c3aed,
          size: 0.1,
          transparent: true,
          opacity: 0.9,
        });
        disposables.push(procPointsMat);
        const procPoints = new THREE.Points(procGeo, procPointsMat);
        headGroup.add(procPoints);

        headGroup.rotation.y = BASE_ROTATION_Y;
        setModelLoaded(true);
      }
    );

    // 8. Pointer Drag Physics
    let targetRotationX = BASE_ROTATION_X;
    let targetRotationY = BASE_ROTATION_Y;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      velocityX = 0;
      velocityY = 0;
      try {
        mount.setPointerCapture(e.pointerId);
      } catch {}
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;

        velocityX = deltaX * 0.009;
        velocityY = deltaY * 0.007;

        targetRotationY += velocityX;
        targetRotationX += velocityY;
        targetRotationX = Math.max(-0.85, Math.min(0.85, targetRotationX));

        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else if (e.pointerType === 'mouse') {
        const rect = mount.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = BASE_ROTATION_Y + normX * 0.4;
        targetRotationX = BASE_ROTATION_X - normY * 0.25;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        mount.releasePointerCapture(e.pointerId);
      } catch {}
    };

    mount.addEventListener('pointerdown', handlePointerDown);
    mount.addEventListener('pointermove', handlePointerMove);
    mount.addEventListener('pointerup', handlePointerUp);
    mount.addEventListener('pointercancel', handlePointerUp);

    // 9. Scroll Tracking
    let scrollY = window.scrollY || 0;
    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 10. Animation Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth slide-in towards resting position
      headGroup.position.x += (restingPosX - headGroup.position.x) * 0.05;

      // Inertia decay
      if (!isDragging) {
        velocityX *= 0.94;
        velocityY *= 0.94;
        targetRotationY += velocityX;
        targetRotationX += velocityY;
        targetRotationX = Math.max(-0.85, Math.min(0.85, targetRotationX));
      }

      // Gentle vertical float + scroll parallax
      const scrollFactor = Math.min(scrollY / 700, 1.0);
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.08;
      headGroup.position.y = (restingPosY + floatOffset) - (scrollFactor * 0.6);

      // Smooth rotation lerp
      headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.08;

      // Particle drift
      backgroundParticles.rotation.y = elapsedTime * 0.03;
      backgroundParticles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.06;

      // Subtle light pulse
      keyLight.intensity = 5.0 + Math.sin(elapsedTime * 2.2) * 0.8;
      rimLight.intensity = 4.2 + Math.cos(elapsedTime * 1.8) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Dynamic Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      const isMob = window.innerWidth < 1024;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Re-calculate visible frustum on orientation change or desktop resize
      const curFrustumHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const curFrustumWidth = curFrustumHeight * (w / h);
      restingPosX = isMob ? Math.min(curFrustumWidth * 0.28, 1.55) : 3.8;
      restingPosY = isMob ? -0.15 : 0.1;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mount.removeEventListener('pointerdown', handlePointerDown);
      mount.removeEventListener('pointermove', handlePointerMove);
      mount.removeEventListener('pointerup', handlePointerUp);
      mount.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      cancelAnimationFrame(animationId);

      // Full disposal of all GPU assets
      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {}
      });

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  // Fallback if device has no WebGL or GPU crashed permanently
  if (!webglSupported) {
    return (
      <div className="relative w-full h-full min-h-[440px] sm:min-h-[540px] flex items-center justify-center select-none overflow-hidden">
        <div className="relative flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#0077c8]/30 shadow-lg shadow-[#0077c8]/15 flex items-center justify-center animate-pulse">
            <SpiherStarburstLogo size={56} />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#d4e8f5] text-[10px] font-mono font-bold text-[#002b66]">
              <Sparkles className="w-3 h-3 text-[#0077c8]" />
              <span>RADIANZA 3D CORE ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">SPIHER Flagship Technical Symposium</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[540px] flex items-center justify-center select-none overflow-visible">
      {/* Three.js 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[440px] sm:min-h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Floating 3D Telemetry HUD Badges */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-10 flex flex-col items-end gap-1 pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-[#0077c8]/30 text-[#002b66] font-mono text-[10px] sm:text-[11px] font-bold tracking-wider shadow-xs">
          1.00011 // 0.39
        </span>
        <span className="text-[9px] font-mono font-bold text-[#7c3aed] tracking-widest uppercase">
          mot.pos:c [SYS_OK]
        </span>
      </div>

      {/* Interactive 3D Orbit Drag / Touch Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#d4e8f5] shadow-xs text-[10px] font-mono font-bold text-[#002b66] pointer-events-none z-10 whitespace-nowrap">
        <Move3d className="w-3.5 h-3.5 text-[#0077c8]" />
        <span>Touch & drag to rotate 3D Head 360°</span>
      </div>
    </div>
  );
};

export default ThreeDCyberHeadCanvas;
