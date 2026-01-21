# Template System Guide - Gheware DevOps AI

## Overview

This guide explains the centralized template system that automatically adds common elements (Google Analytics, meta tags, header, footer) to all HTML pages.

## System Components

### 1. Head Loader (`/docs/js/head-loader.js`)
Automatically injects:
- Google Analytics (GA4: G-9904BXNJ3H) - **production only**
- Google Search Console verification tag
- Favicon
- Open Graph / Social Media meta tags
- Twitter Card tags
- Schema.org structured data
- Common meta tags (charset, viewport, author)

### 2. Template Loader (`/docs/js/template-loader.js`)
Loads reusable HTML components:
- Header navigation (`/docs/templates/header.html`)
- Footer (`/docs/templates/footer.html`)
- Author bio (for blog posts)

### 3. Reusable Templates
- `/docs/templates/header.html` - Site navigation and branding
- `/docs/templates/footer.html` - Site footer with links
- `/docs/templates/author-bio.html` - Author info for blog posts
- `/docs/templates/head-common.html` - Reference documentation
- `/docs/templates/page-template-minimal.html` - Minimal page starter
- `/docs/templates/page-template-full.html` - Full-featured page starter

## How to Create a New Page

### Minimal Setup (3 lines!)

```html
<!DOCTYPE html>
<html lang="en-IN">
<head>
    <title>Your Page Title</title>
    <script src="/js/head-loader.js"></script>
    <link rel="stylesheet" href="/css/premium.css">
    <script src="/js/template-loader.js" defer></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <!-- Your content here -->
    <section class="container">
        <h1>Your Page Title</h1>
        <p>Content goes here...</p>
    </section>

    <div id="footer-placeholder"></div>
</body>
</html>
```

### Full Setup (with custom SEO)

```html
<!DOCTYPE html>
<html lang="en-IN">
<head>
    <!-- Custom meta tags (optional) -->
    <meta name="description" content="Your custom description">
    <meta name="keywords" content="your, custom, keywords">

    <title>Your Page Title - Gheware DevOps AI</title>

    <!-- Custom Open Graph (optional) -->
    <meta property="og:title" content="Social Media Title">
    <meta property="og:description" content="Social description">
    <meta property="og:image" content="https://brainupgrade-in.github.io/images/custom.png">

    <!-- REQUIRED: Auto-loaders -->
    <script src="/js/head-loader.js"></script>
    <link rel="stylesheet" href="/css/premium.css">
    <script src="/js/template-loader.js" defer></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <!-- Your content -->

    <div id="footer-placeholder"></div>
</body>
</html>
```

## What Gets Auto-Loaded

### On Every Page (via head-loader.js)

1. **Google Analytics GA4**
   - ID: `G-9904BXNJ3H`
   - Production only (brainupgrade-in.github.io)
   - Disabled in development

2. **Google Search Console Verification**
   - Verification code: `Vpuxg_Y6ADBHxZwy2cvVfZpPbPWk27zVdu6Mms32wVE`

3. **Meta Tags**
   - Charset: UTF-8
   - Viewport: responsive
   - Author: Gheware Technologies

4. **Favicon**
   - SVG icon: `/favicon.svg`

5. **Open Graph Tags** (uses page title/description or defaults)
   - og:title
   - og:description
   - og:type: website
   - og:url
   - og:image

6. **Twitter Card Tags**
   - twitter:card: summary_large_image
   - twitter:title
   - twitter:description
   - twitter:image

7. **Schema.org Structured Data**
   - Type: EducationalOrganization
   - Includes social media links

### On Every Page (via template-loader.js)

1. **Header** (`/docs/templates/header.html`)
   - Logo and branding
   - Navigation links (Features, Labs, Pricing, Blog)
   - "Start Lab" CTA button

2. **Footer** (`/docs/templates/footer.html`)
   - Brand description
   - Link sections (Platform, Learning Paths, Company)
   - Social media icons
   - Copyright and legal links

## Customization

### Override Defaults

You can override any default by adding your own tags **before** the head-loader.js script:

```html
<head>
    <!-- This will be used instead of the default -->
    <meta name="description" content="My custom description">

    <!-- Still load head-loader.js to add remaining elements -->
    <script src="/js/head-loader.js"></script>
</head>
```

### Configuration

Edit `/docs/js/head-loader.js` to change site-wide defaults:

```javascript
const CONFIG = {
    siteTitle: 'Gheware DevOps AI - Kubernetes Virtual Lab Platform',
    siteUrl: 'https://brainupgrade-in.github.io',
    defaultDescription: '...',
    defaultKeywords: '...',
    author: 'Gheware Technologies',
    favicon: '/favicon.svg',
    ogImage: '/images/og-image.png',
    gaId: 'G-9904BXNJ3H',  // Change GA ID here
    googleVerification: 'Vpuxg_Y6ADBHxZwy2cvVfZpPbPWk27zVdu6Mms32wVE',
    social: {
        youtube: 'https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A',
        twitter: 'https://twitter.com/gheware_tech',
        linkedin: 'https://linkedin.com/company/gheware-technologies'
    }
};
```

## Migration Guide

### Existing Pages

