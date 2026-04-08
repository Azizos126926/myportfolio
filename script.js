const body = document.body;
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');
const reveals = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const savedTheme = localStorage.getItem('portfolio-theme');
const initialTheme = savedTheme === 'vintage' ? 'vintage' : 'modern';
body.dataset.theme = initialTheme;

function updateThemeButtonLabel() {
  const isVintage = body.dataset.theme === 'vintage';
  themeToggle.textContent = isVintage ? 'Modern mode' : 'Vintage mode';
  themeToggle.setAttribute('aria-pressed', String(isVintage));
}

updateThemeButtonLabel();

themeToggle.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'vintage' ? 'modern' : 'vintage';
  localStorage.setItem('portfolio-theme', body.dataset.theme);
  updateThemeButtonLabel();
  if (reducedMotion) drawBackground();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    projects.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden-project', !show);
    });
  });
});

if (reducedMotion) {
  reveals.forEach((el) => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
}

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const count = Math.max(10, Math.floor(window.innerWidth / 140));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.4 + 0.5,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
  }));
}

function palette() {
  if (body.dataset.theme === 'vintage') {
    return {
      gradient0: 'rgba(165, 93, 42, 0.12)',
      gradient1: 'rgba(239, 230, 212, 0)',
      particle: 'rgba(123, 73, 38, 0.12)',
    };
  }
  return {
    gradient0: 'rgba(47, 109, 246, 0.08)',
    gradient1: 'rgba(10, 18, 32, 0)',
    particle: 'rgba(115, 166, 255, 0.12)',
  };
}

function drawBackground() {
  const colors = palette();
  const gradient = ctx.createRadialGradient(
    window.innerWidth * 0.15,
    window.innerHeight * 0.08,
    0,
    window.innerWidth * 0.15,
    window.innerHeight * 0.08,
    window.innerWidth * 0.92
  );

  gradient.addColorStop(0, colors.gradient0);
  gradient.addColorStop(1, colors.gradient1);

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = window.innerHeight + 10;
    if (p.y > window.innerHeight + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = colors.particle;
    ctx.fill();
  }

  if (!reducedMotion) requestAnimationFrame(drawBackground);
}

resizeCanvas();
drawBackground();
window.addEventListener('resize', resizeCanvas);
