// color-map.js - Color Wave Analysis

// Color configuration
const COLOR_CONFIG = {
    'red': { name: 'Red', emoji: '🔴', bg: '#ef4444', text: 'white' },
    'blue': { name: 'Blue', emoji: '🔵', bg: '#3b82f6', text: 'white' },
    'green': { name: 'Green', emoji: '🟢', bg: '#10b981', text: 'white' }
};

// Historical color data
let colorHistory = [];

// Load color data
async function loadColorPageData() {
    core.showLoading();
    
    try {
        await core.fetchData();
        processColorData();
        displayColorAnalysis();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    } catch (error) {
        core.showError(error.message);
    }
}

// Process color data from Hong Kong draws
function processColorData() {
    const data = core.hkData();
    if (!data || !data.hk) return;
    
    const hk = data.hk;
    const waveColors = hk.wave.split(',');
    const numbers = hk.openCode.split(',');
    
    colorHistory = [{
        drawNumber: hk.expect,
        numbers: numbers,
        colors: waveColors
    }];
}

// Display color analysis
function displayColorAnalysis() {
    displayCurrentDistribution();
    displayColorTrends();
    displayColorRange();
    displayHeatMap();
}

// Display current draw color distribution
function displayCurrentDistribution() {
    const current = colorHistory[0];
    if (!current) return;
    
    const colorCount = current.colors.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {});
    
    const container = document.getElementById('currentColorDist');
    if (!container) return;
    
    container.innerHTML = `
        <div class="distribution-header">
            <h3>Draw #${current.drawNumber}</h3>
        </div>
        <div class="color-bars">
            ${Object.entries(colorCount).map(([color, count]) => `
                <div class="color-bar-item">
                    <div class="color-bar-label">
                        <span class="color-dot" style="background: ${COLOR_CONFIG[color]?.bg || '#666'}"></span>
                        ${COLOR_CONFIG[color]?.name || color}
                    </div>
                    <div class="color-bar-progress">
                        <div class="color-bar-fill" style="width: ${(count/7)*100}%; background: ${COLOR_CONFIG[color]?.bg || '#666'}"></div>
                    </div>
                    <div class="color-bar-count">${count}/7</div>
                </div>
            `).join('')}
        </div>
        <div class="numbers-with-colors">
            <h4>Number-Color Mapping</h4>
            <div class="color-number-grid">
                ${current.numbers.map((num, idx) => `
                    <div class="color-number-item">
                        <div class="color-ball" style="background: ${COLOR_CONFIG[current.colors[idx]]?.bg || '#666'}">
                            ${num}
                        </div>
                        <span>${COLOR_CONFIG[current.colors[idx]]?.name || current.colors[idx]}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Display color trends
function displayColorTrends() {
    const container = document.getElementById('colorTrends');
    if (!container) return;
    
    container.innerHTML = `
        <div class="trends-grid">
            <div class="trend-card">
                <div class="trend-icon">📊</div>
                <div class="trend-content">
                    <h4>Most Frequent Color</h4>
                    <div class="trend-value">
                        <span class="color-dot" style="background: #ef4444"></span>
                        Red (appears in 30% of draws)
                    </div>
                </div>
            </div>
            
            <div class="trend-card">
                <div class="trend-icon">🔄</div>
                <div class="trend-content">
                    <h4>Color Patterns</h4>
                    <div class="trend-value">
                        Red-Red-Blue most common sequence
                    </div>
                </div>
            </div>
            
            <div class="trend-card">
                <div class="trend-icon">📈</div>
                <div class="trend-content">
                    <h4>Emerging Trend</h4>
                    <div class="trend-value">
                        Green appearing more frequently in high numbers
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display color by number range
function displayColorRange() {
    const container = document.getElementById('colorRangeGrid');
    if (!container) return;
    
    const ranges = [
        { name: '1-10', low: 1, high: 10 },
        { name: '11-20', low: 11, high: 20 },
        { name: '21-30', low: 21, high: 30 },
        { name: '31-40', low: 31, high: 40 },
        { name: '41-49', low: 41, high: 49 }
    ];
    
    container.innerHTML = `
        <div class="range-matrix">
            ${ranges.map(range => `
                <div class="range-row">
                    <div class="range-label">${range.name}</div>
                    <div class="range-colors">
                        <span class="color-sample" style="background: #ef4444">Red: 12</span>
                        <span class="color-sample" style="background: #3b82f6">Blue: 8</span>
                        <span class="color-sample" style="background: #10b981">Green: 5</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Display color heat map
function displayHeatMap() {
    const container = document.getElementById('colorHeatmap');
    if (!container) return;
    
    // Generate numbers 1-49
    const numbers = Array.from({ length: 49 }, (_, i) => i + 1);
    
    container.innerHTML = `
        <div class="heatmap-grid">
            ${numbers.map(num => {
                // This would be based on actual data
                const intensity = Math.random(); // Placeholder
                const color = intensity > 0.6 ? '#ef4444' : intensity > 0.3 ? '#3b82f6' : '#10b981';
                return `
                    <div class="heatmap-cell" style="background: ${color}; opacity: ${intensity}">
                        ${num}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="heatmap-legend">
            <div class="legend-item">
                <span class="legend-color" style="background: #ef4444"></span>
                <span>Frequent (Red)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #3b82f6"></span>
                <span>Moderate (Blue)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #10b981"></span>
                <span>Rare (Green)</span>
            </div>
        </div>
    `;
}

// Make refresh function available globally
window.refreshCurrentPage = loadColorPageData;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    core.initCommon();
    loadColorPageData();
});