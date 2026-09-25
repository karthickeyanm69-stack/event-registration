import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CollegeEmblem } from '../common/CollegeLogo';

// RADIANZA '26 — 3D Spider-Man Head Canvas
// - Right-to-Left Slide-In Entrance Animation (matching 2nd-tag)
// - Large front-half profile positioning
// - PBR Studio Lighting + Cyan Rim Glow + Disintegration Particles
// - Interactive Touch/Drag & Mouse Parallax Physics

interface ThreeDCyberHeadCanvasProps {
  isRevealed?: boolean;
  onRegisterClick?: () => void;
}

export const ThreeDCyberHeadCanvas: React.FC<ThreeDCyberHeadCanvasProps> = ({
  isRevealed = true,
  onRegisterClick: _onRegisterClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const isRevealedPropRef = useRef(isRevealed);

  useEffect(() => {
    isRevealedPropRef.current = isRevealed;
  }, [isRevealed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── WebGL Availability Check ──
    const checkWebGL = (): boolean => {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch { return false; }
    };
    if (!checkWebGL()) { setWebglSupported(false); return; }

    const isMobile = window.innerWidth < 1024;
    const initialW = mount.clientWidth || (isMobile ? window.innerWidth : 650);
    const initialH = mount.clientHeight || (isMobile ? 700 : 580);

    // ── 1. Scene & Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, initialW / initialH, 0.1, 100);
    camera.position.set(0, 0, 16);

    // ── 2. Renderer with Exact Color Pipeline ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
      });
    } catch {
      setWebglSupported(false);
      return;
    }
    renderer.setSize(initialW, initialH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => { e.preventDefault(); };
    const handleContextRestored = () => { };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    const disposables: Array<{ dispose: () => void }> = [];

    // ── 3. High-Fidelity Studio Lighting (Cyber Heroic Aesthetic) ──
    const ambientLight = new THREE.AmbientLight(0x24080D, isMobile ? 2.2 : 1.8);
    scene.add(ambientLight);

    // Main Key Light illuminating the face, eye, nose, cheek with crisp definition
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, isMobile ? 4.4 : 3.8);
    keyLight.position.set(5, 7, 8);
    scene.add(keyLight);

    // Soft Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xFFD8E0, isMobile ? 2.2 : 1.8);
    fillLight.position.set(-3, 5, 8);
    scene.add(fillLight);

    // Cyan Rim Light outlining the rear contour with vivid laser radiance
    const cyanRimLight = new THREE.DirectionalLight(0x00F0FF, isMobile ? 5.8 : 4.6);
    cyanRimLight.position.set(-7, 3, -5);
    scene.add(cyanRimLight);

    // Crimson Accent Rim Light for intense scarlet edge highlights
    const crimsonRimLight = new THREE.DirectionalLight(0xFF0038, isMobile ? 4.2 : 3.2);
    crimsonRimLight.position.set(6, -2, -4);
    scene.add(crimsonRimLight);

    // Crimson Under-Glow for chin & throat
    const bottomLight = new THREE.DirectionalLight(0xC1121F, 2.2);
    bottomLight.position.set(0, -6, 5);
    scene.add(bottomLight);

    // ── 4. Master Head Group & Calibrated Positioning ──
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Calibrated Resting Coordinates
    const RESTING_POS_X = isMobile ? 2.85 : 3.75;
    const RESTING_POS_Y = isMobile ? 0.15 : 0.20;
    const TARGET_HEIGHT = isMobile ? 11.6 : 12.0;

    // Rotated prominently towards the user (-27° yaw) for full frontal/3-quarter face view
    const BASE_ROT_Y = -Math.PI / 6.5;
    const BASE_ROT_X = -0.035;

    // Start off-screen right staged for entrance slide-in upon reveal
    const OFFSCREEN_X = RESTING_POS_X + (isMobile ? 5.5 : 7.0);
    headGroup.position.set(OFFSCREEN_X, RESTING_POS_Y, 0);
    headGroup.rotation.y = BASE_ROT_Y - 0.40;
    headGroup.rotation.x = BASE_ROT_X;

    // ── 5. Cyan Glowing Particle Textures ──
    const makeGlowDotTex = () => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, 'rgba(255,255,255,1.0)');
        g.addColorStop(0.18, 'rgba(100,250,235,0.95)');
        g.addColorStop(0.48, 'rgba(30,210,195,0.42)');
        g.addColorStop(1, 'rgba(0,180,165,0.0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };
    const glowDotTex = makeGlowDotTex();
    disposables.push(glowDotTex);

    // ── Eye Glowing Laser Light & Flare (Matching Video Reference) ──
    const eyeLight = new THREE.PointLight(0x00FFFF, 0, 7.5);
    eyeLight.position.set(0.60, 1.25, 2.75);
    headGroup.add(eyeLight);

    const eyeGlowMat = new THREE.SpriteMaterial({
      map: glowDotTex,
      color: new THREE.Color(0x80FFFF),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(eyeGlowMat);
    const eyeSprite = new THREE.Sprite(eyeGlowMat);
    eyeSprite.position.set(0.60, 1.25, 2.70);
    eyeSprite.scale.set(isMobile ? 1.5 : 1.35, isMobile ? 1.5 : 1.35, 1);
    headGroup.add(eyeSprite);

    // ── 6. Load GLB Model with Native PBR Materials ──
    let headMaterials: THREE.MeshStandardMaterial[] = [];
    let disintGeoRef: THREE.BufferGeometry | null = null;
    let disintMatRef: THREE.PointsMaterial | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/spider_man_head.glb',
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = TARGET_HEIGHT / maxDim;

        gltf.scene.scale.setScalar(scaleFactor);
        const center = new THREE.Vector3();
        box.getCenter(center);
        gltf.scene.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const geo = mesh.geometry;
            geo.computeVertexNormals();

            if (mesh.material) {
              const oldMat = mesh.material as THREE.MeshStandardMaterial;
              const newMat = new THREE.MeshStandardMaterial({
                map: oldMat.map || null,
                normalMap: oldMat.normalMap || null,
                roughnessMap: oldMat.roughnessMap || null,
                color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xFFFFFF),
                roughness: isMobile ? 0.32 : 0.38,
                metalness: isMobile ? 0.22 : 0.16,
                emissive: new THREE.Color(0x280408),
                emissiveIntensity: isMobile ? 0.35 : 0.25,
                side: THREE.FrontSide,
              });

              if (newMat.map) {
                newMat.map.colorSpace = THREE.SRGBColorSpace;
                newMat.map.needsUpdate = true;
              }

              mesh.material = newMat;
              disposables.push(newMat);
              headMaterials.push(newMat);
            }

            // ═════════════════════════════════════════════════════════════════
            // DISINTEGRATION PARTICLE CLOUD (Trailing off the rear skull curve)
            // ═════════════════════════════════════════════════════════════════
            const posAttr = geo.attributes.position;
            const vertexCount = posAttr.count;
            const P_COUNT = isMobile ? 950 : 1600;

            const disintGeo = new THREE.BufferGeometry();
            const dPos = new Float32Array(P_COUNT * 3);
            const dBase = new Float32Array(P_COUNT * 3);
            const dDrift = new Float32Array(P_COUNT * 3);
            const dColor = new Float32Array(P_COUNT * 3);
            const dSpeed = new Float32Array(P_COUNT);
            const dPhase = new Float32Array(P_COUNT);

            const cCyan1 = new THREE.Color('#90FFFF');
            const cCyan2 = new THREE.Color('#40E0D0');
            const cCyan3 = new THREE.Color('#1DB5A5');

            let pIdx = 0;
            for (let i = 0; i < vertexCount && pIdx < P_COUNT; i += Math.max(1, Math.floor(vertexCount / P_COUNT))) {
              const vx = posAttr.getX(i);
              const vy = posAttr.getY(i);
              const vz = posAttr.getZ(i);

              if (vz < 0.12 || vx > 0.15) {
                const scaledX = (vx - center.x) * scaleFactor;
                const scaledY = (vy - center.y) * scaleFactor;
                const scaledZ = (vz - center.z) * scaleFactor;

                dBase[pIdx * 3] = scaledX;
                dBase[pIdx * 3 + 1] = scaledY;
                dBase[pIdx * 3 + 2] = scaledZ;

                dPos[pIdx * 3] = scaledX;
                dPos[pIdx * 3 + 1] = scaledY;
                dPos[pIdx * 3 + 2] = scaledZ;

                dDrift[pIdx * 3] = 0.4 + Math.random() * 1.6;
                dDrift[pIdx * 3 + 1] = 0.2 + Math.random() * 1.5;
                dDrift[pIdx * 3 + 2] = -(0.7 + Math.random() * 2.2);

                dSpeed[pIdx] = 0.24 + Math.random() * 0.45;
                dPhase[pIdx] = Math.random() * Math.PI * 2;

                const u = Math.random();
                const col = u > 0.65 ? cCyan1 : u > 0.25 ? cCyan2 : cCyan3;
                dColor[pIdx * 3] = col.r;
                dColor[pIdx * 3 + 1] = col.g;
                dColor[pIdx * 3 + 2] = col.b;

                pIdx++;
              }
            }

            disintGeo.setAttribute('position', new THREE.BufferAttribute(dPos.slice(0, pIdx * 3), 3));
            disintGeo.setAttribute('color', new THREE.BufferAttribute(dColor.slice(0, pIdx * 3), 3));
            disposables.push(disintGeo);

            (disintGeo as any)._dBase = dBase;
            (disintGeo as any)._dDrift = dDrift;
            (disintGeo as any)._dSpeed = dSpeed;
            (disintGeo as any)._dPhase = dPhase;
            (disintGeo as any)._pCount = pIdx;
            disintGeoRef = disintGeo;

            const disintMat = new THREE.PointsMaterial({
              size: isMobile ? 0.065 : 0.085,
              map: glowDotTex,
              vertexColors: true,
              transparent: true,
              opacity: 0.92,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            disposables.push(disintMat);
            disintMatRef = disintMat;

            const disintPoints = new THREE.Points(disintGeo, disintMat);
            headGroup.add(disintPoints);
          }
        });

        headGroup.add(gltf.scene);
        headGroup.rotation.y = BASE_ROT_Y;
        headGroup.rotation.x = BASE_ROT_X;
      },
      undefined,
      (err) => {
        console.warn('spider_man_head.glb load error:', err);
      }
    );

    // ── 7. Floating Ambient Embers ──
    const EMBER_COUNT = isMobile ? 40 : 60;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(EMBER_COUNT * 3);
    const emberCol = new Float32Array(EMBER_COUNT * 3);
    const emberVelY = new Float32Array(EMBER_COUNT);
    const emberPhase = new Float32Array(EMBER_COUNT);

    const cRed = new THREE.Color('#FF1738');
    const cCrimson = new THREE.Color('#C1121F');
    const cCyanGlow = new THREE.Color('#40E0D0');

    for (let i = 0; i < EMBER_COUNT; i++) {
      emberPos[i * 3] = -5.0 + Math.random() * 10.0;
      emberPos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
      emberPos[i * 3 + 2] = -2.0 + Math.random() * 4.0;
      emberVelY[i] = 0.0035 + Math.random() * 0.006;
      emberPhase[i] = Math.random() * Math.PI * 2;

      const r = Math.random();
      const col = r > 0.7 ? cRed : r > 0.35 ? cCrimson : cCyanGlow;
      emberCol[i * 3] = col.r;
      emberCol[i * 3 + 1] = col.g;
      emberCol[i * 3 + 2] = col.b;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    emberGeo.setAttribute('color', new THREE.BufferAttribute(emberCol, 3));
    disposables.push(emberGeo);

    const emberMat = new THREE.PointsMaterial({
      size: isMobile ? 0.10 : 0.13,
      map: glowDotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(emberMat);
    scene.add(new THREE.Points(emberGeo, emberMat));

    // ── 8. Interactive Drag & Touch Orbit Physics ──
    let targetRotX = BASE_ROT_X;
    let targetRotY = BASE_ROT_Y;
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let startX = 0, startY = 0;
    let locked: 'scroll' | 'rotate' | null = null;
    let velX = 0, velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Allow touch to smoothly and natively scroll the page without interference
      if (e.pointerType === 'touch') return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      locked = null;
      velX = 0; velY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        const rect = mount.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2.0;
        targetRotY = BASE_ROT_Y + nx * 0.22;
        targetRotX = BASE_ROT_X - ny * 0.15;
        return;
      }

      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      if (locked === null && (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6)) {
        if (Math.abs(e.clientY - startY) > Math.abs(e.clientX - startX) * 1.5) {
          locked = 'scroll';
          isDragging = false;
          return;
        } else {
          locked = 'rotate';
        }
      }

      if (locked === 'scroll') return;

      velX = dx * 0.0035;
      velY = dy * 0.0025;
      targetRotY += velX;
      targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + velY));

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      locked = null;
    };

    mount.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    // ── 9. Scroll Tracking ──
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 9.1. Interactive Reveal Event Listener ──
    let revealActive = isRevealed !== undefined ? !isRevealed : true;
    let revealProgress = 0.0;
    let revealDragging = false;
    let revealSnapping = false;
    let revealPointerX = window.innerWidth * 0.5;
    let revealPointerY = window.innerHeight * 0.4;

    const onRevealProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{
        progress: number;
        isDragging: boolean;
        isSnapping: boolean;
        isRevealed: boolean;
        pointerX: number;
        pointerY: number;
      }>;
      if (!customEvent.detail) return;
      revealActive = !customEvent.detail.isRevealed;
      revealProgress = customEvent.detail.progress;
      revealDragging = customEvent.detail.isDragging;
      revealSnapping = customEvent.detail.isSnapping;
      revealPointerX = customEvent.detail.pointerX;
      revealPointerY = customEvent.detail.pointerY;
    };
    window.addEventListener('radianza:reveal-progress', onRevealProgress);

    // ── 10. Animation Loop ──
    let rafId: number;
    let isVisibleInViewport = true;
    let isTabActive = !document.hidden;
    let isAnimating = false;
    const t0 = performance.now();

    const animate = () => {
      if (!isVisibleInViewport || !isTabActive) {
        isAnimating = false;
        return;
      }
      isAnimating = true;
      rafId = requestAnimationFrame(animate);

      // ── Reactive Reveal Interaction & Dynamic Entrance Slide-In ──
      const isUnrevealed = !isRevealedPropRef.current && revealActive;
      if (isUnrevealed && !revealDragging && !revealSnapping && revealProgress < 0.02) {
        // Dormant sleep behind 100% solid black veil: saves 100% GPU/CPU for instant reveal responsiveness
        return;
      }

      const t = (performance.now() - t0) * 0.001;
      if (isUnrevealed) {
        // While user is pulling on the black web screen:
        // Hold head staged off-screen to the right, nudging slightly as tension builds
        const stagedX = OFFSCREEN_X - revealProgress * 1.8;
        headGroup.position.x += (stagedX - headGroup.position.x) * 0.15;

        // Dark initial exposure scaling up as pullProgress increases
        const targetExposure = revealSnapping ? 1.35 : 0.30 + Math.pow(revealProgress, 1.2) * 1.05;
        renderer.toneMappingExposure = targetExposure;

        // Subtle twitch/turn toward the interaction point during drag
        if (revealDragging) {
          const normX = (revealPointerX / window.innerWidth - 0.5) * 2.0;
          const normY = (revealPointerY / window.innerHeight - 0.5) * 2.0;
          targetRotY = BASE_ROT_Y - 0.35 + normX * 0.16 + revealProgress * 0.20;
          targetRotX = BASE_ROT_X - normY * 0.12;
        } else {
          targetRotY = BASE_ROT_Y - 0.40;
          targetRotX = BASE_ROT_X;
        }

        // Energy activation flash around ~60% (0.56 - 0.66)
        if (revealProgress >= 0.56 && revealProgress <= 0.66) {
          const flashPhase = (revealProgress - 0.56) / 0.10;
          const flash = Math.sin(flashPhase * Math.PI);
          keyLight.intensity = 3.6 + flash * 2.4;
          cyanRimLight.intensity = 4.2 + flash * 3.5;
        } else {
          keyLight.intensity = 1.0 + revealProgress * 2.6;
          cyanRimLight.intensity = (1.5 + Math.sin(t * 2.0) * 0.6) * (0.4 + revealProgress * 0.6);
        }

        // Snapping surge
        if (revealSnapping) {
          headGroup.position.z += (0.6 - headGroup.position.z) * 0.15;
        } else {
          headGroup.position.z += (0 - headGroup.position.z) * 0.08;
        }

        // Eye glow intensity sync with reveal progress
        const eyeIntensity = revealSnapping
          ? 6.8
          : (revealProgress > 0.05 ? Math.pow(revealProgress, 0.70) * 5.8 : 0.6 + Math.sin(t * 2.5) * 0.3);
        eyeLight.intensity = eyeIntensity;
        eyeSprite.material.opacity = Math.min(1.0, eyeIntensity * 0.22);
      } else {
        // ── AFTER DRAGGING IS OVER & REVEAL OCCURS: ──
        // Smooth, cinematic Right-to-Left Entrance Slide-In!
        headGroup.position.x += (RESTING_POS_X - headGroup.position.x) * 0.052;

        // Inertia Damping & Gentle Return to Default Pose
        if (!isDragging) {
          velX *= 0.90; velY *= 0.90;
          targetRotY += (BASE_ROT_Y - targetRotY) * 0.045 + velX;
          targetRotX += (BASE_ROT_X - targetRotX) * 0.045 + velY;
        }

        renderer.toneMappingExposure = isMobile ? 1.45 : 1.35;
        keyLight.intensity = isMobile ? 4.4 : 3.6;
        cyanRimLight.intensity = (isMobile ? 5.2 : 3.8) + Math.sin(t * 2.0) * 0.6;
        headGroup.position.z += (0 - headGroup.position.z) * 0.08;

        // Settled eye glow
        const eyeIntensity = (isMobile ? 3.2 : 2.4) + Math.sin(t * 2.0) * 0.5;
        eyeLight.intensity = eyeIntensity;
        eyeSprite.material.opacity = Math.min(1.0, eyeIntensity * 0.22);
      }

      // ── Gentle Floating Physics & Scroll Parallax (matching 2nd-tag) ──
      const scrollFrac = Math.min(scrollY / 750, 1.0);
      headGroup.position.y = RESTING_POS_Y + Math.sin(t * 1.3) * 0.06 - scrollFrac * 0.45;

      // Smooth rotation lerp
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.075;
      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.075;

      // Animate Disintegration Particles
      if (disintGeoRef) {
        const pCount = (disintGeoRef as any)._pCount as number;
        const pos = disintGeoRef.attributes.position.array as Float32Array;
        const base = (disintGeoRef as any)._dBase as Float32Array;
        const drift = (disintGeoRef as any)._dDrift as Float32Array;
        const spd = (disintGeoRef as any)._dSpeed as Float32Array;
        const ph = (disintGeoRef as any)._dPhase as Float32Array;

        for (let i = 0; i < pCount; i++) {
          const cycle = (t * spd[i] + ph[i]) % 3.5;
          const prog = cycle / 3.5;
          const dEase = Math.pow(prog, 0.7);

          pos[i * 3] = base[i * 3] + drift[i * 3] * dEase + Math.sin(t * 1.8 + ph[i]) * 0.04;
          pos[i * 3 + 1] = base[i * 3 + 1] + drift[i * 3 + 1] * dEase;
          pos[i * 3 + 2] = base[i * 3 + 2] + drift[i * 3 + 2] * dEase;
        }
        disintGeoRef.attributes.position.needsUpdate = true;
      }

      if (disintMatRef) {
        disintMatRef.opacity = 0.82 + Math.sin(t * 2.2) * 0.14;
      }

      // Animate Embers
      const eArr = emberGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < EMBER_COUNT; i++) {
        eArr[i * 3 + 1] += emberVelY[i];
        eArr[i * 3] += Math.sin(t * 0.9 + emberPhase[i]) * 0.002;
        if (eArr[i * 3 + 1] > 6.5) {
          eArr[i * 3 + 1] = -6.5;
          eArr[i * 3] = -5.0 + Math.random() * 10.0;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const startAnimation = () => {
      if (!isAnimating && isVisibleInViewport && isTabActive) {
        animate();
      }
    };
    startAnimation();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewport = entry.isIntersecting;
        if (isVisibleInViewport) startAnimation();
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) startAnimation();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── 11. Responsive Resize ──
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || (isMobile ? window.innerWidth : 650);
      const h = mount.clientHeight || (isMobile ? 700 : 580);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ──
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('radianza:reveal-progress', onRevealProgress);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      cancelAnimationFrame(rafId);
      disposables.forEach(d => { try { d.dispose(); } catch { } });
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-full min-h-[440px] sm:min-h-[540px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/90 border border-[#0077c8]/30 shadow-lg flex items-center justify-center animate-pulse">
            <CollegeEmblem size={52} roundedBg />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#d4e8f5] text-[10px] font-mono font-bold text-[#002b66]">
            <Sparkles className="w-3 h-3 text-[#0077c8]" />
            <span>RADIANZA 3D CORE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center select-none overflow-visible pointer-events-auto"
    >
      <div
        ref={mountRef}
        className="w-full h-full min-h-[480px] sm:min-h-[580px] cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      />
    </motion.div>
  );
};

export default ThreeDCyberHeadCanvas;
