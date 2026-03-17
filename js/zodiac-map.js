// zodiac-map.js - Zodiac Animal Analysis

// Zodiac configuration with detailed information
const ZODIAC_CONFIG = {
    '鼠': { 
        name: 'Rat', 
        emoji: '🐭', 
        element: 'Water', 
        direction: 'North',
        traits: 'Intelligent, Adaptable',
        color: '#9ca3af'  // Gray
    },
    '牛': { 
        name: 'Ox', 
        emoji: '🐮', 
        element: 'Earth', 
        direction: 'Northeast',
        traits: 'Diligent, Reliable',
        color: '#8b5cf6'  // Purple
    },
    '虎': { 
        name: 'Tiger', 
        emoji: '🐯', 
        element: 'Wood', 
        direction: 'East',
        traits: 'Brave, Competitive',
        color: '#f97316'  // Orange
    },
    '兔': { 
        name: 'Rabbit', 
        emoji: '🐰', 
        element: 'Wood', 
        direction: 'East',
        traits: 'Gentle, Elegant',
        color: '#ec4899'  // Pink
    },
    '龙': { 
        name: 'Dragon', 
        emoji: '🐲', 
        element: 'Earth', 
        direction: 'Southeast',
        traits: 'Confident, Ambitious',
        color: '#ef4444'  // Red
    },
    '蛇': { 
        name: 'Snake', 
        emoji: '🐍', 
        element: 'Fire', 
        direction: 'South',
        traits: 'Wise, Mysterious',
        color: '#10b981'  // Green
    },
    '马': { 
        name: 'Horse', 
        emoji: '🐴', 
        element: 'Fire', 
        direction: 'South',
        traits: 'Energetic, Independent',
        color: '#f59e0b'  // Amber
    },
    '羊': { 
        name: 'Goat', 
        emoji: '🐑', 
        element: 'Earth', 
        direction: 'Southwest',
        traits: 'Creative, Peaceful',
        color: '#d1d5db'  // Light Gray
    },
    '猴': { 
        name: 'Monkey', 
        emoji: '🐵', 
        element: 'Metal', 
        direction: 'West',
        traits: 'Clever, Playful',
        color: '#a16207'  // Brown
    },
    '鸡': { 
        name: 'Rooster', 
        emoji: '🐔', 
        element: 'Metal', 
        direction: 'West',
        traits: 'Observant, Confident',
        color: '#dc2626'  // Dark Red
    },
    '狗': { 
        name: 'Dog', 
        emoji: '🐶', 
        element: 'Earth', 
        direction: 'Northwest',
        traits: 'Loyal, Honest',
        color: '#6b7280'  // Gray
    },
    '猪': { 
        name: 'Pig', 
        emoji: '🐷', 
        element: 'Water', 
        direction: 'North',
        traits: 'Generous, Compassionate',
        color: '#f472b6'  // Light Pink
    }
};

// Element groups for Chinese zodiac
const ELEMENT_GROUPS = {
    'Wood': ['虎', '兔'],
    'Fire': ['蛇', '马'],
    'Earth': ['牛', '龙', '羊', '狗'],
    'Metal': ['猴', '鸡'],
    'Water': ['鼠', '猪']
};

// Historical zodiac data
let zodiacHistory = [];

// Load zodiac data
async function loadZodiacPageData() {
    console.log('Loading zodiac page data...');
    core.showLoading();
    
    try {
        await core.fetchData();
        console.log('Data fetched successfully:', core.hkData());
        processZodiacData();
        displayZodiacAnalysis();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    } catch (error) {
        console.error('Error loading zodiac data:', error);
        core.showError(error.message);
    }
}

// Process zodiac data from Hong Kong draws
function processZodiacData() {
    const data = core.hkData();
    if (!data || !data.hk) return;
    
    const hk = data.hk;
    const zodiacs = hk.zodiac.split(',');
    const numbers = hk.openCode.split(',');
    const waveColors = hk.wave.split(',');
    
    zodiacHistory = [{
        drawNumber: hk.expect,
        numbers: numbers,
        zodiacs: zodiacs,
        colors: waveColors
    }];
    
    console.log('Processed zodiac data:', zodiacHistory);
}

// Display zodiac analysis
function displayZodiacAnalysis() {
    displayCurrentDistribution();
    displayZodiacNumberMapping();
    displayZodiacPatterns();
    displayElementGroups();
}

