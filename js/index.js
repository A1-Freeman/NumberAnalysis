// js/index.js - Home page with historical query functionality

// Color mapping for numbers (static, based on actual wave colors)
const COLOR_MAP = {
    // Red group
    1: '#ef4444', 2: '#ef4444', 7: '#ef4444', 8: '#ef4444', 
    12: '#ef4444', 13: '#ef4444', 18: '#ef4444', 19: '#ef4444',
    23: '#ef4444', 24: '#ef4444', 29: '#ef4444', 30: '#ef4444',
    34: '#ef4444', 35: '#ef4444', 40: '#ef4444', 45: '#ef4444', 46: '#ef4444',
    
    // Blue group
    3: '#3b82f6', 4: '#3b82f6', 9: '#3b82f6', 10: '#3b82f6',
    14: '#3b82f6', 15: '#3b82f6', 20: '#3b82f6', 25: '#3b82f6',
    26: '#3b82f6', 31: '#3b82f6', 36: '#3b82f6', 37: '#3b82f6',
    41: '#3b82f6', 42: '#3b82f6', 47: '#3b82f6', 48: '#3b82f6',
    
    // Green group
    5: '#10b981', 6: '#10b981', 11: '#10b981', 16: '#10b981',
    17: '#10b981', 21: '#10b981', 22: '#10b981', 27: '#10b981',
    28: '#10b981', 32: '#10b981', 33: '#10b981', 38: '#10b981',
    39: '#10b981', 43: '#10b981', 44: '#10b981', 49: '#10b981'
};

// State management
let historicalDraws = []; // Will store multiple draws
let currentPage = 1;
const DRAWS_PER_PAGE = 8;
let currentQuery = {
    type: 'single', // 'single', 'range', 'recent'
    value: null,
    special: null
};

// Load home page data
async function loadHomePageData() {
    console.log('Loading home page data...');
    core.showLoading();
    
    try {
        await core.fetchData(); // This gets the latest draw
        displayLatestDraw();
        displayQuickStats();
        
        // Also load some historical data for demo
        await loadHistoricalDraws(5); // Load last 5 draws
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    } catch (error) {
        console.error('Error loading data:', error);
        core.showError(error.message);
    }
}

// Load historical draws (simulated for now - would need historical API)
async function loadHistoricalDraws(count) {
    // This is a simulation - in reality, you'd need an API that provides historical data
    // For now, we'll generate some sample historical draws based on the current one
    const currentData = core.hkData();
    if (!currentData || !currentData.hk) return;
    
    const hk = currentData.hk;
    const currentNumbers = hk.openCode.split(',').map(n => parseInt(n.trim()));
    
    // Generate sample historical draws
    historicalDraws = [];
    for (let i = 1; i <= count; i++) {
        const drawNumber = parseInt(hk.expect) - i;
        const drawDate = new Date(hk.openTime);
        drawDate.setDate(drawDate.getDate() - (i * 3)); // Roughly every 3 days
        
        // Generate slightly different numbers
        const numbers = currentNumbers.map(n => {
            let newNum = n + (i * 2);
            if (newNum > 49) newNum = newNum - 48;
            return newNum;
        }).sort((a, b) => a - b);
        
        historicalDraws.push({
            drawNumber: drawNumber.toString(),
            openTime: drawDate.toISOString(),
            numbers: numbers,
            isSnowball: i === 2 || i === 4 // Mark some as snowballs for demo
        });
    }
    
    displayResults();
}

