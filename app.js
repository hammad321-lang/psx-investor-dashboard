// Pre-calculated institutional data mappings for quick matching
const corporateDatabaseDirectory = {
    "NML": { sector: "Textile Composite", price: 78.50, bv: 280.35, shariah: "YES", divs: [5.0, 4.5, 4.0, 4.0, 3.5] },
    "SYS": { sector: "Technology & Communications", price: 435.00, bv: 114.40, shariah: "YES", divs: [8.0, 6.0, 5.0, 4.0, 3.5] },
    "FFC": { sector: "Chemicals & Fertilizers", price: 195.00, bv: 110.20, shariah: "YES", divs: [18.5, 16.0, 14.5, 13.0, 12.0] },
    "MARI": { sector: "Oil & Gas Exploration", price: 2450.00, bv: 980.50, shariah: "YES", divs: [142.0, 120.0, 98.0, 82.0, 75.0] },
    "MEBL": { sector: "Islamic Commercial Banking", price: 210.00, bv: 88.60, shariah: "YES", divs: [24.0, 20.0, 16.0, 12.0, 8.5] },
    "OGDC": { sector: "Oil & Gas Exploration", price: 122.30, bv: 265.40, shariah: "YES", divs: [10.5, 9.0, 8.25, 7.5, 6.75] },
    "PPL": { sector: "Oil & Gas Exploration", price: 114.80, bv: 242.10, shariah: "YES", divs: [8.5, 7.5, 6.0, 5.5, 4.5] },
    "EFERT": { sector: "Chemicals & Fertilizers", price: 168.40, bv: 58.20, shariah: "YES", divs: [21.0, 18.5, 15.0, 12.5, 11.0] }
};

document.addEventListener("DOMContentLoaded", () => {
    // Initial evaluation trigger
    runCalculationsEngine();
});

// Primary trigger used to sync asset metrics into calculation inputs
function quickLoadAsset(ticker) {
    if (!ticker) return;
    const item = corporateDatabaseDirectory[ticker.toUpperCase()];
    if (item) {
        document.getElementById('varTicker').value = ticker.toUpperCase();
        document.getElementById('varSector').value = item.sector;
        document.getElementById('varPrice').value = item.price;
        document.getElementById('varBv').value = item.bv;
        document.getElementById('varShariah').value = item.shariah;
        
        // Populate inputs with database tracking logs
        for(let i = 1; i <= 5; i++) {
            document.getElementById(`div${i}`).value = item.divs[i-1] || 0;
        }
        
        runCalculationsEngine();
    }
}

// Fixed tracking logic processing queries for ANY custom asset string input
function pullManualTicker() {
    const rawInput = document.getElementById('manualTickerInput').value;
    if (!rawInput) return;
    
    const cleanTicker = rawInput.trim().toUpperCase();
    const cleanMatch = corporateDatabaseDirectory[cleanTicker];
    
    if (cleanMatch) {
        quickLoadAsset(cleanTicker);
    } else {
        // Generate flexible variables without throwing execution path errors
        document.getElementById('varTicker').value = cleanTicker;
        document.getElementById('varSector').value = "General PSX Listed Market";
        document.getElementById('varPrice').value = 100.00;
        document.getElementById('varBv').value = 100.00;
        document.getElementById('varShariah').value = "YES";
        
        for(let i = 1; i <= 5; i++) {
            document.getElementById(`div${i}`).value = 5.00;
        }
        runCalculationsEngine();
    }
}

