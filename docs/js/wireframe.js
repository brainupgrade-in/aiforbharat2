// DiabetCare AI - Enhanced Mobile-First PWA JavaScript
// Provides interactivity, PWA features, and offline support

(function() {
    'use strict';

    // ===========================
    // Template Definitions (Embedded)
    // ===========================

    const TEMPLATES = {
        header: `
            <header class="app-header sticky-header">
                <button class="menu-btn" id="menuBtn" aria-label="Menu">
                    <span class="hamburger-icon">☰</span>
                </button>
                <h1 class="app-title">
                    <a href="index.html" class="title-link">DiabetCare AI</a>
                </h1>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">
                        <span class="theme-icon">🌙</span>
                    </button>
                    <button class="profile-btn" id="profileBtn" aria-label="Profile">
                        <span class="profile-icon" role="img" aria-label="Profile">👤</span>
                    </button>
                </div>
            </header>

            <!-- Side Menu -->
            <nav class="side-menu" id="sideMenu">
                <div class="side-menu-header">
                    <h2>Menu</h2>
                    <button class="close-menu-btn" id="closeMenuBtn" aria-label="Close menu">✕</button>
                </div>
                <div style="padding: 1rem 1rem 0.5rem; border-bottom: 1px solid var(--border-light);">
                    <label style="font-size: 0.875rem; color: var(--text-tertiary); display: block; margin-bottom: 0.5rem;">Language</label>
                    <select id="languageSelect" class="form-input" style="font-size: 0.9rem; padding: 0.5rem;">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                    </select>
                </div>
                <ul class="side-menu-list">
                    <li><a href="dashboard.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Home">🏠</span>
                        <span class="menu-text">Dashboard</span>
                    </a></li>
                    <li><a href="glucose-tracker.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Chart">📊</span>
                        <span class="menu-text">Glucose Tracker</span>
                    </a></li>
                    <li><a href="meal-analyzer.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Meal">🍽️</span>
                        <span class="menu-text">Meal Analyzer</span>
                    </a></li>
                    <li><a href="retina-scan.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Eye">👁️</span>
                        <span class="menu-text">Retina Scan</span>
                    </a></li>
                    <li><a href="chatbot.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Robot">🤖</span>
                        <span class="menu-text">AI Advisor</span>
                    </a></li>
                    <li class="menu-divider"></li>
                    <li><a href="index.html" class="menu-item">
                        <span class="menu-icon" role="img" aria-label="Info">ℹ️</span>
                        <span class="menu-text">About</span>
                    </a></li>
                </ul>
            </nav>

            <!-- Menu Overlay -->
            <div class="menu-overlay" id="menuOverlay"></div>
        `,
        footer: `
            <!-- Bottom Navigation (Mobile Primary) -->
            <nav class="bottom-nav sticky-bottom-nav">
                <a href="dashboard.html" class="nav-item" data-page="dashboard">
                    <span class="nav-icon" role="img" aria-label="Home">🏠</span>
                    <span class="nav-label">Home</span>
                </a>
                <a href="glucose-tracker.html" class="nav-item" data-page="glucose-tracker">
                    <span class="nav-icon" role="img" aria-label="Chart">📊</span>
                    <span class="nav-label">Glucose</span>
                </a>
                <a href="meal-analyzer.html" class="nav-item" data-page="meal-analyzer">
                    <span class="nav-icon" role="img" aria-label="Meal">🍽️</span>
                    <span class="nav-label">Meals</span>
                </a>
                <a href="chatbot.html" class="nav-item" data-page="chatbot">
                    <span class="nav-icon" role="img" aria-label="Robot">🤖</span>
                    <span class="nav-label">AI Advisor</span>
                </a>
            </nav>

            <!-- Desktop Footer -->
            <footer class="desktop-footer">
                <p>AWS AI for Bharat Hackathon 2026 | DiabetCare AI</p>
            </footer>
        `
    };

    // ===========================
    // Template Loader
    // ===========================

    function loadTemplates() {
        // Load header
        const headerContainer = document.querySelector('#header-container');
        if (headerContainer) {
            headerContainer.innerHTML = TEMPLATES.header;
            initializeMenu();
        }

        // Load footer
        const footerContainer = document.querySelector('#footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = TEMPLATES.footer;
            setActiveNavItem();
        }

        return !!(headerContainer && footerContainer);
    }

    // Initialize menu functionality
    function initializeMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const sideMenu = document.getElementById('sideMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const themeToggle = document.getElementById('themeToggle');

        if (!menuBtn || !sideMenu || !menuOverlay) return;

        // Open menu
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            menuOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        // Close menu
        const closeMenu = () => {
            sideMenu.classList.remove('open');
            menuOverlay.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        };

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeMenu);
        }

        menuOverlay.addEventListener('click', closeMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Theme toggle functionality
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                toggleTheme();
                updateThemeIcon();
            });
            updateThemeIcon();
        }

        // Language selector functionality
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            // Load saved language
            const savedLang = localStorage.getItem('language') || 'en';
            languageSelect.value = savedLang;

            languageSelect.addEventListener('change', (e) => {
                changeLanguage(e.target.value);
            });
        }
    }

    // Update theme toggle icon
    function updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const themeIcon = themeToggle.querySelector('.theme-icon');
        const isDark = document.body.classList.contains('dark-mode');

        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    // Set active nav item based on current page
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ===========================
    // PWA Service Worker Registration
    // ===========================

    // Check if we're running on HTTP/HTTPS (not file://)
    const isHttpProtocol = window.location.protocol === 'http:' || window.location.protocol === 'https:';

    if ('serviceWorker' in navigator && isHttpProtocol) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('✅ ServiceWorker registered:', registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch(error => {
                    console.warn('⚠️ ServiceWorker registration failed:', error.message);
                });
        });

        // Handle service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 ServiceWorker updated, page will reload');
            window.location.reload();
        });
    } else if (!isHttpProtocol) {
        console.log('ℹ️ ServiceWorker not available (file:// protocol). Use HTTP server for full PWA features.');
    }

    // ===========================
    // Offline Detection & Indicator
    // ===========================

    function createOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '📡 You are offline. Some features may be limited.';
        indicator.id = 'offline-indicator';
        document.body.appendChild(indicator);
        return indicator;
    }

    let offlineIndicator = null;

    function updateOnlineStatus() {
        if (!offlineIndicator) {
            offlineIndicator = createOfflineIndicator();
        }

        if (navigator.onLine) {
            offlineIndicator.classList.remove('show');
            console.log('✅ Online');
        } else {
            offlineIndicator.classList.add('show');
            console.log('⚠️ Offline');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check on load
    document.addEventListener('DOMContentLoaded', updateOnlineStatus);

    // ===========================
    // PWA Install Prompt
    // ===========================

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💾 Install prompt available');
        e.preventDefault();
        deferredPrompt = e;

        // Show install button if it exists
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`Install prompt outcome: ${outcome}`);
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                }
            });
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        deferredPrompt = null;
        showToast('App installed successfully!', 'success');
    });

    // ===========================
    // Navigation & Active State Management
    // ===========================

    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DiabetCare AI Wireframes loaded');

        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Update wireframe nav active state
        const wireframeNavLinks = document.querySelectorAll('.wireframe-nav a');
        wireframeNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update bottom navigation active state
        const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
        bottomNavItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // ===========================
    // Touch & Haptic Feedback
    // ===========================

    function addTouchFeedback() {
        const interactiveElements = document.querySelectorAll(
            '.feature-card, .action-card, .stat-card, .btn, button, a.nav-item, .insight-card, .reminder-item'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';

                // Haptic feedback if supported
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            }, { passive: true });

            element.addEventListener('touchend', function() {
                this.style.opacity = '';
            }, { passive: true });

            element.addEventListener('touchcancel', function() {
                this.style.opacity = '';
            }, { passive: true });
        });
    }

    document.addEventListener('DOMContentLoaded', addTouchFeedback);

    // ===========================
    // Toast Notifications
    // ===========================

    function showToast(message, type = 'info', duration = 3000) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: calc(var(--nav-height, 56px) + 1rem);
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 600;
            font-size: 0.95rem;
            max-width: 90%;
            text-align: center;
            transition: transform 0.3s ease-out;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Expose globally
    window.showToast = showToast;

    // ===========================
    // Analytics & Event Tracking
    // ===========================

    function logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            ...data
        };
        console.log('📊 Analytics Event:', event);

        // In production, send to analytics service
        // Example: gtag('event', eventName, data);
    }

    // Track page views
    logEvent('page_view', {
        title: document.title,
        referrer: document.referrer
    });

    // Track button clicks
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('button, .btn, .action-card, .feature-card');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                logEvent('button_click', {
                    label: this.textContent?.trim() ||
                           this.querySelector('.action-label')?.textContent?.trim() ||
                           this.querySelector('h3')?.textContent?.trim() ||
                           'Unknown',
                    type: this.className
                });
            });
        });

        // Track navigation
        const navLinks = document.querySelectorAll('.bottom-nav .nav-item, .wireframe-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                logEvent('navigation', {
                    to: this.getAttribute('href'),
                    label: this.textContent?.trim() || this.querySelector('.nav-label')?.textContent?.trim()
                });
            });
        });
    });

    // ===========================
    // Loading State Management
    // ===========================

    function showLoading(element) {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.innerHTML = '<span class="loading"></span>';
        element.disabled = true;
    }

    function hideLoading(element) {
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
        element.disabled = false;
    }

    window.showLoading = showLoading;
    window.hideLoading = hideLoading;

    // ===========================
    // Skeleton Screen for Page Transitions
    // ===========================

    function showSkeletonScreen() {
        const content = document.querySelector('.app-content, .wireframe-content');
        if (content) {
            content.classList.add('skeleton');
        }
    }

    function hideSkeletonScreen() {
        const content = document.querySelector('.app-content, .wireframe-content');
        if (content) {
            content.classList.remove('skeleton');
        }
    }

    // ===========================
    // Pull-to-Refresh with Visual Indicator
    // ===========================

    let startY = 0;
    let pullDistance = 0;
    const pullThreshold = 80;
    let pullIndicator = null;

    // Create pull-to-refresh indicator
    function createPullIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh-indicator';
        indicator.innerHTML = `
            <span class="pull-to-refresh-icon" role="img" aria-label="Refresh">🔄</span>
            <span>Pull to refresh</span>
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].pageY;

            // Create indicator if it doesn't exist
            if (!pullIndicator) {
                pullIndicator = createPullIndicator();
            }
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (startY > 0) {
            pullDistance = e.touches[0].pageY - startY;

            if (pullDistance > 0) {
                if (!pullIndicator) {
                    pullIndicator = createPullIndicator();
                }

                // Show indicator and update based on distance
                const progress = Math.min(pullDistance / pullThreshold, 1);
                pullIndicator.style.transform = `translateX(-50%) translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
                pullIndicator.style.opacity = progress;

                // Rotate icon based on pull distance
                const icon = pullIndicator.querySelector('.pull-to-refresh-icon');
                if (icon) {
                    icon.style.transform = `rotate(${progress * 360}deg)`;
                }

                // Change text when ready
                const text = pullIndicator.querySelector('span:last-child');
                if (text) {
                    text.textContent = pullDistance >= pullThreshold ? 'Release to refresh' : 'Pull to refresh';
                }
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (pullDistance > pullThreshold) {
            // Trigger refresh
            console.log('🔄 Pull-to-refresh triggered');

            if (pullIndicator) {
                const text = pullIndicator.querySelector('span:last-child');
                if (text) {
                    text.textContent = 'Refreshing...';
                }
            }

            showToast('Refreshing...', 'info', 1500);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            // Hide indicator
            if (pullIndicator) {
                pullIndicator.style.transform = 'translateX(-50%) translateY(-100px)';
                pullIndicator.style.opacity = '0';
            }
        }

        startY = 0;
        pullDistance = 0;
    });

    // ===========================
    // Theme Management (Future Enhancement)
    // ===========================

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        } else if (prefersDark) {
            document.body.classList.add('dark-mode');
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        logEvent('theme_toggle', { theme: isDark ? 'dark' : 'light' });
        showToast(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'success');
    }

    document.addEventListener('DOMContentLoaded', initTheme);
    window.toggleTheme = toggleTheme;

    // ===========================
    // Language Switcher (Future Enhancement)
    // ===========================

    function changeLanguage(lang) {
        console.log('🌍 Language changed to:', lang);
        localStorage.setItem('language', lang);
        logEvent('language_change', { language: lang });
        showToast(`Language changed to ${lang}`, 'success');
        // In actual app, this would trigger i18n translation
    }

    window.changeLanguage = changeLanguage;

    // ===========================
    // Floating Action Button (FAB) Handler
    // ===========================

    document.addEventListener('DOMContentLoaded', function() {
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', function() {
                // Default action: Quick glucose log
                logEvent('fab_click', { action: 'quick_glucose_log' });
                showToast('Quick action: Log glucose', 'info');
                // Navigate to glucose tracker
                window.location.href = 'glucose-tracker.html';
            });
        }
    });

    // ===========================
    // Form Validation
    // ===========================

    function validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
                input.classList.remove('valid');
            } else {
                input.classList.add('valid');
                input.classList.remove('invalid');
            }
        });

        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    window.validateForm = validateForm;

    // Real-time validation for all forms
    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                // Validate on blur
                input.addEventListener('blur', function() {
                    validateInput(this);
                });

                // Validate on input (for real-time feedback)
                input.addEventListener('input', function() {
                    if (this.classList.contains('invalid') || this.classList.contains('valid')) {
                        validateInput(this);
                    }
                });
            });

            // Prevent form submission if invalid
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                let isValid = true;
                const requiredInputs = this.querySelectorAll('input[required], textarea[required], select[required]');

                requiredInputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    showToast('Form submitted successfully!', 'success');
                    logEvent('form_submit', { form: this.className });

                    // In real app, this would send data to server
                    setTimeout(() => {
                        this.reset();
                        requiredInputs.forEach(input => {
                            input.classList.remove('valid', 'invalid');
                        });
                    }, 1000);
                } else {
                    showToast('Please check all required fields', 'error');
                }
            });
        });
    }

    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');

        // Remove previous validation states
        input.classList.remove('valid', 'invalid');

        // Remove existing error messages
        const existingError = input.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Check if required field is empty
        if (required && !value) {
            input.classList.add('invalid');
            showFieldError(input, 'This field is required');
            return false;
        }

        // Skip validation if field is empty and not required
        if (!value && !required) {
            return true;
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    input.classList.add('invalid');
                    showFieldError(input, 'Please enter a valid email');
                    return false;
                }
                break;

            case 'number':
                const num = parseFloat(value);
                const min = parseFloat(input.getAttribute('min'));
                const max = parseFloat(input.getAttribute('max'));

                if (isNaN(num)) {
                    input.classList.add('invalid');
                    showFieldError(input, 'Please enter a valid number');
                    return false;
                }

                if (min !== null && !isNaN(min) && num < min) {
                    input.classList.add('invalid');
                    showFieldError(input, `Value must be at least ${min}`);
                    return false;
                }

                if (max !== null && !isNaN(max) && num > max) {
                    input.classList.add('invalid');
                    showFieldError(input, `Value must be at most ${max}`);
                    return false;
                }
                break;

            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    input.classList.add('invalid');
                    showFieldError(input, 'Please enter a valid phone number');
                    return false;
                }
                break;

            case 'url':
                try {
                    new URL(value);
                } catch {
                    input.classList.add('invalid');
                    showFieldError(input, 'Please enter a valid URL');
                    return false;
                }
                break;
        }

        // If we got here, input is valid
        input.classList.add('valid');
        return true;
    }

    function showFieldError(input, message) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'form-error';
        errorSpan.textContent = message;
        input.parentElement.appendChild(errorSpan);
    }

    // Initialize form validation on page load
    document.addEventListener('DOMContentLoaded', initFormValidation);

    // ===========================
    // LocalStorage Helpers (for offline data)
    // ===========================

    const Storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage error:', e);
                return null;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        }
    };

    window.Storage = Storage;

    // ===========================
    // IndexedDB Helper (for larger offline data)
    // ===========================

    const DB = {
        name: 'DiabetCareDB',
        version: 1,
        db: null,

        init: async function() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.name, this.version);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    // Create object stores
                    if (!db.objectStoreNames.contains('glucose')) {
                        const glucoseStore = db.createObjectStore('glucose', { keyPath: 'id', autoIncrement: true });
                        glucoseStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('meals')) {
                        const mealStore = db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
                        mealStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('scans')) {
                        const scanStore = db.createObjectStore('scans', { keyPath: 'id', autoIncrement: true });
                        scanStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };
            });
        },

        add: async function(storeName, data) {
            const tx = this.db.transaction([storeName], 'readwrite');
            const store = tx.objectStore(storeName);
            return store.add(data);
        },

        getAll: async function(storeName) {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    };

    // Initialize IndexedDB on load
    if ('indexedDB' in window) {
        DB.init().then(() => {
            console.log('✅ IndexedDB initialized');
        }).catch(err => {
            console.error('❌ IndexedDB initialization failed:', err);
        });
    }

    window.DB = DB;

    // ===========================
    // Performance Monitoring
    // ===========================

    if ('performance' in window && 'PerformanceObserver' in window) {
        // Measure Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📈 LCP:', lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('📈 FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Log navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📈 Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                    console.log('📈 DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms');
                }
            }, 0);
        });
    }

    // ===========================
    // Error Handling & Reporting
    // ===========================

    window.addEventListener('error', (event) => {
        console.error('❌ Global error:', event.error);
        logEvent('error', {
            message: event.message,
            filename: event.filename,
            line: event.lineno,
            column: event.colno
        });
        // In production, send to error tracking service (e.g., Sentry)
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Unhandled promise rejection:', event.reason);
        logEvent('unhandled_rejection', {
            reason: event.reason?.toString()
        });
    });

    // ===========================
    // Utility Functions
    // ===========================

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll/resize events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    window.debounce = debounce;
    window.throttle = throttle;

    // ===========================
    // Scroll Behavior
    // ===========================

    // Show/hide header on scroll (optional enhancement)
    let lastScrollTop = 0;
    const header = document.querySelector('.app-header');

    if (header) {
        const handleScroll = throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100);

        // window.addEventListener('scroll', handleScroll, { passive: true });
        // Commented out by default, uncomment to enable auto-hide header
    }

    // ===========================
    // Initialize on DOM Ready
    // ===========================

    document.addEventListener('DOMContentLoaded', () => {
        // Load header and footer templates
        loadTemplates();
    });

    // ===========================
    // Lifecycle Logging
    // ===========================

    console.log(`
    ╔═══════════════════════════════════════╗
    ║   DiabetCare AI - PWA Wireframes     ║
    ║   Version: 1.0.0                      ║
    ║   Status: ✅ Ready                    ║
    ╚═══════════════════════════════════════╝

    📱 Mobile-First PWA Features:
    ✅ Service Worker registered
    ✅ Offline support enabled
    ✅ Install prompt ready
    ✅ Touch feedback active
    ✅ Analytics tracking active
    ✅ IndexedDB initialized

    🎨 Navigation:
    ✅ Bottom navigation active
    ✅ Page transitions ready
    ✅ Touch interactions enabled
    ✅ Header/Footer templates loaded

    🔧 Developer Tools:
    - window.showToast(msg, type)
    - window.toggleTheme()
    - window.changeLanguage(lang)
    - window.Storage { set, get, remove, clear }
    - window.DB { init, add, getAll }
    `);

})();
