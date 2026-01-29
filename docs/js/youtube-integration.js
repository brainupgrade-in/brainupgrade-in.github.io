/**
 * YouTube Integration for Gheware DevOps AI Blog
 * Cross-platform engagement features for blog-to-YouTube conversion
 *
 * Features:
 * - Sticky subscribe bar with scroll trigger
 * - Video badge rendering for posts with videos
 * - Analytics tracking for YouTube interactions
 * - Cross-platform link generation
 *
 * Version: 1.0
 * Date: January 24, 2026
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        channelId: 'UCSHFanMgmtBK5mWXCyTCW7A',
        channelUrl: 'https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A',
        subscribeUrl: 'https://youtube.com/channel/UCSHFanMgmtBK5mWXCyTCW7A?sub_confirmation=1',
        scrollTriggerPercent: 30,
        dismissResetDays: 7,
        playlists: {
            mcp: 'PLqGvN2U9LT-ukrMpG3SsyjtwK72qjIc54',
            dca: 'PLqGvN2U9LT-vWbh5QUb4EdCQDy0pdgUBE',
            kcna: 'PLqGvN2U9LT-uKcna'
        }
    };

    // Blog post to video mapping
    const VIDEO_MAPPING = {
        'docker-image-layers-complete-guide-2026': {
            videoId: 'EPZdHiw2VAI',
            title: 'Docker Layers Explained - Why 90% Get This Wrong',
            duration: '6:00',
            views: '1.5k'
        },
        'kubernetes-security-best-practices-2026': {
            videoId: 'pH67LNj7Wu0',
            title: 'Kubernetes Security 2026 - 8 Essential Domains',
            duration: '10:00',
            views: '1.2k'
        },
        'langgraph-vs-crewai-vs-autogen-comparison-2026': {
            videoId: '-awavcRtL_4',
            title: 'LangGraph vs CrewAI vs AutoGen - Complete Comparison',
            duration: '12:00',
            views: '1.8k'
        },
        'claude-code-vs-cursor-deep-dive-2026': {
            videoId: 'Uui-sbJ6EgA',
            title: 'Claude Code vs Cursor - Complete Deep Dive',
            duration: '15:00',
            views: '900'
        },
        'claude-code-for-devops-engineers-2026': {
            videoId: '3twm3B7QkZI',
            title: 'Claude Code for DevOps Engineers',
            duration: '12:00',
            views: '750'
        },
        'ai-agent-design-patterns-2026': {
            videoId: 'ROPR-Nk3RmQ',
            title: 'AI Agent Design Patterns 2026',
            duration: '10:00',
            views: '2.1k'
        },
        'ai-agent-design-patterns-implementation-guide-2026': {
            videoId: 'ROPR-Nk3RmQ',
            title: 'AI Agent Design Patterns 2026',
            duration: '10:00',
            views: '2.1k'
        }
    };

    /**
     * Initialize the sticky YouTube subscribe bar
     */
    function initStickyBar() {
        const bar = document.getElementById('youtube-subscribe-bar');
        if (!bar) return;

        // Check if dismissed and if reset period has passed
        const dismissed = localStorage.getItem('youtube-bar-dismissed');
        const dismissedTime = localStorage.getItem('youtube-bar-dismissed-time');

        if (dismissed && dismissedTime) {
            const resetTime = CONFIG.dismissResetDays * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(dismissedTime) > resetTime) {
                localStorage.removeItem('youtube-bar-dismissed');
                localStorage.removeItem('youtube-bar-dismissed-time');
            } else {
                return; // Still dismissed
            }
        }

        let shown = false;
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > CONFIG.scrollTriggerPercent && !shown) {
                bar.classList.remove('hidden');
                bar.classList.add('visible');
                shown = true;
                trackEvent('youtube_bar_shown', 'impression', 'sticky_bar');
            }
        }, { passive: true });
    }

    /**
     * Dismiss the sticky bar
     */
    window.dismissYouTubeBar = function() {
        const bar = document.getElementById('youtube-subscribe-bar');
        if (bar) {
            bar.classList.remove('visible');
            bar.classList.add('hidden');
            localStorage.setItem('youtube-bar-dismissed', 'true');
            localStorage.setItem('youtube-bar-dismissed-time', Date.now().toString());
            trackEvent('youtube_bar_dismissed', 'dismiss', 'sticky_bar');
        }
    };

    /**
     * Get video info for a blog post slug
     * @param {string} slug - Blog post slug
     * @returns {object|null} Video info or null
     */
    function getVideoForPost(slug) {
        // Clean the slug
        const cleanSlug = slug.replace('.html', '').replace(/^\/blog\/posts\//, '');
        return VIDEO_MAPPING[cleanSlug] || null;
    }

    /**
     * Add video badges to blog cards that have corresponding videos
     */
    function addVideoBadgesToCards() {
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            const link = card.querySelector('.blog-card-title a');
            if (!link) return;

            const href = link.getAttribute('href');
            const slug = href.split('/').pop();
            const videoInfo = getVideoForPost(slug);

            if (videoInfo) {
                card.classList.add('has-video');

                // Create video badge
                const badge = document.createElement('a');
                badge.href = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
                badge.target = '_blank';
                badge.rel = 'noopener';
                badge.className = 'video-cta-badge-card';
                badge.innerHTML = `
                    <div class="video-play-button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <div class="video-info">
                        <span class="video-label">Watch Video</span>
                        <div class="video-stats">
                            <span>${videoInfo.views} views</span>
                            <span>${videoInfo.duration}</span>
                        </div>
                    </div>
                `;

                badge.addEventListener('click', function(e) {
                    trackEvent('video_badge_click', 'click', videoInfo.videoId);
                });

                // Insert at the beginning of card content
                const content = card.querySelector('.blog-card-content');
                if (content) {
                    content.insertBefore(badge, content.firstChild);
                }
            }
        });
    }

    /**
     * Add cross-platform links to blog cards
     */
    function addCrossPlatformLinks() {
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            const link = card.querySelector('.blog-card-title a');
            if (!link) return;

            const href = link.getAttribute('href');
            const slug = href.split('/').pop();
            const videoInfo = getVideoForPost(slug);

            if (videoInfo) {
                const content = card.querySelector('.blog-card-content');
                if (!content) return;

                // Check if cross-platform links already exist
                if (card.querySelector('.cross-platform-links')) return;

                const crossLinks = document.createElement('div');
                crossLinks.className = 'cross-platform-links';
                crossLinks.innerHTML = `
                    <div class="platform-link youtube">
                        <a href="https://youtube.com/watch?v=${videoInfo.videoId}" target="_blank" rel="noopener">
                            <span class="platform-icon">&#127909;</span>
                            <span class="platform-text">Watch on YouTube</span>
                            <span class="platform-stats">${videoInfo.duration} &bull; ${videoInfo.views}</span>
                        </a>
                    </div>
                `;

                content.appendChild(crossLinks);
            }
        });
    }

    /**
     * Track YouTube interaction events
     * @param {string} action - Event action
     * @param {string} category - Event category
     * @param {string} label - Event label
     */
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log(`[YouTube Integration] Event: ${action}, Category: ${category}, Label: ${label}`);
    }

    /**
     * Add click tracking to all YouTube links
     */
    function addClickTracking() {
        document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach(link => {
            if (link.dataset.ytTracked) return;
            link.dataset.ytTracked = 'true';

            link.addEventListener('click', function() {
                const context = this.closest('.youtube-channel-section') ? 'channel_section' :
                                this.closest('.trending-videos-section') ? 'trending_video' :
                                this.closest('.youtube-sticky-bar') ? 'sticky_bar' :
                                this.closest('.playlist-card') ? 'playlist' :
                                this.closest('.video-cta-card') ? 'video_cta' :
                                this.closest('.video-banner') ? 'video_banner' :
                                this.closest('.cross-platform-links') ? 'cross_platform' :
                                this.closest('.video-cta-badge-card') ? 'video_badge' : 'general';

                trackEvent('youtube_click', context, this.href);
            });
        });
    }

    /**
     * Generate video CTA HTML for blog posts
     * @param {string} slug - Blog post slug
     * @returns {string} HTML string or empty string
     */
    window.generateVideoCTA = function(slug) {
        const videoInfo = getVideoForPost(slug);
        if (!videoInfo) return '';

        return `
            <div class="video-cta-card">
                <div class="video-cta-thumbnail">
                    <a href="https://www.youtube.com/watch?v=${videoInfo.videoId}" target="_blank" rel="noopener">
                        <img src="https://img.youtube.com/vi/${videoInfo.videoId}/maxresdefault.jpg"
                             alt="${videoInfo.title}"
                             loading="lazy"
                             onerror="this.src='https://img.youtube.com/vi/${videoInfo.videoId}/hqdefault.jpg'">
                        <span class="play-icon">&#9654;</span>
                    </a>
                </div>
                <div class="video-cta-content">
                    <span class="video-cta-badge">&#128250; Watch Video</span>
                    <h4>${videoInfo.title}</h4>
                    <p>Visual walkthrough with real examples and demos. Perfect complement to this article.</p>
                    <a href="https://www.youtube.com/watch?v=${videoInfo.videoId}" class="video-cta-button" target="_blank" rel="noopener">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        Watch on YouTube
                    </a>
                </div>
            </div>
        `;
    };

    /**
     * Generate video banner HTML for blog posts
     * @param {string} slug - Blog post slug
     * @returns {string} HTML string or empty string
     */
    window.generateVideoBanner = function(slug) {
        const videoInfo = getVideoForPost(slug);
        if (!videoInfo) return '';

        return `
            <div class="video-banner">
                <span class="video-banner-icon">&#127916;</span>
                <p class="video-banner-text">
                    <strong>Prefer video?</strong> Watch
                    <a href="https://www.youtube.com/watch?v=${videoInfo.videoId}" target="_blank" rel="noopener">${videoInfo.title}</a>
                    on YouTube <span class="video-banner-duration">(${videoInfo.duration})</span>
                </p>
            </div>
        `;
    };

    /**
     * Initialize all YouTube integration features
     */
    function init() {
        // Sticky bar disabled - replaced by 3-CTA system
        // initStickyBar();

        // Add video badges to cards (only on blog index)
        if (window.location.pathname.includes('/blog/') && !window.location.pathname.includes('/posts/')) {
            addVideoBadgesToCards();
            addCrossPlatformLinks();
        }

        // Add click tracking
        addClickTracking();

        // Re-run tracking after templates load
        document.addEventListener('templatesLoaded', addClickTracking);

        console.log('[YouTube Integration] Initialized successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.YouTubeIntegration = {
        getVideoForPost,
        generateVideoCTA: window.generateVideoCTA,
        generateVideoBanner: window.generateVideoBanner,
        videoMapping: VIDEO_MAPPING,
        config: CONFIG
    };

})();
