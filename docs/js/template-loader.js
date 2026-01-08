/**
 * Template Loader for Gheware DevOps AI
 * Loads header and footer templates into pages
 */

(function() {
    'use strict';

    const TEMPLATES = {
        header: '/templates/header.html',
        footer: '/templates/footer.html',
        'author-bio': '/templates/author-bio.html'
    };

    /**
     * Fetch and inject a template into a placeholder element
     * @param {string} templatePath - Path to the template file
     * @param {string} placeholderId - ID of the placeholder element
     */
    async function loadTemplate(templatePath, placeholderId) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            console.warn(`Template placeholder #${placeholderId} not found`);
            return;
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const html = await response.text();
            placeholder.outerHTML = html;
        } catch (error) {
            console.error(`Error loading template ${templatePath}:`, error);
        }
    }

    /**
     * Initialize templates when DOM is ready
     */
    function init() {
        // Build array of template loading promises
        const templatePromises = [
            loadTemplate(TEMPLATES.header, 'header-placeholder'),
            loadTemplate(TEMPLATES.footer, 'footer-placeholder')
        ];

        // Load author-bio template if placeholder exists (blog posts)
        if (document.getElementById('author-bio-placeholder')) {
            templatePromises.push(loadTemplate(TEMPLATES['author-bio'], 'author-bio-placeholder'));
        }

        Promise.all(templatePromises).then(() => {
            // Mark active nav link based on current page
            markActiveNavLink();
            // Dispatch event for other scripts that depend on templates
            document.dispatchEvent(new CustomEvent('templatesLoaded'));
        });
    }

    /**
     * Mark the current page's nav link as active
     */
    function markActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath ||
                (href === '/blog/' && currentPath.startsWith('/blog')) ||
                (currentPath === '/' && href.startsWith('/#'))) {
                link.classList.add('active');
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
