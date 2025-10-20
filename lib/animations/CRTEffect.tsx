'use client';

import React, { useEffect, useRef, useState } from 'react';
import './CRTEffect.css';

interface CRTEffectProps {
  children: React.ReactNode;
  className?: string;
  effects?: {
    scanlines?: boolean;
    vignette?: boolean;
    vcr?: boolean;
    snow?: boolean;
    wobble?: boolean;
  };
  intensity?: {
    vcrOpacity?: number;
    snowOpacity?: number;
    vcrTracking?: number;
    vcrTapeAge?: number;
    vcrBlur?: number;
    vcrFps?: number;
  };
}

export default function CRTEffect({
  children,
  className = '',
  effects = {
    scanlines: true,
    vignette: true,
    vcr: true,
    snow: true,
    wobble: true,
  },
  intensity = {
    vcrOpacity: 0.6,
    snowOpacity: 0.2,
    vcrTracking: 220,
    vcrTapeAge: 70,
    vcrBlur: 1,
    vcrFps: 60,
  },
}: CRTEffectProps) {
  const vcrCanvasRef = useRef<HTMLCanvasElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effects.vcr && !effects.snow) return;

    let vcrInterval: number | NodeJS.Timeout;
    let snowFrame: number;

    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const renderTail = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number
    ) => {
      const n = getRandomInt(1, 50);
      const dirs = [1, -1];
      let rd = radius;
      const dir = dirs[Math.floor(Math.random() * dirs.length)];

      for (let i = 0; i < n; i++) {
        const step = 0.01;
        let r = getRandomInt((rd -= step), radius);
        let dx = getRandomInt(1, 4);
        radius -= 0.1;
        dx *= dir;
        ctx.fillRect((x += dx), y, r, r);
        ctx.fill();
      }
    };

    const renderTrackingNoise = () => {
      if (!vcrCanvasRef.current) return;

      const canvas = vcrCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Skip if canvas has no valid dimensions yet
      if (canvas.width === 0 || canvas.height === 0 || !isFinite(canvas.width) || !isFinite(canvas.height)) return;

      const radius = 2;
      const xmax = canvas.width;
      const ymax = canvas.height;
      let posy1 = intensity.vcrTracking || 0;
      let posy2 = canvas.height;
      let posy3 = intensity.vcrTracking || 0;
      const num = intensity.vcrTapeAge || 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.beginPath();

      for (let i = 0; i <= num; i++) {
        const x = Math.random() * xmax;
        const y1 = getRandomInt((posy1 += 3), posy2);
        const y2 = getRandomInt(0, (posy3 -= 3));

        ctx.fillRect(x, y1, radius, radius);
        ctx.fillRect(x, y2, radius, radius);
        ctx.fill();

        renderTail(ctx, x, y1, radius);
        renderTail(ctx, x, y2, radius);
      }

      ctx.closePath();
    };

    const generateSnow = () => {
      if (!snowCanvasRef.current) return;

      const canvas = snowCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Skip if canvas has no valid dimensions yet
      if (w === 0 || h === 0 || !isFinite(w) || !isFinite(h)) return;

      const d = ctx.createImageData(w, h);
      const b = new Uint32Array(d.data.buffer);
      const len = b.length;

      for (let i = 0; i < len; i++) {
        b[i] = ((255 * Math.random()) | 0) << 24;
      }

      ctx.putImageData(d, 0, 0);
    };

    const updateCanvasSizes = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (vcrCanvasRef.current && effects.vcr) {
          vcrCanvasRef.current.width = rect.width;
          vcrCanvasRef.current.height = rect.height;
        }

        if (snowCanvasRef.current && effects.snow) {
          snowCanvasRef.current.width = rect.width / 2;
          snowCanvasRef.current.height = rect.height / 2;
        }
      }
    };

    updateCanvasSizes();

    // VCR effect
    if (effects.vcr) {
      const fps = intensity.vcrFps || 60;
      if (fps >= 60) {
        const animate = () => {
          renderTrackingNoise();
          vcrInterval = requestAnimationFrame(animate);
        };
        animate();
      } else {
        vcrInterval = setInterval(() => {
          renderTrackingNoise();
        }, 1000 / fps);
      }
    }

    // Snow effect
    if (effects.snow) {
      const animateSnow = () => {
        generateSnow();
        snowFrame = requestAnimationFrame(animateSnow);
      };
      animateSnow();
    }

    // Resize handler
    const handleResize = () => {
      updateCanvasSizes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (typeof vcrInterval === 'number') {
        cancelAnimationFrame(vcrInterval);
      } else {
        clearInterval(vcrInterval);
      }
      if (snowFrame) {
        cancelAnimationFrame(snowFrame);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [effects, intensity]);

  return (
    <div ref={containerRef} className={`crt-screen-container ${className}`}>
      <div className="crt-screen-wrapper">
        <div className={`crt-screen-wrapper-2 ${effects.wobble ? 'crt-wobbley' : ''}`}>
          <div className="crt-screen-wrapper-3">
            <div className="crt-content">{children}</div>

            {effects.vcr && (
              <canvas
                ref={vcrCanvasRef}
                className="crt-vcr"
                style={{
                  opacity: intensity.vcrOpacity,
                  filter: `blur(${intensity.vcrBlur}px)`,
                }}
              />
            )}

            {effects.snow && (
              <canvas
                ref={snowCanvasRef}
                className="crt-snow"
                style={{ opacity: intensity.snowOpacity }}
              />
            )}

            {effects.scanlines && <div className="crt-scanlines" />}
          </div>
        </div>
      </div>

      {effects.vignette && <div className="crt-vignette" />}
    </div>
  );
}
