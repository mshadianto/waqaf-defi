/*═══════════════════════════════════════════════════════════════
  WaqFi — Scroll Observers & Navigation
═══════════════════════════════════════════════════════════════*/

// ── Reveal-on-scroll (IntersectionObserver) ──
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  );

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
}

// ── Topbar scroll effect ──
export function initTopbarScroll() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Smooth nav scroll + active state ──
export function initNavigation() {
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      const target = a.getAttribute('href')?.slice(1);
      if (target) {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── Scroll to section helper ──
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
