// --- HTML5 Canvas Confetti Celebrator ---
export const Confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,
  init() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.removeEventListener('resize', this.resizeBound);
    this.resizeBound = () => this.resize();
    window.addEventListener('resize', this.resizeBound);
  },
  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },
  spawn(count = 80) {
    this.init();
    if (!this.ctx) return;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
    const colors = ['#a855f7', '#6366f1', '#06b6d4', '#10b981', '#f43f5e', '#facc15'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -this.canvas.height - 20,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3,
        opacity: 1
      });
    }
    this.loop();
  },
  loop() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;
    
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      
      if (p.y > this.canvas.height - 20) {
        p.opacity -= 0.015;
      }
      
      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    
    if (active) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};