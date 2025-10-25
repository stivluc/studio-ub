'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.onclick !== null ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Smooth follow animation
    let animationFrameId: number;
    const animate = () => {
      if (cursorRef.current) {
        // Lerp (linear interpolation) for smooth following
        const smoothness = 0.15; // Lower = more delay/smoothness
        positionRef.current.x += (targetRef.current.x - positionRef.current.x) * smoothness;
        positionRef.current.y += (targetRef.current.y - positionRef.current.y) * smoothness;

        cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: isHovering ? '-20px' : '-10px',
        left: isHovering ? '-20px' : '-10px',
        width: isHovering ? '40px' : '20px',
        height: isHovering ? '40px' : '20px',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        transition: 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: isClicking
            ? 'rgba(250, 236, 187, 0.3)'
            : isHovering
              ? 'rgba(250, 236, 187, 0.2)'
              : 'rgba(0, 0, 0, 0.5)',
          border: isHovering
            ? '2px solid var(--color-cream)'
            : '2px solid white',
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'transform 0.1s ease, background-color 0.2s ease, border-color 0.2s ease',
        }}
      />
    </div>
  );
}
