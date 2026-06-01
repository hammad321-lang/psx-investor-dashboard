// Comprehensive KMI-All Shariah Index Institutional Asset Directory
const corporateDatabaseDirectory = {
    "SYS": {
        sector: "Technology & Communications",
        price: 435.00,
        bv: 114.40,
        shariah: "YES",
        sharesOutstanding: 291,
        divs: [8.0, 6.0, 5.0, 4.0, 3.5],
        divTypes: ["Cash Dividend", "Cash Dividend", "Cash + Bonus", "Cash Dividend", "10% Bonus"],
        corporatePlan: "Aggressive North American and GCC client acquisition pipeline. Expanding nearshore delivery centers to hedge rupee valuations via USD export earnings revenues.",
        growthFactor: 0.25, // 25% expected trajectory based on plan scaling
        competitors: [
            { name: "OCTOPUS", price: 72.40, bv: 28.10, risk: "Asset-light high maintenance ARR lines" },
            { name: "AVN", price: 54.10, bv: 31.40, risk: "Project-driven engineering backlog exposures" }
        ]
    },
    "FFC": {
        sector: "Chemicals & Fertilizers",
        price: 195.00,
        bv: 110.20,
        shariah: "YES",
        sharesOutstanding: 1272,
        divs: [18.5, 16.0, 14.5, 13.0, 12.0],
        divTypes: ["Interim Cash", "Final Cash", "Interim Cash", "Final Cash", "Interim Cash"],
        corporatePlan: "Coal gasification feasibility development alongside infrastructure pricing optimization models. Highly defensive recurring operations ensuring premium cash yield stability.",
        growthFactor: 0.12,
        competitors: [
            { name: "EFERT", price: 168.40, bv: 58.20, risk: "Sustained high efficiency plant operations" },
            { name: "FATIMA", price: 46.50, bv: 41.20, risk: "Diversified distribution footprint dependencies" }
        ]
    },
    "EFERT": {
        sector: "Chemicals & Fertilizers",
        price: 168.40,
        bv: 58.20,
        shariah: "YES",
        sharesOutstanding: 1335,
        divs: [21.0, 18.5, 15.0, 12.5, 11.0],
        divTypes: ["Final Cash", "Interim Cash", "Final Cash", "Interim Cash", "Final Cash"],
        corporatePlan: "Maximizing production capacity utilization via the Daharki plant upgrades. Focused heavily on running near-100% free cash flow payouts to equity shareholders.",
        growthFactor: 0.14,
        competitors: [
            { name: "FFC", price: 195.00, bv: 110.20, risk: "Massive scale defensive reserve positions" },
            { name: "FATIMA", price: 46.50, bv: 41.20, risk: "Mining asset expansion funding requirements" }
        ]
    },
    "MARI": {
        sector: "Oil & Gas Exploration (E&P)",
        price: 2450.00,
        bv: 980.50,
        shariah: "YES",
        sharesOutstanding: 133,
        divs: [142.0, 120.0, 98.0, 82.0, 75.0],
        divTypes: ["Final Cash", "Interim Cash", "Final Cash", "Interim Cash", "Final Cash"],
        corporatePlan: "Aggressive exploration campaigns across newly acquired operational blocks. Steady output maximization at Mari Gas Field to satisfy national network frameworks.",
        growthFactor: 0.18,
        competitors: [
            { name: "OGDC", price: 122.30, bv: 265.40, risk: "High sovereign circular debt accumulation load" },
            { name: "PPL", price: 114.80, bv: 242.10, risk: "Sovereign receivable collection lag windows" }
        ]
    },
    "OGDC": {
        sector: "Oil & Gas Exploration (E&P)",
        price: 122.30,
        bv: 265.40,
        shariah: "YES",
        sharesOutstanding: 4301,
        divs: [10.5, 9.0, 8.25, 7.5, 6.75],
        divTypes: ["Interim Cash", "Final Cash", "Interim Cash", "Final Cash", "Interim Cash"],
        corporatePlan: "Deep strategic well asset monetization and structural joint-venture execution. Capex allocations are heavily dependent on ongoing circular debt settlement tranches.",
        growthFactor: 0.10,
        competitors: [
            { name: "MARI", price: 2450.00, bv: 980.50, risk: "Premium operational efficiency focus" },
            { name: "PPL", price: 114.80, bv: 242.10, risk: "Exploration block infrastructure matching needs" }
        ]
    },
    "PPL": {
        sector: "Oil & Gas Exploration (E&P)",
        price: 114.80,
        bv: 242.10,
        shariah: "YES",
        sharesOutstanding: 2721,
        divs: [8.5, 7.5, 6.0, 5.5, 4.5],
        divTypes: ["Final Cash", "Interim Cash", "Final Cash", "Interim Cash", "Final Cash"],
        corporatePlan: "Optimizing development well outputs across deep-water horizons. Cash allocation optimization models focus on preserving balance sheet strength through pricing shocks.",
        growthFactor: 0.11,
        competitors: [
            { name: "OGDC", price: 122.30, bv: 265.40, risk: "State asset matching dependency pipelines" },
            { name: "MARI", price: 2450.00, bv: 980.50, risk: "High margin field extraction capabilities" }
        ]
    },
    "HUBC": {
        sector: "Power Generation & Energy",
        price: 118.50,
        bv: 56.40,
        shariah: "YES",
        sharesOutstanding: 1297,
        divs: [18.0, 15.5, 12.0, 10.0, 8.5],
        divTypes: ["Interim Cash", "Final Cash", "Interim Cash", "Final Cash", "Interim Cash"],
        corporatePlan: "Capital deployment diversification strategies scaling directly into mining ventures, electric vehicles, and clean water processing grids to hedge legacy PPA shifts.",
        growthFactor: 0.16,
        competitors: [
            { name: "KAPCO", price: 28.50, bv: 44.10, risk: "Plant lease renewal negotiations headwinds" },
            { name: "NPL", price: 22.10, bv: 38.60, risk: "Capacity payments structural readjustments" }
        ]
    },
    "LUCK": {
        sector: "Cement Sector",
        price: 745.00,
        bv: 512.30,
        shariah: "YES",
        sharesOutstanding: 313,
        divs: [18.0, 15.0, 12.0, 10.0, 0.0],
        divTypes: ["Final Cash", "Final Cash", "Final Cash", "Final Cash", "No Payout"],
        corporatePlan: "Expanding international cement grinding infrastructure footprints alongside localized captive green energy setups to permanently suppress grid utility costs.",
        growthFactor: 0.15,
        competitors: [
            { name: "DGKC", price: 68.20, bv: 142.10, risk: "High debt service metrics during rate adjustments" },
            { name: "CHCC", price: 134.50, bv: 118.20, risk: "Northern construction cycle demand speeds" }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    runCalculationsEngine();
});

// Primary automation anchor to link selected index components without wiping layout contexts
function quickLoadAsset(ticker) {
    if (!ticker) return;
    const item = corporateDatabaseDirectory[ticker.toUpperCase()];
    if (item) {
        document.getElementById('varTicker').value = ticker.toUpperCase();
        document.getElementById('varSector').value = item.sector;
        document.getElementById('varPrice').value = item.price;
        document.getElementById('varBv').value = item.bv;
        document.getElementById('varShariah').value = item.shariah;
        document.getElementById('compShares').value = item.sharesOutstanding;
        
        // Automated population of payout matrices
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`div${i}`).value = item.divs[i-1] !== undefined ? item.divs[i-1] : 0;
            document.getElementById(`type${i}`).value = item.divTypes[i-1] || "Cash Dividend";
        }

        // Automated population of peer definitions
        if (item.competitors && item.competitors.length >= 2) {
            for (let j = 1; j <= 2; j++) {
                document.getElementById(`peerName${j}`).value = item.competitors[j-1].name;
                document.getElementById(`peerPrice${j}`).value = item.competitors[j-1].price;
                document.getElementById(`peerBv${j}`).value = item.competitors[j-1].balanceSheetWorth || item.competitors[j-1].bv;
                document.getElementById(`peerRisk${j}`).value = item.competitors[j-1].risk;
            }
        }
        
        runCalculationsEngine();
    }
}

