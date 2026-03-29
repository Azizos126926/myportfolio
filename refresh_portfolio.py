from pathlib import Path
import re

root = Path(".")

index_file = root / "index.html"
style_file = root / "style.css"
readme_file = root / "README.md"

# -------------------------
# 1) README rewrite
# -------------------------
new_readme = """# Aziz Karaborni — Portfolio

This repository contains my personal portfolio website, built to showcase my work and background as an Applied AI and Machine Learning Engineer.

The site brings together selected projects, professional experience, competition results, and the technical foundations that shape the way I build.

## About me

I enjoy working at the intersection of machine learning, engineering, and real-world problem solving.

My background includes:

- machine learning and deep learning
- computer vision
- scientific and biological data
- scalable algorithm development
- deployment and software integration

I am especially drawn to projects that combine technical depth, clear purpose, and strong execution.

## What the website includes

The portfolio presents:

- selected projects from my GitHub
- professional experience
- technical skills
- competition results
- education and research background
- my CV

## Tech stack

This portfolio is built as a lightweight static website using:

- HTML
- CSS
- JavaScript

## Repository contents

- `index.html` — main portfolio page
- `style.css` — styling
- `script.js` — interactions and dynamic elements
- `CV_Aziz_Karaborni.pdf` — current CV

## Portfolio

The live website is available here:

**[View Portfolio](https://azizos126926.github.io/myportfolio/)**

## Contact

- LinkedIn: [karaborni-aziz](https://linkedin.com/in/karaborni-aziz)
- GitHub: [Azizos126926](https://github.com/Azizos126926)
- Kaggle: [mingo126](https://www.kaggle.com/mingo126)

---

This portfolio evolves over time as I keep building, learning, and refining the kinds of systems I want to create.
"""
readme_file.write_text(new_readme, encoding="utf-8")
print("Updated README.md")

# -------------------------
# 2) index.html text cleanup
# -------------------------
if index_file.exists():
    html = index_file.read_text(encoding="utf-8")

    replacements = {
        "Projects chosen to tell a recruiter-friendly story.": "A selection of projects I enjoyed building and pushing far.",
        "Evidence of applied work in production-oriented and research-heavy environments.": "A few places where I got to build things for real.",
        "Results that make the profile immediately legible to recruiters.": "A few competition results I am proud of.",
        "Focused on high-impact ML": "Drawn to ambitious ML",
        "Built with intention for machine learning engineering roles.": "Built with curiosity, ambition, and a soft spot for hard problems.",
        "Building robust machine learning systems that bridge research, engineering, and product value.": "Building machine learning experiences that feel sharp, useful, and alive.",
    }

    for old, new in replacements.items():
        html = html.replace(old, new)

    # Remove a whole project card containing "Industrial Defect Detection"
    patterns = [
        r'<article\b[^>]*class="[^"]*project-card[^"]*"[^>]*>.*?Industrial Defect Detection.*?</article>',
        r'<div\b[^>]*class="[^"]*project-card[^"]*"[^>]*>.*?Industrial Defect Detection.*?</div>',
        r'<article\b[^>]*>.*?Industrial Defect Detection.*?</article>',
        r'<div\b[^>]*>.*?Industrial Defect Detection.*?</div>',
    ]
    for pat in patterns:
        html = re.sub(pat, "", html, flags=re.DOTALL | re.IGNORECASE)

    # Optional small tone tweaks if these strings exist
    small_replacements = {
        "Selected Projects": "Projects",
        "Professional Experience": "Where I’ve built",
        "Competition Results": "Competition Highlights",
    }
    for old, new in small_replacements.items():
        html = html.replace(old, new)

    index_file.write_text(html, encoding="utf-8")
    print("Updated index.html")
else:
    print("index.html not found, skipped.")

# -------------------------
# 3) style.css playful layer
# -------------------------
fun_css = """

/* === playful refresh === */
:root {
  --accent-3: #ff7ac6;
  --accent-4: #ffd166;
}

body {
  background:
    radial-gradient(circle at 12% 18%, rgba(124, 156, 255, 0.18), transparent 22%),
    radial-gradient(circle at 84% 14%, rgba(255, 122, 198, 0.14), transparent 20%),
    radial-gradient(circle at 72% 78%, rgba(255, 209, 102, 0.12), transparent 18%),
    var(--bg);
}

body::before,
body::after {
  content: "";
  position: fixed;
  inset: auto;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.55;
}

body::before {
  top: 8%;
  right: -80px;
  background: rgba(255, 122, 198, 0.18);
}

body::after {
  bottom: 4%;
  left: -80px;
  background: rgba(255, 209, 102, 0.14);
}

.hero h1 span,
.hero-title span {
  background: linear-gradient(135deg, var(--accent), var(--accent-3), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.primary-btn,
.btn-primary,
button.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-3) 52%, var(--accent-2));
  border: none;
  box-shadow: 0 10px 30px rgba(124, 156, 255, 0.18);
}

.primary-btn:hover,
.btn-primary:hover,
button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(124, 156, 255, 0.24);
}

.glass-card,
.card,
.project-card,
.experience-card,
.quick-facts div,
.skills-shell {
  position: relative;
  overflow: hidden;
}

.glass-card::after,
.card::after,
.project-card::after,
.experience-card::after,
.quick-facts div::after,
.skills-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 38%, rgba(255,255,255,0.03));
  pointer-events: none;
}

.project-card:hover,
.card:hover,
.glass-card:hover,
.experience-card:hover {
  transform: translateY(-6px) scale(1.01);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.badge,
.tag,
.filter-chip.active,
.chip.active {
  background: linear-gradient(135deg, rgba(124,156,255,0.18), rgba(255,122,198,0.16));
  border: 1px solid rgba(255,255,255,0.08);
}

.site-header,
header {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)),
    rgba(10, 12, 18, 0.55);
  backdrop-filter: blur(10px);
}

/* light mode support if you already use a light theme */
@media (prefers-color-scheme: light) {
  body {
    background:
      radial-gradient(circle at 12% 18%, rgba(124, 156, 255, 0.16), transparent 22%),
      radial-gradient(circle at 84% 14%, rgba(255, 122, 198, 0.12), transparent 20%),
      radial-gradient(circle at 72% 78%, rgba(255, 209, 102, 0.10), transparent 18%),
      var(--bg);
  }

  .site-header,
  header {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18)),
      rgba(255,255,255,0.45);
  }
}
"""

if style_file.exists():
    css = style_file.read_text(encoding="utf-8")
    if "/* === playful refresh === */" not in css:
        css += "\n" + fun_css
        style_file.write_text(css, encoding="utf-8")
        print("Updated style.css")
    else:
        print("style.css already contains the playful refresh block.")
else:
    print("style.css not found, skipped.")

print("\\nDone.")