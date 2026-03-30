from pathlib import Path
import re

style_file = Path("style.css")
index_file = Path("index.html")

if not style_file.exists():
    raise FileNotFoundError("style.css not found")

css = style_file.read_text(encoding="utf-8")

# 1) Remove the playful refresh block if it exists
css = re.sub(
    r"/\* === playful refresh === \*/.*?(?=@media|\Z)",
    "",
    css,
    flags=re.DOTALL
)

# 2) Add a calmer visual system
calm_css = """

/* === calm readability refresh === */
:root {
  --bg: #f5f7fb;
  --bg-soft: #eef2f8;
  --surface: rgba(255, 255, 255, 0.78);
  --surface-strong: rgba(255, 255, 255, 0.9);
  --text: #0f172a;
  --text-soft: #475569;
  --border: rgba(15, 23, 42, 0.08);
  --accent: #2563eb;
  --accent-soft: #dbeafe;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  background: linear-gradient(180deg, #f7f9fc 0%, #edf2f8 100%);
  color: var(--text);
}

/* remove decorative glow */
body::before,
body::after {
  content: none !important;
}

.site-header,
header {
  background: rgba(255, 255, 255, 0.72);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* calmer cards */
.glass-card,
.card,
.project-card,
.experience-card,
.skills-shell,
.quick-facts div {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* remove glossy overlay */
.glass-card::after,
.card::after,
.project-card::after,
.experience-card::after,
.skills-shell::after,
.quick-facts div::after {
  content: none !important;
}

/* softer hover */
.project-card:hover,
.card:hover,
.glass-card:hover,
.experience-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.10);
}

/* buttons */
.primary-btn,
.btn-primary,
button.primary {
  background: var(--text);
  color: white;
  border: none;
  box-shadow: none;
}

.primary-btn:hover,
.btn-primary:hover,
button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
}

/* chips and tags */
.badge,
.tag,
.filter-chip,
.chip {
  background: #eff4fb;
  color: #334155;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.filter-chip.active,
.chip.active {
  background: #e0ecff;
  color: #1d4ed8;
  border-color: rgba(37, 99, 235, 0.18);
}

/* text readability */
p,
li,
.text-muted,
.muted {
  color: var(--text-soft);
  line-height: 1.75;
}

h1, h2, h3, h4 {
  color: var(--text);
  letter-spacing: -0.02em;
}

/* hero readability */
.hero,
.hero-section {
  padding-top: 4rem;
  padding-bottom: 3rem;
}

.hero h1,
.hero-title {
  font-size: clamp(3.1rem, 8vw, 6.2rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
  max-width: 11ch;
  color: var(--text);
}

/* remove flashy gradient text */
.hero h1 span,
.hero-title span {
  background: none !important;
  color: var(--accent) !important;
  -webkit-background-clip: initial !important;
  background-clip: initial !important;
}

.hero p,
.hero-subtitle {
  max-width: 62ch;
  font-size: 1.08rem;
  line-height: 1.8;
  color: var(--text-soft);
}

/* make the side intro card calmer */
.hero .glass-card,
.hero .card,
.hero aside {
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(15, 23, 42, 0.07);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

/* section spacing */
section {
  scroll-margin-top: 90px;
}

.section-heading,
.section-title {
  margin-bottom: 0.5rem;
}

.section-subtitle,
.section-lead {
  color: var(--text-soft);
  max-width: 60ch;
}

/* nav readability */
nav a,
.nav-link {
  color: #334155;
}

nav a:hover,
.nav-link:hover {
  color: var(--text);
}

/* constrain overlarge hero blocks on desktop */
@media (min-width: 1100px) {
  .hero-grid,
  .hero-content {
    align-items: start;
    gap: 2.5rem;
  }

  .hero h1,
  .hero-title {
    max-width: 9ch;
  }
}

/* mobile improvements */
@media (max-width: 768px) {
  .hero h1,
  .hero-title {
    font-size: clamp(2.7rem, 13vw, 4.4rem);
    line-height: 0.98;
    max-width: 100%;
  }

  .hero p,
  .hero-subtitle {
    font-size: 1rem;
    line-height: 1.7;
  }
}
"""

if "/* === calm readability refresh === */" not in css:
    css += "\n" + calm_css
else:
    css = re.sub(
        r"/\* === calm readability refresh === \*/.*",
        calm_css,
        css,
        flags=re.DOTALL
    )

style_file.write_text(css, encoding="utf-8")
print("Updated style.css")

# Optional: soften one phrase in the hero card if it exists
if index_file.exists():
    html = index_file.read_text(encoding="utf-8")

    replacements = {
        "Drawn to ambitious ML": "Interested in thoughtful ML",
        "Open to ML Engineering roles": "Machine Learning Engineer",
    }

    for old, new in replacements.items():
        html = html.replace(old, new)

    index_file.write_text(html, encoding="utf-8")
    print("Updated index.html")

print("Done.")