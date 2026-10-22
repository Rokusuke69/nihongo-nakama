/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export const SakuraPetalsCanvas: React.FC<{ count?: number; opacity?: number }> = ({
  count = 28,
  opacity = 0.85,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const colors = [
      'rgba(255, 183, 197, 0.75)',
      'rgba(255, 197, 208, 0.65)',
      'rgba(255, 218, 224, 0.85)',
      'rgba(244, 166, 183, 0.60)',
    ];

    const petals: Petal[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.2 + 0.4,
      speedY: Math.random() * 1.5 + 0.6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.4 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity * opacity;
      ctx.fillStyle = p.color;

      // Draw characteristic Sakura notched petal curve
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size / 2, -p.size, 0, -p.size * 1.3);
      ctx.bezierCurveTo(p.size / 2, -p.size, p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
