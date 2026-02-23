(() => {
  const body = document.body;
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Active nav state
  const page = body.dataset.page;
  if (page) {
    document.querySelectorAll('.site-nav a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if ((page === 'home' && href === 'index.html') || href.includes(`${page}.html`)) {
        a.classList.add('active');
      }
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = old || 'Copy';
          btn.classList.remove('copied');
        }, 1400);
      } catch {
        btn.textContent = 'Copy failed';
      }
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Animated background canvas
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particles = Array.from({ length: 42 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    r: Math.random() * 2.4 + 0.5,
  }));

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  const loop = () => {
    t += 0.005;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(w * 0.2, h * 0.15, 0, w * 0.2, h * 0.15, Math.max(w, h));
    g.addColorStop(0, 'rgba(99,102,241,0.18)');
    g.addColorStop(0.45, 'rgba(16,185,129,0.07)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    particles.forEach((p, i) => {
      p.x += p.vx + Math.sin(t + i) * 0.00008;
      p.y += p.vy + Math.cos(t + i * 0.7) * 0.00008;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
      const x = p.x * w;
      const y = p.y * h;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = x - q.x * w;
        const dy = y - q.y * h;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(129,140,248,${0.12 * (1 - dist / 160)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(q.x * w, q.y * h);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
