// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 4 + 'px';
  cursor.style.top = my - 4 + 'px';
});
function animateRing() {
  rx += (mx - rx - 16) * 0.18;
  ry += (my - ry - 16) * 0.18;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.5)';
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.borderColor = 'rgba(26,108,255,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(26,108,255,0.4)';
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile menu drawer
(function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');

  if (!burger || !menu || !backdrop) return;

  function openMenu() {
    burger.classList.add('open');
    menu.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
  function toggleMenu() {
    if (menu.classList.contains('open')) closeMenu(); else openMenu();
  }

  burger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on link click
  menu.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Ambient glow follows mouse slowly
const a1 = document.querySelector('.ambient-1');
document.addEventListener('mousemove', e => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  a1.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
});

// ============== CAROUSEL ==============
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentEl = document.getElementById('carouselCurrent');
  const totalEl = document.getElementById('carouselTotal');
  const progressEl = document.getElementById('carouselProgress');

  if (!track || !prevBtn || !nextBtn || !currentEl || !totalEl || !progressEl) return;

  const cards = track.querySelectorAll('.project-card');
  if (!cards.length) return;

  const total = cards.length;
  totalEl.textContent = String(total).padStart(2, '0');

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    progressEl.appendChild(dot);
  }
  const dots = progressEl.querySelectorAll('.carousel-dot');

  function getCardWidth() {
    if (cards.length < 2) return cards[0].offsetWidth;
    // Use distance between card 0 and card 1 (covers gap precisely)
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  function scrollToCard(index) {
    const cardWidth = getCardWidth();
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  }

  function updateState() {
    const cardWidth = getCardWidth();
    // Bias the threshold: flip to next card after ~30% scrolled, not 50%.
    // This makes the counter/dots feel responsive during the swipe.
    const rawIndex = track.scrollLeft / cardWidth;
    const index = Math.floor(rawIndex + 0.3);
    const clamped = Math.max(0, Math.min(total - 1, index));

    currentEl.textContent = String(clamped + 1).padStart(2, '0');
    dots.forEach((d, i) => d.classList.toggle('active', i === clamped));

    // Visible-card count for disabling next button correctly
    const visibleCount = Math.max(1, Math.floor(track.clientWidth / cardWidth));
    const maxIndex = Math.max(0, total - visibleCount);

    prevBtn.disabled = clamped <= 0 && track.scrollLeft <= 4;
    nextBtn.disabled = clamped >= maxIndex && track.scrollLeft >= (cardWidth * maxIndex) - 4;
  }

  prevBtn.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    const currentIndex = Math.round(track.scrollLeft / cardWidth);
    scrollToCard(Math.max(0, currentIndex - 1));
  });

  nextBtn.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    const currentIndex = Math.round(track.scrollLeft / cardWidth);
    scrollToCard(Math.min(total - 1, currentIndex + 1));
  });

  let rafId = null;
  track.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      updateState();
      rafId = null;
    });
  });

  window.addEventListener('resize', updateState);

  // Keyboard navigation when carousel is hovered/focused
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn.click(); }
  });

  // Initial state
  setTimeout(updateState, 100);
})();