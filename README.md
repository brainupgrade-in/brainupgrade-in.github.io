# Gheware DevOps AI - Kubernetes Virtual Lab Platform

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://brainupgrade-in.github.io)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](https://gheware.com)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-orange)](https://gheware.com)

> Marketing website for Gheware DevOps AI - A Kubernetes Virtual Lab Platform for hands-on DevOps training

🔗 **Live Site:** [https://brainupgrade-in.github.io](https://brainupgrade-in.github.io)

🎓 **Main Platform:** [https://brainupgrade.in](https://brainupgrade.in)

---

## 🚀 About

Gheware DevOps AI is a **Kubernetes Virtual Lab Platform** that provides hands-on training for developers, DevOps engineers, and certification candidates. This repository contains the marketing website built with modern, lightweight technologies.

### Key Features

- ☸️ **Real Kubernetes Clusters** - Not simulations, actual multi-node K8s environments
- 🐳 **Docker & Container Training** - Build, deploy, and manage containers
- 🔄 **CI/CD Pipelines** - GitOps workflows with Jenkins, GitHub Actions, ArgoCD
- 📊 **Observability Stack** - Prometheus, Grafana, logging, and tracing
- 🔐 **Security Best Practices** - RBAC, Network Policies, CKS certification prep
- ☁️ **Cloud Provider Labs** - EKS, GKE, AKS environments

### Target Audience

- Developers learning Kubernetes and Docker
- DevOps engineers seeking hands-on practice
- Certification candidates (CKA, CKAD, CKS)
- Teams needing scalable training platforms

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 + CSS3 (Custom design system)
- Vanilla JavaScript (No frameworks - Fast & lightweight)
- GitHub Pages (Static hosting)

**Design:**
- Custom CSS with DevOps-themed color palette (Green/Teal)
- Mobile-first responsive design
- System font stack (No external font dependencies)

**SEO & Analytics:**
- Google Analytics (GA4)
- Google Search Console verified
- Sitemap.xml
- Schema.org structured data
- Open Graph + Twitter Cards

**Template System:**
- Reusable header/footer components
- Centralized meta tag management
- Automatic Google Analytics injection

---

## 📁 Project Structure

```
.
├── docs/                      # GitHub Pages source directory
│   ├── index.html             # Homepage
│   ├── privacy.html           # Privacy policy
│   ├── terms.html             # Terms of service
│   ├── sitemap.xml            # SEO sitemap
│   ├── robots.txt             # Search engine directives
│   ├── favicon.svg            # Site icon
│   ├── css/
│   │   └── premium.css        # Design system
│   ├── js/
│   │   ├── head-loader.js     # Meta tags & analytics loader
│   │   └── template-loader.js # Header/footer template loader
│   ├── templates/
│   │   ├── header.html        # Reusable header
│   │   └── footer.html        # Reusable footer
│   ├── images/                # Static images
│   └── blog/
│       ├── index.html         # Blog homepage
│       ├── css/blog.css       # Blog-specific styles
│       └── posts/             # Blog articles
├── start-dev.sh               # Development server
├── CLAUDE.md                  # Claude Code instructions
└── README.md                  # This file
```

---

## 🏃 Quick Start

### Prerequisites

- Python 3.x, PHP 7.x, or Node.js (for local development server)
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/brainupgrade-in/brainupgrade-in.github.io.git
cd brainupgrade-in.github.io

# Start local development server (port 8889)
./start-dev.sh

# Visit in browser
open http://localhost:8889
```

The `start-dev.sh` script automatically detects available servers (Python, PHP, or npx) and starts the appropriate one.

### Deployment

Deployment is automatic via GitHub Pages. Any push to `main` branch triggers a rebuild:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Pages serves from the `/docs` directory. Changes are live in 1-2 minutes.

---

## 🎨 Design System

### Color Palette

```css
/* Primary (DevOps Green/Teal) */
--primary: #10b981
--primary-dark: #059669
--primary-light: #34d399

/* Secondary (Blue) */
--secondary: #2563eb

/* Accent (Orange/Yellow) */
--accent: #f59e0b

/* Dark Theme */
--dark: #0f172a
```

### Hero Gradient

```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #10b981 100%);
```

### Typography

- **Font Stack:** System fonts for performance
- **Sizes:** Responsive rem-based units
- **Display:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell

---

## 📝 Blog

The blog section features DevOps and Kubernetes tutorials:

- **Categories:** Kubernetes, Docker, CI/CD, Cloud Native, DevOps & AI
- **Format:** Technical tutorials with code examples
- **Hero Images:** Custom SVG graphics (1200x630px)
- **SEO:** Article schema markup, Open Graph tags

### Recent Posts

- AI Agent Design Patterns Implementation Guide
- Claude Code for DevOps Engineers
- LangChain Complete Guide
- Kubernetes Security Best Practices
- Docker Image Layers Deep Dive

---

## 🔧 Template System

The site uses a centralized template system for consistency:

**Header/Footer Templates:**
```html
<div id="header-placeholder"></div>
<!-- Page content -->
<div id="footer-placeholder"></div>
```

**Auto-Loaded Elements:**
- Google Analytics (production only)
- Meta tags (charset, viewport, author)
- Open Graph / Twitter Cards
- Favicon
- Schema.org structured data

**Creating a New Page:**

```html
<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta name="description" content="Page description">
    <title>Page Title | Gheware DevOps AI</title>

    <script src="/js/head-loader.js"></script>
    <link rel="stylesheet" href="/css/premium.css">
    <script src="/js/template-loader.js" defer></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <!-- Your content here -->

    <div id="footer-placeholder"></div>
</body>
</html>
```

---

## 🤝 Contributing

This is a proprietary project for Gheware Technologies. For contributions or suggestions:

- **Contact:** contact@gheware.com
- **Issues:** Report bugs via GitHub Issues
- **Website:** https://gheware.com

---

## 📄 License

Copyright © 2026 Gheware Technologies. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, or use of this website's code, design, or content is prohibited.

---

## 🌐 Links

- **Live Site:** [brainupgrade-in.github.io](https://brainupgrade-in.github.io)
- **Main Platform:** [brainupgrade.in](https://brainupgrade.in)
- **Company Website:** [gheware.com](https://gheware.com)
- **YouTube:** [Gheware DevOps AI](https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A)
- **Twitter:** [@gheware_tech](https://twitter.com/gheware_tech)
- **LinkedIn:** [Gheware Technologies](https://linkedin.com/company/gheware-technologies)

---

## 📞 Contact

**Gheware Technologies**
- Email: contact@gheware.com
- Website: https://gheware.com

---

<p align="center">
  <strong>Made in India 🇮🇳</strong><br>
  Empowering DevOps Engineers Worldwide
</p>
