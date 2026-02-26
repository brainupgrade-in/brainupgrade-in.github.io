/**
 * Head Loader for Gheware DevOps AI
 * Automatically injects common meta tags, GA tracking, and verification tags
 * Usage: Add <script src="/js/head-loader.js"></script> in <head>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        siteTitle: 'Gheware DevOps AI - Kubernetes Virtual Lab Platform',
        siteUrl: 'https://brainupgrade-in.github.io',
        defaultDescription: 'Master Kubernetes and DevOps with hands-on virtual labs. Enterprise-grade training platform for developers and teams.',
        defaultKeywords: 'kubernetes training, docker training, devops lab, k8s learning, CI/CD pipeline, cloud native, container orchestration, devops certification, CKA, CKAD, CKS',
        author: 'Gheware Technologies',
        favicon: '/favicon.svg',
        ogImage: '/images/og-image.png',
        // Domain-specific Google Analytics IDs
        gaId: {
            'brainupgrade-in.github.io': 'G-TRDMMEZ26F',
            'www.brainupgrade-in.github.io': 'G-TRDMMEZ26F',
            'devops.gheware.com': 'G-TRDMMEZ26F',
            'www.devops.gheware.com': 'G-TRDMMEZ26F'
        },
        googleVerification: 'Vpuxg_Y6ADBHxZwy2cvVfZpPbPWk27zVdu6Mms32wVE',
        social: {
            youtube: 'https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A',
            twitter: 'https://twitter.com/gheware_tech',
            linkedin: 'https://linkedin.com/company/gheware-technologies'
        }
    };

    /**
     * Create and append a meta tag
     */
    function addMetaTag(name, content, isProperty = false) {
        if (!content) return;
        const meta = document.createElement('meta');
        if (isProperty) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }

    /**
     * Create and append a link tag
     */
    function addLinkTag(rel, href, type = null) {
        const link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        if (type) link.setAttribute('type', type);
        document.head.appendChild(link);
    }

    /**
     * Initialize Google Analytics GA4
     */
    function initializeGA() {
        const hostname = window.location.hostname;
        const gaId = CONFIG.gaId[hostname];

        // Skip if GA is already loaded statically (check for gtag script)
        if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
            console.log('GA4 already loaded statically, skipping JS initialization');
            return;
        }

        // Only load in production for supported domains
        if (!gaId) {
            console.log('GA4 disabled (development mode or unsupported domain)');
            return;
        }

        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', gaId, {
            page_title: document.title,
            page_location: window.location.href
        });

        console.log(`GA4 initialized for ${hostname} with ID: ${gaId}`);
    }

    /**
     * Add Schema.org structured data
     */
    function addStructuredData() {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Gheware DevOps AI",
            "url": CONFIG.siteUrl,
            "description": CONFIG.defaultDescription,
            "sameAs": [
                CONFIG.social.youtube,
                CONFIG.social.twitter,
                CONFIG.social.linkedin
            ]
        });
        document.head.appendChild(script);
    }

    /**
     * Initialize common head elements
     */
    function init() {
        // Get page-specific data from existing meta tags or use defaults
        const pageTitle = document.title || CONFIG.siteTitle;
        const pageDescription = document.querySelector('meta[name="description"]')?.content || CONFIG.defaultDescription;
        const pageUrl = CONFIG.siteUrl + window.location.pathname;
        const pageImage = CONFIG.siteUrl + CONFIG.ogImage;

        // Add basic meta tags if not already present
        if (!document.querySelector('meta[charset]')) {
            const charset = document.createElement('meta');
            charset.setAttribute('charset', 'UTF-8');
            document.head.insertBefore(charset, document.head.firstChild);
        }

        if (!document.querySelector('meta[name="viewport"]')) {
            addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
        }

        if (!document.querySelector('meta[name="author"]')) {
            addMetaTag('author', CONFIG.author);
        }

        // Add Google Search Console verification (if not already in static HTML)
        // NOTE: For Search Console, verification tag MUST be in static HTML, not added by JS
        // The tag should be manually added to each page's <head> section
        if (!document.querySelector('meta[name="google-site-verification"]')) {
            addMetaTag('google-site-verification', CONFIG.googleVerification);
        }

        // Add favicon if not present
        if (!document.querySelector('link[rel="icon"]')) {
            addLinkTag('icon', CONFIG.favicon, 'image/svg+xml');
        }

        // Add Open Graph tags if not present
        if (!document.querySelector('meta[property="og:title"]')) {
            addMetaTag('og:title', pageTitle, true);
            addMetaTag('og:description', pageDescription, true);
            addMetaTag('og:type', 'website', true);
            addMetaTag('og:url', pageUrl, true);
            addMetaTag('og:image', pageImage, true);
        }

        // Add Twitter Card tags if not present
        if (!document.querySelector('meta[name="twitter:card"]')) {
            addMetaTag('twitter:card', 'summary_large_image');
            addMetaTag('twitter:title', pageTitle);
            addMetaTag('twitter:description', pageDescription);
            addMetaTag('twitter:image', pageImage);
        }

        // Add structured data if not present
        if (!document.querySelector('script[type="application/ld+json"]')) {
            addStructuredData();
        }

        // Initialize Google Analytics
        initializeGA();

        console.log('Head elements initialized for:', pageTitle);
    }

    // Run immediately (script should be in <head>)
    init();
})();
