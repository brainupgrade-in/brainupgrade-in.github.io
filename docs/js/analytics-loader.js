/**
 * Google Analytics Loader for DevOps Gheware
 * Handles GA4 tracking across all pages
 */

(function() {
    'use strict';

    // GA4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-9904BXNJ3H';

    // Only load in production
    if (window.location.hostname === 'brainupgrade-in.github.io' ||
        window.location.hostname === 'www.brainupgrade-in.github.io') {

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

        console.log('GA4 initialized for DevOps Gheware');
    } else {
        console.log('GA4 disabled (development mode)');
    }
})();
