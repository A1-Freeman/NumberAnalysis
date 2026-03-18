// js/index.js - Home page specific code

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

// Load home page data
async function loadHomePageData() {
    console.log('Loading home page data...');
    core.showLoading();
    
    try {
        await core.fetchData();
        displayHomePage();
    } catch (error) {
        console.error('Error loading data:', error);
        core.showError(error.message);
    }
}

// Display home page content
function displayHomePage() {
    const data = core.hkData();
    if (!data || !data.hk) {
        core.showError('Hong Kong data not available');
        return;
    }
    
    const hk = data.hk;
    
    // Parse data - convert to integers (remove leading zeros)
    const numbers = hk.openCode.split(',').map(n => parseInt(n.trim()));
    const waveColors = hk.wave.split(',');
    const zodiacs = hk.zodiac.split(',');
    
    // Display sections
    displayLatestDraw(hk.expect, hk.openTime, numbers, waveColors, zodiacs);
    displayStatistics(numbers);
    displayAdditionalInfo(numbers, waveColors, zodiacs);
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Update last updated
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated) {
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    }
}

// Display latest draw with machine-style balls
function displayLatestDraw(drawNumber, drawDate, numbers, waveColors, zodiacs) {
    const container = document.getElementById('latestDraw');
    if (!container) return;
    
    // Format date nicely
    const formattedDate = core.formatDate(drawDate);
    
    // Create balls HTML
    const ballsHtml = numbers.map((num, index) => {
        // Use static color mapping for consistency
        const color = COLOR_MAP[num] || '#ef4444';
        
        return `
            <div class="draw-ball" style="background: ${color}">
                <div class="ball-inner">${num}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="draw-header">
            <div class="draw-number">Draw #${drawNumber}</div>
            <div class="draw-date">${formattedDate}</div>
        </div>
        <div class="numbers-row">
            ${ballsHtml}
        </div>
    `;
}

// Display statistics
function displayStatistics(numbers) {
    const container = document.getElementById('statistics');
    if (!container) return;
    
    const numArray = numbers.map(n => parseInt(n));
    
    // Calculate statistics
    const sum = numArray.reduce((a, b) => a + b, 0);
    const odd = numArray.filter(n => n % 2 === 1).length;
    const even = numArray.filter(n => n % 2 === 0).length;
    const high = numArray.filter(n => n > 24).length;
    const low = numArray.filter(n => n <= 24).length;
    
    // Calculate ranges
    const ranges = {
        '1-10': numArray.filter(n => n <= 10).length,
        '11-20': numArray.filter(n => n > 10 && n <= 20).length,
        '21-30': numArray.filter(n => n > 20 && n <= 30).length,
        '31-40': numArray.filter(n => n > 30 && n <= 40).length,
        '41-49': numArray.filter(n => n > 40).length
    };
    
    // Find most common range
    const mostCommonRange = Object.entries(ranges).reduce((a, b) => 
        a[1] > b[1] ? a : b
    )[0];
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-label">Total Sum</div>
                <div class="stat-value">${sum}</div>
                <div class="stat-subtitle">Average: ${(sum/7).toFixed(1)}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⚖️</div>
                <div class="stat-label">Odd/Even</div>
                <div class="stat-value">${odd} : ${even}</div>
                <div class="stat-subtitle">${odd > even ? 'More odd' : 'More even'}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-label">High/Low</div>
                <div class="stat-value">${high} : ${low}</div>
                <div class="stat-subtitle">${high > low ? 'More high (25-49)' : 'More low (1-24)'}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-label">Most Common Range</div>
                <div class="stat-value">${mostCommonRange}</div>
                <div class="stat-subtitle">Numbers ${mostCommonRange}</div>
            </div>
        </div>
    `;
}

function displayAdditionalInfo(numbers, waveColors) {
    const container = document.getElementById('additionalInfo');
    if (!container) return;
    
    // Count colors from API
    const colorCount = waveColors.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {});
    
    // Get min/max
    const numArray = numbers.map(n => parseInt(n));
    const maxNum = Math.max(...numArray);
    const minNum = Math.min(...numArray);
    
    container.innerHTML = `
        <div class="extra-grid">
            <div class="extra-card">
                <div class="extra-title">Wave Color Distribution</div>
                <div class="extra-content">
                    <div><span class="color-dot" style="background: #ef4444"></span> Red: ${colorCount['red'] || 0}</div>
                    <div><span class="color-dot" style="background: #3b82f6"></span> Blue: ${colorCount['blue'] || 0}</div>
                    <div><span class="color-dot" style="background: #10b981"></span> Green: ${colorCount['green'] || 0}</div>
                </div>
                <div class="badge ${getDominantColorBadge(colorCount)}">
                    👑 Dominant: ${getDominantColor(colorCount)}
                </div>
            </div>
            
            <div class="extra-card">
                <div class="extra-title">Number Range</div>
                <div class="extra-content">
                    <div>📈 Highest: ${maxNum}</div>
                    <div>📉 Lowest: ${minNum}</div>
                    <div>📊 Range: ${maxNum - minNum}</div>
                </div>
                <div class="badge badge-blue">
                    Spread: ${maxNum - minNum}
                </div>
            </div>
            
            <div class="extra-card">
                <div class="extra-title">Quick Stats</div>
                <div class="extra-content">
                    <div>🎯 Total numbers: 7</div>
                    <div>📅 Draws tracked: 1</div>
                </div>
                <div class="badge badge-green">
                    Current draw only
                </div>
            </div>
        </div>
    `;
}

// Helper: Get dominant color
function getDominantColor(colorCount) {
    let dominant = 'Red';
    let maxCount = 0;
    
    if ((colorCount['red'] || 0) > maxCount) {
        maxCount = colorCount['red'];
        dominant = 'Red';
    }
    if ((colorCount['blue'] || 0) > maxCount) {
        maxCount = colorCount['blue'];
        dominant = 'Blue';
    }
    if ((colorCount['green'] || 0) > maxCount) {
        maxCount = colorCount['green'];
        dominant = 'Green';
    }
    
    return dominant;
}

// Helper: Get badge class for dominant color
function getDominantColorBadge(colorCount) {
    const dominant = getDominantColor(colorCount);
    switch(dominant) {
        case 'Red': return 'badge-red';
        case 'Blue': return 'badge-blue';
        case 'Green': return 'badge-green';
        default: return 'badge-blue';
    }
}

// Make refresh function available globally
window.refreshCurrentPage = loadHomePageData;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Index page DOM loaded');
    core.initCommon();
    loadHomePageData();
});