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
./start-dev-docker.sh       # Docker with live reload (port 8889)
```

### Deployment
```bash
./deploy.sh                           # Local KIND cluster
# Production: GitHub Actions workflow (manual trigger)
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
- Server: nginx:alpine-slim Docker container
- Fonts: System font stack (no external dependencies)
- SEO: Sitemap.xml, robots.txt, Schema.org structured data

**Key Features:**
- Green/teal DevOps-themed design system
- Mobile-first responsive design
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
│   │   └── analytics-loader.js # Google Analytics loader
│   ├── images/                 # Static images (empty)
│   └── blog/
│       ├── index.html          # Blog homepage
│       ├── css/blog.css        # Blog-specific styles
│       ├── posts/
│       │   └── _template.html  # Blog post template
│       └── assets/images/      # Blog hero images (empty)
├── kubernetes/
│   └── gheware-devops-ai-manifest.yaml  # K8s deployment manifests (optional)
├── .github/workflows/          # GitHub Actions (empty, to be configured)
├── .claude/agents/             # Claude agent configs (empty)
├── Dockerfile                  # Container image definition (for Docker/K8s)
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git exclusions
├── deploy.sh                   # Local KIND deployment script
├── start-dev.sh                # Local development server
├── start-dev-docker.sh         # Docker-based dev server
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
./start-dev-docker.sh             # Docker with live reload

# Deploy to GitHub Pages
git add . && git commit -m "Update site" && git push origin main
```

### Docker/Kubernetes (Alternative)
```bash
# Local KIND deployment
./deploy.sh                       # Deploys to 'finance' cluster

# Kubernetes commands
kubectl get pods -n devops-gheware
kubectl logs -f deployment/devops-gheware -n devops-gheware
kubectl port-forward svc/devops-gheware-service 8080:80 -n devops-gheware
```

---

## Blog Content (Future)

### Blog Post Creation Checklist

**Required Elements:**
1. **Hero Image:** 1200x630px, green gradient, DevOps-relevant icons
2. **Metadata:** BlogPosting schema, Open Graph, Twitter Cards
3. **Structure:** Key Takeaways → Content → Author Bio → Footer
4. **Categories:** Kubernetes, Docker, CI/CD, Cloud Native, Certifications

**Reference Template:**
- `/docs/blog/posts/_template.html`

---

## SEO Configuration

**Current:**
- Sitemap.xml with homepage and legal pages
- robots.txt allowing all crawlers
- Schema.org EducationalOrganization structured data
- Open Graph + Twitter Card meta tags

**To Add:**
- Google Analytics (update GA_MEASUREMENT_ID in analytics-loader.js)
- Google Search Console verification
- Blog posts as they are created

---

## Social Media

**Company Accounts:**
- **Twitter/X:** @gheware_tech
- **YouTube:** @gheware_tech
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

## GitHub Pages Deployment

**Automatic:** GitHub Pages auto-deploys when pushing to main branch.

**Manual Steps:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Site will be live at https://brainupgrade-in.github.io within 1-2 minutes.

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

**Last Updated:** 2025-01-08
**Repository:** https://github.com/brainupgrade-in/brainupgrade-in.github.io
**Local Path:** /home/rajesh/devops.gheware.com
**Primary Goal:** Drive signups to https://brainupgrade.in Kubernetes Labs
