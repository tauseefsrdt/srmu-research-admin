import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GsapBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for interactive scientific network
    const numParticles = Math.min(Math.floor((width * height) / 18000), 75);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulsePhase: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(10, 74, 143, ', // Deep navy
      'rgba(12, 92, 168, ', // Lake teal
      'rgba(255, 183, 3, ', // Amber gold
    ];

    for (let i = 0; i < numParticles; i++) {
      const color = colors[Math.floor(Math.random() * (i % 5 === 0 ? 3 : 2))];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        color,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw interactive connections & particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce from walls
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse interaction (gentle attraction and repulsion field)
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (1 - dist / 150) * 1.5;
          p1.x -= (dx / dist) * force;
          p1.y -= (dy / dist) * force;
        }

        const alpha = p1.baseAlpha + Math.sin(time * p1.pulseSpeed * 60 + p1.pulsePhase) * 0.15;

        // Draw particle node with glow
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${Math.max(0.1, alpha)})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distNodes < 160) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - distNodes / 160) * 0.22;
            ctx.strokeStyle = `rgba(10, 74, 143, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Draw connecting line to mouse if close
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mouseLineAlpha = (1 - dist / 140) * 0.35;
          ctx.strokeStyle = `rgba(255, 183, 3, ${mouseLineAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // GSAP Floating Ambient Blobs Animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let gsapCtx: gsap.Context | null = null;

    if (!prefersReducedMotion && containerRef.current) {
      gsapCtx = gsap.context(() => {
        if (blob1Ref.current) {
          gsap.to(blob1Ref.current, {
            x: '+=90',
            y: '+=70',
            scale: 1.18,
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
        if (blob2Ref.current) {
          gsap.to(blob2Ref.current, {
            x: '-=80',
            y: '+=60',
            scale: 0.92,
            duration: 14,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1,
          });
        }
        if (blob3Ref.current) {
          gsap.to(blob3Ref.current, {
            x: '+=60',
            y: '-=50',
            scale: 1.12,
            duration: 16,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2,
          });
        }
      }, containerRef);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (gsapCtx) gsapCtx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#F8FAFC]"
      aria-hidden="true"
    >
      {/* Subtle modern dot matrix */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 74, 143, 0.14) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 45%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 45%, transparent 100%)',
        }}
      />

      {/* GSAP Floating Light Auras */}
      <div
        ref={blob1Ref}
        className="absolute -top-28 -left-28 w-[580px] h-[580px] rounded-full filter blur-[110px] opacity-30"
        style={{
          background: 'radial-gradient(circle, #0A4A8F 0%, #0C5CA8 45%, transparent 70%)',
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute top-[30%] -right-28 w-[520px] h-[520px] rounded-full filter blur-[110px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #FFB703 0%, #FFC107 45%, transparent 70%)',
        }}
      />
      <div
        ref={blob3Ref}
        className="absolute bottom-5 left-[22%] w-[520px] h-[520px] rounded-full filter blur-[110px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #0C5CA8 0%, #bfd3ea 50%, transparent 70%)',
        }}
      />

      {/* Interactive GSAP Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-80"
      />
    </div>
  );
}
