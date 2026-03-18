// js/color-map.js - Color Map specific functionality

// CORRECT static color mapping based on actual Mark Six wave colors
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

// Color groups for summary
const COLOR_GROUPS = {
    red: [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46],
    blue: [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48],
    green: [5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]
};

// Get color for a number
function getNumberColor(number) {
    return COLOR_MAP[number] || '#ef4444'; // Default to red if not found
}

// Initialize color map
function initColorMap() {
    console.log('Initializing color map with static mapping...');
    
    const machineDisplay = document.getElementById('machineDisplay');
    if (!machineDisplay) return;
    
    // Define columns with numbers in display order (top to bottom)
    const columns = [
        { 
            name: '1-10', 
            displayOrder: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] // top to bottom
        },
        { 
            name: '11-20', 
            displayOrder: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11]
        },
        { 
            name: '21-30', 
            displayOrder: [30, 29, 28, 27, 26, 25, 24, 23, 22, 21]
        },
        { 
            name: '31-40', 
            displayOrder: [40, 39, 38, 37, 36, 35, 34, 33, 32, 31]
        },
        { 
            name: '41-49', 
            displayOrder: [49, 48, 47, 46, 45, 44, 43, 42, 41] // 9 numbers only
        }
    ];
    
    // Clear existing content
    machineDisplay.innerHTML = '';
    
    // Create each column
    columns.forEach((column) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'machine-col';
        
        // Add column label
        const label = document.createElement('div');
        label.className = 'col-label';
        label.textContent = column.name;
        colDiv.appendChild(label);
        
        // Calculate how many spacer balls needed
        // First 4 columns have 10 balls, last column has 9
        // To bottom-align, last column needs 1 spacer at the top
        const maxBallsPerColumn = 10;
        const spacerCount = maxBallsPerColumn - column.displayOrder.length;
        
        // Add spacers at the TOP (to push balls to bottom)
        for (let i = 0; i < spacerCount; i++) {
            const spacer = document.createElement('div');
            spacer.className = 'ball-spacer';
            colDiv.appendChild(spacer);
        }
        
        // Add balls in display order (top to bottom)
        column.displayOrder.forEach(number => {
            const ball = document.createElement('div');
            ball.className = 'machine-ball';
            ball.style.background = getNumberColor(number);
            
            // Add inner white circle with number
            const inner = document.createElement('div');
            inner.className = 'ball-inner';
            inner.textContent = number;
            
            ball.appendChild(inner);
            colDiv.appendChild(ball);
        });
        
        machineDisplay.appendChild(colDiv);
    });
    
    console.log('Color map initialized');
}

// Initialize color groups summary
function initColorSummary() {
    const summaryContainer = document.getElementById('colorSummary');
    if (!summaryContainer) return;
    
    summaryContainer.innerHTML = `
        <div class="summary-title">📋 Color Groups Reference</div>
        <div class="summary-grid">
            <div class="summary-group">
                <div class="group-title red">
                    <span class="color-dot" style="background: #ef4444"></span>
                    Red Group (17 numbers)
                </div>
                <div class="group-numbers">
                    ${COLOR_GROUPS.red.map(n => `<span class="number-tag">${n}</span>`).join('')}
                </div>
            </div>
            
            <div class="summary-group">
                <div class="group-title blue">
                    <span class="color-dot" style="background: #3b82f6"></span>
                    Blue Group (16 numbers)
                </div>
                <div class="group-numbers">
                    ${COLOR_GROUPS.blue.map(n => `<span class="number-tag">${n}</span>`).join('')}
                </div>
            </div>
            
            <div class="summary-group">
                <div class="group-title green">
                    <span class="color-dot" style="background: #10b981"></span>
                    Green Group (16 numbers)
                </div>
                <div class="group-numbers">
                    ${COLOR_GROUPS.green.map(n => `<span class="number-tag">${n}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Make refresh function available globally (though this is static)
window.refreshCurrentPage = () => {
    console.log('Color map is static, no refresh needed');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Color map page DOM loaded');
    
    // Initialize theme from core
    if (window.core) {
        core.initCommon();
    }
    
    // Initialize color map
    initColorMap();
    initColorSummary();
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});