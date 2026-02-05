import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (!isVisible) {
        // Snap cursor to position on first move
        cursorPos.current = { x: e.clientX, y: e.clientY };
        setIsVisible(true);
      }
    };

    // Hover handlers
    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        cursor.classList.add('hover');
      }
    };

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        cursor.classList.remove('hover');
      }
    };

    // Animation loop
    const animate = () => {
      // Smooth lerp
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.2;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.2;

      // Update cursor position
      cursor.style.left = `${cursorPos.current.x}px`;
      cursor.style.top = `${cursorPos.current.y}px`;

      // Add to trail
      trailRef.current.push({ x: cursorPos.current.x, y: cursorPos.current.y });
      if (trailRef.current.length > 25) {
        trailRef.current.shift();
      }

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trailRef.current.forEach((point, index) => {
        const progress = index / trailRef.current.length;
        const size = 20 * (0.3 + progress * 0.7);
        const opacity = progress * 0.4;

        if (opacity > 0.02) {
          ctx.save();
          ctx.translate(point.x, point.y);
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(size * 0.3, size * 0.7);
          ctx.lineTo(size * 0.5, size * 0.5);
          ctx.lineTo(size * 0.7, size * 0.3);
          ctx.closePath();
          
          ctx.fillStyle = `rgba(255, 189, 18, ${opacity})`;
          ctx.fill();
          
          ctx.strokeStyle = `rgba(15, 17, 21, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          ctx.restore();
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    // Start
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible]);

  return (
    <>
      <svg
        ref={cursorRef}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`custom-cursor ${isVisible ? 'visible' : ''}`}
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill="#ffbd12"
          stroke="#0f1115"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <canvas ref={canvasRef} className="custom-cursor-trail" />
    </>
  );
};
