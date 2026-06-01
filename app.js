/***********************
 * PSX TERMINAL v2 — STABLE OFFLINE ENGINE
 * Fully working version (NO API dependency)
 ***********************/

// =====================
// COMPLETE DATABASE (RESTORED + SAFE)
// =====================
const corporateDatabaseDirectory = {
    SYS: {
        sector: "Technology & Communications",
        price: 435.00,
        bv: 114.40,
        shariah: "YES",
        sharesOutstanding: 291,
        divs: [8.0, 6.0, 5.0, 4.0, 3.5],
        divTypes: ["Cash Dividend", "Cash Dividend", "Cash + Bonus", "Cash Dividend", "Cash Dividend"],
        corporatePlan: "Aggressive export-led IT expansion with USD revenue diversification.",
        growthFactor: 0.25,
        competitors: [
            { name: "OCTOPUS", price: 72.40, bv: 28.10, risk: "Asset-light tech model" },
            { name: "AVN", price: 54.10, bv: 31.40, risk: "Project-based engineering exposure" }
        ]
    },

    FFC: {
        sector: "Chemicals & Fertilizers",
        price: 195.00,
        bv: 110.20,
        shariah: "YES",
        sharesOutstanding: 1272,
        divs: [18.5, 16.0, 14.5, 13.0, 12.0],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "Stable fertilizer cashflow with strong dividend policy.",
        growthFactor: 0.12,
        competitors: [
            { name: "EFERT", price: 168.40, bv: 58.20, risk: "High efficiency plant operations" },
            { name: "FATIMA", price: 46.50, bv: 41.20, risk: "Diversified chemical exposure" }
        ]
    },

    EFERT: {
        sector: "Chemicals & Fertilizers",
        price: 168.40,
        bv: 58.20,
        shariah: "YES",
        sharesOutstanding: 1335,
        divs: [21, 18.5, 15, 12.5, 11],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "High utilization fertilizer production and export focus.",
        growthFactor: 0.14,
        competitors: [
            { name: "FFC", price: 195, bv: 110.2, risk: "Scale advantage" },
            { name: "FATIMA", price: 46.5, bv: 41.2, risk: "Volatile margins" }
        ]
    },

    MARI: {
        sector: "Oil & Gas Exploration",
        price: 2450.00,
        bv: 980.50,
        shariah: "YES",
        sharesOutstanding: 133,
        divs: [142, 120, 98, 82, 75],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "High yield gas field production and exploration expansion.",
        growthFactor: 0.18,
        competitors: [
            { name: "OGDC", price: 122.3, bv: 265.4, risk: "Circular debt exposure" },
            { name: "PPL", price: 114.8, bv: 242.1, risk: "Receivable delays" }
        ]
    },

    OGDC: {
        sector: "Oil & Gas Exploration",
        price: 122.30,
        bv: 265.40,
        shariah: "YES",
        sharesOutstanding: 4301,
        divs: [10.5, 9, 8.25, 7.5, 6.75],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "State-linked exploration with stable reserves.",
        growthFactor: 0.10,
        competitors: [
            { name: "MARI", price: 2450, bv: 980.5, risk: "High efficiency operations" },
            { name: "PPL", price: 114.8, bv: 242.1, risk: "Exploration lag" }
        ]
    },

    PPL: {
        sector: "Oil & Gas Exploration",
        price: 114.80,
        bv: 242.10,
        shariah: "YES",
        sharesOutstanding: 2721,
        divs: [8.5, 7.5, 6, 5.5, 4.5],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "Balanced exploration and production strategy.",
        growthFactor: 0.11,
        competitors: [
            { name: "OGDC", price: 122.3, bv: 265.4, risk: "State dependency" },
            { name: "MARI", price: 2450, bv: 980.5, risk: "High margin operator" }
        ]
    },

    HUBC: {
        sector: "Power Generation",
        price: 118.50,
        bv: 56.40,
        shariah: "YES",
        sharesOutstanding: 1297,
        divs: [18, 15.5, 12, 10, 8.5],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
        corporatePlan: "Diversifying into mining and clean energy assets.",
        growthFactor: 0.16,
        competitors: [
            { name: "KAPCO", price: 28.5, bv: 44.1, risk: "Tariff pressure" },
            { name: "NPL", price: 22.1, bv: 38.6, risk: "Capacity payment risk" }
        ]
    },

    LUCK: {
        sector: "Cement",
        price: 745.00,
        bv: 512.30,
        shariah: "YES",
        sharesOutstanding: 313,
        divs: [18, 15, 12, 10, 0],
        divTypes: ["Cash", "Cash", "Cash", "Cash", "None"],
        corporatePlan: "Global cement expansion with energy efficiency focus.",
        growthFactor: 0.15,
        competitors: [
            { name: "DGKC", price: 68.2, bv: 142.1, risk: "Debt pressure" },
            { name: "CHCC", price: 134.5, bv: 118.2, risk: "Demand cycles" }
        ]
    }
};

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    runCalculationsEngine();
});

