/**
 * ParticleSystem.js
 * High-performance 2D Canvas Particle Engine optimized for iPhone mobile GPUs.
 * Features ambient twinkling stars, glowing cyan particles, interactive tap bursts,
 * and dynamic light stream transitions.
 */

window.ParticleSystem = class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.streamParticles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.mode = 'ambient';
    
    this.theme = 'navy-cyan';
    
    this.cyanColors = [
      'rgba(0, 242, 254, ',
      'rgba(112, 228, 239, ',
      'rgba(230, 230, 250, ',
      'rgba(255, 255, 255, '
    ];

    this.warmColors = [
      'rgba(248, 200, 220, ',
      'rgba(232, 141, 155, ',
      'rgba(255, 218, 185, ',
      'rgba(247, 231, 206, ',
      'rgba(255, 255, 255, '
    ];

    this.dreamyColors = [
      'rgba(255, 223, 128, ',
      'rgba(230, 230, 250, ',
      'rgba(180, 160, 235, ',
      'rgba(255, 248, 231, '
    ];

    this.midnightColors = [
      'rgba(255, 215, 0, ',
      'rgba(230, 230, 250, ',
      'rgba(255, 255, 255, ',
      'rgba(180, 160, 235, '
    ];

    this.colors = this.cyanColors;
    this.init();
  }

  setTheme(themeName) {
    this.theme = themeName;
    document.body.classList.remove('theme-birthday-warm', 'theme-dreamy-night', 'theme-midnight-constellation', 'theme-cake-playful', 'theme-arcade-cozy', 'theme-sunset-cinematic', 'theme-memory-universe');
    if (themeName === 'birthday-warm') {
      this.colors = this.warmColors;
      document.body.classList.add('theme-birthday-warm');
    } else if (themeName === 'dreamy-night') {
      this.colors = this.dreamyColors;
      document.body.classList.add('theme-dreamy-night');
    } else if (themeName === 'midnight-constellation') {
      this.colors = this.midnightColors;
      document.body.classList.add('theme-midnight-constellation');
    } else if (themeName === 'cake-playful') {
      this.colors = [
        'rgba(255, 182, 193, ',
        'rgba(255, 253, 208, ',
        'rgba(230, 230, 250, ',
        'rgba(255, 133, 162, ',
        'rgba(255, 255, 255, '
      ];
      document.body.classList.add('theme-cake-playful');
    } else if (themeName === 'arcade-cozy') {
      this.colors = [
        'rgba(168, 85, 247, ',
        'rgba(56, 189, 248, ',
        'rgba(250, 204, 21, ',
        'rgba(244, 114, 182, ',
        'rgba(255, 255, 255, '
      ];
      document.body.classList.add('theme-arcade-cozy');
    } else if (themeName === 'sunset-cinematic') {
      this.colors = [
        'rgba(248, 200, 220, ',
        'rgba(232, 141, 155, ',
        'rgba(255, 218, 185, ',
        'rgba(230, 230, 250, ',
        'rgba(247, 231, 206, ',
        'rgba(255, 255, 255, '
      ];
      document.body.classList.add('theme-sunset-cinematic');
    } else if (themeName === 'memory-universe') {
      this.colors = [
        'rgba(255, 215, 0, ',
        'rgba(248, 200, 220, ',
        'rgba(255, 255, 255, ',
        'rgba(230, 230, 250, ',
        'rgba(212, 175, 55, '
      ];
      document.body.classList.add('theme-memory-universe');
    } else {
      this.colors = this.cyanColors;
    }
    this.createAmbientParticles(60);
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.createAmbientParticles(60);
    this.animate();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  createAmbientParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.generateParticle());
    }
  }

  generateParticle() {
    const baseColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: baseColor
    };
  }

  triggerBurst(x, y, count = 30, colorOverride = null) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const baseColor = colorOverride || this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push({
        x: x,
        y: y,
        radius: Math.random() * 3.5 + 1,
        alpha: 1,
        baseAlpha: 1,
        twinkleSpeed: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        friction: 0.95,
        color: baseColor,
        isBurst: true
      });
    }
  }

  triggerFireworks(durationMs = 5000) {
    const festiveColors = [
      'rgba(248, 200, 220, ',
      'rgba(255, 215, 0, ',
      'rgba(255, 133, 162, ',
      'rgba(230, 230, 250, ',
      'rgba(255, 182, 193, ',
      'rgba(255, 255, 255, '
    ];
    
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 250;
      const launchX = Math.random() * (this.width * 0.8) + (this.width * 0.1);
      const launchY = Math.random() * (this.height * 0.5) + (this.height * 0.15);
      const color = festiveColors[Math.floor(Math.random() * festiveColors.length)];
      this.triggerBurst(launchX, launchY, 45, color);

      if (elapsed >= durationMs) {
        clearInterval(interval);
      }
    }, 250);
  }

  triggerCyanStream(durationMs = 2500) {
    this.mode = 'stream';
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.streamParticles = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(this.width, this.height) * 0.6 + 100;
      this.streamParticles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        targetX: centerX,
        targetY: centerY,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.02,
        color: 'rgba(0, 242, 254, '
      });
    }

    setTimeout(() => {
      this.mode = 'ambient';
      this.streamParticles = [];
    }, durationMs);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (!p.isBurst) {
        p.alpha += p.twinkleSpeed;
        if (p.alpha > 0.95 || p.alpha < 0.15) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + Math.max(0, p.alpha) + ')';
      this.ctx.shadowBlur = p.isBurst ? 12 : 6;
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.fill();
    }

    if (this.mode === 'stream') {
      for (let i = 0; i < this.streamParticles.length; i++) {
        const sp = this.streamParticles[i];
        sp.x += (sp.targetX - sp.x) * sp.speed;
        sp.y += (sp.targetY - sp.y) * sp.speed;

        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = sp.color + sp.alpha + ')';
        this.ctx.shadowBlur = 16;
        this.ctx.shadowColor = '#00f2fe';
        this.ctx.fill();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
};