// Display latest draw
function displayLatestDraw() {
    const data = core.hkData();
    if (!data || !data.hk) return;
    
    const hk = data.hk;
    const numbers = hk.openCode.split(',').map(n => parseInt(n.trim()));
    const container = document.getElementById('latestDraw');
    if (!container) return;
    
    const ballsHtml = numbers.map(num => {
        const color = COLOR_MAP[num] || '#ef4444';
        return `
            <div class="draw-ball" style="background: ${color}">
                <div class="ball-inner">${num}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="draw-header">
            <div class="draw-number">Draw #${hk.expect}</div>
            <div class="draw-date">${core.formatDate(hk.openTime)}</div>
        </div>
        <div class="numbers-row">
            ${ballsHtml}
        </div>
    `;
}

// Display quick stats
function displayQuickStats() {
    const data = core.hkData();
    if (!data || !data.hk) return;
    
    const hk = data.hk;
    const numbers = hk.openCode.split(',').map(n => parseInt(n.trim()));
    
    const sum = numbers.reduce((a, b) => a + b, 0);
    const odd = numbers.filter(n => n % 2 === 1).length;
    const even = numbers.filter(n => n % 2 === 0).length;
    const high = numbers.filter(n => n > 24).length;
    const low = numbers.filter(n => n <= 24).length;
    const range = Math.max(...numbers) - Math.min(...numbers);
    
    const container = document.getElementById('quickStats');
    if (!container) return;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-label">Sum</div>
            <div class="stat-value">${sum}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">⚖️</div>
            <div class="stat-label">Odd/Even</div>
            <div class="stat-value">${odd}:${even}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-label">High/Low</div>
            <div class="stat-value">${high}:${low}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📏</div>
            <div class="stat-label">Range</div>
            <div class="stat-value">${range}</div>
        </div>
    `;
}

// Display results grid
function displayResults() {
    const container = document.getElementById('resultsGrid');
    const countEl = document.getElementById('resultsCount');
    if (!container) return;
    
    if (historicalDraws.length === 0) {
        container.innerHTML = '<div class="no-results">No draws found matching your criteria</div>';
        if (countEl) countEl.textContent = 'Showing 0 draws';
        return;
    }
    
    // Paginate
    const start = (currentPage - 1) * DRAWS_PER_PAGE;
    const end = start + DRAWS_PER_PAGE;
    const paginatedDraws = historicalDraws.slice(start, end);
    
    container.innerHTML = paginatedDraws.map(draw => {
        const numbers = draw.numbers || [];
        const sum = numbers.reduce((a, b) => a + b, 0);
        
        const ballsHtml = numbers.map(num => {
            const color = COLOR_MAP[num] || '#ef4444';
            return `
                <div class="card-ball" style="background: ${color}">
                    <div class="inner">${num}</div>
                </div>
            `;
        }).join('');
        
        const snowballBadge = draw.isSnowball ? 
            '<span class="snowball-badge">🏆 Snowball</span>' : '';
        
        return `
            <div class="result-card">
                <div class="card-header">
                    <span class="card-draw-number">#${draw.drawNumber}</span>
                    <span class="card-draw-date">${core.formatDate(draw.openTime).split(',')[0]}</span>
                </div>
                <div class="card-numbers">
                    ${ballsHtml}
                </div>
                <div class="card-stats">
                    <span>Sum: ${sum}</span>
                    ${snowballBadge}
                </div>
            </div>
        `;
    }).join('');
    
    if (countEl) {
        countEl.textContent = `Showing ${start + 1}-${Math.min(end, historicalDraws.length)} of ${historicalDraws.length} draws`;
    }
    
    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!prevBtn || !nextBtn) return;
    
    const totalPages = Math.ceil(historicalDraws.length / DRAWS_PER_PAGE);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

// Handle query type change
function initQueryInterface() {
    const radioButtons = document.querySelectorAll('input[name="queryType"]');
    const singleInput = document.getElementById('singleInput');
    const rangeInput = document.getElementById('rangeInput');
    const recentInput = document.getElementById('recentInput');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Hide all input groups
            singleInput.style.display = 'none';
            rangeInput.style.display = 'none';
            recentInput.style.display = 'none';
            
            // Show selected
            if (e.target.value === 'single') {
                singleInput.style.display = 'flex';
            } else if (e.target.value === 'range') {
                rangeInput.style.display = 'flex';
            } else if (e.target.value === 'recent') {
                recentInput.style.display = 'flex';
            }
            
            currentQuery.type = e.target.value;
        });
    });
    
    // Recent draws slider
    const recentSlider = document.getElementById('recentSlider');
    const recentValue = document.getElementById('recentValue');
    
    if (recentSlider) {
        recentSlider.addEventListener('input', (e) => {
            recentValue.textContent = e.target.value;
        });
    }
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }
    
    // Special filters
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            applySpecialFilters();
        });
    });
}

// Perform search based on current query
async function performSearch() {
    console.log('Performing search with type:', currentQuery.type);
    
    // In a real implementation, you'd call an API here
    // For now, we'll just reload the sample data
    
    if (currentQuery.type === 'recent') {
        const count = document.getElementById('recentSlider').value;
        await loadHistoricalDraws(parseInt(count));
    }
    
    currentPage = 1;
}

// Clear search
function clearSearch() {
    // Reset inputs
    document.getElementById('drawNumber').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('recentSlider').value = '5';
    document.getElementById('recentValue').textContent = '5';
    
    // Reset to recent 5 draws
    currentQuery.type = 'recent';
    document.querySelector('input[value="recent"]').checked = true;
    document.getElementById('singleInput').style.display = 'none';
    document.getElementById('rangeInput').style.display = 'none';
    document.getElementById('recentInput').style.display = 'flex';
    
    // Reload
    loadHistoricalDraws(5);
}

// Apply special filters
function applySpecialFilters() {
    const activeFilters = [];
    document.querySelectorAll('.filter-chip.active').forEach(chip => {
        activeFilters.push(chip.dataset.filter);
    });
    
    console.log('Active filters:', activeFilters);
    
    // Filter the historical draws based on active filters
    // This would need real data with filterable properties
    displayResults();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Index page DOM loaded');
    core.initCommon();
    
    // Initialize query interface
    initQueryInterface();
    
    // Load data
    loadHomePageData();
    
    // Pagination buttons
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(historicalDraws.length / DRAWS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            displayResults();
        }
    });
});

// Make refresh function available globally
window.refreshCurrentPage = loadHomePageData;