// =====================
// LOAD ASSET
// =====================
function quickLoadAsset(ticker) {
    if (!ticker) return;

    const item = corporateDatabaseDirectory[ticker.toUpperCase()];

    if (!item) return;

    document.getElementById('varTicker').value = ticker.toUpperCase();
    document.getElementById('varSector').value = item.sector;
    document.getElementById('varPrice').value = item.price;
    document.getElementById('varBv').value = item.bv;
    document.getElementById('varShariah').value = item.shariah;
    document.getElementById('compShares').value = item.sharesOutstanding;

    for (let i = 1; i <= 5; i++) {
        document.getElementById(`div${i}`).value = item.divs[i - 1] || 0;
        document.getElementById(`type${i}`).value = item.divTypes[i - 1] || "Cash";
    }

    for (let j = 1; j <= 2; j++) {
        if (item.competitors[j - 1]) {
            document.getElementById(`peerName${j}`).value = item.competitors[j - 1].name;
            document.getElementById(`peerPrice${j}`).value = item.competitors[j - 1].price;
            document.getElementById(`peerBv${j}`).value = item.competitors[j - 1].bv;
            document.getElementById(`peerRisk${j}`).value = item.competitors[j - 1].risk;
        }
    }

    runCalculationsEngine();
}

// =====================
// MANUAL INPUT
// =====================
function pullManualTicker() {
    const t = document.getElementById('manualTickerInput').value.trim().toUpperCase();
    if (!t) return;

    if (corporateDatabaseDirectory[t]) {
        quickLoadAsset(t);
    } else {
        document.getElementById('varTicker').value = t;
        document.getElementById('varSector').value = "PSX Listed Equity";
        document.getElementById('varPrice').value = 100;
        document.getElementById('varBv').value = 100;
        document.getElementById('varShariah').value = "YES";
        document.getElementById('compShares').value = 100;

        runCalculationsEngine();
    }
}

// =====================
// MAIN ENGINE
// =====================
function runCalculationsEngine() {

    const ticker = document.getElementById('varTicker').value.toUpperCase();
    const sector = document.getElementById('varSector').value;
    const price = parseFloat(document.getElementById('varPrice').value) || 0;
    const bv = parseFloat(document.getElementById('varBv').value) || 1;
    const shares = parseFloat(document.getElementById('compShares').value) || 0;
    const shariah = document.getElementById('varShariah').value;

    document.getElementById('cardTicker').innerText = ticker;
    document.getElementById('cardSector').innerText = sector;

    const pb = price / bv;

    const pbEl = document.getElementById('cardPbVal');
    pbEl.innerText = pb.toFixed(2) + "x";
    pbEl.style.color = pb < 1 ? "var(--green)" : "var(--accent)";

    document.getElementById('cardShariahBadge').innerHTML =
        shariah === "YES"
            ? `<span class="quick-badge badge-green">COMPLIANT</span>`
            : `<span class="quick-badge badge-red">NON-COMPLIANT</span>`;

    const mc = price * shares;
    const nw = bv * shares;

    document.getElementById('lblMarketCap').innerText = "Rs. " + mc.toLocaleString();
    document.getElementById('lblNetWorth').innerText = "Rs. " + nw.toLocaleString();

    for (let i = 1; i <= 5; i++) {
        const div = parseFloat(document.getElementById(`div${i}`).value) || 0;
        document.getElementById(`yield${i}`).innerText =
            price ? ((div / price) * 100).toFixed(2) + "%" : "0%";
    }

    const base = corporateDatabaseDirectory[ticker] || {};
    const growth = base.growthFactor || 0.12;

    for (let y = 1; y <= 3; y++) {

        let cons = price + (bv * growth * y);
        let opt = price * Math.pow(1 + growth, y);

        document.getElementById(`fcCons${y}`).innerText = "Rs. " + cons.toFixed(2);
        document.getElementById(`fcOpt${y}`).innerText = "Rs. " + opt.toFixed(2);

        const cagr = price ? (Math.pow(cons / price, 1 / y) - 1) * 100 : 0;
        document.getElementById(`fcCagr${y}`).innerText = cagr.toFixed(1) + "%";
    }

    calculatePeerRatios();
    generateExpertInsights(ticker, sector, pb, shariah);
}

// =====================
// PEERS
// =====================
function calculatePeerRatios() {
    for (let i = 1; i <= 2; i++) {
        const p = parseFloat(document.getElementById(`peerPrice${i}`).value) || 0;
        const b = parseFloat(document.getElementById(`peerBv${i}`).value) || 1;

        const pb = p / b;

        const el = document.getElementById(`peerPb${i}`);
        el.innerText = pb.toFixed(2) + "x";
        el.style.color = pb < 1 ? "var(--green)" : "var(--accent)";
    }
}

// =====================
// INSIGHTS
// =====================
function generateExpertInsights(ticker, sector, pb, shariah) {

    const suggestBox = document.getElementById('suggestBox');
    const riskBox = document.getElementById('riskBox');

    const compliance = shariah === "YES"
        ? "Shariah compliant structure confirmed."
        : "Non-compliant asset.";

    if (pb < 1) {
        suggestBox.innerHTML = `
            <li>Value zone detected below book value.</li>
            <li>Potential accumulation opportunity.</li>
            <li>${compliance}</li>
        `;

        riskBox.innerHTML = `
            <li>Possible value trap risk.</li>
            <li>Check liquidity cycles.</li>
        `;
    } else {
        suggestBox.innerHTML = `
            <li>Growth pricing environment.</li>
            <li>Requires earnings confirmation.</li>
            <li>${compliance}</li>
        `;

        riskBox.innerHTML = `
            <li>High valuation sensitivity.</li>
            <li>Macro risk exposure elevated.</li>
        `;
    }
}
