import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CollegeEmblem } from '../common/CollegeLogo';

interface ThreeDCyberHeadCanvasProps {
  onRegisterClick?: () => void;
}

export const ThreeDCyberHeadCanvas: React.FC<ThreeDCyberHeadCanvasProps> = ({ onRegisterClick: _onRegisterClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

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

    // Camera calibrated: FOV=38, position z=16
    // Frustum height = 11.02 units at z=0 (from y=-5.51 to y=+5.51)
    const camera = new THREE.PerspectiveCamera(38, initialW / initialH, 0.1, 100);
    camera.position.set(0, 0, 16);

    // ── 2. Renderer ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'default',
        precision: isMobile ? 'mediump' : 'highp',
      });
    } catch {
      setWebglSupported(false);
      return;
    }
    renderer.setSize(initialW, initialH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => { e.preventDefault(); };
    const handleContextRestored = () => { };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    const disposables: Array<{ dispose: () => void }> = [];

    // ── 3. Background Subtle Cyber Dot Matrix Grid Effect ──
    const gridRows = isMobile ? 26 : 30;
    const gridCols = isMobile ? 26 : 34;
    const gridGeo = new THREE.BufferGeometry();
    const gridPos = new Float32Array(gridRows * gridCols * 3);
    const colStep = 15.6 / (gridCols - 1);
    const rowStep = 13.2 / (gridRows - 1);
    let gIdx = 0;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        gridPos[gIdx * 3] = -7.8 + c * colStep;
        gridPos[gIdx * 3 + 1] = -6.6 + r * rowStep;
        gridPos[gIdx * 3 + 2] = -4.5;
        gIdx++;
      }
    }
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPos, 3));
    disposables.push(gridGeo);

    const gridMat = new THREE.PointsMaterial({
      size: isMobile ? 0.052 : 0.056,
      color: 0x0077c8,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    disposables.push(gridMat);
    scene.add(new THREE.Points(gridGeo, gridMat));

    // ── 4. Master Head Group & Calibrated Vertical Sizing (Zero Top/Bottom Clipping) ──
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Restored large front-half profile visibility & positioning:
    // - TARGET_HEIGHT = 11.6 on mobile (12.0 on desktop) spanning top to bottom
    // - RESTING_POS_X = 3.65 on mobile (3.8 on desktop) so only the front half is visible, skull back is off-screen
    // - RESTING_POS_Y = 0.05 on mobile (0.1 on desktop)
    const RESTING_POS_X = isMobile ? 3.65 : 3.8;
    const RESTING_POS_Y = isMobile ? 0.05 : 0.1;
    const TARGET_HEIGHT = isMobile ? 11.6 : 12.0;

    // Start off-screen right for initial entrance slide-in
    headGroup.position.set(RESTING_POS_X + 6.0, RESTING_POS_Y, 0);

    // Left-facing pure profile (-88 degrees)
    const BASE_ROT_Y = -Math.PI / 2.05;
    const BASE_ROT_X = -0.02;

    // ── 5. Particle Textures ──
    const makeSquareTex = () => {
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 2, 28, 28);
      }
      return new THREE.CanvasTexture(c);
    };
    const squareTex = makeSquareTex();
    disposables.push(squareTex);

    const makeStarTex = () => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(186,230,253,0.75)');
        g.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);

        ctx.beginPath();
        ctx.moveTo(32, 2);
        ctx.quadraticCurveTo(32, 32, 62, 32);
        ctx.quadraticCurveTo(32, 32, 32, 62);
        ctx.quadraticCurveTo(32, 32, 2, 32);
        ctx.quadraticCurveTo(32, 32, 32, 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };
    const starTex = makeStarTex();
    disposables.push(starTex);

    // ── 6. Background Digital Particle Field (Cyan / Royal Blue / Purple / Lavender) ──
    const PC_MAIN = isMobile ? 85 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PC_MAIN * 3);
    const pCol = new Float32Array(PC_MAIN * 3);
    const pVelY = new Float32Array(PC_MAIN);
    const pPhase = new Float32Array(PC_MAIN);

    const cCyan = new THREE.Color('#00e5ff');
    const cSky = new THREE.Color('#38bdf8');
    const cBlue = new THREE.Color('#0077c8');
    const cViolet = new THREE.Color('#a855f7');
    const cLavender = new THREE.Color('#c084fc');

    for (let i = 0; i < PC_MAIN; i++) {
      // Distributed across the hero negative space and depth
      pPos[i * 3] = -7.8 + Math.random() * 11.5;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 13.0;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
      pVelY[i] = 0.005 + Math.random() * 0.008;
      pPhase[i] = Math.random() * Math.PI * 2;

      const r = Math.random();
      const col = r > 0.65 ? cCyan : r > 0.45 ? cSky : r > 0.25 ? cBlue : r > 0.12 ? cViolet : cLavender;
      pCol[i * 3] = col.r; pCol[i * 3 + 1] = col.g; pCol[i * 3 + 2] = col.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    disposables.push(pGeo);

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      map: squareTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    disposables.push(pMat);
    scene.add(new THREE.Points(pGeo, pMat));

    // ── 6b. Secondary Micro Cyber Data Bits (Sharp, high-density cyber particles) ──
    const PC_MICRO = isMobile ? 65 : 90;
    const microGeo = new THREE.BufferGeometry();
    const microPos = new Float32Array(PC_MICRO * 3);
    const microCol = new Float32Array(PC_MICRO * 3);
    const microVelY = new Float32Array(PC_MICRO);
    const microPhase = new Float32Array(PC_MICRO);

    for (let i = 0; i < PC_MICRO; i++) {
      microPos[i * 3] = -7.5 + Math.random() * 11.0;
      microPos[i * 3 + 1] = (Math.random() - 0.5) * 13.0;
      microPos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      microVelY[i] = 0.0035 + Math.random() * 0.006;
      microPhase[i] = Math.random() * Math.PI * 2;

      const r = Math.random();
      const col = r > 0.5 ? cCyan : r > 0.25 ? cLavender : cBlue;
      microCol[i * 3] = col.r; microCol[i * 3 + 1] = col.g; microCol[i * 3 + 2] = col.b;
    }
    microGeo.setAttribute('position', new THREE.BufferAttribute(microPos, 3));
    microGeo.setAttribute('color', new THREE.BufferAttribute(microCol, 3));
    disposables.push(microGeo);

    const microMat = new THREE.PointsMaterial({
      size: isMobile ? 0.12 : 0.14,
      map: squareTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
    disposables.push(microMat);
    scene.add(new THREE.Points(microGeo, microMat));

    // ── 7. Load GLB & Build Clean Frontside-Only Sculptural Mesh ──
    const loader = new GLTFLoader();
    loader.load(
      '/cyber_head.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const src = (child as THREE.Mesh).geometry;
          const geo = src.clone();
          geo.computeVertexNormals();
          disposables.push(geo);

          geo.computeBoundingBox();
          const bb = geo.boundingBox!;
          const sz = new THREE.Vector3();
          bb.getSize(sz);
          const maxDim = Math.max(sz.x, sz.y, sz.z) || 1;
          const S = TARGET_HEIGHT / maxDim;

          const PA = geo.attributes.position;
          const N = PA.count;
          const minY = bb.min.y;
          const maxY = bb.max.y;
          const H = sz.y;

          // Landmarks from geometry:
          const dynNose = new THREE.Vector3(0.0, 1.10, 2.59);
          const dynLips = new THREE.Vector3(0.0, 0.57, 2.35);
          const dynRightEar = new THREE.Vector3(1.72, 1.50, -0.16);
          const dynLeftEar = new THREE.Vector3(-1.72, 1.50, -0.16);
          const dynRightEye = new THREE.Vector3(0.65, 1.94, 1.98);
          const dynLeftEye = new THREE.Vector3(-0.65, 1.94, 1.98);

          // Color Palette:
          const colBase = new THREE.Color('#0062b8'); // Deep Royal Electric Blue
          const colEarViolet = new THREE.Color('#7c3aed'); // Deep Violet for Ear Concha
          const colEarDark = new THREE.Color('#581c87'); // Dark Violet
          const colEyeViolet = new THREE.Color('#6366f1'); // Indigo for Eye socket
          const colLipViolet = new THREE.Color('#8b5cf6'); // Subtle Violet for Lips
          const colNeck = new THREE.Color('#c084fc'); // Lavender for Neck dissolution

          const vColors = new Float32Array(N * 3);
          const pColors = new Float32Array(N * 3);
          const tmpV = new THREE.Vector3();
          const tmpC = new THREE.Color();
          const starIdx: number[] = [];

          const earRadius = 0.85;
          const eyeRadius = 0.55;
          const lipRadius = 0.45;

          for (let i = 0; i < N; i++) {
            tmpV.set(PA.getX(i), PA.getY(i), PA.getZ(i));

            let maxH = 0;
            let hColor = colBase;

            // 1. Ear Highlight
            const dRE = tmpV.distanceTo(dynRightEar);
            const dLE = tmpV.distanceTo(dynLeftEar);
            const earDist = Math.min(dRE, dLE);
            if (earDist < earRadius) {
              const f = Math.pow(1.0 - earDist / earRadius, 1.4);
              if (f > maxH) {
                maxH = f;
                hColor = earDist < earRadius * 0.45 ? colEarDark : colEarViolet;
              }
            }

            // 2. Eye Highlight
            const dREye = tmpV.distanceTo(dynRightEye);
            const dLEye = tmpV.distanceTo(dynLeftEye);
            const eyeDist = Math.min(dREye, dLEye);
            if (eyeDist < eyeRadius) {
              const f = Math.pow(1.0 - eyeDist / eyeRadius, 1.6) * 0.45;
              if (f > maxH) {
                maxH = f;
                hColor = colEyeViolet;
              }
            }

            // 3. Lip Highlight
            const lipDist = tmpV.distanceTo(dynLips);
            if (lipDist < lipRadius) {
              const f = Math.pow(1.0 - lipDist / lipRadius, 1.8) * 0.35;
              if (f > maxH) {
                maxH = f;
                hColor = colLipViolet;
              }
            }

            // Blend base with highlight
            tmpC.copy(colBase).lerp(hColor, maxH);

            // 4. Neck fade at lower torso into soft lavender-pink
            const relY = (tmpV.y - minY) / H;
            if (relY < 0.28) {
              const neckFade = Math.pow(1.0 - relY / 0.28, 1.3) * 0.85;
              tmpC.lerp(colNeck, neckFade);
            }

            vColors[i * 3] = tmpC.r;
            vColors[i * 3 + 1] = tmpC.g;
            vColors[i * 3 + 2] = tmpC.b;

            // Point node colors
            if (earDist < earRadius) {
              pColors[i * 3] = colEarViolet.r;
              pColors[i * 3 + 1] = colEarViolet.g;
              pColors[i * 3 + 2] = colEarViolet.b;
            } else if (maxH > 0.2) {
              pColors[i * 3] = colEyeViolet.r;
              pColors[i * 3 + 1] = colEyeViolet.g;
              pColors[i * 3 + 2] = colEyeViolet.b;
            } else {
              pColors[i * 3] = 0.0;
              pColors[i * 3 + 1] = 0.85;
              pColors[i * 3 + 2] = 1.0;
            }

            // Star Sparkle Candidates
            const isFacingCamera = tmpV.x > -0.6;
            const isAboveNeck = relY > 0.26;
            if (isFacingCamera && isAboveNeck) {
              if (maxH > 0.25 || (i % 7 === 0 && tmpV.z > 0.15)) {
                starIdx.push(i);
              }
            }
          }

          geo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));

          // ── Layer A: Opaque Frontside Sculptural Core Shader ──
          // 1. side: THREE.FrontSide with depthWrite: true -> 100% OPAQUE TO BACKFACES.
          //    Completely hides internal mouth cavities, eye sockets, and the other ear!
          // 2. Base is luminous pale ice-blue (#f4f9fd) with subtle Fresnel edge rim.
          // 3. Ear concha receives rich violet shading matching reference art!
          // 4. Neck base smoothly dissolves into page background (#edf6fe).
          const coreShaderMat = new THREE.ShaderMaterial({
            uniforms: {
              uCoreColor: { value: new THREE.Color('#f4f9fd') },
              uRimColor: { value: new THREE.Color('#bae6fd') },
              uEarColor: { value: new THREE.Color('#6d28d9') },
              uBgColor: { value: new THREE.Color('#edf6fe') },
              uRightEar: { value: dynRightEar },
              uEarRadius: { value: earRadius },
              uMinY: { value: minY },
              uMaxY: { value: maxY },
            },
            vertexShader: `
              varying vec3 vNormal;
              varying vec3 vViewDir;
              varying vec3 vModelPos;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                vViewDir = normalize(-mvPos.xyz);
                vModelPos = position;
                gl_Position = projectionMatrix * mvPos;
              }
            `,
            fragmentShader: `
              varying vec3 vNormal;
              varying vec3 vViewDir;
              varying vec3 vModelPos;
              uniform vec3 uCoreColor;
              uniform vec3 uRimColor;
              uniform vec3 uEarColor;
              uniform vec3 uBgColor;
              uniform vec3 uRightEar;
              uniform float uEarRadius;
              uniform float uMinY;
              uniform float uMaxY;

              void main() {
                // Subtle fresnel rim along outer silhouette
                float fresnel = pow(1.0 - abs(dot(vViewDir, vNormal)), 2.0);
                vec3 col = mix(uCoreColor, uRimColor, fresnel * 0.40);

                // Deep violet shading inside ear concha
                float earDist = distance(vModelPos, uRightEar);
                if (earDist < uEarRadius) {
                  float earF = pow(1.0 - earDist / uEarRadius, 1.4);
                  col = mix(col, uEarColor, earF * 0.85);
                }

                // Smooth dissolve at neck base into page background
                float relY = (vModelPos.y - uMinY) / (uMaxY - uMinY);
                float bottomFade = clamp((0.26 - relY) / 0.22, 0.0, 1.0);
                col = mix(col, uBgColor, bottomFade);

                gl_FragColor = vec4(col, 1.0);
              }
            `,
            side: THREE.FrontSide,
            depthTest: true,
            depthWrite: true,
          });
          disposables.push(coreShaderMat);
          const solidMesh = new THREE.Mesh(geo, coreShaderMat);
          solidMesh.scale.setScalar(S);
          headGroup.add(solidMesh);

          // ── Layer B: Frontside Royal Blue Triangular Wireframe Grid ──
          const wireMat = new THREE.MeshBasicMaterial({
            vertexColors: true,
            wireframe: true,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0.95,
            polygonOffset: true,
            polygonOffsetFactor: -4.0,
            polygonOffsetUnits: -8.0,
            depthTest: true,
            depthWrite: false,
          });
          disposables.push(wireMat);
          const wireMesh = new THREE.Mesh(geo, wireMat);
          wireMesh.scale.setScalar(S * 1.001);
          headGroup.add(wireMesh);

          // ── Layer C: Sparkling Purple & Cyan Vertex Nodes ──
          const pointsGeo = geo.clone();
          pointsGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
          disposables.push(pointsGeo);

          const pointsMat = new THREE.PointsMaterial({
            size: isMobile ? 0.075 : 0.085,
            vertexColors: true,
            transparent: true,
            opacity: 0.90,
            depthWrite: false,
          });
          disposables.push(pointsMat);
          const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
          pointsMesh.scale.setScalar(S * 1.002);
          headGroup.add(pointsMesh);

          // ── Layer D: 4-Pointed Diamond Star Sparkles ──
          if (starIdx.length > 0) {
            const sGeo = new THREE.BufferGeometry();
            const sPos = new Float32Array(starIdx.length * 3);
            const sCol = new Float32Array(starIdx.length * 3);
            for (let si = 0; si < starIdx.length; si++) {
              const oi = starIdx[si];
              sPos[si * 3] = PA.getX(oi) * S * 1.003;
              sPos[si * 3 + 1] = PA.getY(oi) * S * 1.003;
              sPos[si * 3 + 2] = PA.getZ(oi) * S * 1.003;
              sCol[si * 3] = Math.min(1.0, vColors[oi * 3] * 1.35);
              sCol[si * 3 + 1] = Math.min(1.0, vColors[oi * 3 + 1] * 1.35);
              sCol[si * 3 + 2] = Math.min(1.0, vColors[oi * 3 + 2] * 1.35);
            }
            sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
            sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
            disposables.push(sGeo);

            const sMat = new THREE.PointsMaterial({
              size: isMobile ? 0.11 : 0.13,
              map: starTex,
              vertexColors: true,
              transparent: true,
              opacity: 0.90,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            disposables.push(sMat);
            headGroup.add(new THREE.Points(sGeo, sMat));
          }
        });

        headGroup.rotation.y = BASE_ROT_Y;
        headGroup.rotation.x = BASE_ROT_X;
      },
      undefined,
      (err) => {
        console.warn('GLB load error:', err);
      }
    );

    // ── 8. Interactive Drag & Touch Orbit Physics ──
    let targetRotX = BASE_ROT_X;
    let targetRotY = BASE_ROT_Y;
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let startX = 0, startY = 0;
    let locked: 'scroll' | 'rotate' | null = null;
    let velX = 0, velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      locked = null;
      velX = 0; velY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      // Smooth vertical scroll pass-through on mobile
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
    mount.addEventListener('pointermove', onPointerMove, { passive: true });
    mount.addEventListener('pointerup', onPointerUp, { passive: true });
    mount.addEventListener('pointercancel', onPointerUp, { passive: true });

    // ── 9. Scroll Tracking for Gentle Parallax ──
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 10. Animation Loop with Viewport & Tab Visibility Pause ──
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

      const t = (performance.now() - t0) * 0.001;

      // Smooth slide-in towards RESTING_POS_X
      headGroup.position.x += (RESTING_POS_X - headGroup.position.x) * 0.045;

      // Inertia Damping
      if (!isDragging) {
        velX *= 0.92; velY *= 0.92;
        targetRotY += velX;
        targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + velY));
      }

      // Gentle floating physics & scroll parallax
      const scrollFrac = Math.min(scrollY / 750, 1.0);
      headGroup.position.y = RESTING_POS_Y + Math.sin(t * 1.3) * 0.06 - scrollFrac * 0.45;

      // Smooth rotation lerp
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.075;
      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.075;

      // Cyber dot grid breathing pulse
      gridMat.opacity = 0.28 + Math.sin(t * 1.2) * 0.06;

      // Background square particles drift
      const pArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PC_MAIN; i++) {
        pArr[i * 3 + 1] += pVelY[i];
        pArr[i * 3] += Math.sin(t * 0.85 + pPhase[i]) * 0.0025;
        if (pArr[i * 3 + 1] > 6.5) {
          pArr[i * 3 + 1] = -6.5;
          pArr[i * 3] = -7.8 + Math.random() * 11.5;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      // Micro cyber data bits drift
      const mArr = microGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PC_MICRO; i++) {
        mArr[i * 3 + 1] += microVelY[i];
        mArr[i * 3] += Math.cos(t * 0.75 + microPhase[i]) * 0.0018;
        if (mArr[i * 3 + 1] > 6.5) {
          mArr[i * 3 + 1] = -6.5;
          mArr[i * 3] = -7.5 + Math.random() * 11.0;
        }
      }
      microGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const startAnimation = () => {
      if (!isAnimating && isVisibleInViewport && isTabActive) {
        animate();
      }
    };
    startAnimation();

    // IntersectionObserver to pause loop when scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewport = entry.isIntersecting;
        if (isVisibleInViewport) {
          startAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    // Tab Visibility change listener
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startAnimation();
      }
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
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
