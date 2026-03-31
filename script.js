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
revelsSafeObserve();
function revelsSafeObserve() {
  reveals.forEach(el => observer.observe(el));
}

let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.max(18, Math.floor(window.innerWidth / 70));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.4 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }));
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    window.innerWidth * 0.5, 0, 0,
    window.innerWidth * 0.5, 0, window.innerWidth * 0.85
  );
  if (body.classList.contains('light')) {
    gradient.addColorStop(0, 'rgba(60,99,255,0.05)');
    gradient.addColorStop(1, 'rgba(243,247,255,0)');
  } else {
    gradient.addColorStop(0, 'rgba(124,156,255,0.05)');
    gradient.addColorStop(1, 'rgba(7,17,31,0)');
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = window.innerHeight + 10;
    if (p.y > window.innerHeight + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = body.classList.contains('light') ? 'rgba(60,99,255,0.08)' : 'rgba(124,156,255,0.12)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.hypot(dx, dy);
      if (d < 80) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = body.classList.contains('light')
          ? `rgba(60,99,255,${0.03 - d / 4000})`
          : `rgba(124,156,255,${0.05 - d / 2500})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBackground);
}

resizeCanvas();
drawBackground();
window.addEventListener('resize', resizeCanvas);
