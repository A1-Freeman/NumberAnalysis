// app.js - Hong Kong focused version

const CONFIG = {
    // Use your Cloudflare Worker URL
    API_URL: 'https://number-analysis-proxy.vineroz.workers.dev',
    REFRESH_INTERVAL: 300000, // 5 minutes
    COLORS: {
        'red': '#ef4444',
        'blue': '#3b82f6',
        'green': '#10b981'
    }
};

// State management
let hkData = null;
let lastUpdate = null;

// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-toggle-icon');

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Format date
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

// Calculate statistics
function calculateStats(numbers) {
    const numArray = numbers.map(n => parseInt(n));
    const sum = numArray.reduce((a, b) => a + b, 0);
    const odd = numArray.filter(n => n % 2 === 1).length;
    const even = numArray.filter(n => n % 2 === 0).length;
    const high = numArray.filter(n => n > 24).length;
    const low = numArray.filter(n => n <= 24).length;
    
    // Find most common range
    const ranges = {
        '1-10': numArray.filter(n => n <= 10).length,
        '11-20': numArray.filter(n => n > 10 && n <= 20).length,
        '21-30': numArray.filter(n => n > 20 && n <= 30).length,
        '31-40': numArray.filter(n => n > 30 && n <= 40).length,
        '41-49': numArray.filter(n => n > 40).length
    };
    
    const mostCommonRange = Object.entries(ranges).reduce((a, b) => 
        a[1] > b[1] ? a : b
    )[0];
    
    return { sum, odd, even, high, low, mostCommonRange };
}

// Get zodiac animal emoji
function getZodiacEmoji(zodiac) {
    const emojis = {
        '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰',
        '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑',
        '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷'
    };
    return emojis[zodiac] || '⭐';
}

// Display Hong Kong data
function displayHongKongData(data) {
    if (!data || !data.hk) {
        showError('Hong Kong data not available');
        return;
    }
    
    const hk = data.hk;
    
    // Parse data
    const drawNumber = hk.expect;
    const drawDate = hk.openTime;
    const numbers = hk.openCode.split(',');
    const waveColors = hk.wave.split(',');
    const zodiacs = hk.zodiac.split(',');
    
    // Calculate statistics
    const stats = calculateStats(numbers);
    
    // Display latest draw
    displayLatestDraw(drawNumber, drawDate, numbers, waveColors, zodiacs);
    
    // Display insights
    displayInsights(stats, numbers);
    
    // Display extra info (wave colors and zodiacs)
    displayExtraInfo(waveColors, zodiacs, numbers);
}

// Display latest draw
function displayLatestDraw(drawNumber, drawDate, numbers, waveColors, zodiacs) {
    const heroSection = document.getElementById('heroSection');
    
    const ballsHtml = numbers.map((num, index) => {
        const color = CONFIG.COLORS[waveColors[index]] || '#6366f1';
        const zodiac = zodiacs[index];
        const emoji = getZodiacEmoji(zodiac);
        return `
            <div class="ball-large" style="background-color: ${color}">
                ${num}
                <small>${emoji} ${zodiac}</small>
            </div>
        `;
    }).join('');
    
    document.getElementById('latestDrawCard').innerHTML = `
        <div class="draw-header-large">
            <span class="draw-number-large">Draw #${drawNumber}</span>
            <span class="draw-date-large">${formatDate(drawDate)}</span>
        </div>
        <div class="numbers-row">
            ${ballsHtml}
        </div>
    `;
}

// Display insights
function displayInsights(stats, numbers) {
    const insightsGrid = document.getElementById('insightsGrid');
    
    insightsGrid.innerHTML = `
        <div class="insight-card">
            <div class="insight-icon">📊</div>
            <div class="insight-title">Total Sum</div>
            <div class="insight-value">${stats.sum}</div>
            <div class="insight-subtitle">Average: ${(stats.sum/7).toFixed(1)}</div>
        </div>
        
        <div class="insight-card">
            <div class="insight-icon">⚖️</div>
            <div class="insight-title">Odd vs Even</div>
            <div class="insight-value">${stats.odd} : ${stats.even}</div>
            <div class="insight-subtitle">${stats.odd > stats.even ? 'More odd' : 'More even'}</div>
        </div>
        
        <div class="insight-card">
            <div class="insight-icon">📈</div>
            <div class="insight-title">High vs Low</div>
            <div class="insight-value">${stats.high} : ${stats.low}</div>
            <div class="insight-subtitle">${stats.high > stats.low ? 'More high (25-49)' : 'More low (1-24)'}</div>
        </div>
        
        <div class="insight-card">
            <div class="insight-icon">🎯</div>
            <div class="insight-title">Most Common Range</div>
            <div class="insight-value">${stats.mostCommonRange}</div>
            <div class="insight-subtitle">Numbers ${stats.mostCommonRange}</div>
        </div>
    `;
}