// Display current draw zodiac distribution
function displayCurrentDistribution() {
    const current = zodiacHistory[0];
    if (!current) return;
    
    const container = document.getElementById('currentZodiacDist');
    if (!container) return;
    
    // Count zodiac occurrences
    const zodiacCount = current.zodiacs.reduce((acc, zodiac) => {
        acc[zodiac] = (acc[zodiac] || 0) + 1;
        return acc;
    }, {});
    
    // Find dominant zodiac
    let dominantZodiac = '鼠';
    let maxCount = 0;
    Object.entries(zodiacCount).forEach(([zodiac, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantZodiac = zodiac;
        }
    });
    
    container.innerHTML = `
        <div class="distribution-header">
            <h3>Draw #${current.drawNumber}</h3>
            <div class="dominant-badge">
                <span class="badge-icon">👑</span>
                Dominant: ${ZODIAC_CONFIG[dominantZodiac]?.emoji} ${ZODIAC_CONFIG[dominantZodiac]?.name} (${maxCount}x)
            </div>
        </div>
        
        <div class="zodiac-bars">
            ${Object.entries(zodiacCount).map(([zodiac, count]) => `
                <div class="zodiac-bar-item">
                    <div class="zodiac-bar-label">
                        <span class="zodiac-emoji">${ZODIAC_CONFIG[zodiac]?.emoji || '⭐'}</span>
                        <span class="zodiac-name">${ZODIAC_CONFIG[zodiac]?.name || zodiac}</span>
                        <span class="zodiac-element">(${ZODIAC_CONFIG[zodiac]?.element || 'Unknown'})</span>
                    </div>
                    <div class="zodiac-bar-progress">
                        <div class="zodiac-bar-fill" style="width: ${(count/7)*100}%; background: ${ZODIAC_CONFIG[zodiac]?.color || '#6366f1'}"></div>
                    </div>
                    <div class="zodiac-bar-count">${count}/7</div>
                </div>
            `).join('')}
        </div>
        
        <div class="zodiac-summary">
            <h4>Distribution Summary</h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Unique Zodiacs:</span>
                    <span class="summary-value">${Object.keys(zodiacCount).length}/7</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Repeated Zodiacs:</span>
                    <span class="summary-value">${Object.values(zodiacCount).filter(c => c > 1).length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Elements Present:</span>
                    <span class="summary-value">${getElementsPresent(current.zodiacs).length}/5</span>
                </div>
            </div>
        </div>
    `;
}