To migrate an existing page to use the new system:

1. **Remove old meta tags** (charset, viewport, author, favicon, OG tags, schema, analytics)
2. **Keep page-specific tags** (description, keywords, title)
3. **Add head-loader.js** script
4. **Ensure header/footer placeholders** exist

**Before:**
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description">
    <meta name="author" content="Gheware Technologies">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta property="og:title" content="...">
    <!-- etc -->
    <script src="js/analytics-loader.js"></script>
    <link rel="stylesheet" href="css/premium.css">
    <script src="js/template-loader.js" defer></script>
</head>
```

**After:**
```html
<head>
    <meta name="description" content="Page description">
    <title>Page Title</title>

    <script src="/js/head-loader.js"></script>
    <link rel="stylesheet" href="/css/premium.css">
    <script src="/js/template-loader.js" defer></script>
</head>
```

### Blog Posts

Blog posts should use the same pattern:

```html
<head>
    <meta name="description" content="Blog post description">
    <meta property="article:published_time" content="2026-01-15">
    <meta property="article:author" content="Rajesh Gheware">
    <title>Blog Post Title | Gheware DevOps AI</title>

    <script src="/js/head-loader.js"></script>
    <link rel="stylesheet" href="/css/premium.css">
    <link rel="stylesheet" href="/blog/css/blog.css">
    <script src="/js/template-loader.js" defer></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <!-- Blog content -->

    <div id="author-bio-placeholder"></div>
    <div id="footer-placeholder"></div>
</body>
```

## Benefits

1. **Centralized Management**
   - Update GA tracking in one place
   - Change verification tags site-wide instantly
   - Consistent branding across all pages

2. **Reduced Duplication**
   - No need to copy/paste header/footer HTML
   - Meta tags auto-generated from config
   - Smaller HTML files (3-10 lines instead of 40+)

3. **Easier Maintenance**
   - Update navigation in one file (`/docs/templates/header.html`)
   - Change footer links once (`/docs/templates/footer.html`)
   - Modify GA settings in one place

4. **Better SEO**
   - Guaranteed Google verification on every page
   - Consistent Open Graph tags
   - Proper structured data

5. **Future-Proof**
   - Easy to add new tracking tools
   - Simple to update branding
   - Scalable to 100s of pages

## File Structure

```
docs/
├── js/
│   ├── head-loader.js          # Auto-injects common <head> elements
│   ├── template-loader.js       # Loads header/footer templates
│   └── analytics-loader.js      # [DEPRECATED - use head-loader.js]
├── templates/
│   ├── header.html              # Site header/navigation
│   ├── footer.html              # Site footer
│   ├── author-bio.html          # Author info (blog posts)
│   ├── head-common.html         # Reference documentation
│   ├── page-template-minimal.html   # Starter template (minimal)
│   └── page-template-full.html      # Starter template (full-featured)
├── index.html                   # Homepage (migrated)
├── privacy.html                 # Privacy page (migrated)
├── terms.html                   # Terms page (to be migrated)
└── blog/
    ├── index.html               # Blog homepage (migrated)
    └── posts/
        └── *.html               # Blog posts (to be migrated)
```

## Testing

### Local Development

```bash
./start-dev.sh
# Visit http://localhost:8889
```

**Check that:**
- Header and footer load correctly
- GA is disabled (check console: "GA4 disabled (development mode)")
- No JavaScript errors

### Production

After deploying to GitHub Pages:

1. **Verify Google Analytics**
   - Visit https://brainupgrade-in.github.io
   - Open browser DevTools → Console
   - Should see: "GA4 initialized for DevOps Gheware"
   - Check GA4 Real-Time reports

2. **Verify Search Console**
   - Go to https://search.google.com/search-console
   - Click "Verify" on your property
   - Should succeed immediately

3. **Verify Templates**
   - Header appears on all pages
   - Footer appears on all pages
   - Navigation links work correctly

## Troubleshooting

### Templates not loading

**Symptom:** Header/footer don't appear

**Solution:**
- Check placeholders exist: `<div id="header-placeholder"></div>`
- Verify template-loader.js is loaded with `defer`
- Check browser console for fetch errors
- Ensure paths use `/templates/` (absolute, not relative)

### GA not tracking

**Symptom:** No GA data in reports

**Solution:**
- Verify hostname is `brainupgrade-in.github.io` (production only)
- Check browser console for GA initialization message
- Verify GA ID in `/docs/js/head-loader.js` config
- Check GA Real-Time reports (data can take 24-48hrs for main reports)

### Duplicate meta tags

**Symptom:** Multiple identical meta tags in <head>

**Solution:**
- head-loader.js checks for existing tags before adding
- Remove any manual meta tags that head-loader.js provides
- Only keep page-specific tags (description, keywords, title)

## Next Steps

1. **Migrate remaining pages** - Update all HTML files to use head-loader.js
2. **Remove deprecated files** - Delete `/docs/js/analytics-loader.js` after migration
3. **Test thoroughly** - Verify all pages load correctly
4. **Monitor GA** - Ensure tracking works on all pages
5. **Update documentation** - Keep CLAUDE.md updated with changes

## Questions?

Contact: contact@gheware.com
