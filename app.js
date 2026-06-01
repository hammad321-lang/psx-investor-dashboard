/***********************
 * PSX INTELLIGENT TERMINAL v2
 * Hybrid Live + Static Engine
 ***********************/

// =====================
// CONFIG
// =====================
const API_BASE = window.API_BASE || null;
const CACHE_TTL = 60 * 1000; // 1 min cache

const cacheStore = {};

// =====================
// STATIC FALLBACK DATA
// =====================
const corporateDatabaseDirectory = {
    SYS: { sector: "Technology & Communications", bv: 114.40, shariah: "YES", sharesOutstanding: 291 },
    FFC: { sector: "Chemicals & Fertilizers", bv: 110.20, shariah: "YES", sharesOutstanding: 1272 },
    EFERT: { sector: "Chemicals & Fertilizers", bv: 58.20, shariah: "YES", sharesOutstanding: 1335 },
    MARI: { sector: "Oil & Gas Exploration", bv: 980.50, shariah: "YES", sharesOutstanding: 133 },
    OGDC: { sector: "Oil & Gas Exploration", bv: 265.40, shariah: "YES", sharesOutstanding: 4301 },
    PPL: { sector: "Oil & Gas Exploration", bv: 242.10, shariah: "YES", sharesOutstanding: 2721 },
    HUBC: { sector: "Power Generation", bv: 56.40, shariah: "YES", sharesOutstanding: 1297 },
    LUCK: { sector: "Cement", bv: 512.30, shariah: "YES", sharesOutstanding: 313 }
};

// =====================
// UTILITIES
// =====================
function fmt(num) {
    if (!num && num !== 0) return "-";
    return Number(num).toLocaleString(undefined, {
        maximumFractionDigits: 2
    });
}

function getCached(key) {
    const item = cacheStore[key];
    if (!item) return null;
    if (Date.now() - item.time > CACHE_TTL) return null;
    return item.data;
}

function setCache(key, data) {
    cacheStore[key] = { data, time: Date.now() };
}

// =====================
// API LAYER (LIVE DATA)
// =====================
async function fetchStockData(ticker) {
    const key = ticker.toUpperCase();

    const cached = getCached(key);
    if (cached) return cached;

    try {
        if (!API_BASE) throw new Error("No API configured");

        const res = await fetch(`${API_BASE}/stock/${key}`);
        const data = await res.json();

        setCache(key, data);
        return data;

    } catch (err) {
        console.warn("API failed, using fallback:", err.message);

        // fallback mode
        return {
            ticker: key,
            price: 100,
            bv: corporateDatabaseDirectory[key]?.bv || 100,
            sector: corporateDatabaseDirectory[key]?.sector || "PSX Listed Equity",
            shariah: corporateDatabaseDirectory[key]?.shariah || "YES",
            sharesOutstanding: corporateDatabaseDirectory[key]?.sharesOutstanding || 100,
            divs: [0,0,0,0,0],
            divTypes: ["Cash", "Cash", "Cash", "Cash", "Cash"],
            corporatePlan: "Fallback mode active (no live API connection).",
            growthFactor: 0.1,
            competitors: []
        };
    }
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    runCalculationsEngine();
    setInterval(runCalculationsEngine, 60000); // auto refresh
});

// =====================
// LOAD ASSET
// =====================
async function quickLoadAsset(ticker) {
    if (!ticker) return;

    const data = await fetchStockData(ticker);

    document.getElementById('varTicker').value = ticker.toUpperCase();
    document.getElementById('varSector').value = data.sector;
    document.getElementById('varPrice').value = data.price;
    document.getElementById('varBv').value = data.bv;
    document.getElementById('varShariah').value = data.shariah;
    document.getElementById('compShares').value = data.sharesOutstanding;

    // dividends
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`div${i}`).value = data.divs?.[i-1] || 0;
        document.getElementById(`type${i}`).value = data.divTypes?.[i-1] || "Cash";
    }

    runCalculationsEngine();
}

// =====================
// MANUAL INPUT FALLBACK
// =====================
function pullManualTicker() {
    const input = document.getElementById('manualTickerInput').value.trim().toUpperCase();
    if (!input) return;
    quickLoadAsset(input);
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

    // snapshot
    document.getElementById('cardTicker').innerText = ticker;
    document.getElementById('cardSector').innerText = sector;

    // P/B
    const pb = price / bv;
    const pbEl = document.getElementById('cardPbVal');
    pbEl.innerText = `${pb.toFixed(2)}x`;
    pbEl.style.color = pb < 1 ? "var(--green)" : "var(--accent)";

    // Shariah badge
    document.getElementById('cardShariahBadge').innerHTML =
        shariah === "YES"
            ? `<span class="quick-badge badge-green">COMPLIANT</span>`
            : `<span class="quick-badge badge-red">NON-COMPLIANT</span>`;

    // Market cap (FIXED: not "Million" wrong label anymore)
    const marketCap = price * shares;
    const netWorth = bv * shares;

    document.getElementById('lblMarketCap').innerText =
        `Rs. ${fmt(marketCap)}`;

    document.getElementById('lblNetWorth').innerText =
        `Rs. ${fmt(netWorth)}`;

    // Dividend yield
    for (let i = 1; i <= 5; i++) {
        const div = parseFloat(document.getElementById(`div${i}`).value) || 0;
        document.getElementById(`yield${i}`).innerText =
            price ? `${((div / price) * 100).toFixed(2)}%` : "0.0%";
    }

    // Forecast model
    const base = corporateDatabaseDirectory[ticker] || {};
    const growth = base.growthFactor || 0.12;

    for (let y = 1; y <= 3; y++) {

        let cons = price + (bv * growth * 0.8 * y);
        let opt = price * Math.pow(1 + growth, y);

        if (pb < 0.6) {
            cons += bv * 0.05 * y;
            opt += bv * 0.08 * y;
        }

        document.getElementById(`fcCons${y}`).innerText = `Rs. ${fmt(cons)}`;
        document.getElementById(`fcOpt${y}`).innerText = `Rs. ${fmt(opt)}`;

        const cagr = price ? (Math.pow(cons / price, 1 / y) - 1) * 100 : 0;
        document.getElementById(`fcCagr${y}`).innerText = `${cagr.toFixed(1)}%`;
    }

    calculatePeerRatios();
    generateExpertInsights(ticker, sector, pb, shariah, price);
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
        el.innerText = `${pb.toFixed(2)}x`;
        el.style.color = pb < 1 ? "var(--green)" : "var(--accent)";
    }
}

// =====================
// INSIGHTS ENGINE (IMPROVED)
// =====================
function generateExpertInsights(ticker, sector, pb, shariah) {

    const suggestBox = document.getElementById('suggestBox');
    const riskBox = document.getElementById('riskBox');

    const compliance = shariah === "YES"
        ? "Shariah compliant structure confirmed."
        : "Non-compliant asset — avoid Islamic portfolio classification.";

    if (pb < 1) {
        suggestBox.innerHTML = `
            <li>Value Zone: Trading below book value benchmark.</li>
            <li>Defensive accumulation range detected.</li>
            <li>${compliance}</li>
        `;

        riskBox.innerHTML = `
            <li>Check for value trap conditions.</li>
            <li>Liquidity cycles may distort undervaluation signal.</li>
        `;
    } else {
        suggestBox.innerHTML = `
            <li>Growth pricing detected above book value.</li>
            <li>Requires earnings confirmation for continuation.</li>
            <li>${compliance}</li>
        `;

        riskBox.innerHTML = `
            <li>High valuation compression risk in downturn.</li>
            <li>Macro sensitivity increased.</li>
        `;
    }
}
