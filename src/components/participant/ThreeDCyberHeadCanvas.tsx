import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CollegeEmblem } from '../common/CollegeLogo';
// RADIANZA '26 3D Cyber Head Component
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
      color: 0xC1121F, // Deep Crimson web grid
      transparent: true,
      opacity: 0.30,
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
        // Luminous red aura gradient for laser sparkles
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, 'rgba(255,255,255,1.0)');
        g.addColorStop(0.25, 'rgba(255,180,195,0.90)');
        g.addColorStop(0.55, 'rgba(255,23,56,0.50)');
        g.addColorStop(1, 'rgba(193,18,31,0.0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);

        // Crisp 4-pointed diamond star flare
        ctx.beginPath();
        ctx.moveTo(32, 2);
        ctx.quadraticCurveTo(32, 32, 62, 32);
        ctx.quadraticCurveTo(32, 32, 32, 62);
        ctx.quadraticCurveTo(32, 32, 2, 32);
        ctx.quadraticCurveTo(32, 32, 32, 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.98)';
        ctx.fill();

        // Secondary subtle diagonal sparkle
        ctx.beginPath();
        ctx.moveTo(32, 14);
        ctx.quadraticCurveTo(32, 32, 50, 32);
        ctx.quadraticCurveTo(32, 32, 32, 50);
        ctx.quadraticCurveTo(32, 32, 14, 32);
        ctx.quadraticCurveTo(32, 32, 32, 14);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,245,215,0.7)';
        ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    };
    const starTex = makeStarTex();
    disposables.push(starTex);

    // ── 6. Background Digital Particle Field (Crimson Embers & Red Cyber Sparks) ──
    const PC_MAIN = isMobile ? 85 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PC_MAIN * 3);
    const pCol = new Float32Array(PC_MAIN * 3);
    const pVelY = new Float32Array(PC_MAIN);
    const pPhase = new Float32Array(PC_MAIN);

    const cRedGlow = new THREE.Color('#FF1738');
    const cCrimson = new THREE.Color('#C1121F');
    const cDeepRed = new THREE.Color('#780016');
    const cWhite = new THREE.Color('#FFFFFF');
    const cSilver = new THREE.Color('#E5E7EB');

    for (let i = 0; i < PC_MAIN; i++) {
      // Distributed across the hero negative space and depth
      pPos[i * 3] = -7.8 + Math.random() * 11.5;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 13.0;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
      pVelY[i] = 0.005 + Math.random() * 0.008;
      pPhase[i] = Math.random() * Math.PI * 2;

      // Glowing crimson and red sparks with occasional white cyber nodes
      const r = Math.random();
      let col: THREE.Color;
      if (r > 0.65) {
        col = cRedGlow;
      } else if (r > 0.25) {
        col = cCrimson;
      } else if (r > 0.08) {
        col = cDeepRed;
      } else {
        col = cWhite;
      }
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
      const col = r > 0.6 ? cRedGlow : r > 0.2 ? cCrimson : cSilver;
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
    let starMat: THREE.PointsMaterial | null = null;
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

          // Anatomical landmarks in model space:
          const dynNose = new THREE.Vector3(0.0, 1.10, 2.59);
          const dynLips = new THREE.Vector3(0.0, 0.57, 2.35);
          const chinPoint = new THREE.Vector3(0.0, 0.08, 2.18);
          const dynRightEar = new THREE.Vector3(1.72, 1.50, -0.16);
          const dynLeftEar = new THREE.Vector3(-1.72, 1.50, -0.16);
          const dynRightEye = new THREE.Vector3(0.65, 1.94, 1.98);
          const dynLeftEye = new THREE.Vector3(-0.65, 1.94, 1.98);
          const jawCornerRight = new THREE.Vector3(1.42, 0.62, 0.25);
          const jawCornerLeft = new THREE.Vector3(-1.42, 0.62, 0.25);

          // Fast inline 3D point-to-segment distance helper
          const distToSegment = (
            px: number, py: number, pz: number,
            a: THREE.Vector3, b: THREE.Vector3
          ): number => {
            const abX = b.x - a.x, abY = b.y - a.y, abZ = b.z - a.z;
            const apX = px - a.x, apY = py - a.y, apZ = pz - a.z;
            const lenSq = abX * abX + abY * abY + abZ * abZ;
            if (lenSq <= 0.00001) {
              const dx = px - a.x, dy = py - a.y, dz = pz - a.z;
              return Math.sqrt(dx * dx + dy * dy + dz * dz);
            }
            const t = Math.max(0, Math.min(1, (apX * abX + apY * abY + apZ * abZ) / lenSq));
            const projX = a.x + abX * t;
            const projY = a.y + abY * t;
            const projZ = a.z + abZ * t;
            const dx = px - projX, dy = py - projY, dz = pz - projZ;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
          };

          // Curated Spider-Man Inspired Dark Futuristic Palette:
          // 70% Near-Black (#050505), 20% Deep Crimson (#C1121F), 5% Bright Red Glow (#FF1738), 5% White/Light Gray
          const colRedGlow = new THREE.Color('#FF1738');   // Bright red laser glow & active nodes
          const colCrimson = new THREE.Color('#C1121F');   // Signature Deep Crimson wireframe
          const colDarkCrimson = new THREE.Color('#780016'); // Shaded jaw & cranial depth
          const colWhite = new THREE.Color('#FFFFFF');     // High-tech white node sparks & edge highlights
          const colSilver = new THREE.Color('#E5E7EB');    // Sleek metallic silver wire
          const colVoid = new THREE.Color('#050505');      // 70% Near-black dissolve

          const vColors = new Float32Array(N * 3);
          const pColors = new Float32Array(N * 3);
          const tmpV = new THREE.Vector3();
          const tmpC = new THREE.Color();
          const starIdx: number[] = [];

          for (let i = 0; i < N; i++) {
            const vx = PA.getX(i);
            const vy = PA.getY(i);
            const vz = PA.getZ(i);
            tmpV.set(vx, vy, vz);

            const relY = (vy - minY) / H;

            // 1. Crown & Cranial Dome (Golden wireframe arch across top of skull)
            let crownFactor = 0;
            if (relY > 0.74) {
              crownFactor = Math.min(1.0, (relY - 0.74) / 0.12);
              if (vz > 1.4) {
                // Forehead front smoothly connects to blue brow
                crownFactor *= Math.max(0.0, 1.0 - (vz - 1.4) / 0.65);
              }
              if (relY > 0.88) crownFactor = Math.max(crownFactor, 0.95);
            }

            // 2. Occiput (Back of skull curvature)
            let occiputFactor = 0;
            if (vz < 0.35 && relY > 0.32) {
              occiputFactor = Math.min(1.0, (0.35 - vz) / 0.50);
            }

            // 3. Ear & Temporal Cluster (Minimal, delicate golden accent)
            const dREar = tmpV.distanceTo(dynRightEar);
            const dLEar = tmpV.distanceTo(dynLeftEar);
            const dEar = Math.min(dREar, dLEar);
            let earFactor = 0;
            if (dEar < 1.05) {
              // Minimal, refined golden accent on ear matching user request
              earFactor = Math.pow(1.0 - dEar / 1.05, 1.8) * 0.35;
            }

            // 4. Jawline Mandible Contour (Subtle golden contour strictly behind the chin!)
            const dJawR = Math.min(
              distToSegment(vx, vy, vz, dynRightEar, jawCornerRight),
              distToSegment(vx, vy, vz, jawCornerRight, chinPoint)
            );
            const dJawL = Math.min(
              distToSegment(vx, vy, vz, dynLeftEar, jawCornerLeft),
              distToSegment(vx, vy, vz, jawCornerLeft, chinPoint)
            );
            const dJaw = Math.min(dJawR, dJawL);
            let jawFactor = 0;
            // Kept strictly behind the chin (vz < 1.55) so the chin stays minimal in gold
            if (dJaw < 0.45 && vz < 1.55) {
              jawFactor = Math.pow(1.0 - dJaw / 0.45, 1.3) * 0.40;
            }

            // 5. Neck & Throat (Gold strands descending under the jaw)
            let neckFactor = 0;
            if (relY >= 0.12 && relY <= 0.46 && vz < 1.60) {
              const topFade = relY > 0.38 ? (0.46 - relY) / 0.08 : 1.0;
              const bottomFade = relY < 0.18 ? (relY - 0.12) / 0.06 : 1.0;
              neckFactor = Math.min(1.0, topFade * bottomFade * 0.88);
            }

            // 6. Eye Focal Ember (Incandescent golden spark in the blue face)
            const dREye = tmpV.distanceTo(dynRightEye);
            const dLEye = tmpV.distanceTo(dynLeftEye);
            const dEye = Math.min(dREye, dLEye);
            let eyeFactor = 0;
            if (dEye < 0.48) {
              eyeFactor = Math.pow(1.0 - dEye / 0.48, 1.4);
            }

            // Combine anatomical gold weights:
            let goldWeight = Math.max(crownFactor, occiputFactor, earFactor, jawFactor, neckFactor, eyeFactor);

            // 7. Facial Profile Shield (Strictly keeps nose, lips, mouth, AND CHIN in pure electric cyan/blue!)
            // Any vertex on the front facial and chin profile (vz > 1.60) has gold suppressed to MINIMAL/ZERO!
            const dNose = tmpV.distanceTo(dynNose);
            const dLips = tmpV.distanceTo(dynLips);
            const dChin = tmpV.distanceTo(chinPoint);

            if (eyeFactor < 0.25) {
              if (dNose < 0.85) {
                goldWeight = 0.0;
              }
              if (dLips < 0.65) {
                goldWeight = 0.0;
              }
              // Chin front tip & curve: completely minimal/zero gold! (Image 1 fix)
              if (dChin < 0.65 || (vz > 1.60 && vy < 0.40 && vy > -0.70)) {
                goldWeight = 0.0;
              }
              // Cheek front shield
              if (vz > 1.05 && relY > 0.46 && relY < 0.76 && dEar > 0.80 && dJaw > 0.35) {
                goldWeight = Math.min(goldWeight, 0.10);
              }
            }

            // ── Wireframe Color Assignment ──
            if (goldWeight > 0.05) {
              // Accent areas (crown, eye, ear, jaw) glow with bright red & crimson
              const baseAccent = tmpC.copy(colRedGlow).lerp(colCrimson, 0.35);
              if (crownFactor > 0.6 || eyeFactor > 0.4) {
                baseAccent.lerp(colWhite, 0.30);
              }
              tmpC.copy(colCrimson).lerp(baseAccent, goldWeight);
            } else {
              // Base wireframe is deep crimson with silver/white profile edge
              tmpC.copy(colCrimson);
              if (dNose < 0.65 || dLips < 0.50 || dChin < 0.55) {
                tmpC.lerp(colSilver, 0.45);
              }
            }

            // Lower torso / clavicle dissolve into near-black page background
            if (relY < 0.20) {
              const dissolve = Math.pow(1.0 - relY / 0.20, 1.4);
              tmpC.lerp(colVoid, dissolve * 0.95);
            }

            vColors[i * 3] = tmpC.r;
            vColors[i * 3 + 1] = tmpC.g;
            vColors[i * 3 + 2] = tmpC.b;

            // ── Vertex Node Color Assignment (Points Mesh) ──
            if (goldWeight > 0.35) {
              let pC = (vy > 1.8 || neckFactor > 0.5) ? colRedGlow : colCrimson;
              if (eyeFactor > 0.40) pC = colWhite;
              pColors[i * 3] = pC.r;
              pColors[i * 3 + 1] = pC.g;
              pColors[i * 3 + 2] = pC.b;
            } else {
              const pC = (dNose < 0.80 || dLips < 0.60 || dChin < 0.60) ? colWhite : colRedGlow;
              pColors[i * 3] = pC.r;
              pColors[i * 3 + 1] = pC.g;
              pColors[i * 3 + 2] = pC.b;
            }

            if (relY < 0.18) {
              const d = Math.pow(1.0 - relY / 0.18, 1.5);
              pColors[i * 3] *= (1.0 - d);
              pColors[i * 3 + 1] *= (1.0 - d);
              pColors[i * 3 + 2] *= (1.0 - d);
            }

            // ── Star Sparkle Placement (Selected Key Anatomical Accents) ──
            const isFacingCamera = vx > -0.50;
            const isAboveShoulder = relY > 0.20;

            if (isFacingCamera && isAboveShoulder) {
              // 1. Eye focal spark (highest priority)
              if (dREye < 0.26) {
                starIdx.push(i);
              }
              // 2. Ear subtle glint (rare, minimal)
              else if (dREar < 0.55 && vx > 1.40 && i % 8 === 0) {
                starIdx.push(i);
              }
              // 3. Cranial crown curve sparkles
              else if (relY > 0.86 && vx > 0.15 && i % 7 === 0) {
                starIdx.push(i);
              }
              // 4. Golden throat & neck strands sparkles
              else if (neckFactor > 0.70 && vx > 0.10 && i % 6 === 0) {
                starIdx.push(i);
              }
              // 5. Facial nose bridge and cheek crest glints
              else if ((dNose < 0.28 || (vz > 1.35 && vy > 1.3 && vy < 1.7 && vx > 0.95)) && i % 10 === 0) {
                starIdx.push(i);
              }
            }
          }

          geo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));

          // ── Layer A: Opaque Frontside Dual-Tone Sculptural Core Shader ──
          const coreShaderMat = new THREE.ShaderMaterial({
            uniforms: {
              uCoreColor: { value: new THREE.Color('#050505') },
              uBlueRim: { value: new THREE.Color('#C1121F') },
              uGoldRim: { value: new THREE.Color('#FF1738') },
              uAmberRim: { value: new THREE.Color('#C1121F') },
              uEarColor: { value: new THREE.Color('#780016') },
              uCrimsonColor: { value: new THREE.Color('#C1121F') },
              uEyeColor: { value: new THREE.Color('#FF1738') },
              uBgColor: { value: new THREE.Color('#050505') },
              uRightEar: { value: dynRightEar },
              uRightEye: { value: dynRightEye },
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
              uniform vec3 uBlueRim;
              uniform vec3 uGoldRim;
              uniform vec3 uAmberRim;
              uniform vec3 uEarColor;
              uniform vec3 uCrimsonColor;
              uniform vec3 uEyeColor;
              uniform vec3 uBgColor;
              uniform vec3 uRightEar;
              uniform vec3 uRightEye;
              uniform float uMinY;
              uniform float uMaxY;

              void main() {
                float ndotv = abs(dot(vViewDir, vNormal));
                float fresnel = pow(1.0 - ndotv, 2.2);

                float relY = (vModelPos.y - uMinY) / (uMaxY - uMinY);

                // Determine rim tone: Gold/Amber for crown/back/neck/chin, Blue for upper facial profile
                // Strictly restrict faceFactor to upper face (relY > 0.46 and vModelPos.z > 0.6)
                float faceFactor = smoothstep(0.6, 1.3, vModelPos.z) * smoothstep(0.82, 0.70, relY) * smoothstep(0.44, 0.52, relY);
                float earDist = distance(vModelPos, uRightEar);
                if (earDist < 1.1) {
                  faceFactor *= smoothstep(0.4, 1.1, earDist);
                }

                vec3 rimColor = mix(uGoldRim, uBlueRim, faceFactor);
                if (relY > 0.85 || vModelPos.z < 0.1 || relY < 0.44) {
                  rimColor = mix(uGoldRim, uAmberRim, 0.35);
                }

                vec3 col = mix(uCoreColor, rimColor, fresnel * 0.58);

                // Ear internal warmth (amber & crimson depth)
                if (earDist < 0.95) {
                  float earF = pow(1.0 - earDist / 0.95, 1.3);
                  vec3 earHue = mix(uEarColor, uCrimsonColor, clamp((0.45 - earDist) / 0.35, 0.0, 1.0));
                  col = mix(col, earHue, earF * 0.85);
                }

                // Eye orbital golden warmth
                float eyeDist = distance(vModelPos, uRightEye);
                if (eyeDist < 0.48) {
                  float eyeF = pow(1.0 - eyeDist / 0.48, 1.5);
                  col = mix(col, uEyeColor, eyeF * 0.92);
                }

                // Throat, neck & chin rich radiant golden ambient warmth
                if (relY >= 0.14 && relY <= 0.48 && vModelPos.z < 2.2) {
                  float throatWarmth = smoothstep(0.14, 0.22, relY) * smoothstep(0.50, 0.44, relY);
                  col += uGoldRim * (0.24 * throatWarmth);
                }

                // Smooth dissolve at neck base into page background
                float bottomFade = clamp((0.22 - relY) / 0.16, 0.0, 1.0);
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

          // ── Layer B: Frontside Dual-Tone Gold & Cyan Triangular Wireframe ──
          const wireMat = new THREE.MeshBasicMaterial({
            vertexColors: true,
            wireframe: true,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0.96,
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

          // ── Layer C: Sparkling Gold & Cyan Vertex Nodes ──
          const pointsGeo = geo.clone();
          pointsGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
          disposables.push(pointsGeo);

          const pointsMat = new THREE.PointsMaterial({
            size: isMobile ? 0.050 : 0.058,
            vertexColors: true,
            transparent: true,
            opacity: 0.68,
            depthWrite: false,
          });
          disposables.push(pointsMat);
          const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
          pointsMesh.scale.setScalar(S * 1.002);
          headGroup.add(pointsMesh);

          // ── Layer D: 4-Pointed Diamond Star Sparkles (Luminous Texture) ──
          if (starIdx.length > 0) {
            const sGeo = new THREE.BufferGeometry();
            const sPos = new Float32Array(starIdx.length * 3);
            const sCol = new Float32Array(starIdx.length * 3);
            for (let si = 0; si < starIdx.length; si++) {
              const oi = starIdx[si];
              sPos[si * 3] = PA.getX(oi) * S * 1.003;
              sPos[si * 3 + 1] = PA.getY(oi) * S * 1.003;
              sPos[si * 3 + 2] = PA.getZ(oi) * S * 1.003;
              sCol[si * 3] = Math.min(1.0, vColors[oi * 3] * 1.40);
              sCol[si * 3 + 1] = Math.min(1.0, vColors[oi * 3 + 1] * 1.40);
              sCol[si * 3 + 2] = Math.min(1.0, vColors[oi * 3 + 2] * 1.40);
            }
            sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
            sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
            disposables.push(sGeo);

            starMat = new THREE.PointsMaterial({
              size: isMobile ? 0.16 : 0.22,
              map: starTex,
              vertexColors: true,
              transparent: true,
              opacity: 0.94,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            disposables.push(starMat);
            headGroup.add(new THREE.Points(sGeo, starMat));
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

      // 4-pointed diamond star sparkle breathing twinkle
      if (starMat) {
        starMat.opacity = 0.82 + Math.sin(t * 2.6) * 0.16;
      }

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
