// Hero portrait 
const HERO_PROFILE = {
  src: '',
  alt: 'Mohamed Dali Braham',
};

// Projects carousel data 
const PROJECTS_DATA = [
  {
    badges: [{ variant: 'prod', label: 'Production' }, { variant: 'lead', label: 'Team Lead' }],
    title: 'DataHack 2026 — Organizer Platform',
    description:
      'Led 4 backend developers end-to-end: data model, API contracts, code reviews, and architectural standards. Built a QR-based multi-checkpoint check-in system for real-time participant tracking. Deployed and monitored on CPanel — on call during the live event, zero critical failures.',
    stack: ['FastAPI', 'PostgreSQL', 'QR Codes', 'React', 'CPanel'],
    github: 'https://github.com/Dali-MDB',
  },
  {
    badges: [{ variant: 'lead', label: 'Team Lead' }],
    title: 'Traveleo — Travel Agency Platform',
    description:
      'Led backend architecture for a full booking platform. APIs optimized to sub-200ms via indexing, query tuning, and Redis caching. Real-time messaging via Django Channels. Hybrid recommendation system (content-based + collaborative filtering).',
    stack: ['DRF', 'Next.js', 'PostgreSQL', 'Redis', 'Celery', 'Django Channels'],
    github: 'https://github.com/Dali-MDB/Escapeo',
  },
  {
    badges: [{ variant: 'arch', label: 'Architecture' }],
    title: 'Melio Insurance SaaS',
    description:
      'Multi-tenant SaaS backend — full PostgreSQL schema isolation per tenant with domain-based routing. 10-stage claim lifecycle enforced as a validated state machine. RBAC across 6 roles with granular per-endpoint permission classes. Includes policy renewal and global admin layer for tenant onboarding.',
    stack: ['DRF', 'django-tenants', 'PostgreSQL', 'JWT', 'RBAC'],
    github: 'https://github.com/Dali-MDB/melio-insurance-saas',
  },
  {
    badges: [{ variant: 'ai', label: 'AI · Multi-agent' }],
    title: 'Code Review Agent Swarm',
    description:
      'Multi-agent pipeline for automated code review on Python repositories. Three independent LangGraph agents — analyzer, fixer, and judge — share a common state and form an end-to-end reasoning loop: detect issues, generate fixes, validate output. No human in the loop.',
    stack: ['LangGraph', 'OpenRouter', 'Python'],
    github: 'https://github.com/Dali-MDB',
  },
  {
    badges: [{ variant: 'arch', label: 'Architecture' }],
    title: 'Socmel — Social Platform Backend',
    description:
      "Reverse-engineered Instagram's feed logic and Discord's channel architecture to understand production-grade system design from the inside. Real-time DMs, group chats, and server-channel routing via WebSockets. Rate limiting, response caching, background task processing.",
    stack: ['FastAPI', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/Dali-MDB/socmel',
  },
  {
    badges: [{ variant: 'ai', label: 'AI Pipeline' }],
    title: 'Melio InkSmart — AI Publishing',
    description:
      'Async NLP pipeline triggered on article publish: Celery workers run HuggingFace models outside the request cycle to generate summaries and semantic tags automatically. Redis caching and rate limiting stabilize inference throughput under traffic spikes.',
    stack: ['DRF', 'Celery', 'Redis', 'HuggingFace', 'PostgreSQL'],
    github: 'https://github.com/Dali-MDB',
  },
  {
    badges: [{ variant: 'prod', label: 'Production' }],
    title: 'DataHack 2026 — Registration',
    description:
      "Registration backend for ESI's largest data science event. Team formation, member validation, random assignment, and edge case handling. Stayed on call during the live event under real traffic — the system held.",
    stack: ['Express.js', 'MongoDB'],
    github: 'https://github.com/Dali-MDB',
  },
  {
    badges: [{ variant: 'ai', label: 'NLP Tool' }],
    title: 'Resume Ranker',
    description:
      'FastAPI service that extracts text from PDF resumes and scores them against job descriptions using NLP similarity. Returns match scores and targeted suggestions based on missing keywords. Built with spaCy and sentence-transformers for semantic matching.',
    stack: ['FastAPI', 'spaCy', 'sentence-transformers', 'PyMuPDF'],
    github: 'https://github.com/Dali-MDB/resume_ranker',
  },
];

const GITHUB_ICON_SVG =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

function renderProjectCards(container) {
  if (!container) return;
  container.innerHTML = '';
  PROJECTS_DATA.forEach((project, index) => {
    container.appendChild(buildProjectCard(project, index));
  });
}

function buildProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card';

  const glow = document.createElement('div');
  glow.className = 'project-glow';
  card.appendChild(glow);

  const num = document.createElement('div');
  num.className = 'project-num';
  num.textContent = String(index + 1).padStart(2, '0');
  card.appendChild(num);

  if (project.badges?.length) {
    const badges = document.createElement('div');
    badges.className = 'project-badges';
    project.badges.forEach((b) => {
      const span = document.createElement('span');
      span.className = `badge badge-${b.variant}`;
      span.textContent = b.label;
      badges.appendChild(span);
    });
    card.appendChild(badges);
  }

  const title = document.createElement('div');
  title.className = 'project-title';
  title.textContent = project.title;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'project-desc';
  desc.textContent = project.description;
  card.appendChild(desc);

  const stack = document.createElement('div');
  stack.className = 'project-stack';
  (project.stack || []).forEach((chip) => {
    const s = document.createElement('span');
    s.className = 'stack-chip';
    s.textContent = chip;
    stack.appendChild(s);
  });
  card.appendChild(stack);

  const link = document.createElement('a');
  link.href = project.github;
  link.className = 'project-link';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = `View on GitHub ${GITHUB_ICON_SVG}`;
  card.appendChild(link);

  return card;
}

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

