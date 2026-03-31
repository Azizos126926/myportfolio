const body = document.body;
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');
const reveals = document.querySelectorAll('.reveal');

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || (!savedTheme && prefersLight)) body.classList.add('light');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projects.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden-project', !show);
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.max(10, Math.floor(window.innerWidth / 130));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 0.6,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
  }));
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    window.innerWidth * 0.1, 0, 0,
    window.innerWidth * 0.1, 0, window.innerWidth * 0.9
  );

  if (body.classList.contains('light')) {
    gradient.addColorStop(0, 'rgba(53,94,246,0.035)');
    gradient.addColorStop(1, 'rgba(244,247,252,0)');
  } else {
    gradient.addColorStop(0, 'rgba(132,163,255,0.045)');
    gradient.addColorStop(1, 'rgba(11,18,32,0)');
  }

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
    ctx.fillStyle = body.classList.contains('light')
      ? 'rgba(53,94,246,0.055)'
      : 'rgba(132,163,255,0.08)';
    ctx.fill();
  }

  requestAnimationFrame(drawBackground);
}

resizeCanvas();
drawBackground();
window.addEventListener('resize', resizeCanvas);
