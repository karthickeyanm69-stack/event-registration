import React, { useEffect, useRef, useState, useCallback } from 'react';

// RADIANZA '26 — Authentic Spider Web Reveal
// Workflow:
// 1. Fully pitch-black background during the entire web pull.
// 2. Based on pulling length, the spider's eyes glow brighter and brighter with intense laser emission.
// 3. After the pulling is over (reaches threshold), the web snaps, particles burst, and the solid black
//    veil dissolves away to reveal the actual Hero section of the website!

interface InteractiveWebRevealProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

// Draw a lifelike spider matching the user's reference drawing with dynamic glowing eyes based on pull length
function drawRealisticSpider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  time: number,
  isTense: boolean,
  pullProgress: number,
  color: string = '#FFFFFF'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const legTwitch = Math.sin(time * 0.003) * 0.08;
  const tension = isTense ? 0.25 : 0;
  const glowLevel = Math.max(0, Math.min(1.0, pullProgress));

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.shadowColor = glowLevel > 0.25 ? '#4EE2EC' : 'rgba(78, 226, 236, 0.75)';
  ctx.shadowBlur = 8 + glowLevel * 14;

  // 1. Abdomen (Large oval rear body)
  ctx.beginPath();
  ctx.ellipse(0, 11, 9.2, 14.0, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle abdomen markings
  ctx.strokeStyle = glowLevel > 0.3 ? 'rgba(78, 226, 236, 0.6)' : 'rgba(255, 23, 56, 0.5)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.lineTo(0, 19);
  ctx.moveTo(-3, 8);
  ctx.lineTo(3, 8);
  ctx.moveTo(-4, 13);
  ctx.lineTo(4, 13);
  ctx.stroke();

  // 2. Cephalothorax (Head & chest)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, -3.2, 6.4, 8.0, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Chelicerae / Pedipalps (Front mouth pincers & fangs)
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-2.5, -9);
  ctx.quadraticCurveTo(-4.8, -13.5, -2, -15.5);
  ctx.moveTo(2.5, -9);
  ctx.quadraticCurveTo(4.8, -13.5, 2, -15.5);
  ctx.stroke();

  // Fangs tip glow when pulled
  if (glowLevel > 0.15) {
    ctx.fillStyle = glowLevel > 0.5 ? '#4EE2EC' : '#FF1738';
    ctx.beginPath();
    ctx.arc(-2, -15.5, 1.0 + glowLevel * 1.2, 0, Math.PI * 2);
    ctx.arc(2, -15.5, 1.0 + glowLevel * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. EYES: DYNAMIC GLOW BASED ON PULLING LENGTH
  // As pulling length increases, all 8 spider eyes intensify from ruby embers to blazing cyan/white laser fire!
  ctx.save();

  // Eye Coordinates for realistic 8-eye arachnid pattern
  const centralEyes = [
    { x: -2.3, y: -5.4, r: 1.4 + glowLevel * 2.6 }, // Anterior median left
    { x: 2.3, y: -5.4, r: 1.4 + glowLevel * 2.6 },  // Anterior median right
  ];
  const lateralEyes = [
    { x: -4.8, y: -6.2, r: 1.0 + glowLevel * 1.6 }, // Anterior lateral left
    { x: 4.8, y: -6.2, r: 1.0 + glowLevel * 1.6 },  // Anterior lateral right
  ];
  const posteriorEyes = [
    { x: -3.5, y: -8.0, r: 0.9 + glowLevel * 1.4 },
    { x: -1.2, y: -8.4, r: 0.9 + glowLevel * 1.4 },
    { x: 1.2, y: -8.4, r: 0.9 + glowLevel * 1.4 },
    { x: 3.5, y: -8.0, r: 0.9 + glowLevel * 1.4 },
  ];
  const allEyes = [...centralEyes, ...lateralEyes, ...posteriorEyes];

  // A. Outer Radial Glow Corona (scaled with pull distance)
  const glowRadius = 8 + glowLevel * 45;
  const haloAlpha = 0.25 + glowLevel * 0.70;
  const haloGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, glowRadius);
  if (glowLevel < 0.35) {
    haloGrad.addColorStop(0, `rgba(255, 23, 56, ${haloAlpha * 0.8})`);
    haloGrad.addColorStop(0.5, `rgba(255, 60, 90, ${haloAlpha * 0.3})`);
    haloGrad.addColorStop(1, 'rgba(255, 23, 56, 0)');
  } else {
    haloGrad.addColorStop(0, `rgba(255, 255, 255, ${haloAlpha * 0.9})`);
    haloGrad.addColorStop(0.3, `rgba(78, 226, 236, ${haloAlpha * 0.7})`);
    haloGrad.addColorStop(0.7, `rgba(0, 160, 220, ${haloAlpha * 0.3})`);
    haloGrad.addColorStop(1, 'rgba(78, 226, 236, 0)');
  }
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, -6, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // B. Draw All 8 Glowing Eyes
  const baseEyeColor = glowLevel > 0.60
    ? '#FFFFFF'
    : (glowLevel > 0.28 ? '#B8FFFF' : '#FF1738');
  const eyeShadowColor = glowLevel > 0.35 ? '#4EE2EC' : '#FF1738';
  ctx.shadowColor = eyeShadowColor;
  ctx.shadowBlur = 8 + glowLevel * 32;
  ctx.fillStyle = baseEyeColor;

  allEyes.forEach((eye) => {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // C. Cross-Lens Starburst / Flare on Central Eyes when pulled
  if (glowLevel > 0.20) {
    const flareSpan = 8 + glowLevel * 36;
    const flareAlpha = Math.min(1.0, (glowLevel - 0.20) * 1.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${flareAlpha * 0.9})`;
    ctx.lineWidth = 1.0;

    centralEyes.forEach((eye) => {
      // Horizontal flare spike
      ctx.beginPath();
      ctx.moveTo(eye.x - flareSpan, eye.y);
      ctx.lineTo(eye.x + flareSpan, eye.y);
      ctx.stroke();

      // Vertical flare spike
      ctx.beginPath();
      ctx.moveTo(eye.x, eye.y - flareSpan * 0.6);
      ctx.lineTo(eye.x, eye.y + flareSpan * 0.6);
      ctx.stroke();
    });
  }

  // D. Twin Focused Laser Beams Shooting Forward (intensifies with pull length)
  if (glowLevel > 0.12) {
    const beamLength = 20 + glowLevel * 90;
    const beamAlpha = Math.min(1.0, (glowLevel - 0.12) * 1.4);

    centralEyes.forEach((eye) => {
      const beamAngle = eye.x < 0 ? -Math.PI * 0.58 : -Math.PI * 0.42;
      const targetX = eye.x + Math.cos(beamAngle) * beamLength;
      const targetY = eye.y + Math.sin(beamAngle) * beamLength;

      // Outer laser cone
      ctx.beginPath();
      ctx.moveTo(eye.x, eye.y);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = `rgba(78, 226, 236, ${beamAlpha * 0.75})`;
      ctx.lineWidth = 1.6 + glowLevel * 3.0;
      ctx.stroke();

      // White laser beam core
      ctx.beginPath();
      ctx.moveTo(eye.x, eye.y);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${beamAlpha * 0.95})`;
      ctx.lineWidth = 0.8 + glowLevel * 1.0;
      ctx.stroke();
    });
  }
  ctx.restore();

  // 5. Eight Realistic Jointed Legs (4 left, 4 right)
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const leftLegs = [
    // Leg 1 (Front): reaches forward and outward
    { cx: -4, cy: -5, kx: -16, ky: -22 - tension * 8, tx: -12 + legTwitch * 15, ty: -38 },
    // Leg 2: reaches forward-left
    { cx: -5, cy: -3, kx: -24, ky: -15, tx: -34, ty: -24 + legTwitch * 12 },
    // Leg 3: reaches sideways-back
    { cx: -5, cy: 1, kx: -25, ky: 5, tx: -36, ty: 14 + legTwitch * 10 },
    // Leg 4 (Rear): reaches back-left
    { cx: -4, cy: 4, kx: -18, ky: 24 + tension * 6, tx: -20, ty: 39 + legTwitch * 8 },
  ];

  // Draw Left Legs
  leftLegs.forEach((leg) => {
    ctx.beginPath();
    ctx.moveTo(leg.cx, leg.cy);
    ctx.lineTo(leg.kx, leg.ky);
    ctx.lineTo(leg.tx, leg.ty);
    ctx.stroke();
  });

  // Draw Right Legs (Mirrored with subtle phase variation)
  leftLegs.forEach((leg, i) => {
    const rTwitch = Math.cos(time * 0.003 + i) * 0.08;
    ctx.beginPath();
    ctx.moveTo(-leg.cx, leg.cy);
    ctx.lineTo(-leg.kx, leg.ky);
    ctx.lineTo(-leg.tx + rTwitch * 10, leg.ty);
    ctx.stroke();
  });

  ctx.restore();
}

