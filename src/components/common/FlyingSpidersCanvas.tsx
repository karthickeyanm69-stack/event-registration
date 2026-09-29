import React, { useEffect, useRef } from 'react';

interface MultiverseParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  type: 'spider' | 'spark' | 'hex' | 'glitch';
  angle: number;
  angularVel: number;
  legPhase: number;
  legSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface FlyingSpidersCanvasProps {
  className?: string;
  count?: number;
}

export const FlyingSpidersCanvas: React.FC<FlyingSpidersCanvasProps> = ({
  className = '',
  count = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const COLOR_PALETTE = [
      { color: '#FF1E42', glow: 'rgba(255, 30, 66, 0.6)' },   // Miles Red
      { color: '#FF6B00', glow: 'rgba(255, 107, 0, 0.6)' },  // Portal Amber
      { color: '#E000FF', glow: 'rgba(224, 0, 255, 0.55)' }, // Glitch Magenta
      { color: '#00F0FF', glow: 'rgba(0, 240, 255, 0.5)' },  // Venom Cyan
      { color: '#FFE600', glow: 'rgba(255, 230, 0, 0.5)' },  // Electric Yellow
    ];

    // Initialize Spider & Multiverse Particles
    const particles: MultiverseParticle[] = [];
    for (let i = 0; i < count; i++) {
      const pal = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
      const typeChoice: 'spider' | 'spark' | 'hex' | 'glitch' =
        i % 3 === 0 ? 'spider' : i % 3 === 1 ? 'hex' : 'spark';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.3 : -0.3),
        vy: -0.4 - Math.random() * 0.8, // Floating upward
        size: typeChoice === 'spider' ? 2.5 + Math.random() * 2.5 : 1.5 + Math.random() * 3,
        color: pal.color,
        glowColor: pal.glow,
        type: typeChoice,
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.03,
        legPhase: Math.random() * Math.PI * 2,
        legSpeed: 0.006 + Math.random() * 0.01,
        opacity: 0.35 + Math.random() * 0.55,
        life: 0,
        maxLife: 200 + Math.random() * 400,
      });
    }

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    // Draw little Spider
    const drawSpider = (
      c: CanvasRenderingContext2D,
      p: MultiverseParticle,
      time: number
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.angle);

      // Spider body
      c.fillStyle = p.color;
      c.shadowColor = p.glowColor;
      c.shadowBlur = 8;
      c.beginPath();
      c.ellipse(0, 0, p.size * 0.8, p.size * 1.2, 0, 0, Math.PI * 2);
      c.fill();

      // Spider head
      c.beginPath();
      c.arc(0, -p.size * 1.1, p.size * 0.6, 0, Math.PI * 2);
      c.fill();

      // Spider legs (8 legs)
      c.strokeStyle = p.color;
      c.lineWidth = 0.85;
      c.shadowBlur = 4;
      const legCycle = Math.sin(time * p.legSpeed + p.legPhase);

      for (let side = -1; side <= 1; side += 2) {
        for (let j = 0; j < 4; j++) {
          const baseAngle = (j * 0.3 - 0.45) * side;
          const kx = side * (p.size * 2 + j * 1.2) + legCycle * side * 1.5;
          const ky = (j - 1.5) * p.size * 1.4;
          const endX = side * (p.size * 3.5 + j * 1.8);
          const endY = (j - 1.2) * p.size * 2.2 + (j % 2 === 0 ? 3 : -2);

          c.beginPath();
          c.moveTo(side * (p.size * 0.6), (j - 1.5) * p.size * 0.8);
          c.quadraticCurveTo(kx, ky, endX, endY);
          c.stroke();
        }
      }

      c.restore();
    };

    // Draw Multiverse Hex Spark
    const drawHex = (c: CanvasRenderingContext2D, p: MultiverseParticle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.angle);
      c.strokeStyle = p.color;
      c.fillStyle = p.glowColor;
      c.lineWidth = 1;
      c.shadowColor = p.glowColor;
      c.shadowBlur = 10;

      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const hx = Math.cos(rad) * p.size * 2;
        const hy = Math.sin(rad) * p.size * 2;
        if (i === 0) c.moveTo(hx, hy);
        else c.lineTo(hx, hy);
      }
      c.closePath();
      c.stroke();
      if (Math.random() > 0.4) c.fill();
      c.restore();
    };

    // Draw Spark
    const drawSpark = (c: CanvasRenderingContext2D, p: MultiverseParticle) => {
      c.save();
      c.translate(p.x, p.y);
      c.fillStyle = p.color;
      c.shadowColor = p.glowColor;
      c.shadowBlur = 12;
      c.beginPath();
      c.arc(0, 0, p.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    let lastTime = 0;
    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.life += 1;
        p.angle += p.angularVel;
        p.x += p.vx;
        p.y += p.vy;

        // Interactive mouse gravity repulsion
        if (pointerRef.current.active) {
          const dx = p.x - pointerRef.current.x;
          const dy = p.y - pointerRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Screen wrap
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        if (p.type === 'spider') {
          drawSpider(ctx, p, time);
        } else if (p.type === 'hex') {
          drawHex(ctx, p);
        } else {
          drawSpark(ctx, p);
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
    />
  );
};
