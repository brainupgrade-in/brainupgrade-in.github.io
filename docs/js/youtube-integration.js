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
        },
        'sre-burnout-ai-incident-prevention-clawdbot-2026': {
            videoId: 'zimqsZhzui4',
            title: 'Why 70% of SREs Are Quitting (And How AI Fixes Everything)',
            duration: '7:36',
            views: 'New'
        },
        'context-engineering-ai-performance-guide-2026': {
            videoId: '8rtwLmkW1Ic',
            title: 'Context Engineering: 5 Techniques That 10x Your AI Performance',
            duration: '8:30',
            views: 'New',
            engagementLevel: 'high'
        },
        'prompt-engineering-github-copilot-mastery-guide-2026': {
            videoId: 'Tlz4sB6ChIE',
            title: 'Why 90% of Developers Get Prompt Engineering Wrong: GitHub Copilot Mastery Guide',
            duration: '9:00',
            views: 'New',
            engagementLevel: 'high'
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
     * Play video inline by replacing thumbnail with YouTube iframe
     * @param {HTMLElement} thumbnailElement - The clicked thumbnail element
     */
    window.playInlineVideo = function(thumbnailElement) {
        const videoPlayer = thumbnailElement.closest('.inline-video-player');
        if (!videoPlayer) return;

        const videoId = videoPlayer.dataset.videoId;
        if (!videoId) return;

        // Track video play event
        trackEvent('inline_video_play', 'video_interaction', videoId);

        // Create YouTube iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.className = 'youtube-iframe';

        // Replace thumbnail with iframe
        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(iframe);
        videoPlayer.classList.add('playing');

        console.log('[YouTube Integration] Inline video started:', videoId);
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
        playInlineVideo: window.playInlineVideo,
        videoMapping: VIDEO_MAPPING,
        config: CONFIG
    };

})();
