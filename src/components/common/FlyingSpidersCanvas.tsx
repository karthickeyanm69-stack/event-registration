import React, { useEffect, useRef } from 'react';

interface SpiderParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  angularVel: number;
  legPhase: number;
  legSpeed: number;
  opacity: number;
  silkLength: number;
  swayFreq: number;
  swayAmp: number;
}

interface FlyingSpidersCanvasProps {
  className?: string;
  count?: number;
}

export const FlyingSpidersCanvas: React.FC<FlyingSpidersCanvasProps> = ({
  className = '',
  count = 10,
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
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize Spiders
    const spiders: SpiderParticle[] = [];
    const actualCount = Math.min(count, 12);
    for (let i = 0; i < actualCount; i++) {
      spiders.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 + (Math.random() > 0.5 ? 0.3 : -0.3),
        vy: -0.3 - Math.random() * 0.55,
        size: 2.0 + Math.random() * 2.2,
        angle: (Math.random() - 0.5) * 0.3,
        angularVel: (Math.random() - 0.5) * 0.01,
        legPhase: Math.random() * Math.PI * 2,
        legSpeed: 0.004 + Math.random() * 0.006,
        opacity: 0.3 + Math.random() * 0.3,
        silkLength: 30 + Math.random() * 50,
        swayFreq: 0.0015 + Math.random() * 0.002,
        swayAmp: 0.5 + Math.random() * 0.8,
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

    // Render little arachnid
    const drawLittleSpider = (
      c: CanvasRenderingContext2D,
      s: SpiderParticle,
      time: number
    ) => {
      c.save();
      c.translate(s.x, s.y);
      c.rotate(s.angle);

      const color = `rgba(24, 24, 30, ${s.opacity})`;
      const accentColor = `rgba(180, 20, 35, ${s.opacity * 0.85})`;
      const silkColor = `rgba(30, 30, 40, ${s.opacity * 0.25})`;

      // Silk Filament
      c.beginPath();
      c.moveTo(0, s.size * 0.6);
      const wave = Math.sin(time * 0.003 + s.legPhase) * 4;
      c.quadraticCurveTo(wave * 0.5, s.silkLength * 0.5, wave, s.silkLength);
      c.strokeStyle = silkColor;
      c.lineWidth = 0.5;
      c.stroke();

      // Abdomen
      c.beginPath();
      c.ellipse(0, s.size * 0.2, s.size * 0.65, s.size * 0.85, 0, 0, Math.PI * 2);
      c.fillStyle = color;
      c.fill();

      // Marking
      c.beginPath();
      c.arc(0, s.size * 0.1, s.size * 0.22, 0, Math.PI * 2);
      c.fillStyle = accentColor;
      c.fill();

      // Head
      c.beginPath();
      c.arc(0, -s.size * 0.6, s.size * 0.45, 0, Math.PI * 2);
      c.fillStyle = color;
      c.fill();

      // Legs (Simplified 4 pair lines for high performance)
      c.strokeStyle = color;
      c.lineWidth = Math.max(0.65, s.size * 0.2);
      c.lineCap = 'round';

      const legOffsets = [
        { bx: -s.size * 0.3, by: -s.size * 0.4, tx: -s.size * 2.0, ty: -s.size * 0.7 },
        { bx: -s.size * 0.4, by: -s.size * 0.1, tx: -s.size * 2.3, ty: s.size * 0.1 },
        { bx: -s.size * 0.4, by: s.size * 0.1, tx: -s.size * 2.1, ty: s.size * 1.2 },
        { bx: -s.size * 0.3, by: s.size * 0.3, tx: -s.size * 1.6, ty: s.size * 1.9 },
      ];

      legOffsets.forEach((l, idx) => {
        const tw = Math.sin(time * s.legSpeed + s.legPhase + idx * 0.8) * (s.size * 0.35);
        // Left
        c.beginPath();
        c.moveTo(l.bx, l.by);
        c.lineTo(l.tx + tw, l.ty + tw * 0.5);
        c.stroke();

        // Right
        c.beginPath();
        c.moveTo(-l.bx, l.by);
        c.lineTo(-l.tx - tw, l.ty + tw * 0.5);
        c.stroke();
      });

      c.restore();
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      animId = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) * 0.001, 0.033);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      for (let i = 0; i < spiders.length; i++) {
        const s = spiders[i];
        const sway = Math.sin(time * s.swayFreq + s.legPhase) * s.swayAmp;
        s.x += (s.vx + sway) * (dt * 60);
        s.y += s.vy * (dt * 60);
        s.angle += s.angularVel;

        if (pointer.active) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 100) * 1.5;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
          }
        }

        if (s.y < -60) {
          s.y = height + 30;
          s.x = Math.random() * width;
        } else if (s.y > height + 60) {
          s.y = -30;
        }

        if (s.x < -40) {
          s.x = width + 30;
        } else if (s.x > width + 40) {
          s.x = -30;
        }

        drawLittleSpider(ctx, s, time);
      }
    };

    // Intersection Observer to stop rendering when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-15 select-none ${className}`}
    />
  );
};
