// GREEN CLOCK — Core JavaScript (Majestic Polish)

// Inject shared Navigation and Footer
const navbarHTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="logo-mark">
          <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="2"/>
          <line x1="18" y1="18" x2="18" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="logo-hand-h"/>
          <line x1="18" y1="18" x2="26" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="logo-hand-m"/>
          <path d="M 6 12 L 14 18 L 10 28" stroke="currentColor" stroke-width="1.5" fill="none" class="logo-crack" opacity="0"/>
        </svg>
        <span class="logo-text">GREEN CLOCK</span>
      </a>
      <div class="nav-links" id="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="news.html" class="nav-link">News</a>
        <a href="forum.html" class="nav-link">Community</a>
        <a href="feedback.html" class="nav-link">Challenges & Ideas</a>
      </div>
      <div class="nav-right">
        <div class="mode-toggle" id="mode-toggle">
          <span class="toggle-label" id="toggle-label">Utopia</span>
          <div class="toggle-track"><div class="toggle-thumb"></div></div>
        </div>
        <a href="forum.html" class="btn nav-cta">Join</a>
        <button class="hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
`;

const footerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-top reveal">
        <div class="footer-brand">
          <a href="index.html" class="nav-logo" style="margin-bottom: 1rem;">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" class="logo-mark">
              <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="2"/>
              <line x1="18" y1="18" x2="18" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18" y1="18" x2="26" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="logo-text">GREEN CLOCK</span>
          </a>
          <p class="footer-tagline">An initiative to rethink our economic model before it's too late.</p>
        </div>
        <div class="footer-nav">
          <div class="footer-col">
            <h4>Platform</h4>
            <a href="index.html">Home</a>
            <a href="news.html">News</a>
            <a href="forum.html">Community</a>
            <a href="feedback.html">Ideas</a>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <a href="article-doomsday.html">Doomsday Clock</a>
            <a href="#">IPCC Report</a>
            <a href="#">Circular Economy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom reveal reveal-delay-1">
        <p>&copy; 2026 Green Clock Initiative.</p>
        <p>Designed by Artificial & Human Intelligence</p>
      </div>
    </div>
  </footer>
`;

// Dynamic Script Loader for Lenis (Smooth Scroll)
function loadLenis(callback) {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js';
  script.onload = callback;
  document.head.appendChild(script);
}

// ─── Initialization ───
document.addEventListener('DOMContentLoaded', () => {
  // Inject Page Transition Overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Fade In Page
  setTimeout(() => document.body.classList.add('loaded'), 100);

  // Inject Nav & Footer
  const navSlot = document.getElementById('nav-slot');
  if (navSlot) navSlot.outerHTML = navbarHTML;
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  // Active Link State
  const currentPage = document.body.getAttribute('data-page') || 'home';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href').includes(currentPage)) {
      link.classList.add('active');
    }
    // Very naive check for home
    if (currentPage === 'home' && link.getAttribute('href') === 'index.html') {
      link.classList.add('active');
    }
  });

  // Smooth Page Transitions for Links
  document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('javascript')) {
        e.preventDefault();
        document.body.classList.remove('loaded');
        document.body.classList.add('is-leaving');
        setTimeout(() => { window.location.href = href; }, 800);
      }
    });
  });

  // State Management
  const body = document.body;
  const toggle = document.getElementById('mode-toggle');
  const toggleLabel = document.getElementById('toggle-label');
  
  const savedMode = localStorage.getItem('gc-mode');
  if (savedMode === 'dystopia') {
    body.classList.add('dystopia');
    if (toggleLabel) toggleLabel.textContent = 'Dystopia';
  } else {
    body.classList.add('utopia');
    if (toggleLabel) toggleLabel.textContent = 'Utopia';
  }

  // Toggle Logic
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isUtopia = body.classList.contains('utopia');
      body.classList.toggle('utopia', !isUtopia);
      body.classList.toggle('dystopia', isUtopia);
      
      const newMode = isUtopia ? 'dystopia' : 'utopia';
      localStorage.setItem('gc-mode', newMode);
      if (toggleLabel) toggleLabel.textContent = isUtopia ? 'Dystopia' : 'Utopia';
      
      animateNumbers();
    });
  }

  // Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Number Counter Animation
  function animateNumbers() {
    const isDystopia = body.classList.contains('dystopia');
    const stats = document.querySelectorAll('.stat-value span:first-child');
    
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute(isDystopia ? 'data-count-dystopia' : 'data-count-utopia'));
      const start = parseInt(stat.innerText) || 0;
      const duration = 1500;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const current = Math.floor(start + (target - start) * ease);
        stat.innerText = current;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.innerText = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Initialize smooth scrolling & reveal
  loadLenis(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    lenis.on('scroll', ({ scroll }) => {
      if (navbar) {
        if (scroll > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      }
    });

    // Intersection Observer for Cinematic Reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('stats-grid')) {
            animateNumbers();
          }
          // observer.unobserve(entry.target); // keep observing if we want it to trigger again, but usually one-time is better for performance. We'll unobserve to keep it majestic.
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });

    document.querySelectorAll('.reveal, .stats-grid, .cycle-visual, .news-card, .pillar').forEach(el => {
      // Add base reveal class if missing
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      observer.observe(el);
    });
  });
});
