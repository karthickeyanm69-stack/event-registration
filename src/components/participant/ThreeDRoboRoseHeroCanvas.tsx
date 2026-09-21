import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDRoboRoseHeroCanvasProps {
  onRegisterClick?: () => void;
}

export const ThreeDRoboRoseHeroCanvas: React.FC<ThreeDRoboRoseHeroCanvasProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 0. WebGL Availability Check ──
    const checkWebGL = (): boolean => {
      try {
        const c = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (c.getContext('webgl') || c.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };
    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    let isMobile = window.innerWidth < 1024;
    let width = mount.clientWidth || (isMobile ? window.innerWidth : 680);
    let height = mount.clientHeight || (isMobile ? 740 : 620);

    // ── 1. Scene & Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    // Camera positioned to capture rose at top, hand holding stem in middle, arm extending down
    camera.position.set(0, 0.2, 13.5);

    // ── 2. Renderer ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: isMobile ? 'mediump' : 'highp',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => e.preventDefault();
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const disposables: Array<{ dispose: () => void }> = [];

    // Master Hero Group (Receives Parallax & Layout offsets)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Configure layout offsets: ensure whole hand and rose are prominently framed
    const applyLayoutOffsets = () => {
      isMobile = window.innerWidth < 1024;
      if (isMobile) {
        masterGroup.position.set(0.0, 0.5, 0);
        masterGroup.scale.set(0.88, 0.88, 0.88);
      } else {
        masterGroup.position.set(0.1, 0.05, 0);
        masterGroup.scale.set(1.05, 1.05, 1.05);
      }
    };
    applyLayoutOffsets();

    // ── 3. Dedicated Multi-Channel Lighting Rig ──
    // Ambient fill (deep sapphire night)
    const ambientLight = new THREE.AmbientLight(0x0a1e38, 1.4);
    scene.add(ambientLight);

    // Rose Key Light: Warm golden spotlight aimed directly at the petals
    const roseKeyLight = new THREE.DirectionalLight(0xfff0db, 3.2);
    roseKeyLight.position.set(2.0, 4.0, 4.5);
    scene.add(roseKeyLight);

    // Rose Velvet Backlight: Soft crimson rim light highlighting petal edges
    const roseRimLight = new THREE.PointLight(0xff2d55, 3.5, 12, 1.2);
    roseRimLight.position.set(-1.0, 2.5, -2.0);
    scene.add(roseRimLight);

    // Cyber Hand Light: Intense electric cyan point light at palm/wrist
    const handCyanLight = new THREE.PointLight(0x00f2fe, 4.0, 8.0, 1.4);
    handCyanLight.position.set(0.6, -0.6, 1.2);
    scene.add(handCyanLight);

    // Secondary Warm Gold Accent Light for servo knuckles
    const goldAccentLight = new THREE.PointLight(0xf5b942, 2.6, 6.0, 1.6);
    goldAccentLight.position.set(1.2, -1.8, 1.6);
    scene.add(goldAccentLight);

    // Vertical ascending energy sparkles / dust motes
    const sparkleCount = isMobile ? 32 : 55;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    const sparkleVel: { y: number; phase: number }[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      sparklePos[i * 3] = (Math.random() - 0.4) * 8.5;
      sparklePos[i * 3 + 1] = -4.5 + Math.random() * 8.5;
      sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
      sparkleVel.push({
        y: 0.008 + Math.random() * 0.016,
        phase: Math.random() * Math.PI * 2,
      });
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    disposables.push(sparkleGeo);

    // Canvas circular particle texture
    const createSparkleTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 245, 210, 1)');
      grad.addColorStop(0.35, 'rgba(245, 185, 66, 0.85)');
      grad.addColorStop(0.75, 'rgba(0, 242, 254, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      disposables.push(tex);
      return tex;
    };

    const sparkleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: createSparkleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });
    disposables.push(sparkleMat);
    const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparklePoints);

    // ── 4. The 3D Velvet Rose & Stem Hierarchy ──
    const flowerAssemblyGroup = new THREE.Group();
    masterGroup.add(flowerAssemblyGroup);

    // Rose Flower Head (Positioned at y = 1.6, center)
    const roseHeadGroup = new THREE.Group();
    roseHeadGroup.position.set(0.0, 1.6, 0.0);
    flowerAssemblyGroup.add(roseHeadGroup);

    // Luxurious Velvet Petal Materials
    const outerPetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb21b2b),
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    disposables.push(outerPetalMat);

    const midPetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9e1220),
      roughness: 0.32,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    disposables.push(midPetalMat);

    const innerPetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x6e0811),
      roughness: 0.4,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    disposables.push(innerPetalMat);

    // Smooth Curved Petal Generator
    const createSmoothPetalGeometry = (w: number, h: number, curvature: number, flare: number) => {
      const uSegs = 16;
      const vSegs = 16;
      const pos: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let j = 0; j <= vSegs; j++) {
        const v = j / vSegs; // 0 at base, 1 at petal tip
        const curveY = Math.sin(v * Math.PI * 0.5);
        const currentWidth = Math.sin(v * Math.PI * 0.8) * w * 0.5;

        for (let i = 0; i <= uSegs; i++) {
          const u = i / uSegs;
          const nu = (u - 0.5) * 2; // -1 to 1

          const px = nu * currentWidth;
          const py = v * h;
          // Cup shape: bulges forward in middle, curls back at top rim
          const cup = -curvature * Math.sin(v * Math.PI) * (1 - nu * nu);
          const topFlare = flare * Math.pow(v, 2.0) * (1 - Math.abs(nu) * 0.25);
          const pz = cup + topFlare;

          pos.push(px, py, pz);
          normals.push(0, 0, 1);
          uvs.push(u, v);
        }
      }

      for (let j = 0; j < vSegs; j++) {
        for (let i = 0; i < uSegs; i++) {
          const a = j * (uSegs + 1) + i;
          const b = a + (uSegs + 1);
          const c = a + 1;
          const d = b + 1;
          indices.push(a, b, c);
          indices.push(c, b, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      disposables.push(geo);
      return geo;
    };

    // Build Concentric Spiral Petal Layers
    // Tier 1: Inner Rose Core / Spiral Bud (9 petals)
    const tier1Geo = createSmoothPetalGeometry(0.48, 0.65, 0.28, -0.22);
    for (let i = 0; i < 9; i++) {
      const p = new THREE.Mesh(tier1Geo, innerPetalMat);
      const ang = i * 2.39996;
      const r = 0.06 + i * 0.024;
      p.position.set(Math.cos(ang) * r, -0.05 + i * 0.015, Math.sin(ang) * r);
      p.rotation.set(0.35 + i * 0.03, -ang + Math.PI / 2, 0.1);
      p.scale.setScalar(0.75 + i * 0.04);
      roseHeadGroup.add(p);
    }

    // Tier 2: Mid Blossom Petals (12 cupped petals)
    const tier2Geo = createSmoothPetalGeometry(0.8, 0.95, 0.38, 0.2);
    for (let i = 0; i < 12; i++) {
      const p = new THREE.Mesh(tier2Geo, midPetalMat);
      const ang = i * 2.39996 + 0.6;
      const r = 0.24 + (i % 3) * 0.04;
      p.position.set(Math.cos(ang) * r, -0.12 + (i % 2) * 0.02, Math.sin(ang) * r);
      p.rotation.set(0.6 + (i % 2) * 0.08, -ang + Math.PI / 2, -0.08 + (i % 3) * 0.06);
      p.scale.setScalar(0.9 + i * 0.025);
      roseHeadGroup.add(p);
    }

    // Tier 3: Grand Outer Bloom (16 expansive velvet petals with rolled rims)
    const tier3Geo = createSmoothPetalGeometry(1.15, 1.35, 0.45, 0.45);
    for (let i = 0; i < 16; i++) {
      const p = new THREE.Mesh(tier3Geo, outerPetalMat);
      const ang = (i / 16) * Math.PI * 2;
      const r = 0.52 + (i % 3) * 0.05;
      p.position.set(Math.cos(ang) * r, -0.22, Math.sin(ang) * r);
      p.rotation.set(0.95 + (i % 2) * 0.1, -ang + Math.PI / 2, (i % 2 === 0 ? 1 : -1) * 0.12);
      p.scale.setScalar(1.0 + (i % 4) * 0.04);
      roseHeadGroup.add(p);
    }

    // Green Calyx Sepals (cradling base of blossom)
    const sepalMat = new THREE.MeshStandardMaterial({
      color: 0x1b5e20,
      roughness: 0.45,
      side: THREE.DoubleSide,
    });
    disposables.push(sepalMat);
    const sepalGeo = createSmoothPetalGeometry(0.32, 1.1, -0.4, 0.12);
    for (let i = 0; i < 5; i++) {
      const sep = new THREE.Mesh(sepalGeo, sepalMat);
      const ang = (i / 5) * Math.PI * 2;
      sep.position.set(Math.cos(ang) * 0.38, -0.32, Math.sin(ang) * 0.38);
      sep.rotation.set(1.35, -ang + Math.PI / 2, 0);
      sep.scale.set(0.85, 0.85, 0.85);
      roseHeadGroup.add(sep);
    }

    // Slender Botanical Rose Stem passing through the hand grasp
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.3, 0.0),
      new THREE.Vector3(0.0, 0.4, 0.02),
      new THREE.Vector3(0.0, -0.4, 0.03), // Exactly where fingers wrap!
      new THREE.Vector3(0.02, -1.2, 0.05),
      new THREE.Vector3(0.04, -2.4, 0.08),
      new THREE.Vector3(0.05, -3.6, 0.1),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 36, 0.058, 12, false);
    disposables.push(stemGeo);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x247333,
      roughness: 0.38,
      metalness: 0.06,
    });
    disposables.push(stemMat);
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    flowerAssemblyGroup.add(stemMesh);

    // Natural Thorns
    const thornGeo = new THREE.ConeGeometry(0.026, 0.095, 6);
    disposables.push(thornGeo);
    const thornMat = new THREE.MeshStandardMaterial({
      color: 0x4a1818,
      roughness: 0.45,
    });
    disposables.push(thornMat);
    const thornPlacements = [
      { y: 0.85, x: 0.06, z: 0.03, rotZ: -1.2 },
      { y: 0.15, x: -0.06, z: 0.04, rotZ: 1.3 },
      { y: -0.95, x: 0.07, z: 0.06, rotZ: -1.1 },
      { y: -1.8, x: -0.05, z: 0.08, rotZ: 1.4 },
    ];
    thornPlacements.forEach((tp) => {
      const th = new THREE.Mesh(thornGeo, thornMat);
      th.position.set(tp.x, tp.y, tp.z);
      th.rotation.z = tp.rotZ;
      flowerAssemblyGroup.add(th);
    });

    // ── 5. The Cybernetic Robotic Hand & Arm ──
    // Hand assembly anchored to grip stem at y = -0.4
    const roboHandGroup = new THREE.Group();
    masterGroup.add(roboHandGroup);

    // Materials
    const cyberArmorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x062247),
      emissive: new THREE.Color(0x02122b),
      roughness: 0.22,
      metalness: 0.8,
      transmission: 0.25,
      thickness: 0.6,
      clearcoat: 0.4,
    });
    disposables.push(cyberArmorMat);

    const cyberWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    disposables.push(cyberWireMat);

    const goldServoMat = new THREE.MeshStandardMaterial({
      color: 0xf5b942,
      emissive: 0x5a3e06,
      roughness: 0.2,
      metalness: 0.9,
    });
    disposables.push(goldServoMat);

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: false,
    });
    disposables.push(cyanGlowMat);

    const createCyberSegment = (geo: THREE.BufferGeometry, parent: THREE.Group, scale = 1.0) => {
      disposables.push(geo);
      const solid = new THREE.Mesh(geo, cyberArmorMat);
      solid.scale.setScalar(scale);
      parent.add(solid);

      const wire = new THREE.Mesh(geo, cyberWireMat);
      wire.scale.setScalar(scale * 1.008);
      parent.add(wire);
      return solid;
    };

    // Forearm: Rises smoothly from bottom-right (x = 1.5, y = -3.2) towards wrist at (x = 0.65, y = -1.5)
    const armGroup = new THREE.Group();
    armGroup.position.set(0.65, -1.5, 0.2);
    // Angle upward-left pointing towards the stem grasp
    armGroup.rotation.set(-0.15, 0.2, 0.42);
    roboHandGroup.add(armGroup);

    // Forearm lower shaft
    const forearmGeo = new THREE.CylinderGeometry(0.42, 0.58, 2.8, 12);
    const forearmMesh = createCyberSegment(forearmGeo, armGroup);
    forearmMesh.position.y = -1.4;

    // Glowing longitudinal fiber traces along forearm
    const armTraceGeo = new THREE.CylinderGeometry(0.43, 0.59, 2.6, 8, 1, true);
    disposables.push(armTraceGeo);
    const armTraceMat = new THREE.MeshBasicMaterial({
      color: 0x0878d1,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    disposables.push(armTraceMat);
    const armTrace = new THREE.Mesh(armTraceGeo, armTraceMat);
    armTrace.position.y = -1.4;
    armGroup.add(armTrace);

    // Wrist Rotary Servo Unit
    const wristChassisGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 24);
    disposables.push(wristChassisGeo);
    const wristChassis = new THREE.Mesh(wristChassisGeo, goldServoMat);
    wristChassis.rotation.x = Math.PI / 2;
    armGroup.add(wristChassis);

    // Inner glowing cyan core
    const wristCoreGeo = new THREE.TorusGeometry(0.24, 0.05, 12, 28);
    disposables.push(wristCoreGeo);
    const wristCore = new THREE.Mesh(wristCoreGeo, cyanGlowMat);
    armGroup.add(wristCore);

    // Palm & Carpal Plate (Directly beside stem at y = -0.4, x = 0.2)
    const palmGroup = new THREE.Group();
    palmGroup.position.set(0, 0.38, 0);
    armGroup.add(palmGroup);

    const palmGeo = new THREE.BoxGeometry(0.78, 0.95, 0.28);
    createCyberSegment(palmGeo, palmGroup);

    // Build Articulated 3-Phalanx Robotic Fingers
    const buildRoboFinger = (
      baseOffset: THREE.Vector3,
      baseRot: THREE.Vector3,
      lengths: [number, number, number],
      curls: [number, number, number]
    ) => {
      const root = new THREE.Group();
      root.position.copy(baseOffset);
      root.rotation.set(baseRot.x, baseRot.y, baseRot.z);
      palmGroup.add(root);

      // Knuckle 1 (Gold Servo)
      const knuckleGeo = new THREE.SphereGeometry(0.09, 10, 10);
      disposables.push(knuckleGeo);
      const k1 = new THREE.Mesh(knuckleGeo, goldServoMat);
      root.add(k1);

      // Phalanx 1
      const p1Group = new THREE.Group();
      root.add(p1Group);
      const p1Geo = new THREE.CylinderGeometry(0.075, 0.085, lengths[0], 8);
      createCyberSegment(p1Geo, p1Group);
      p1Group.children.forEach((c) => (c.position.y = lengths[0] / 2));
      p1Group.rotation.x = curls[0];

      // Knuckle 2
      const k2 = new THREE.Mesh(knuckleGeo, goldServoMat);
      k2.position.set(0, lengths[0], 0);
      p1Group.add(k2);

      // Phalanx 2
      const p2Group = new THREE.Group();
      p2Group.position.set(0, lengths[0], 0);
      p1Group.add(p2Group);
      const p2Geo = new THREE.CylinderGeometry(0.065, 0.075, lengths[1], 8);
      createCyberSegment(p2Geo, p2Group);
      p2Group.children.forEach((c) => (c.position.y = lengths[1] / 2));
      p2Group.rotation.x = curls[1];

      // Knuckle 3
      const k3 = new THREE.Mesh(knuckleGeo, goldServoMat);
      k3.position.set(0, lengths[1], 0);
      p2Group.add(k3);

      // Phalanx 3 (Fingertip)
      const p3Group = new THREE.Group();
      p3Group.position.set(0, lengths[1], 0);
      p2Group.add(p3Group);
      const p3Geo = new THREE.ConeGeometry(0.062, lengths[2], 8);
      createCyberSegment(p3Geo, p3Group);
      p3Group.children.forEach((c) => (c.position.y = lengths[2] / 2));
      p3Group.rotation.x = curls[2];

      // Cyan glowing touch node
      const tipGeo = new THREE.SphereGeometry(0.038, 8, 8);
      disposables.push(tipGeo);
      const tip = new THREE.Mesh(tipGeo, cyanGlowMat);
      tip.position.set(0, lengths[2], 0);
      p3Group.add(tip);

      return root;
    };

    // Fingers clasping stem authentically
    // 1. Thumb (foreground grip against the front of the stem)
    buildRoboFinger(
      new THREE.Vector3(-0.42, 0.12, 0.12),
      new THREE.Vector3(0.2, 0.65, -0.65),
      [0.42, 0.35, 0.3],
      [-0.4, -0.55, -0.3]
    );

    // 2. Index Finger (curling around stem from behind/side)
    buildRoboFinger(
      new THREE.Vector3(-0.3, 0.52, -0.05),
      new THREE.Vector3(0.12, 0.12, 0.15),
      [0.5, 0.38, 0.3],
      [0.9, 0.95, 0.75]
    );

    // 3. Middle Finger (firm central grip)
    buildRoboFinger(
      new THREE.Vector3(-0.1, 0.55, -0.05),
      new THREE.Vector3(0.05, 0.05, 0.05),
      [0.54, 0.42, 0.32],
      [1.0, 1.05, 0.8]
    );

    // 4. Ring Finger (cradling lower stem)
    buildRoboFinger(
      new THREE.Vector3(0.1, 0.52, -0.05),
      new THREE.Vector3(-0.05, -0.06, -0.06),
      [0.48, 0.36, 0.28],
      [1.08, 1.1, 0.85]
    );

    // 5. Pinky Finger (natural outer curl)
    buildRoboFinger(
      new THREE.Vector3(0.28, 0.44, -0.05),
      new THREE.Vector3(-0.12, -0.15, -0.18),
      [0.38, 0.28, 0.24],
      [1.15, 1.18, 0.9]
    );

    // ── 6. Floating & Tumbling 3D Rose Petals ──
    const petalInstCount = isMobile ? 12 : 20;
    const singlePetalGeo = createSmoothPetalGeometry(0.55, 0.75, 0.28, 0.3);
    const petalInstancedMesh = new THREE.InstancedMesh(
      singlePetalGeo,
      outerPetalMat,
      petalInstCount
    );
    disposables.push(petalInstancedMesh);

    interface TumblingPetal {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      vRotX: number;
      vRotY: number;
      vRotZ: number;
      scale: number;
      wobblePhase: number;
    }

    const petalsData: TumblingPetal[] = [];
    const dummyMat4 = new THREE.Matrix4();
    const dummyEuler = new THREE.Euler();
    const dummyVec3 = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();

    for (let i = 0; i < petalInstCount; i++) {
      const p: TumblingPetal = {
        x: (Math.random() - 0.45) * 8.0,
        y: -3.5 + Math.random() * 7.5,
        z: -1.0 + Math.random() * 3.5,
        vx: -0.003 - Math.random() * 0.005,
        vy: -0.006 - Math.random() * 0.01,
        vz: (Math.random() - 0.5) * 0.004,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: 0.008 + Math.random() * 0.012,
        vRotY: 0.006 + Math.random() * 0.01,
        vRotZ: 0.005 + Math.random() * 0.008,
        scale: 0.5 + Math.random() * 0.4,
        wobblePhase: Math.random() * Math.PI * 2,
      };
      petalsData.push(p);

      dummyVec3.set(p.x, p.y, p.z);
      dummyEuler.set(p.rotX, p.rotY, p.rotZ);
      dummyQuat.setFromEuler(dummyEuler);
      dummyMat4.compose(
        dummyVec3,
        dummyQuat,
        new THREE.Vector3(p.scale, p.scale, p.scale)
      );
      petalInstancedMesh.setMatrixAt(i, dummyMat4);
    }
    petalInstancedMesh.instanceMatrix.needsUpdate = true;
    masterGroup.add(petalInstancedMesh);

    // ── 7. Pointer Parallax Physics ──
    const targetParallax = { x: 0, y: 0 };
    const currentParallax = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetParallax.x = nx * 0.18;
      targetParallax.y = ny * 0.15;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const t = e.touches[0];
      const rect = mount.getBoundingClientRect();
      const nx = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
      targetParallax.x = nx * 0.12;
      targetParallax.y = ny * 0.1;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ── 8. Responsive Resize Handler ──
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || (window.innerWidth < 1024 ? window.innerWidth : 680);
      height = mount.clientHeight || (window.innerWidth < 1024 ? 740 : 620);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      applyLayoutOffsets();
    };
    window.addEventListener('resize', handleResize);

    // ── 9. Main 60 FPS Render Loop ──
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Damped Parallax Lerp
      currentParallax.x += (targetParallax.x - currentParallax.x) * 0.045;
      currentParallax.y += (targetParallax.y - currentParallax.y) * 0.045;

      masterGroup.rotation.y = currentParallax.x;
      masterGroup.rotation.x = -currentParallax.y;

      // Subtle living pulse of the cyber hand servo
      wristCore.rotation.z += 0.015;
      handCyanLight.intensity = 3.6 + Math.sin(elapsed * 3.0) * 0.5;
      goldAccentLight.intensity = 2.4 + Math.cos(elapsed * 2.2) * 0.3;

      // Organic gentle sway of the flower blossom
      const sway = Math.sin(elapsed * 1.2) * 0.018;
      roseHeadGroup.rotation.z = sway;
      roseHeadGroup.rotation.x = Math.cos(elapsed * 1.0) * 0.015;

      // Animate ascending vertical sparkles
      const pAttr = sparkleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < sparkleCount; i++) {
        let py = pAttr.getY(i);
        py += sparkleVel[i].y;
        if (py > 4.5) {
          py = -4.5;
        }
        pAttr.setY(i, py);
        const px = pAttr.getX(i) + Math.sin(elapsed * 1.8 + sparkleVel[i].phase) * 0.003;
        pAttr.setX(i, px);
      }
      pAttr.needsUpdate = true;

      // Animate 3D Tumbling Floating Rose Petals
      for (let i = 0; i < petalInstCount; i++) {
        const p = petalsData[i];
        p.x += p.vx + Math.sin(elapsed * 1.4 + p.wobblePhase) * 0.003;
        p.y += p.vy;
        p.z += p.vz;
        p.rotX += p.vRotX;
        p.rotY += p.vRotY;
        p.rotZ += p.vRotZ;

        if (p.y < -4.5) {
          p.y = 4.5;
          p.x = (Math.random() - 0.3) * 6.5;
        }
        if (p.x < -4.8) {
          p.x = 4.5;
        }

        dummyVec3.set(p.x, p.y, p.z);
        dummyEuler.set(p.rotX, p.rotY, p.rotZ);
        dummyQuat.setFromEuler(dummyEuler);
        dummyMat4.compose(
          dummyVec3,
          dummyQuat,
          new THREE.Vector3(p.scale, p.scale, p.scale)
        );
        petalInstancedMesh.setMatrixAt(i, dummyMat4);
      }
      petalInstancedMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── 10. Comprehensive Teardown & Resource Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {
          // ignore
        }
      });

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center p-6 text-[#FFF2D5]/70">
        <p className="text-sm">Interactive 3D preview requires WebGL.</p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative overflow-hidden pointer-events-auto select-none"
      style={{ minHeight: '100%' }}
      aria-label="3D Holographic Robotic Hand holding Velvet Rose"
    />
  );
};
