/**
 * Enhanced Blog Search & Filtering System
 * Inspired by health.gheware.com/blog functionality
 * Features: Real-time search, category filtering, pagination, RSS feed, animations
 */

class EnhancedBlogSearch {
    constructor() {
        this.posts = [];
        this.allPosts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 12;
        this.searchTerm = '';
        this.selectedCategory = '';
        this.searchTimeout = null;
        this.isLoading = false;

        // URL state management
        this.urlParams = new URLSearchParams(window.location.search);

        this.init();
    }

    async init() {
        try {
            await this.loadPosts();
            this.restoreFromURL();
            this.setupEventListeners();
            this.handleRecoveryMode();
            this.setupKeyboardShortcuts();
            this.renderCategoryFilters();
            this.renderPosts();
            this.setupRSSFeed();
        } catch (error) {
            console.error('Failed to initialize blog search:', error);
            this.showError();
        }
    }

    async loadPosts() {
        try {
            const response = await fetch('/blog/posts-data.json');
            if (!response.ok) throw new Error('Failed to load posts data');

            const data = await response.json();
            this.allPosts = data.posts.map(post => ({
                ...post,
                featured: post.category === 'AI Engineering' || post.title.includes('Claude Code'), // Mark featured posts
                categoryEmoji: this.getCategoryEmoji(post.category)
            }));
            this.filteredPosts = [...this.allPosts];
        } catch (error) {
            console.error('Error loading posts:', error);
            // Fallback to empty array
            this.allPosts = [];
            this.filteredPosts = [];
        }
    }

    getCategoryEmoji(category) {
        const emojiMap = {
            'DevSecOps': '🔒',
            'Kubernetes': '☸️',
            'AWS': '☁️',
            'Docker': '🐳',
            'AI Engineering': '🤖',
            'DevOps & AI': '⚙️',
            'AI & Machine Learning': '🧠',
            'AI & DevOps': '🚀',
            'Default': '📝'
        };
        return emojiMap[category] || emojiMap['Default'];
    }

    restoreFromURL() {
        // Restore search term
        this.searchTerm = this.urlParams.get('search') || '';
        if (this.searchTerm) {
            document.getElementById('blogSearchBox').value = this.searchTerm;
        }

        // Restore category filter
        this.selectedCategory = this.urlParams.get('category') || '';

        // Restore page
        this.currentPage = parseInt(this.urlParams.get('page')) || 1;

        // Apply filters if any exist
        if (this.searchTerm || this.selectedCategory) {
            this.applyFilters();
        }
    }

    updateURL() {
        const params = new URLSearchParams();

        if (this.searchTerm) params.set('search', this.searchTerm);
        if (this.selectedCategory) params.set('category', this.selectedCategory);
        if (this.currentPage > 1) params.set('page', this.currentPage);

        const newURL = params.toString() ?
            `${window.location.pathname}?${params.toString()}` :
            window.location.pathname;

        window.history.replaceState({}, '', newURL);
    }