// Display zodiac-number mapping
function displayZodiacNumberMapping() {
    const current = zodiacHistory[0];
    if (!current) return;
    
    const container = document.getElementById('zodiacNumberGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="mapping-grid">
            ${current.zodiacs.map((zodiac, index) => `
                <div class="mapping-card" style="border-left: 4px solid ${ZODIAC_CONFIG[zodiac]?.color || '#6366f1'}">
                    <div class="mapping-header">
                        <span class="mapping-number">#${current.numbers[index]}</span>
                        <span class="mapping-zodiac">
                            ${ZODIAC_CONFIG[zodiac]?.emoji || '⭐'} ${ZODIAC_CONFIG[zodiac]?.name || zodiac}
                        </span>
                    </div>
                    <div class="mapping-details">
                        <div class="mapping-detail">
                            <span class="detail-label">Element:</span>
                            <span class="detail-value">${ZODIAC_CONFIG[zodiac]?.element || 'Unknown'}</span>
                        </div>
                        <div class="mapping-detail">
                            <span class="detail-label">Direction:</span>
                            <span class="detail-value">${ZODIAC_CONFIG[zodiac]?.direction || 'Unknown'}</span>
                        </div>
                        <div class="mapping-detail">
                            <span class="detail-label">Traits:</span>
                            <span class="detail-value">${ZODIAC_CONFIG[zodiac]?.traits || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Display zodiac patterns
function displayZodiacPatterns() {
    const current = zodiacHistory[0];
    if (!current) return;
    
    const container = document.getElementById('zodiacPatterns');
    if (!container) return;
    
    // Find consecutive zodiacs (same zodiac appearing in a row)
    const consecutive = findConsecutiveZodiacs(current.zodiacs);
    
    // Find zodiac pairs that appear together
    const pairs = findZodiacPairs(current.zodiacs);
    
    // Check element balance
    const elements = getElementsPresent(current.zodiacs);
    const elementBalance = elements.length === 5 ? 'All five elements present' : 
                          elements.length > 3 ? 'Good balance' : 'Limited variety';
    
    container.innerHTML = `
        <div class="patterns-grid">
            <div class="pattern-card">
                <div class="pattern-icon">🔄</div>
                <div class="pattern-content">
                    <h4>Consecutive Zodiacs</h4>
                    <div class="pattern-value">
                        ${consecutive.length > 0 ? 
                            consecutive.map(z => `${ZODIAC_CONFIG[z]?.emoji} ${ZODIAC_CONFIG[z]?.name}`).join(' → ') : 
                            'No consecutive matches'}
                    </div>
                </div>
            </div>
            
            <div class="pattern-card">
                <div class="pattern-icon">🤝</div>
                <div class="pattern-content">
                    <h4>Zodiac Pairs</h4>
                    <div class="pattern-value">
                        ${pairs.length > 0 ? 
                            pairs.map(p => `${ZODIAC_CONFIG[p[0]]?.emoji}+${ZODIAC_CONFIG[p[1]]?.emoji}`).join(', ') : 
                            'No repeated pairs'}
                    </div>
                </div>
            </div>
            
            <div class="pattern-card">
                <div class="pattern-icon">⚖️</div>
                <div class="pattern-content">
                    <h4>Element Balance</h4>
                    <div class="pattern-value">
                        ${elementBalance}
                    </div>
                    <div class="pattern-elements">
                        ${elements.map(e => `
                            <span class="element-tag element-${e.toLowerCase()}">${e}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="pattern-card">
                <div class="pattern-icon">🧩</div>
                <div class="pattern-content">
                    <h4>Direction Spread</h4>
                    <div class="pattern-value">
                        ${getDirectionsPresent(current.zodiacs).join(' • ')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display element groups
function displayElementGroups() {
    const current = zodiacHistory[0];
    if (!current) return;
    
    const container = document.getElementById('elementGrid');
    if (!container) return;
    
    // Count elements in current draw
    const elementCount = {};
    current.zodiacs.forEach(zodiac => {
        const element = ZODIAC_CONFIG[zodiac]?.element || 'Unknown';
        elementCount[element] = (elementCount[element] || 0) + 1;
    });
    
    container.innerHTML = `
        <div class="elements-container">
            ${Object.entries(ELEMENT_GROUPS).map(([element, zodiacs]) => {
                const count = elementCount[element] || 0;
                const zodiacsInDraw = current.zodiacs.filter(z => 
                    zodiacs.includes(z)
                );
                
                return `
                    <div class="element-card" style="opacity: ${count > 0 ? 1 : 0.5}">
                        <div class="element-header">
                            <h4>${element}</h4>
                            <span class="element-count">${count}/7</span>
                        </div>
                        <div class="element-zodiacs">
                            ${zodiacs.map(z => `
                                <div class="element-zodiac ${zodiacsInDraw.includes(z) ? 'active' : ''}">
                                    ${ZODIAC_CONFIG[z]?.emoji || '⭐'}
                                    <small>${ZODIAC_CONFIG[z]?.name || z}</small>
                                </div>
                            `).join('')}
                        </div>
                        ${count > 0 ? `
                            <div class="element-numbers">
                                Numbers: ${current.numbers.filter((_, idx) => 
                                    zodiacs.includes(current.zodiacs[idx])
                                ).join(', ')}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Helper function: Find consecutive zodiacs
function findConsecutiveZodiacs(zodiacs) {
    const consecutive = [];
    for (let i = 0; i < zodiacs.length - 1; i++) {
        if (zodiacs[i] === zodiacs[i + 1]) {
            if (!consecutive.includes(zodiacs[i])) {
                consecutive.push(zodiacs[i]);
            }
        }
    }
    return consecutive;
}

// Helper function: Find zodiac pairs
function findZodiacPairs(zodiacs) {
    const pairs = [];
    for (let i = 0; i < zodiacs.length; i++) {
        for (let j = i + 1; j < zodiacs.length; j++) {
            if (zodiacs[i] === zodiacs[j]) {
                pairs.push([zodiacs[i], zodiacs[j]]);
            }
        }
    }
    return pairs;
}

// Helper function: Get elements present
function getElementsPresent(zodiacs) {
    const elements = new Set();
    zodiacs.forEach(z => {
        const element = ZODIAC_CONFIG[z]?.element;
        if (element) elements.add(element);
    });
    return Array.from(elements);
}

// Helper function: Get directions present
function getDirectionsPresent(zodiacs) {
    const directions = new Set();
    zodiacs.forEach(z => {
        const direction = ZODIAC_CONFIG[z]?.direction;
        if (direction) directions.add(direction);
    });
    return Array.from(directions);
}

// Make refresh function available globally
window.refreshCurrentPage = loadZodiacPageData;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Zodiac page DOM loaded');
    core.initCommon();
    loadZodiacPageData();
});