import React, { useEffect, useRef } from 'react';

export default function AntigravitySwarm() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A142F4'];
    const particles = [];
    const particleCount = Math.min(window.innerWidth > 768 ? 1500 : 800, 2000);

    let mouse = { x: width / 2, y: height / 2 };
    let isMouseMoving = false;
    let mouseTimeout;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.angle = Math.atan2(this.vy, this.vx);
        this.speed = Math.random() * 0.5 + 0.2;
        this.friction = 0.95;
      }

      update() {
        // Calculate distance to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Magnetic attraction/swirl effect
        if (distance < 400 && isMouseMoving) {
          // Calculate force (stronger closer to mouse)
          const force = (400 - distance) / 400;
          
          // Calculate tangent angle for swirling
          const angleToMouse = Math.atan2(dy, dx);
          const swirlAngle = angleToMouse + (Math.PI / 2); // 90 degrees offset

          // Apply forces
          this.vx += (Math.cos(angleToMouse) * force * 0.5) + (Math.cos(swirlAngle) * force * 1.2);
          this.vy += (Math.sin(angleToMouse) * force * 0.5) + (Math.sin(swirlAngle) * force * 1.2);
        }

        // Apply friction to slow down over time
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Base wander movement
        this.x += this.vx + Math.cos(this.angle) * this.speed;
        this.y += this.vy + Math.sin(this.angle) * this.speed;

        // Update orientation based on velocity
        if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) {
          this.angle = Math.atan2(this.vy, this.vx);
        } else {
          // Slowly wander randomly if still
          this.angle += (Math.random() - 0.5) * 0.1;
        }

        // Wrap around screen
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.beginPath();
        // Draw a dash instead of a dot
        ctx.moveTo(-this.size * 2, 0);
        ctx.lineTo(this.size * 2, 0);
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      
      isMouseMoving = true;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background vignette
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
      gradient.addColorStop(0, '#f8f9fa'); // light center
      gradient.addColorStop(1, '#e8f0fe'); // subtle blue tint on edges
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: 'none' }}
      />
      {/* Intense Edge Glow Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(66, 133, 244, 0.4)'
        }}
      />
    </>
  );
}
