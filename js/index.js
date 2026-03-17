// index.js - Home page specific code

// Load home page data
async function loadHomePageData() {
    console.log('Loading home page data...'); // Debug log
    core.showLoading();
    
    try {
        await core.fetchData();
        console.log('Data fetched successfully:', core.hkData()); // Debug log
        displayHomePage();
    } catch (error) {
        console.error('Error loading data:', error); // Debug log
        core.showError(error.message);
    }
}

// Display home page content
function displayHomePage() {
    const data = core.hkData();
    console.log('Displaying home page with data:', data); // Debug log
    
    if (!data || !data.hk) {
        core.showError('Hong Kong data not available');
        return;
    }
    
    const hk = data.hk;
    console.log('Hong Kong data:', hk); // Debug log
    
    // Parse data
    const drawNumber = hk.expect;
    const drawDate = hk.openTime;
    const numbers = hk.openCode.split(',');
    const waveColors = hk.wave.split(',');
    const zodiacs = hk.zodiac.split(',');
    
    console.log('Parsed numbers:', numbers); // Debug log
    console.log('Parsed colors:', waveColors); // Debug log
    
    // Calculate statistics
    const stats = calculateStats(numbers);
    console.log('Calculated stats:', stats); // Debug log
    
    // Display sections
    displayLatestDraw(drawNumber, drawDate, numbers, waveColors, zodiacs);
    displayInsights(stats, numbers);
    displayExtraInfo(waveColors, zodiacs, numbers);
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    console.log('Display complete'); // Debug log
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

// Display latest draw
function displayLatestDraw(drawNumber, drawDate, numbers, waveColors, zodiacs) {
    const container = document.getElementById('latestDrawCard');
    if (!container) {
        console.error('latestDrawCard element not found'); // Debug log
        return;
    }
    
    const ballsHtml = numbers.map((num, index) => {
        const color = core.CONFIG.COLORS[waveColors[index]] || '#6366f1';
        const zodiac = zodiacs[index];
        const emoji = getZodiacEmoji(zodiac);
        return `
            <div class="ball-large" style="background-color: ${color}">
                ${num}
                <small>${emoji} ${zodiac}</small>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="draw-header-large">
            <span class="draw-number-large">Draw #${drawNumber}</span>
            <span class="draw-date-large">${core.formatDate(drawDate)}</span>
        </div>
        <div class="numbers-row">
            ${ballsHtml}
        </div>
    `;
}

// Display insights
function displayInsights(stats, numbers) {
    const container = document.getElementById('insightsGrid');
    if (!container) {
        console.error('insightsGrid element not found'); // Debug log
        return;
    }
    
    container.innerHTML = `
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

// Display extra info
function displayExtraInfo(waveColors, zodiacs, numbers) {
    const container = document.getElementById('extraInfoGrid');
    if (!container) {
        console.error('extraInfoGrid element not found'); // Debug log
        return;
    }
    
    // Count wave colors
    const colorCount = waveColors.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {});
    
    // Find dominant color
    let dominantColor = 'red';
    let maxCount = 0;
    Object.entries(colorCount).forEach(([color, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
        }
    });
    
    // Count zodiacs
    const zodiacCount = zodiacs.reduce((acc, zodiac) => {
        acc[zodiac] = (acc[zodiac] || 0) + 1;
        return acc;
    }, {});
    
    // Find repeated zodiacs
    const repeatedZodiacs = Object.entries(zodiacCount)
        .filter(([_, count]) => count > 1)
        .map(([zodiac, count]) => `${zodiac} (${count}x)`);
    
    const numbersArray = numbers.map(n => parseInt(n));
    const maxNum = Math.max(...numbersArray);
    const minNum = Math.min(...numbersArray);
    
    container.innerHTML = `
        <div class="extra-info-card">
            <div class="extra-info-label">Wave Color Distribution</div>
            <div class="extra-info-value">
                ${Object.entries(colorCount).map(([color, count]) => 
                    `<span style="color: ${core.CONFIG.COLORS[color]}">●</span> ${count}`
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
                ${maxNum} / ${minNum}
            </div>
            <div class="extra-info-tag tag-blue">
                Range: ${maxNum - minNum}
            </div>
        </div>
    `;
}

// Make refresh function available globally
window.refreshCurrentPage = loadHomePageData;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Index page DOM loaded'); // Debug log
    core.initCommon();
    loadHomePageData();
});