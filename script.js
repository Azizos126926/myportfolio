const body = document.body;
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-card");
const reveals = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "classic") {
  body.classList.add("classic");
}

function updateThemeButtonLabel() {
  themeToggle.textContent = body.classList.contains("classic") ? "Modern" : "Classic";
}

updateThemeButtonLabel();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("classic");
  localStorage.setItem("theme", body.classList.contains("classic") ? "classic" : "modern");
  updateThemeButtonLabel();
  resizeCanvas();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    projects.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden-project", !show);
    });
  });
});

if (reducedMotion) {
  reveals.forEach((el) => el.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
}

let particles = [];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = body.classList.contains("classic") ? 0 : Math.max(10, Math.floor(window.innerWidth / 140));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.4 + 0.5,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
  }));
}

function drawBackground() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!body.classList.contains("classic")) {
    const gradient = ctx.createRadialGradient(
      window.innerWidth * 0.15,
      window.innerHeight * 0.08,
      0,
      window.innerWidth * 0.15,
      window.innerHeight * 0.08,
      window.innerWidth * 0.92
    );

    gradient.addColorStop(0, "rgba(242, 104, 58, 0.08)");
    gradient.addColorStop(1, "rgba(14, 20, 27, 0)");

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
      ctx.fillStyle = "rgba(255, 196, 134, 0.1)";
      ctx.fill();
    }
  }

  if (!reducedMotion) {
    requestAnimationFrame(drawBackground);
  }
}

resizeCanvas();
drawBackground();
window.addEventListener("resize", resizeCanvas);
