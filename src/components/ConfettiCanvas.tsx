import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
}

const COLORS = ['#3A5A40', '#A3B18A', '#D4A373', '#E9C46A'];
const PARTICLE_COUNT = 60;

export interface ConfettiCanvasRef {
  fire: () => void;
}

export const ConfettiCanvas = forwardRef<ConfettiCanvasRef, object>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = particlesRef.current;

    if (particles.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.y > canvas.height) {
        particles.splice(i, 1);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1.5) * 10 - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 2,
        gravity: 0.4,
        drag: 0.96,
      });
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  }, [animate]);

  useImperativeHandle(ref, () => ({
    fire,
  }));

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';
