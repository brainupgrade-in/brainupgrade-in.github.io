/**
 * Google Analytics Loader for DevOps Gheware
 * Handles GA4 tracking across all pages
 */

(function() {
    'use strict';

    // Domain-specific GA4 Measurement IDs
    const GA_MEASUREMENT_IDS = {
        'brainupgrade-in.github.io': 'G-9904BXNJ3H',
        'www.brainupgrade-in.github.io': 'G-9904BXNJ3H',
        'devops.gheware.com': 'G-TRDMMEZ26F',
        'www.devops.gheware.com': 'G-TRDMMEZ26F'
    };

    const hostname = window.location.hostname;
    const GA_MEASUREMENT_ID = GA_MEASUREMENT_IDS[hostname];

    // Only load in production for supported domains
    if (GA_MEASUREMENT_ID) {

        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href
        });

        console.log(`GA4 initialized for ${hostname} with ID: ${GA_MEASUREMENT_ID}`);
    } else {
        console.log('GA4 disabled (development mode or unsupported domain)');
    }
})();
