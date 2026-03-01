(() => {
  'use strict';

  /* ── Mobile nav ───────────────────────────────────────────────────── */
  const nav    = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active nav link ──────────────────────────────────────────────── */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.site-nav a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (
        (page === 'home' && href === 'index.html') ||
        (page !== 'home' && href.includes(`${page}.html`))
      ) {
        a.classList.add('active');
      }
    });
  }

  /* ── Copy buttons ─────────────────────────────────────────────────── */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = prev;
          btn.classList.remove('copied');
        }, 1600);
      } catch {
        btn.textContent = 'Copy failed';
      }
    });
  });

  /* ── Scroll reveal ────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── Waitlist form ────────────────────────────────────────────────── */
  const form   = document.getElementById('waitlist-form');
  const submit = document.getElementById('waitlist-submit');
  const email  = document.getElementById('waitlist-email');

  if (form && submit && email) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submit.textContent = "You're on the list ✓";
      submit.disabled = true;
      email.disabled  = true;
      submit.style.background   = '#1a7f45';
      submit.style.boxShadow    = '0 4px 16px rgba(26,127,69,.3)';
      submit.style.borderColor  = 'transparent';
    });
  }

  /* ── Ambient canvas (very subtle on light pages) ──────────────────── */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Soft floating orbs — Apple-style ambient gradient, very subtle on white
  const orbs = [
    { x: 0.15, y: 0.0,  vx:  0.00015, vy: 0.00010, r: 0.52, color: 'rgba(94,92,230,.055)'  },
    { x: 0.80, y: 0.25, vx: -0.00012, vy: 0.00008,  r: 0.40, color: 'rgba(139,92,246,.04)' },
    { x: 0.50, y: 0.80, vx:  0.00010, vy: -0.00012, r: 0.45, color: 'rgba(52,199,89,.04)'  },
  ];

  let t = 0;
  const loop = () => {
    t += 1;
    ctx.clearRect(0, 0, W, H);

    orbs.forEach((orb, i) => {
      orb.x += orb.vx + Math.sin(t * 0.004 + i) * 0.00005;
      orb.y += orb.vy + Math.cos(t * 0.003 + i * 0.7) * 0.00005;
      // soft bounce
      if (orb.x < -0.1) orb.vx =  Math.abs(orb.vx);
      if (orb.x >  1.1) orb.vx = -Math.abs(orb.vx);
      if (orb.y < -0.1) orb.vy =  Math.abs(orb.vy);
      if (orb.y >  1.1) orb.vy = -Math.abs(orb.vy);

      const cx = orb.x * W;
      const cy = orb.y * H;
      const rd = orb.r * Math.max(W, H);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rd);
      g.addColorStop(0,   orb.color);
      g.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, '0.015)'));
      g.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