const cursorHooked = new WeakSet();

function bindCursorHover(el) {
  if (!cursor || !ring || cursorHooked.has(el)) return;
  cursorHooked.add(el);
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
}

function hookCursorTargets(root) {
  if (!root) return;
  root.querySelectorAll('a, button, .project-card').forEach((el) => bindCursorHover(el));
}

if (cursor && ring) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
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
}

hookCursorTargets(document.body);

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

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
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  }

  burger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Ambient glow follows mouse slowly
const a1 = document.querySelector('.ambient-1');
if (a1) {
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    a1.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
  });
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentEl = document.getElementById('carouselCurrent');
  const totalEl = document.getElementById('carouselTotal');
  const progressEl = document.getElementById('carouselProgress');

  if (!track || !prevBtn || !nextBtn || !currentEl || !totalEl || !progressEl) return;

  const cards = track.querySelectorAll('.project-card');
  if (!cards.length) return;

  progressEl.innerHTML = '';

  const total = cards.length;
  totalEl.textContent = String(total).padStart(2, '0');

  const dots = [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dots.push(dot);
    progressEl.appendChild(dot);
  }

  function getCardWidth() {
    if (cards.length < 2) return cards[0].offsetWidth;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  function scrollToCard(index) {
    const cardWidth = getCardWidth();
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  }

  function updateState() {
    const cardWidth = getCardWidth();
    const rawIndex = track.scrollLeft / cardWidth;
    const index = Math.floor(rawIndex + 0.3);
    const clamped = Math.max(0, Math.min(total - 1, index));

    currentEl.textContent = String(clamped + 1).padStart(2, '0');
    dots.forEach((d, i) => d.classList.toggle('active', i === clamped));

    const visibleCount = Math.max(1, Math.floor(track.clientWidth / cardWidth));
    const maxIndex = Math.max(0, total - visibleCount);

    prevBtn.disabled = clamped <= 0 && track.scrollLeft <= 4;
    nextBtn.disabled = clamped >= maxIndex && track.scrollLeft >= cardWidth * maxIndex - 4;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToCard(i));
  });

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

  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  setTimeout(updateState, 100);
}

function initHeroProfile() {
  const img = document.getElementById('heroProfileImg');
  if (!img) return;
  const fromJs = typeof HERO_PROFILE.src === 'string' ? HERO_PROFILE.src.trim() : '';
  const fromHtml = img.getAttribute('src') || '';
  img.alt = HERO_PROFILE.alt || img.alt || '';
  img.src = fromJs || fromHtml || './images/my_placeholder.png';
  img.onerror = function () {
    this.onerror = null;
    this.src = './images/my_placeholder.png';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroProfile();

  const track = document.getElementById('carouselTrack');
  renderProjectCards(track);
  hookCursorTargets(track);
  initCarousel();
});