// Search utility supporting dynamic creation parameters for unindexed symbols
function pullManualTicker() {
    const rawInput = document.getElementById('manualTickerInput').value;
    if (!rawInput) return;
    
    const cleanTicker = rawInput.trim().toUpperCase();
    const cleanMatch = corporateDatabaseDirectory[cleanTicker];
    
    if (cleanMatch) {
        quickLoadAsset(cleanTicker);
    } else {
        // Fallback architecture preserves full manual operation features without breakage
        document.getElementById('varTicker').value = cleanTicker;
        document.getElementById('varSector').value = "PSX General Equities Listed Sector";
        document.getElementById('varPrice').value = 100.00;
        document.getElementById('varBv').value = 100.00;
        document.getElementById('varShariah').value = "YES";
        document.getElementById('compShares').value = 100;
        
        document.getElementById('peerName1').value = "PEER 1";
        document.getElementById('peerName2').value = "PEER 2";
        
        runCalculationsEngine();
    }
}

// Complete Institutional Evaluation Engine
function runCalculationsEngine() {
    const ticker = document.getElementById('varTicker').value.toUpperCase();
    const sector = document.getElementById('varSector').value;
    const price = parseFloat(document.getElementById('varPrice').value) || 0;
    const bv = parseFloat(document.getElementById('varBv').value) || 1; 
    const shariah = document.getElementById('varShariah').value;
    const shares = parseFloat(document.getElementById('compShares').value) || 0;

    // Sync basic snapshot elements
    document.getElementById('cardTicker').innerText = ticker;
    document.getElementById('cardSector').innerText = sector;
    
    const pbRatio = price / bv;
    const cardPbVal = document.getElementById('cardPbVal');
    cardPbVal.innerText = `${pbRatio.toFixed(2)}x`;
    cardPbVal.style.color = pbRatio < 1.0 ? "var(--green)" : "var(--accent)";

    const badgeContainer = document.getElementById('cardShariahBadge');
    if (shariah === "YES") {
        badgeContainer.innerHTML = `<span class="quick-badge badge-green">🕋 KMI COMPLIANT</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="quick-badge badge-red">❌ NON-COMPLIANT</span>`;
    }

    // Company Capitalization Summary Computations
    const marketCap = (price * shares);
    const netWorth = (bv * shares);
    document.getElementById('lblMarketCap').innerText = `Rs. ${Math.round(marketCap).toLocaleString()} Million`;
    document.getElementById('lblNetWorth').innerText = `Rs. ${Math.round(netWorth).toLocaleString()} Million`;

    // Real-Time Dividend Yield Matrix Generator
    for (let i = 1; i <= 5; i++) {
        const divValue = parseFloat(document.getElementById(`div${i}`).value) || 0;
        if (price > 0) {
            const calculatedYield = (divValue / price) * 100;
            document.getElementById(`yield${i}`).innerText = `${calculatedYield.toFixed(1)}%`;
        } else {
            document.getElementById(`yield${i}`).innerText = `0.0%`;
        }
    }

    // Corporate Plan-Driven 3-Year Forecasting Framework
    const defaultAssetMatch = corporateDatabaseDirectory[ticker];
    let customGrowthTrajectory = 0.12; // default safe baseline multiplier
    let operationalPlanSummaryText = "Utilizing historical baseline metrics. Adjust primary input parameters manually to chart target tracking horizons.";

    if (defaultAssetMatch) {
        customGrowthTrajectory = defaultAssetMatch.growthFactor;
        operationalPlanSummaryText = defaultAssetMatch.corporatePlan;
    } else {
        operationalPlanSummaryText = `Manual Mode: Tracking ${ticker} under standard ${sector} operational growth paradigms.`;
    }
    
    document.getElementById('lblCorporatePlan').innerText = operationalPlanSummaryText;

    // Apply corporate strategy trends to mathematical output rows
    for (let year = 1; year <= 3; year++) {
        // Base conservative models compound book asset accumulation
        let consValueTarget = price + ((bv * (customGrowthTrajectory * 0.8)) * year);
        // Optimistic targets represent planned strategic expansion case pacing
        let optValueTarget = price * Math.pow((1 + customGrowthTrajectory), year);

        // Adjust underdogs trading deep beneath liquidation base thresholds
        if (pbRatio < 0.6) {
            consValueTarget += (bv * 0.05 * year);
            optValueTarget += (bv * 0.08 * year);
        }

        document.getElementById(`fcCons${year}`).innerText = `Rs. ${consValueTarget.toFixed(2)}`;
        document.getElementById(`fcOpt${year}`).innerText = `Rs. ${optValueTarget.toFixed(2)}`;
        
        if (price > 0) {
            let compiledCagr = (Math.pow((consValueTarget / price), (1 / year)) - 1) * 100;
            document.getElementById(`fcCagr${year}`).innerText = `${compiledCagr.toFixed(1)}%`;
        } else {
            document.getElementById(`fcCagr${year}`).innerText = `0.0%`;
        }
    }

    calculatePeerRatios();
    generateExpertInsights(ticker, sector, pbRatio, shariah);
}

