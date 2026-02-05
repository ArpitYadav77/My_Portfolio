// Premium Arrow Cursor with Smooth Trail
// Only activate on desktop devices with mouse
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
};

// Wait for DOM to be fully loaded
const initCursor = () => {
  if (isTouchDevice()) return;

  const cursorArrow = document.getElementById("cursor-arrow");
  const canvas = document.getElementById("cursor-trail");
  
  // Safety check - ensure elements exist
  if (!cursorArrow || !canvas) {
    console.warn('Cursor elements not found');
    return;
  }
  
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Mouse position - initialize to center to avoid jumping to (0,0)
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Arrow position (lerped for smooth following)
  let arrowX = window.innerWidth / 2;
  let arrowY = window.innerHeight / 2;

  // Trail configuration
  const maxTrailPoints = 25;
  let trail = [];

  // Linear interpolation for smooth motion
  const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
  };

  // Update canvas size on window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // On first mouse move, snap cursor to position
    if (!isInitialized) {
      arrowX = e.clientX;
      arrowY = e.clientY;
      isInitialized = true;
    }
  });

  let isInitialized = false;

  // Hover effect on interactive elements
  const interactiveElements = 'a, button, [role="button"], .cursor-hover';
  
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorArrow.classList.add("hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorArrow.classList.remove("hover");
    }
  });

  // Hide cursor on input focus
  document.addEventListener("focusin", (e) => {
    if (e.target.matches("input, textarea, select")) {
      cursorArrow.style.opacity = "0";
    }
  });

  document.addEventListener("focusout", (e) => {
    if (e.target.matches("input, textarea, select")) {
      cursorArrow.style.opacity = "0.95";
    }
  });

  // Draw arrow shape on canvas
  const drawArrow = (x, y, size, opacity) => {
    ctx.save();
    ctx.translate(x, y);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.3, size * 0.7);
    ctx.lineTo(size * 0.5, size * 0.5);
    ctx.lineTo(size * 0.7, size * 0.3);
    ctx.closePath();
    
    ctx.fillStyle = `rgba(255, 189, 18, ${opacity})`;
    ctx.fill();
    
    // Subtle outline
    ctx.strokeStyle = `rgba(15, 17, 21, ${opacity * 0.5})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    ctx.restore();
  };

  // Animation loop
  function animate() {
    // Smooth arrow follow with lerp (subtle delay)
    arrowX = lerp(arrowX, mouseX, 0.2);
    arrowY = lerp(arrowY, mouseY, 0.2);

    // Update arrow position
    cursorArrow.style.left = arrowX + "px";
    cursorArrow.style.top = arrowY + "px";

    // Add current position to trail
    trail.push({ 
      x: arrowX, 
      y: arrowY 
    });
    
    // Limit trail length
    if (trail.length > maxTrailPoints) {
      trail.shift();
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trail with gradient opacity and size
    trail.forEach((point, index) => {
      const progress = index / trail.length;
      
      // Calculate size and opacity based on position in trail
      const size = 20 * (0.3 + progress * 0.7); // Scale from 30% to 100%
      const opacity = progress * 0.4; // Fade from 0 to 0.4
      
      // Only draw if opacity is visible
      if (opacity > 0.02) {
        drawArrow(point.x, point.y, size, opacity);
      }
    });

    requestAnimationFrame(animate);
  }

  // Start animation loop
  animate();
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCursor);
} else {
  // DOM is already loaded
  initCursor();
}
