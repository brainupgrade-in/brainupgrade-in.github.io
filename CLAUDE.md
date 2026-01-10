# Gheware DevOps AI Website - Quick Reference

## Project Identity
**Purpose:** Marketing site for Gheware DevOps AI - Kubernetes Virtual Lab Platform
- **Main Platform:** https://brainupgrade.in (existing Kubernetes lab platform)
- **Marketing Site:** https://brainupgrade-in.github.io (GitHub Pages)
- **Remote Repo:** https://github.com/brainupgrade-in/brainupgrade-in.github.io.git

---

## Quick Start

### Development
```bash
./start-dev.sh              # Simple HTTP server (port 8889)
```

### Deployment
```bash
git add . && git commit -m "Update site" && git push origin main
```

---

## Product Focus

### Gheware DevOps AI - Kubernetes Virtual Lab
- **URL:** https://brainupgrade.in
- **Target Audience:** Developers, DevOps engineers, certification candidates
- **Key Features:**
  - Real Kubernetes clusters (not simulations)
  - CKA/CKAD/CKS exam preparation
  - Docker & container training
  - CI/CD pipeline labs
  - Observability stack (Prometheus, Grafana)
  - Cloud provider labs (EKS, GKE, AKS)

---

## Architecture

**Tech Stack:**
- Frontend: Static HTML5 + CSS3 (premium.css) + vanilla JavaScript
- Hosting: GitHub Pages (static site)
- Fonts: System font stack (no external dependencies)
- SEO: Sitemap.xml, robots.txt, Schema.org structured data

**Key Features:**
- Green/teal DevOps-themed design system
- Mobile-first responsive design
- Reusable header/footer templates
- Blog infrastructure (skeleton ready)
- Legal pages (Privacy, Terms)

---

## Project Structure

```
devops.gheware.com/
├── docs/                       # GitHub Pages source (served from /docs)
│   ├── index.html              # Main landing page
│   ├── privacy.html            # Privacy policy
│   ├── terms.html              # Terms of service
│   ├── favicon.svg             # Site favicon (Kubernetes layers icon)
│   ├── robots.txt              # SEO robots file
│   ├── sitemap.xml             # SEO sitemap
│   ├── css/
│   │   └── premium.css         # Design system (green/teal theme)
│   ├── js/
│   │   ├── analytics-loader.js # Google Analytics loader
│   │   └── template-loader.js  # Header/footer template loader
│   ├── templates/
│   │   ├── header.html         # Shared header template
│   │   └── footer.html         # Shared footer template
│   ├── images/                 # Static images
│   └── blog/
│       ├── index.html          # Blog homepage
│       ├── css/blog.css        # Blog-specific styles
│       ├── posts/
│       │   └── _template.html  # Blog post template
│       └── assets/images/      # Blog hero images
├── .github/workflows/          # GitHub Actions (empty, to be configured)
├── .gitignore                  # Git exclusions
├── start-dev.sh                # Local development server
└── CLAUDE.md                   # This file
```

---

## Design System

**Color Palette (DevOps Theme):**
- Primary: `#10b981` (Green/Teal)
- Primary Dark: `#059669`
- Primary Light: `#34d399`
- Secondary: `#2563eb` (Blue)
- Accent: `#f59e0b` (Orange/Yellow)
- Dark: `#0f172a`
- Grays: 50-900 scale

**Hero Gradient:**
```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #10b981 100%);
```

**Typography:**
- System font stack (fast, no external requests)
- Display: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...
- Responsive rem units

---

## Deployment

### Production (GitHub Pages)
- **URL:** https://brainupgrade-in.github.io
- **Repository:** https://github.com/brainupgrade-in/brainupgrade-in.github.io
- **Source:** `/docs` folder on `main` branch
- **Deployment:** Automatic on push to main

**GitHub Pages Setup:**
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `/docs`
4. Save

### Local Development
```bash
# Development server (port 8889)
./start-dev.sh                    # Python/PHP/npx auto-detect

# Deploy to GitHub Pages
git add . && git commit -m "Update site" && git push origin main
```

---

## Blog Content

### Published Posts

| Post | Category | Published |
|------|----------|-----------|
| [Claude Code for DevOps Engineers 2026](/docs/blog/posts/claude-code-for-devops-engineers-2026.html) | DevOps & AI | Jan 9, 2026 |
| [LangChain Complete Guide 2026](/docs/blog/posts/langchain-complete-guide-2026.html) | AI & ML | Jan 8, 2026 |

### Blog Post Creation Checklist

**Required Elements:**
1. **Hero Image:** 1200x630px, green gradient, DevOps-relevant icons
2. **Metadata:** BlogPosting schema, Open Graph, Twitter Cards
3. **Structure:** Key Takeaways → Content → Author Bio → Footer
4. **Categories:** Kubernetes, Docker, CI/CD, Cloud Native, Certifications, DevOps & AI

**Reference Template:**
- `/docs/blog/posts/_template.html`

---

## SEO Configuration

**Current:**
- Sitemap.xml with homepage and legal pages
- robots.txt allowing all crawlers
- Schema.org EducationalOrganization structured data
- Open Graph + Twitter Card meta tags

**Configured:**
- Google Analytics GA4: G-9904BXNJ3H (production only)

**To Add:**
- Google Search Console verification

---

## Social Media

**Company Accounts:**
- **YouTube:** Gheware DevOps AI (https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A)
- **Twitter/X:** @gheware_tech
- **LinkedIn:** linkedin.com/company/gheware-technologies

---

## Content Strategy

### Target Audience
1. **Developers** learning Kubernetes/Docker
2. **DevOps Engineers** seeking hands-on practice
3. **Certification Candidates** (CKA, CKAD, CKS)
4. **Teams** needing training platforms

### Core USPs
1. Real Kubernetes clusters (not simulations)
2. Browser-based access (no local setup)
3. Instant lab provisioning
4. Structured certification prep paths
5. 24/7 lab availability

### Pain Points → Solutions
- Complex local K8s setup → Browser-based instant access
- Expensive cloud resources for learning → Shared lab environments
- Lack of hands-on practice → 50+ real-world labs
- No structured learning path → CKA/CKAD/CKS tracks

---

## Related Projects

- **www-gheware:** Main Gheware portfolio site (gheware.com)
- **trade-gheware-com:** TradeGheware stock analytics
- **healthghewarecom:** Health Gheware diabetes management
- **brainupgrade:** Main Kubernetes lab platform

---

## Contact

- **Email:** contact@gheware.com
- **Website:** https://gheware.com

---

**Last Updated:** 2026-01-09
**Repository:** https://github.com/brainupgrade-in/brainupgrade-in.github.io
**Local Path:** /home/rajesh/devops.gheware.com
**Primary Goal:** Drive signups to https://brainupgrade.in Kubernetes Labs