// Concurrent Manual Peer Matrix Calculator
function calculatePeerRatios() {
    for (let i = 1; i <= 2; i++) {
        const pPrice = parseFloat(document.getElementById(`peerPrice${i}`).value) || 0;
        const pBv = parseFloat(document.getElementById(`peerBv${i}`).value) || 1;
        const targetOutputContainer = document.getElementById(`peerPb${i}`);
        
        if (pPrice > 0) {
            const calculatedPeerMultiple = pPrice / pBv;
            targetOutputContainer.innerText = `${calculatedPeerMultiple.toFixed(2)}x`;
            targetOutputContainer.style.color = calculatedPeerMultiple < 1.0 ? "var(--green)" : "var(--accent)";
        } else {
            targetOutputContainer.innerText = "0.00x";
        }
    }
}

// Expert Intelligence Logger Framework
function generateExpertInsights(ticker, sector, pbRatio, shariah) {
    const suggestBox = document.getElementById('suggestBox');
    const riskBox = document.getElementById('riskBox');

    let complianceWarningText = shariah === "YES" 
        ? `<li>Verified KMI asset structure. Dividend payouts are screenable for purification rates if non-core income ticks up.</li>` 
        : `<li style="color:var(--red);">Non-compliant profile. Avoid allocation modeling inside strict Islamic investment frameworks.</li>`;

    if (pbRatio < 1.0) {
        suggestBox.innerHTML = `
            <li>Defensive Moat: Trading below structural liquidation value. Historic PSX patterns suggest strong down-side price defense.</li>
            <li>Value Play: High capital asset allocation discount relative to standard ${sector} benchmarks.</li>
            ${complianceWarningText}
        `;
        riskBox.innerHTML = `
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Check sector-wide capital liquidity velocities before accumulating larger block sizes.</li>
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Evaluate whether low historical multiples reflect authentic undervaluation or a value trap cycle.</li>
        `;
    } else {
        suggestBox.innerHTML = `
            <li>Growth Profile: Trading at premium book valuations. Entry assumes strong compounding velocity from strategic pipeline executions.</li>
            <li>Monitor forward-earnings execution metrics quarterly to justify sustained premiums.</li>
            ${complianceWarningText}
        `;
        riskBox.innerHTML = `
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Elevated multiple compresses safety margins if corporate expansion targets face localized macroeconomic slowdowns.</li>
            <li style="list-style-type:'⚠️ '; margin-left:5px;">Increased susceptibility to capital flight adjustments if industry interest trends pivot.</li>
        `;
    }
}