// Display extra info (wave colors and zodiacs)
function displayExtraInfo(waveColors, zodiacs, numbers) {
    const extraInfoGrid = document.getElementById('extraInfoGrid');
    
    // Count wave colors
    const colorCount = waveColors.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {});
    
    // Find dominant color
    const dominantColor = Object.entries(colorCount).reduce((a, b) => 
        a[1] > b[1] ? a : b
    )[0];
    
    // Count zodiacs
    const zodiacCount = zodiacs.reduce((acc, zodiac) => {
        acc[zodiac] = (acc[zodiac] || 0) + 1;
        return acc;
    }, {});
    
    // Find repeated zodiacs
    const repeatedZodiacs = Object.entries(zodiacCount)
        .filter(([_, count]) => count > 1)
        .map(([zodiac, count]) => `${zodiac} (${count}x)`);
    
    extraInfoGrid.innerHTML = `
        <div class="extra-info-card">
            <div class="extra-info-label">Wave Color Distribution</div>
            <div class="extra-info-value">
                ${Object.entries(colorCount).map(([color, count]) => 
                    `<span style="color: ${CONFIG.COLORS[color]}">●</span> ${count}`
                ).join(' ')}
            </div>
            <div class="extra-info-tag ${dominantColor === 'red' ? 'tag-red' : dominantColor === 'blue' ? 'tag-blue' : 'tag-green'}">
                Dominant: ${dominantColor}
            </div>
        </div>
        
        <div class="extra-info-card">
            <div class="extra-info-label">Zodiac Animals</div>
            <div class="extra-info-value">
                ${zodiacs.map(z => getZodiacEmoji(z)).join(' ')}
            </div>
            <div class="extra-info-tag tag-blue">
                ${zodiacs.join(' • ')}
            </div>
        </div>
        
        <div class="extra-info-card">
            <div class="extra-info-label">Special Patterns</div>
            <div class="extra-info-value">
                ${repeatedZodiacs.length > 0 ? '🔄 Repeated' : '✨ All unique'}
            </div>
            <div class="extra-info-tag ${repeatedZodiacs.length > 0 ? 'tag-red' : 'tag-green'}">
                ${repeatedZodiacs.length > 0 ? repeatedZodiacs.join(', ') : 'No repeats'}
            </div>
        </div>
        
        <div class="extra-info-card">
            <div class="extra-info-label">Number Range Spread</div>
            <div class="extra-info-value">
                ${Math.max(...numbers.map(n => parseInt(n)))} / ${Math.min(...numbers.map(n => parseInt(n)))}
            </div>
            <div class="extra-info-tag tag-blue">
                Range: ${Math.max(...numbers.map(n => parseInt(n))) - Math.min(...numbers.map(n => parseInt(n)))}
            </div>
        </div>
    `;
}

// Fetch data from Cloudflare Worker
async function fetchData() {
    try {
        const response = await fetch(CONFIG.API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        hkData = data;
        lastUpdate = new Date();
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Update UI
function updateUI() {
    if (hkData) {
        displayHongKongData(hkData);
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${lastUpdate.toLocaleString()}`;
    }
}

// Show loading state
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

// Show error state
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'block';
    errorDiv.textContent = `⚠️ Error: ${message}. Please try again.`;
}

// Main load function
async function loadData() {
    showLoading();
    
    try {
        await fetchData();
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        updateUI();
    } catch (error) {
        showError(error.message);
    }
}

// Initialize app
function initApp() {
    initTheme();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    document.getElementById('refreshBtn').addEventListener('click', loadData);
    
    // Initial load
    loadData();
    
    // Auto-refresh
    setInterval(loadData, CONFIG.REFRESH_INTERVAL);
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);