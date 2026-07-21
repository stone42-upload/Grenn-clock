/* ═══════════════════════════════════════════════════════════
   GREEN CLOCK — Premium Interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggle = document.getElementById('mode-toggle');
  const toggleLabel = document.getElementById('toggle-label');
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const particles = document.getElementById('hero-particles');

  let mode = localStorage.getItem('gc-mode') || 'utopia';
  let particleTimer = null;

  // ─── Mode ───────────────────────────────────────────────
  function setMode(m) {
    mode = m;
    body.classList.remove('utopia', 'dystopia');
    body.classList.add(m);
    toggleLabel.textContent = m === 'utopia' ? 'Utopie' : 'Dystopie';
    localStorage.setItem('gc-mode', m);
    resetParticles();
  }

  function flipMode() {
    setMode(mode === 'utopia' ? 'dystopia' : 'utopia');
  }

  toggle.addEventListener('click', flipMode);
  toggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipMode(); }
  });

  setMode(mode);

  // ─── Particles ──────────────────────────────────────────
  function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 3 + 1.5;
    const dur = Math.random() * 10 + 8;
    const delay = Math.random() * 4;
    Object.assign(p.style, {
      width: s + 'px',
      height: s + 'px',
      left: Math.random() * 100 + '%',
      animationDuration: dur + 's',
      animationDelay: delay + 's',
    });
    particles.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000);
  }

  function resetParticles() {
    clearInterval(particleTimer);
    particles.innerHTML = '';
    for (let i = 0; i < 12; i++) setTimeout(spawnParticle, i * 150);
    particleTimer = setInterval(() => {
      if (particles.childElementCount < 20) spawnParticle();
    }, 1000);
  }

  resetParticles();

  // ─── Navbar ─────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ─── Hamburger ──────────────────────────────────────────
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ─── Scroll Reveal ─────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.section-header, .pillar, .stat, .cycle-visual, .cta-content'
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('pillar') || el.classList.contains('stat')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.classList.add('reveal-delay-' + (idx + 1));
    }
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (entry.target.classList.contains('stat')) {
          animateCounters(entry.target);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation ─────────────────────────────────
  function animateCounters(card) {
    card.querySelectorAll('[data-count-utopia], [data-count-dystopia]').forEach(el => {
      const target = parseInt(el.dataset.countUtopia || el.dataset.countDystopia);
      if (isNaN(target)) return;
      const start = performance.now();
      const dur = 1800;
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * ease);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  // ─── Smooth Scroll ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16,
          behavior: 'smooth',
        });
      }
    });
  });

  // ─── Cycle Nodes Stagger ───────────────────────────────
  const nodes = document.querySelectorAll('.cycle-node');
  nodes.forEach((n, i) => {
    n.style.cssText = `opacity:0;transform:scale(0.85);transition:opacity 0.6s ease ${i * 0.12}s,transform 0.6s ease ${i * 0.12}s`;
  });

  const cycleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nodes.forEach(n => { n.style.opacity = '1'; n.style.transform = 'scale(1)'; });
      }
    });
  }, { threshold: 0.25 });

  const diagram = document.getElementById('cycle-diagram');
  if (diagram) cycleObs.observe(diagram);

  // ─── Keyboard shortcut ─────────────────────────────────
  document.addEventListener('keydown', e => {
    if ((e.key === 't' || e.key === 'T') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      flipMode();
    }
  });
});