// Draw a dense, realistic spiral spider web (orb-weaver style)
function drawDenseOrbWeb(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  spokeCount: number,
  ringCount: number,
  alpha: number
) {
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  // 1. Radial Spokes
  for (let s = 0; s < spokeCount; s++) {
    const angle = (s * Math.PI * 2) / spokeCount;
    const ex = cx + Math.cos(angle) * radius;
    const ey = cy + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = 'rgba(230, 245, 255, 0.40)';
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  // 2. Concentric Inward-Sag Catenary Rings
  for (let r = 1; r <= ringCount; r++) {
    const ringRadius = (r / ringCount) * radius;
    const sag = ringRadius * 0.16;

    for (let s = 0; s < spokeCount; s++) {
      const a0 = (s * Math.PI * 2) / spokeCount;
      const a1 = (((s + 1) % spokeCount) * Math.PI * 2) / spokeCount;

      const p0x = cx + Math.cos(a0) * ringRadius;
      const p0y = cy + Math.sin(a0) * ringRadius;
      const p1x = cx + Math.cos(a1) * ringRadius;
      const p1y = cy + Math.sin(a1) * ringRadius;

      const midA = (a0 + a1) * 0.5;
      const ctrlX = cx + Math.cos(midA) * (ringRadius - sag);
      const ctrlY = cy + Math.sin(midA) * (ringRadius - sag);

      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, p1x, p1y);
      ctx.strokeStyle = 'rgba(210, 235, 250, 0.35)';
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // Intersection nodes
      if (r % 2 === 0) {
        ctx.beginPath();
        ctx.arc(p0x, p0y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

export const InteractiveWebReveal: React.FC<InteractiveWebRevealProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Interaction State
  const isDraggingRef = useRef(false);
  const pullProgressRef = useRef(0);
  const isSnappingRef = useRef(false);
  const isCompletedRef = useRef(false);

  // Positions & Spring Simulation
  const anchorRef = useRef({ x: 0, y: 0 });
  const originNodeRef = useRef({ x: 0, y: 0 });
  const currentNodeRef = useRef({ x: 0, y: 0 });
  const targetNodeRef = useRef({ x: 0, y: 0 });
  const nodeVelocityRef = useRef({ x: 0, y: 0 });
  const mountTimeRef = useRef<number>(performance.now());
  const typographyRef = useRef<HTMLDivElement>(null);

  // Pointer & Tracking
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const pointerDownTimeRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const isNearNodeRef = useRef(false);

  // Component React State
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIntroReady, setIsIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsIntroReady(true), 750);
    return () => clearTimeout(timer);
  }, []);

  // Particles & Animations
  const particlesRef = useRef<Particle[]>([]);
  const triggerSnapRef = useRef<() => void>(() => {});

  // Prevent default scroll on touch while reveal is active
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => window.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove]);

  // Main Canvas & Interaction Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mountTime = mountTimeRef.current;
    let lastTime = performance.now();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      anchorRef.current = { x: width * 0.5, y: 0 };
      originNodeRef.current = { x: width * 0.5, y: height * 0.38 };
      if (!isDraggingRef.current && !isSnappingRef.current) {
        if (performance.now() - mountTime > 1200) {
          currentNodeRef.current = { ...originNodeRef.current };
          targetNodeRef.current = { ...originNodeRef.current };
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial positioning: Start spider from above ceiling for smooth descent!
    anchorRef.current = { x: width * 0.5, y: 0 };
    originNodeRef.current = { x: width * 0.5, y: height * 0.38 };
    if (performance.now() - mountTime < 80) {
      currentNodeRef.current = { x: width * 0.5, y: -60 };
    }
    targetNodeRef.current = { ...originNodeRef.current };
    pointerPosRef.current = { x: width * 0.5, y: height * 0.38 };

    // Trigger explosive snap release after pulling is over
    const triggerSnap = () => {
      if (isSnappingRef.current) return;
      isSnappingRef.current = true;
      isDraggingRef.current = false;

      // Haptic feedback
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([35, 60, 25]);
        }
      } catch {}

      // Burst of 100+ glowing particles from the spider
      const burstCount = 100;
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 6.0 + Math.random() * 22.0;
        particlesRef.current.push({
          x: currentNodeRef.current.x,
          y: currentNodeRef.current.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          alpha: 1.0,
          color: Math.random() > 0.35 ? '#4EE2EC' : '#FF1738',
          size: 1.8 + Math.random() * 3.2,
          life: 0,
          maxLife: 65 + Math.random() * 40,
        });
      }

      // Synchronize 3D Head event: snapping surge
      window.dispatchEvent(
        new CustomEvent('radianza:reveal-progress', {
          detail: {
            progress: 1.0,
            isDragging: false,
            isSnapping: true,
            isRevealed: false,
            pointerX: currentNodeRef.current.x,
            pointerY: currentNodeRef.current.y,
          },
        })
      );

      // AFTER PULLING IS OVER: Reveal the actual hero section of the website!
      setTimeout(() => {
        setIsRevealed(true);
        window.dispatchEvent(
          new CustomEvent('radianza:reveal-progress', {
            detail: {
              progress: 1.0,
              isDragging: false,
              isSnapping: false,
              isRevealed: true,
              pointerX: currentNodeRef.current.x,
              pointerY: currentNodeRef.current.y,
            },
          })
        );
        setTimeout(() => {
          if (!isCompletedRef.current) {
            isCompletedRef.current = true;
            onCompleteRef.current();
          }
        }, 350);
      }, 450);
    };

    triggerSnapRef.current = triggerSnap;

    // ── Animation Loop ──
    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) * 0.001, 0.06);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // ── 0. Initial Smooth Spider Descent & Web Blossom (First 1.2s) ──
      const introElapsed = Math.max(0, time - mountTime);
      const introDuration = 1200;
      const isIntroActive = introElapsed < introDuration && !isDraggingRef.current && !isSnappingRef.current;
      const introRatio = Math.min(1.0, introElapsed / introDuration);
      // Buttery smooth quintic ease out
      const introEase = 1 - Math.pow(1 - introRatio, 4.0);
      const webIntroAlpha = Math.min(1.0, Math.max(0, (introElapsed - 200) / 750));
      const spokeScale = Math.min(1.0, Math.max(0, (introElapsed - 300) / 700));

      // ── 1. Node Physics Simulation (Spring + Damping) ──
      const k = 0.20;
      const damping = 0.78;

      if (isDraggingRef.current) {
        currentNodeRef.current.x += (targetNodeRef.current.x - currentNodeRef.current.x) * 0.35;
        currentNodeRef.current.y += (targetNodeRef.current.y - currentNodeRef.current.y) * 0.35;

        // Progress based on vertical pull distance
        const maxPullDist = height * 0.38;
        const pulledDist = Math.max(0, currentNodeRef.current.y - originNodeRef.current.y);
        const progress = Math.min(1.0, pulledDist / maxPullDist);
        pullProgressRef.current = progress;

        // Snap threshold reached: pulling is completed!
        if (progress >= 0.82) {
          triggerSnap();
        }
      } else if (isSnappingRef.current) {
        currentNodeRef.current.y += (height * 1.6 - currentNodeRef.current.y) * 0.22;
        pullProgressRef.current = Math.min(1.0, pullProgressRef.current + dt * 2.8);
      } else if (isIntroActive) {
        // Smooth initial slide down from ceiling on silk thread with zero jerk
        currentNodeRef.current.x = originNodeRef.current.x;
        currentNodeRef.current.y = -60 + (originNodeRef.current.y + 60) * introEase;
        pullProgressRef.current = 0;
      } else {
        // Idle swaying gently eased in
        const swayBlend = Math.min(1.0, (introElapsed - introDuration) / 400);
        const idleSway = Math.sin(time * 0.0018) * 3.0 * swayBlend;
        const idleBob = Math.cos(time * 0.0022) * 4.0 * swayBlend;

        // Magnetic cursor attraction
        const distToPointer = Math.hypot(
          pointerPosRef.current.x - originNodeRef.current.x,
          pointerPosRef.current.y - originNodeRef.current.y
        );
        isNearNodeRef.current = distToPointer < 140;

        let magnetX = 0, magnetY = 0;
        if (isNearNodeRef.current) {
          const pullFactor = (1 - distToPointer / 140) * 16;
          magnetX = (pointerPosRef.current.x - originNodeRef.current.x) * (pullFactor / 140);
          magnetY = (pointerPosRef.current.y - originNodeRef.current.y) * (pullFactor / 140);
        }

        const targetX = originNodeRef.current.x + idleSway + magnetX;
        const targetY = originNodeRef.current.y + idleBob + magnetY;

        const fx = (targetX - currentNodeRef.current.x) * k;
        const fy = (targetY - currentNodeRef.current.y) * k;

        nodeVelocityRef.current.x = (nodeVelocityRef.current.x + fx) * damping;
        nodeVelocityRef.current.y = (nodeVelocityRef.current.y + fy) * damping;

        currentNodeRef.current.x += nodeVelocityRef.current.x;
        currentNodeRef.current.y += nodeVelocityRef.current.y;

        pullProgressRef.current = Math.max(0, pullProgressRef.current - dt * 2.6);
      }

      const progress = pullProgressRef.current;
      const nodeX = currentNodeRef.current.x;
      const nodeY = currentNodeRef.current.y;
      const anchor = anchorRef.current;

      // Pure 120fps hardware-accelerated transform for instruction typography
      if (typographyRef.current) {
        const textOpacity = isIntroReady ? Math.max(0, 1.0 - progress * 3.2) : 0;
        const textY = isIntroReady ? progress * 26 : 14;
        typographyRef.current.style.opacity = textOpacity.toFixed(3);
        typographyRef.current.style.transform = `translate3d(0, ${textY.toFixed(1)}px, 0)`;
      }

      // Dispatch event to synchronize 3D Head eye glow and pose
      if (!isCompletedRef.current) {
        window.dispatchEvent(
          new CustomEvent('radianza:reveal-progress', {
            detail: {
              progress,
              isDragging: isDraggingRef.current,
              isSnapping: isSnappingRef.current,
              isRevealed: false,
              pointerX: nodeX,
              pointerY: nodeY,
            },
          })
        );
      }

      // ── 2. Top-Left Corner Dense Spider Web ──
      const tlHubX = width * 0.20;
      const tlHubY = height * 0.12;
      const tlRadius = Math.min(width * 0.38, 320);
      const webBreathing = 0.45 + Math.sin(time * 0.002) * 0.08 + progress * 0.50;
      const webAlpha = Math.min(1.0, webBreathing * webIntroAlpha) * (isSnappingRef.current ? 1 - progress : 1.0);

      drawDenseOrbWeb(ctx, tlHubX, tlHubY, tlRadius, 14, 8, webAlpha);

      // ── 3. Bottom-Right Corner Dense Spider Web ──
      const brHubX = width * 0.82;
      const brHubY = height * 0.86;
      const brRadius = Math.min(width * 0.40, 340);

      drawDenseOrbWeb(ctx, brHubX, brHubY, brRadius, 14, 8, webAlpha);

      // ── 4. Structural Bridge Draglines Connecting the Spider Webs ──
      ctx.beginPath();
      ctx.moveTo(tlHubX, tlHubY);
      ctx.lineTo(nodeX, nodeY);
      ctx.lineTo(brHubX, brHubY);
      ctx.strokeStyle = `rgba(200, 240, 255, ${webAlpha * 0.65})`;
      ctx.lineWidth = 1.2 + progress * 0.8;
      ctx.stroke();

      // Viscid Dew Pearls on the Bottom-Right Bridge Strand (Matching Reference Image)
      const dewCount = 4;
      for (let dp = 1; dp <= dewCount; dp++) {
        const u = 0.55 + dp * 0.09;
        const dx = nodeX + (brHubX - nodeX) * u;
        const dy = nodeY + (brHubY - nodeY) * u;

        ctx.beginPath();
        ctx.arc(dx, dy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#4EE2EC';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Top ceiling attachment anchor fibers
      const discFootings = 7;
      const discSpan = 38;
      ctx.beginPath();
      for (let df = 0; df < discFootings; df++) {
        const u = (df / (discFootings - 1) - 0.5) * 2;
        const fx = anchor.x + u * discSpan;
        ctx.moveTo(fx, 0);
        ctx.quadraticCurveTo(anchor.x + u * 12, 10, anchor.x, 18);
      }
      ctx.strokeStyle = `rgba(78, 226, 236, ${webAlpha * 0.55})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // ── 5. Primary Vertical Silk Thread with S-Curve Wave ──
      const waveActive = isDraggingRef.current || isNearNodeRef.current;
      const waveAmp = (waveActive ? 9.0 : 3.0) * (1 - progress * 0.7);

      const segCount = 24;
      const threadPoints: Array<{ x: number; y: number }> = [];

      for (let s = 0; s <= segCount; s++) {
        const u = s / segCount;
        const baseY = u * nodeY;
        const baseX = anchor.x + (nodeX - anchor.x) * u;
        const waveOffset = Math.sin(u * Math.PI * 2.2 + time * 0.005) * Math.sin(u * Math.PI) * waveAmp;
        threadPoints.push({ x: baseX + waveOffset, y: baseY });
      }

      // Thread halo
      ctx.beginPath();
      threadPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = `rgba(78, 226, 236, ${0.45 + progress * 0.45})`;
      ctx.lineWidth = 3.2 + progress * 2.0;
      ctx.stroke();

      // Sharp luminous silk filament
      ctx.beginPath();
      threadPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Viscid silk droplets along the dragline
      for (let d = 2; d < threadPoints.length - 1; d += 3) {
        const pt = threadPoints[d];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#4EE2EC';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 6. Secondary Web Strands Radiating from Central Spider ──
      const spokeCount = 8;
      const maxSpokeDist = Math.max(width, height) * 0.85;
      const spokeRadius = (180 + (maxSpokeDist - 180) * Math.min(1.0, progress * 1.5)) * spokeScale;

      for (let i = 0; i < spokeCount; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI * 2) / spokeCount;
        if (i === 0) continue; // vertical thread already drawn

        const ex = nodeX + Math.cos(angle) * spokeRadius;
        const ey = nodeY + Math.sin(angle) * spokeRadius;

        ctx.beginPath();
        ctx.moveTo(nodeX, nodeY);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = i % 2 === 1
          ? `rgba(255, 23, 56, ${webAlpha * 0.65})`
          : `rgba(78, 226, 236, ${webAlpha * 0.60})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 3 concentric connecting loops
        [0.35, 0.65, 0.95].forEach((rf) => {
          const nextA = -Math.PI / 2 + (((i + 1) % spokeCount) * Math.PI * 2) / spokeCount;
          const p1x = nodeX + Math.cos(angle) * (spokeRadius * rf);
          const p1y = nodeY + Math.sin(angle) * (spokeRadius * rf);
          const p2x = nodeX + Math.cos(nextA) * (spokeRadius * rf);
          const p2y = nodeY + Math.sin(nextA) * (spokeRadius * rf);

          const midA = (angle + nextA) * 0.5;
          const ctrlX = nodeX + Math.cos(midA) * (spokeRadius * rf * 0.82);
          const ctrlY = nodeY + Math.sin(midA) * (spokeRadius * rf * 0.82);

          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y);
          ctx.strokeStyle = `rgba(78, 226, 236, ${webAlpha * 0.45})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Pearl intersection node
          ctx.beginPath();
          ctx.arc(p1x, p1y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });
      }

      // ── 7. ACTUAL SPIDERS RENDERING WITH DYNAMIC EYE GLOW BASED ON PULL LENGTH ──
      // A. Small Spider perched on Top-Left Web
      const smallSpiderX = tlHubX + 115 + Math.sin(time * 0.001) * 12;
      const smallSpiderY = tlHubY + 55 + Math.cos(time * 0.0012) * 8;
      const smallSpiderRot = -Math.PI * 0.68 + Math.sin(time * 0.0015) * 0.15;
      drawRealisticSpider(
        ctx,
        smallSpiderX,
        smallSpiderY,
        0.55,
        smallSpiderRot,
        time,
        progress > 0.2,
        progress,
        '#FFFFFF'
      );

      // B. LARGE MAIN SPIDER on Central Dragline (Primary Grab Point!)
      // Eyes glow brighter and brighter based on pulling length!
      if (!isSnappingRef.current || progress < 0.9) {
        const isHoverOrDrag = isNearNodeRef.current || isDraggingRef.current;
        const mainSpiderRot = Math.sin(time * 0.002) * 0.08 + (isDraggingRef.current ? 0.05 : 0);

        // Circular spider web hub backing under the spider
        const hubRadius = (32 + progress * 8 + (isHoverOrDrag ? 4 : 0)) * Math.min(1.0, webIntroAlpha * 1.2);
        if (hubRadius > 2) {
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, hubRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(78, 226, 236, ${(isHoverOrDrag ? 0.14 : 0.06) * (1 - progress * 0.8)})`;
          ctx.strokeStyle = `rgba(78, 226, 236, ${(isHoverOrDrag ? 0.65 : 0.35) * (1 - progress * 0.8)})`;
          ctx.lineWidth = 1.2;
          ctx.fill();
          ctx.stroke();

          // Radiating silk rays in hub
          for (let h = 0; h < 8; h++) {
            const a = (h * Math.PI * 2) / 8 + time * 0.001;
            ctx.beginPath();
            ctx.moveTo(nodeX + Math.cos(a) * 6, nodeY + Math.sin(a) * 6);
            ctx.lineTo(nodeX + Math.cos(a) * hubRadius, nodeY + Math.sin(a) * hubRadius);
            ctx.strokeStyle = 'rgba(78, 226, 236, 0.40)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw the Large Realistic Spider with eye glow scaling with pull length!
        drawRealisticSpider(
          ctx,
          nodeX,
          nodeY,
          1.0 + (isHoverOrDrag ? 0.1 : 0),
          mainSpiderRot,
          time,
          isDraggingRef.current,
          progress,
          '#FFFFFF'
        );
      }

      // ── 8. Burst Particles Simulation upon Snap / Release ──
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.alpha *= 0.93;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.03);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ── Unified Pointer Events (Mouse & Touch Drag) ──
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSnappingRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    pointerDownTimeRef.current = performance.now();
    pointerDownPosRef.current = { x: px, y: py };

    const distToNode = Math.hypot(px - currentNodeRef.current.x, py - currentNodeRef.current.y);
    const hitRadius = 95;
    const nearThread =
      Math.abs(px - anchorRef.current.x) <= 75 &&
      py <= currentNodeRef.current.y + 70 &&
      py >= 0;

    if (distToNode <= hitRadius || nearThread) {
      isDraggingRef.current = true;
      targetNodeRef.current = { x: px, y: py };
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    pointerPosRef.current = { x: px, y: py };

    if (!isDraggingRef.current || isSnappingRef.current) {
      const dist = Math.hypot(px - currentNodeRef.current.x, py - currentNodeRef.current.y);
      const nearThread =
        Math.abs(px - anchorRef.current.x) <= 65 &&
        py <= currentNodeRef.current.y + 40 &&
        py >= 0;
      setIsHovered(dist <= 85 || nearThread);
      return;
    }

    const origX = originNodeRef.current.x;
    const clampedX = origX + (px - origX) * 0.45;
    const clampedY = Math.max(originNodeRef.current.y * 0.95, py);

    targetNodeRef.current = { x: clampedX, y: clampedY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const dt = performance.now() - pointerDownTimeRef.current;
      const distMoved = Math.hypot(
        px - pointerDownPosRef.current.x,
        py - pointerDownPosRef.current.y
      );

      // Tap-to-reveal fallback: Quick tap/click triggers reveal automatically
      if (dt < 350 && distMoved < 25 && !isSnappingRef.current) {
        triggerSnapRef.current();
        return;
      }
    }

    // After pulling was over: If user pulled past 0.35 and released, trigger reveal!
    if (pullProgressRef.current >= 0.35 && !isSnappingRef.current) {
      triggerSnapRef.current();
      return;
    }

    // If slight pull didn't reach threshold, return smoothly to origin
    if (pullProgressRef.current < 0.35 && !isSnappingRef.current) {
      targetNodeRef.current = { ...originNodeRef.current };
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed inset-0 z-[9999] select-none overflow-hidden touch-none transition-opacity duration-500 bg-[#000000] ${
        isRevealed ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
      }`}
      style={{
        cursor: isHovered ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'default',
      }}
    >
      {/* ── 1. The FULLY SOLID PITCH-BLACK VEIL LAYER ── */}
      {/* Stays 100% solid pitch black while pulling, then dissolves cleanly to reveal the actual Hero section! */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          isRevealed ? 'opacity-0 duration-500 ease-out' : 'opacity-100'
        }`}
        style={{
          backgroundColor: '#000000',
        }}
      />

      {/* ── 2. Real-Time Spider Web & Crawling Spiders Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* ── 3. Minimal Cinematic Instruction Typography ── */}
      <div
        ref={typographyRef}
        className="absolute inset-x-0 pointer-events-none z-20 flex flex-col items-center justify-center text-center select-none"
        style={{
          top: 'calc(38vh + 65px)',
          opacity: 0,
          transform: 'translate3d(0, 14px, 0)',
          willChange: 'transform, opacity',
        }}
      >
        <span className="font-serif font-black text-xs sm:text-sm tracking-[0.28em] text-[#FFFFFF]/90 uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          RADIANZA <span className="text-[#FF1738] font-bold">'26</span>
        </span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="w-5 h-[1px] bg-gradient-to-r from-transparent to-[#4EE2EC]" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.34em] text-[#4EE2EC] uppercase animate-pulse">
            PULL TO REVEAL
          </span>
          <span className="w-5 h-[1px] bg-gradient-to-l from-transparent to-[#4EE2EC]" />
        </div>
        <div className="mt-2.5 flex flex-col items-center gap-1 opacity-70">
          <svg
            className="w-4 h-4 text-[#4EE2EC] animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-white/50 uppercase">
            DRAG SPIDER DOWN OR TAP TO ENTER
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWebReveal;