    setupEventListeners() {
        // Search box with debounce
        const searchBox = document.getElementById('blogSearchBox');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value.trim().toLowerCase();
                    this.currentPage = 1;
                    this.applyFilters();
                    this.updateURL();
                }, 200); // 200ms debounce
            });
        }

        // Search suggestions
        const suggestions = document.querySelectorAll('.search-suggestion');
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const term = suggestion.getAttribute('data-term');
                if (searchBox) {
                    searchBox.value = term;
                    this.searchTerm = term.toLowerCase();
                    this.currentPage = 1;
                    this.applyFilters();
                    this.updateURL();
                }
            });
        });

        // Clear search button
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    handleRecoveryMode() {
        // Check if we're coming from a 404 redirect
        const referrer = document.referrer;
        const recoveryInfo = document.getElementById('recoveryInfo');
        const recoveryMessage = document.getElementById('recoveryMessage');

        if (referrer && referrer.includes(window.location.hostname) && this.urlParams.get('recovery')) {
            if (recoveryInfo) {
                recoveryInfo.classList.add('show');
                if (recoveryMessage) {
                    recoveryMessage.textContent = `We've automatically searched our blog based on "${this.urlParams.get('recovery')}".`;
                }
            }
        }
    }

    renderCategoryFilters() {
        const categories = this.getAllCategories();
        const filterButtonsContainer = document.getElementById('filterButtonsContainer');

        if (!filterButtonsContainer) return;

        // Clear existing filter buttons
        filterButtonsContainer.innerHTML = '';

        // Create filter buttons HTML
        const buttonsHTML = `
            <button class="filter-btn ${!this.selectedCategory ? 'active' : ''}"
                    data-category="">
                📚 All Posts <span class="count">${this.allPosts.length}</span>
            </button>
            ${categories.map(({category, count}) => `
                <button class="filter-btn ${this.selectedCategory === category ? 'active' : ''}"
                        data-category="${category}">
                    ${this.getCategoryEmoji(category)} ${category}
                    <span class="count">${count}</span>
                </button>
            `).join('')}
        `;

        filterButtonsContainer.innerHTML = buttonsHTML;

        // Add event listeners to the new buttons
        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const category = e.target.getAttribute('data-category');
                this.selectCategory(category);
            }
        });
    }

    getAllCategories() {
        const categoryCount = {};
        this.allPosts.forEach(post => {
            if (post.category) {
                categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
            }
        });

        // Sort by count, take top 8 categories
        return Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([category, count]) => ({ category, count }));
    }


    selectCategory(category) {
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });

        this.selectedCategory = category;
        this.currentPage = 1;
        this.applyFilters();
        this.updateURL();
    }

    applyFilters() {
        this.showLoading(true);

        let filtered = [...this.allPosts];

        // Apply category filter
        if (this.selectedCategory) {
            filtered = filtered.filter(post =>
                post.category === this.selectedCategory
            );
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(post => {
                const searchFields = [
                    post.title,
                    post.excerpt,
                    post.category,
                    post.tags?.join(' ') || '',
                    post.keywords?.join(' ') || ''
                ].join(' ').toLowerCase();

                return searchFields.includes(this.searchTerm);
            });
        }

        this.filteredPosts = filtered;

        // Show/hide sections
        this.toggleSections(this.searchTerm || this.selectedCategory);

        // Update search stats
        this.updateSearchStats();

        // Show clear button if needed
        this.updateClearButton();

        // Render posts with animation
        setTimeout(() => {
            this.renderPosts();
            this.showLoading(false);
        }, 300);
    }

    toggleSections(showResults) {
        const searchResults = document.getElementById('searchResults');
        const defaultSection = document.getElementById('defaultBlogSection');

        if (showResults) {
            if (searchResults) searchResults.classList.add('show');
            if (defaultSection) defaultSection.style.display = 'none';
        } else {
            if (searchResults) searchResults.classList.remove('show');
            if (defaultSection) defaultSection.style.display = 'block';
        }
    }

    updateSearchStats() {
        const statsElement = document.getElementById('searchStats');
        if (!statsElement) return;

        const total = this.filteredPosts.length;
        const start = (this.currentPage - 1) * this.postsPerPage + 1;
        const end = Math.min(start + this.postsPerPage - 1, total);

        let statsText = '';
        if (this.searchTerm || this.selectedCategory) {
            const filters = [];
            if (this.searchTerm) filters.push(`"${this.searchTerm}"`);
            if (this.selectedCategory) filters.push(`${this.selectedCategory}`);

            statsText = `Found ${this.animateCounter(total)} post${total !== 1 ? 's' : ''} for ${filters.join(' in ')}`;

            if (total > this.postsPerPage) {
                statsText += ` (showing ${start}-${end})`;
            }
        }

        statsElement.innerHTML = this.highlightSearchTerms(statsText);
    }

    animateCounter(target) {
        // Simple counter animation
        return `<span class="animated-counter" data-target="${target}">${target}</span>`;
    }

    highlightSearchTerms(text) {
        if (!this.searchTerm || !text) return text;

        const regex = new RegExp(`(${this.searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    updateClearButton() {
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.classList.toggle('show', !!(this.searchTerm || this.selectedCategory));
        }
    }

    clearSearch() {
        // Clear search input
        const searchBox = document.getElementById('blogSearchBox');
        if (searchBox) searchBox.value = '';

        // Clear filters
        this.searchTerm = '';
        this.selectedCategory = '';
        this.currentPage = 1;

        // Update category buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === '');
        });

        // Reset to all posts
        this.filteredPosts = [...this.allPosts];
        this.toggleSections(false);
        this.updateClearButton();
        this.updateURL();

        // Hide recovery info
        const recoveryInfo = document.getElementById('recoveryInfo');
        if (recoveryInfo) recoveryInfo.classList.remove('show');
    }

    /**
     * Public method to perform search - called by external scripts
     * @param {string} query - Search term
     */
    performSearch(query) {
        this.searchTerm = query.toLowerCase().trim();
        this.currentPage = 1;
        this.applyFilters();
        this.updateURL();
    }

    renderPosts() {
        const container = document.getElementById('searchResultsGrid');
        const noResultsDiv = document.getElementById('noResults');

        if (!container) return;

        if (this.filteredPosts.length === 0) {
            container.innerHTML = '';
            if (noResultsDiv) noResultsDiv.style.display = 'block';
            return;
        }

        if (noResultsDiv) noResultsDiv.style.display = 'none';

        // Paginate posts
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        // Render post cards
        container.innerHTML = postsToShow.map((post, index) => this.createPostCard(post, index)).join('');

        // Add staggered animation
        this.animateCards();

        // Render pagination
        this.renderPagination();

        // Scroll to grid if not on first page
        if (this.currentPage > 1) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    createPostCard(post, index) {
        return `
            <article class="blog-card" style="animation-delay: ${index * 0.05}s;">
                <div class="blog-card-content">
                    ${post.featured ? '<div class="featured-badge">⭐ Featured</div>' : ''}
                    <div class="blog-card-categories">
                        <span class="blog-card-category">
                            ${post.categoryEmoji} ${post.category}
                        </span>
                        ${post.tags && post.tags.length > 0 ? `
                            <span class="blog-card-category secondary">
                                ${post.tags[0]}
                            </span>
                        ` : ''}
                    </div>
                    <h2 class="blog-card-title">
                        <a href="${post.url}">${this.highlightSearchTerms(post.title)}</a>
                    </h2>
                    <p class="blog-card-excerpt">
                        ${this.highlightSearchTerms(post.excerpt)}
                    </p>
                    <div class="blog-card-meta">
                        <span>👤 ${post.author}</span>
                        <span>📅 ${post.publishedDate}</span>
                        <span>⏱️ ${post.readTime}</span>
                    </div>
                </div>
            </article>
        `;
    }

    animateCards() {
        const cards = document.querySelectorAll('#searchResultsGrid .blog-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        if (totalPages <= 1) return;

        const paginationHTML = this.createPaginationHTML(totalPages);

        // Add pagination at top and bottom
        this.addPaginationToContainer('#searchResults .container', paginationHTML, 'top');
        this.addPaginationToContainer('#searchResults .container', paginationHTML, 'bottom');
    }

    createPaginationHTML(totalPages) {
        const maxVisible = 5;
        const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);

        let pagination = `
            <nav class="pagination">
                <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}"
                        data-page="${this.currentPage - 1}"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
        `;

        // Add ellipsis at start if needed
        if (start > 1) {
            pagination += `<button class="pagination-btn" data-page="1">1</button>`;
            if (start > 2) {
                pagination += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Add page numbers
        for (let i = start; i <= end; i++) {
            pagination += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                        data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Add ellipsis at end if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pagination += `<span class="pagination-ellipsis">...</span>`;
            }
            pagination += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        pagination += `
                <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}"
                        data-page="${this.currentPage + 1}"
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next →
                </button>
            </nav>
        `;

        return pagination;
    }

    addPaginationToContainer(containerSelector, paginationHTML, position) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Remove existing pagination
        const existingPagination = container.querySelector(`.pagination-${position}`);
        if (existingPagination) {
            existingPagination.remove();
        }

        // Create new pagination wrapper
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = `pagination-wrapper pagination-${position}`;
        paginationWrapper.innerHTML = paginationHTML;

        // Add event listeners
        paginationWrapper.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn') && !e.target.disabled) {
                const page = parseInt(e.target.getAttribute('data-page'));
                this.currentPage = page;
                this.applyFilters();
                this.updateURL();
            }
        });

        // Insert at appropriate position
        if (position === 'top') {
            container.insertBefore(paginationWrapper, container.firstChild);
        } else {
            container.appendChild(paginationWrapper);
        }
    }

    setupRSSFeed() {
        // Add RSS feed link to head if not exists
        if (!document.querySelector('link[type="application/rss+xml"]')) {
            const rssLink = document.createElement('link');
            rssLink.rel = 'alternate';
            rssLink.type = 'application/rss+xml';
            rssLink.title = 'Gheware DevOps AI RSS Feed';
            rssLink.href = '/blog/rss.xml';
            document.head.appendChild(rssLink);
        }

        // RSS button is now hardcoded in HTML, no need to add dynamically
    }

    showLoading(show) {
        const loading = document.getElementById('searchLoading');
        if (loading) {
            loading.classList.toggle('show', show);
        }
    }

    showError() {
        const container = document.getElementById('searchResultsGrid');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Unable to load blog posts</h3>
                    <p>Please try refreshing the page or contact support if the problem persists.</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready and expose globally
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedBlogSearch = new EnhancedBlogSearch();
});

// Animate counters when they become visible
function animateCounters() {
    const counters = document.querySelectorAll('.animated-counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50; // 50 steps

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 20);
    });
}

// Run counter animation on load
document.addEventListener('DOMContentLoaded', animateCounters);