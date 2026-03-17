// core.js - Shared functionality for all pages

// Configuration
const CONFIG = {
    API_URL: 'https://number-analysis-proxy.vineroz.workers.dev',
    REFRESH_INTERVAL: 300000, // 5 minutes
    COLORS: {
        'red': '#ef4444',
        'blue': '#3b82f6',
        'green': '#10b981'
    }
};

// Global state
let hkData = null;
let lastUpdate = null;

// Theme management
function initTheme() {
    console.log('Initializing theme'); // Debug log
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const themeIcons = document.querySelectorAll('.theme-icon, .theme-toggle-icon');
    themeIcons.forEach(icon => {
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// Data fetching
async function fetchData() {
    console.log('Fetching data from:', CONFIG.API_URL); // Debug log
    
    try {
        const response = await fetch(CONFIG.API_URL);
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data); // Debug log
        
        hkData = data;
        lastUpdate = new Date();
        
        // Update last updated display on all pages
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${lastUpdate.toLocaleString()}`;
        }
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Helper functions
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr.replace(/\//g, '-'));
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
}

function showLoading() {
    console.log('Showing loading state'); // Debug log
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    const errorEl = document.getElementById('error');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
}

function showError(message) {
    console.error('Showing error:', message); // Debug log
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    const errorEl = document.getElementById('error');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'none';
    
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = `⚠️ Error: ${message}. Please try again.`;
    }
}

// Sidebar functionality
function initSidebar() {
    console.log('Initializing sidebar'); // Debug log
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}

// Initialize common elements
function initCommon() {
    console.log('Initializing common elements'); // Debug log
    initTheme();
    initSidebar();
    
    // Theme toggle buttons
    const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-mini');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (window.refreshCurrentPage) {
                window.refreshCurrentPage();
            }
        });
    }
}

// Make functions globally available
window.core = {
    CONFIG,
    hkData: () => hkData,
    lastUpdate: () => lastUpdate,
    fetchData,
    formatDate,
    showLoading,
    showError,
    initCommon,
    toggleTheme
};

console.log('Core.js loaded'); // Debug log