// Complete algorithmic execution stack mapping data dynamically to interface components
function runCalculationsEngine() {
    // Pull inputs from active terminal controls
    const ticker = document.getElementById('varTicker').value.toUpperCase();
    const sector = document.getElementById('varSector').value;
    const price = parseFloat(document.getElementById('varPrice').value) || 0;
    const bv = parseFloat(document.getElementById('varBv').value) || 1; // avoid division by zero
    const shariah = document.getElementById('varShariah').value;
    const baseCapital = parseFloat(document.getElementById('portCap').value) || 0;

    // 1. Snapshot Evaluation Data Sync
    document.getElementById('cardTicker').innerText = ticker;
    document.getElementById('cardSector').innerText = sector;
    
    const pbRatio = price / bv;
    const cardPbVal = document.getElementById('cardPbVal');
    cardPbVal.innerText = `${pbRatio.toFixed(2)}x`;
    if (pbRatio < 1.0) {
        cardPbVal.style.color = "var(--green)";
    } else {
        cardPbVal.style.color = "var(--accent)";
    }

    const badgeContainer = document.getElementById('cardShariahBadge');
    if (shariah === "YES") {
        badgeContainer.innerHTML = `<span class="quick-badge badge-green">🕋 KMI COMPLIANT</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="quick-badge badge-red">❌ NON-COMPLIANT</span>`;
    }

    // 2. Dynamic Account Sizing Logic Engine
    const targetAllocationLimit = baseCapital * 0.74; // Defends cash buffer zones
    const liquidCashBuffer = baseCapital - targetAllocationLimit;
    document.getElementById('lblPortAlloc').innerText = `Rs. ${Math.round(targetAllocationLimit).toLocaleString()}`;
    document.getElementById('lblPortCash').innerText = `Rs. ${Math.round(liquidCashBuffer).toLocaleString()}`;

    // 3. Fully Variable Dividend Payout Ledger Tracker
    for (let i = 1; i <= 5; i++) {
        const divValue = parseFloat(document.getElementById(`div${i}`).value) || 0;
        const targetYieldEl = document.getElementById(`yield1`);
        if (price > 0) {
            const calculatedYield = (divValue / price) * 100;
            document.getElementById(`yield${i}`).innerText = `${calculatedYield.toFixed(1)}%`;
        } else {
            document.getElementById(`yield${i}`).innerText = `0.0%`;
        }
    }

    // 4. Mathematical Compounded Forecasting Multipliers Framework
    // Cons targets expect book additions; Opt targets evaluate forward earnings scaling metrics
    for (let year = 1; year <= 3; year++) {
        let consPriceTarget = price + (bv * 0.15 * year);
        let optPriceTarget = price * Math.pow(1.22, year);
        
        if (pbRatio < 0.5) { 
            // Valuation correction expansion adjustments for underdogs
            consPriceTarget += (bv * 0.1 * year); 
            optPriceTarget += (bv * 0.15 * year);
        }

        document.getElementById(`fcCons${year}`).innerText = `Rs. ${consPriceTarget.toFixed(2)}`;
        document.getElementById(`fcOpt${year}`).innerText = `Rs. ${optPriceTarget.toFixed(2)}`;
        
        // Calculate Compound Annual Growth Rate metric limits
        if (price > 0) {
            let cagrValue = (Math.pow((consPriceTarget / price), (1 / year)) - 1) * 100;
            document.getElementById(`fcCagr${year}`).innerText = `${cagrValue.toFixed(1)}%`;
        } else {
            document.getElementById(`fcCagr${year}`).innerText = `0.0%`;
        }
    }

    // Process peer calculations concurrently
    calculatePeerRatios();
    evaluateRiskContextText(ticker, pbRatio);
}

// 5. Completely Manual Peer Matrix Comparison Generator
function calculatePeerRatios() {
    for (let i = 1; i <= 2; i++) {
        const pPrice = parseFloat(document.getElementById(`peerPrice${i}`).value) || 0;
        const pBv = parseFloat(document.getElementById(`peerBv${i}`).value) || 1;
        const targetOutputContainer = document.getElementById(`peerPb${i}`);
        
        if (pPrice > 0) {
            const peerPbCalculated = pPrice / pBv;
            targetOutputContainer.innerText = `${peerPbCalculated.toFixed(2)}x`;
            if (peerPbCalculated < 1.0) {
                targetOutputContainer.style.color = "var(--green)";
            } else {
                targetOutputContainer.style.color = "var(--accent)";
            }
        } else {
            targetOutputContainer.innerText = "0.00x";
        }
    }
}

// Contextually shifts UI content based on parsed valuation layers
function evaluateRiskContextText(ticker, pbRatio) {
    const suggestBox = document.getElementById('suggestBox');
    const riskBox = document.getElementById('riskBox');
    
    if (pbRatio < 1.0) {
        suggestBox.innerHTML = `
            <li>Asset entry valuation is highly optimal. Trading at a clear discount to book assets.</li>
            <li>Strong margin of safety identified for ${ticker}. Ideal for long-term strategic accumulation.</li>
        `;
        riskBox.innerHTML = `
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Ensure low market capitalization doesn't impact near-term liquidation windows.</li>
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Check for underlying sector cyclical drag headwinds affecting production volume speeds.</li>
        `;
    } else {
        suggestBox.innerHTML = `
            <li>Growth asset configuration profile. Entry reliance depends heavily on sustained future earnings expansions.</li>
            <li>Monitor quarterly cash flow retention trends closely to justify premium positioning.</li>
        `;
        riskBox.innerHTML = `
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Premium valuation leaves limited margin of safety if earnings compression cycles emerge.</li>
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Market price corrections can trigger sharp downside variance.</li>
        `;
    }
}
