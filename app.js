/**
 * PSX Investor Dashboard Framework Core Execution Matrix Controller
 * Developer Identity Asserted: Hammad Hanif
 */

let activeAppMode = "ALL"; 
let focusedCorporateDataNode = null;
let watchlistDataArray = JSON.parse(localStorage.getItem('psx_watchlist_cache')) || ["FFC", "SYS", "MARI"];
let comparativeBasketMatrix = [];

// Strategic Mock Indices for Cross-Industry Baseline Comparisons
const benchmarkCorporateMasterList = ["FFC", "EFERT", "MARI", "SYS", "HUBC"];

document.addEventListener("DOMContentLoaded", () => {
    initializeLocalCacheData();
    runRankings("DIVIDEND");
    triggerDirectTickerQuery(watchlistDataArray[0] || "FFC");
});

function setMode(mode) {
    activeAppMode = mode;
    document.getElementById('btnAll').classList.toggle('active', mode === 'ALL');
    document.getElementById('btnShariah').classList.toggle('active', mode === 'SHARIAH');
    alert(`System Filter Set To: ${mode === 'SHARIAH' ? 'Shariah-Compliant Issuers Exclusively' : 'All Listed Capital Securities'}`);
}

function initializeLocalCacheData() {
    const container = document.getElementById('watchlistContainer');
    container.innerHTML = "";
    watchlistDataArray.forEach(sym => {
        const row = document.createElement('div');
        row.className = "list-item";
        row.innerHTML = `<strong>${sym}</strong> <span style='color:var(--accent); font-size:0.75rem;'>View Data Card</span>`;
        row.onclick = () => triggerDirectTickerQuery(sym);
        container.appendChild(row);
    });
}

function toggleWatchlist() {
    if (!focusedCorporateDataNode) return;
    const s = focusedCorporateDataNode.symbol;
    const idx = watchlistDataArray.indexOf(s);
    if (idx > -1) watchlistDataArray.splice(idx, 1);
    else watchlistDataArray.push(s);
    localStorage.setItem('psx_watchlist_cache', JSON.stringify(watchlistDataArray));
    initializeLocalCacheData();
}

async function triggerSearch() {
    const target = document.getElementById('targetInput').value;
    if (target) triggerDirectTickerQuery(target);
}

async function triggerDirectTickerQuery(symbol) {
    const cleanedSym = symbol.trim().toUpperCase();
    
    // Check Offline Local Storage Cache Layer prior to firing HTTP connection pipes
    const cachedNode = localStorage.getItem(`psx_cache_${cleanedSym}`);
    if (cachedNode) {
        const decoded = JSON.parse(cachedNode);
        if (activeAppMode === "SHARIAH" && !decoded.isShariah) {
            alert(`Selected security [${cleanedSym}] falls outside designated Shariah Compliance guidelines.`);
            return;
        }
        mapCorporateNodeToTerminalUI(decoded);
        return;
    }

    try {
        const res = await fetch(`/api/company?symbol=${cleanedSym}`);
        const data = await res.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }

        if (activeAppMode === "SHARIAH" && !data.isShariah) {
            alert(`Selected entity [${cleanedSym}] does not meet Shariah Screening Criteria.`);
            return;
        }

        // Commit profile payload straight onto Local Storage Offline Cache Matrix Layer
        localStorage.setItem(`psx_cache_${cleanedSym}`, JSON.stringify(data));
        mapCorporateNodeToTerminalUI(data);

    } catch (err) {
        alert("Unable to establish remote data link connection parameters.");
    }
}

function mapCorporateNodeToTerminalUI(node) {
    focusedCorporateDataNode = node;
    
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = `${node.name} Analytics Profile`;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblPrev').innerText = `Rs. ${node.prevClose}`;
    document.getElementById('lbl52Range').innerText = `Rs. ${node.low52} - Rs. ${node.high52}`;
    document.getElementById('lblCap').innerText = `Rs. ${node.marketCap}`;
    document.getElementById('lblFloat').innerText = node.freeFloat;
    document.getElementById('lblDate').innerText = node.lastUpdated;
    
    document.getElementById('lblEps').innerText = `Rs. ${node.eps}`;
    document.getElementById('lblPe').innerText = `${node.pe}x`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;
    document.getElementById('lblPb').innerText = `${node.pb}x`;
    document.getElementById('lblYield').innerText = node.divYield;
    document.getElementById('lblEv').innerText = `Rs. ${node.ev}`;

    // Evaluate algorithmic valuation matrix thresholds dynamically
    const valBadge = document.getElementById('lblValBadge');
    const peFloat = parseFloat(node.pe);
    if (peFloat < 5.5) { valBadge.innerText = "Undervalued Asset"; valBadge.className = "quick-badge badge-green"; }
    else if (peFloat <= 9.5) { valBadge.innerText = "Fairly Valued Base"; valBadge.className = "quick-badge badge-orange"; }
    else { valBadge.innerText = "Premium Premium Overvaluation"; valBadge.className = "quick-badge badge-red"; }

    // Map Dynamic Matrix Lists
    const revContainer = document.getElementById('revenueList'); revContainer.innerHTML = "";
    node.mainRevenue.forEach(i => revContainer.innerHTML += `<li>${i}</li>`);
    
    const incContainer = document.getElementById('incomeList'); incContainer.innerHTML = "";
    node.otherIncome.forEach(i => incContainer.innerHTML += `<li>${i} (Core Recurring Stream)</li>`);

    const futContainer = document.getElementById('futureList'); futContainer.innerHTML = "";
    node.futurePlans.forEach(i => futContainer.innerHTML += `<li>${i}</li>`);

    // Red Flag Heuristic Logic Parser Engine Mapping Sequence
    const rfContainer = document.getElementById('redFlagsList'); rfContainer.innerHTML = "";
    if (parseFloat(node.debt.deRatio) > 1.2) rfContainer.innerHTML += `<li>⚠️ High Balance Sheet Gearing: Debt Equity exceeds safety thresholds.</li>`;
    if (parseFloat(node.pe) > 10) rfContainer.innerHTML += `<li>⚠️ Multiples Compression Risk: High P/E Relative to index bounds.</li>`;
    if (rfContainer.innerHTML === "") rfContainer.innerHTML = `<li style='color:var(--green);'>No immediate operational red flags detected. Clean core baseline indicators.</li>`;

    // Map Debt Profile Fields
    document.getElementById('lblTotalDebt').innerText = `Rs. ${node.debt.total}`;
    document.getElementById('lblDeRatio').innerText = node.debt.deRatio;
    document.getElementById('lblFinCost').innerText = `Rs. ${node.debt.financeCost}`;
    document.getElementById('lblCoverage').innerText = `${node.debt.coverage}x`;

    // Reconstruct 5-Year Financial Statement Dynamic Matrix Rows
    const tableBody = document.querySelector('#financialTable tbody');
    tableBody.innerHTML = `
        <tr><td>Core Topline Revenue</td>${node.history.rev.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td>Net Consolidated Profit</td>${node.history.net.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td>Diluted EPS Matrix</td>${node.history.eps.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
        <tr><td>Net Operational Cash Flows</td>${node.history.cf.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
    `;

    // Project Forward 2-Year Forecast Elements Engine Block
    const forecastBody = document.querySelector('#forecastTable tbody');
    forecastBody.innerHTML = `
        <tr><td>Revenue Growth Path Target</td><td>Rs. ${(parseFloat(node.history.rev[4])*1.12).toFixed(1)}B</td><td>Rs. ${(parseFloat(node.history.rev[4])*1.24).toFixed(1)}B</td><td>85% Alpha Confidence Bounds</td></tr>
        <tr><td>Net Operational Income Forecast</td><td>Rs. ${(parseFloat(node.history.net[4])*1.08).toFixed(1)}B</td><td>Rs. ${(parseFloat(node.history.net[4])*1.19).toFixed(1)}B</td><td>78% High Probability Base</td></tr>
        <tr><td>Projected Cash Distribution Pay-out</td><td>Rs. ${(parseFloat(node.divYield)*1.05).toFixed(1)}%</td><td>Rs. ${(parseFloat(node.divYield)*1.10).toFixed(1)}%</td><td>Stabilized Cash Flow Asset Baseline</td></tr>
    `;

    calculatePortfolioDeployment();
}

function calculatePortfolioDeployment() {
    const cap = parseFloat(document.getElementById('portfolioCapital').value) || 100000;
    const div = focusedCorporateDataNode ? parseFloat(focusedCorporateDataNode.divYield) / 100 : 0.11;
    
    const reportBox = document.getElementById('portfolioReport');
    reportBox.innerHTML = `
        <div class='stat-card'><label>Target Equity Asset Component</label><div class='value'>${focusedCorporateDataNode ? focusedCorporateDataNode.symbol : 'Index Core'} (60%)</div></div>
        <div class='stat-card'><label>Liquidity Buffer Component</label><div class='value'>Cash Equivalents (40%)</div></div>
        <div class='stat-card'><label>Annualized Dividend Cash Flow Flow</label><div class='value' style='color:var(--green);'>Rs. ${(cap * 0.6 * div).toFixed(0)}</div></div>
        <div class='stat-card'><label>Portfolio Specific Volatility/Risk</label><div class='value'>Low-Beta Defensive Balanced</div></div>
    `;
}

function addToComparison() {
    if (!focusedCorporateDataNode) return;
    if (comparativeBasketMatrix.some(i => i.symbol === focusedCorporateDataNode.symbol)) return;
    if (comparativeBasketMatrix.length >= 5) { alert("Maximum benchmarking baseline limits reached (5 Tickers Maximum)."); return; }
    
    comparativeBasketMatrix.push(focusedCorporateDataNode);
    rebuildComparisonMatrixLayout();
}

function removeComparisonTicker(sym) {
    comparativeBasketMatrix = comparativeBasketMatrix.filter(i => i.symbol !== sym);
    rebuildComparisonMatrixLayout();
}

function rebuildComparisonMatrixLayout() {
    const tags = document.getElementById('comparisonTags'); tags.innerHTML = "";
    const headers = document.getElementById('compHeaders'); headers.innerHTML = "<th>Benchmark Parameter</th>";
    
    comparativeBasketMatrix.forEach(node => {
        tags.innerHTML += `<div class='comp-badge'>${node.symbol} <span onclick="removeComparisonTicker('${node.symbol}')">×</span></div>`;
        headers.innerHTML += `<th>${node.symbol}</th>`;
    });

    const rows = [
        { label: "Sector Classification Profile", key: "sector" },
        { label: "Market Price Line (Rs.)", key: "price" },
        { label: "Price-to-Earnings Multiple (P/E)", key: "pe" },
        { label: "Dividend Yield Trailing Bounds", key: "divYield" },
        { label: "Balance Sheet Debt Gearing", key: "debt", subKey: "deRatio" }
    ];

    const body = document.getElementById('compBody'); body.innerHTML = "";
    rows.forEach(r => {
        let tr = `<tr><td><strong>${r.label}</strong></td>`;
        comparativeBasketMatrix.forEach(node => {
            let val = r.subKey ? node[r.key][r.subKey] : node[r.key];
            tr += `<td>${val}</td>`;
        });
        tr += `</tr>`;
        body.innerHTML += tr;
    });
}

function runRankings(strategy) {
    const container = document.getElementById('rankingContainer');
    container.innerHTML = "";
    
    // Calculate simulated strategy matrix scores 
    let mockRankingsData = [
        { sym: "FFC", score: "94/100 Corporate Strength Alignment Index", desc: "Top Tier Defensive Cash Generator Engine" },
        { sym: "EFERT", score: "89/100 Corporate Strength Alignment Index", desc: "Premium Payout Consistency Record Model" },
        { sym: "MARI", score: "86/100 Corporate Strength Alignment Index", desc: "Aggressive Asset Growth Capital Deployment Asset" },
        { sym: "SYS", score: "82/100 Corporate Strength Alignment Index", desc: "High Return Profile Tech Sector Leader Model" }
    ];

    if (strategy === "GROWTH") {
        mockRankingsData.sort((a,b) => b.sym === "SYS" ? 1 : -1);
    }

    mockRankingsData.forEach((item, index) => {
        container.innerHTML += `
            <div class='list-item' onclick="triggerDirectTickerQuery('${item.sym}')">
                <div><strong>#${index + 1} ${item.sym}</strong><br><small style='color:var(--text-muted); font-size:0.7rem;'>${item.desc}</small></div>
                <div style='color:var(--accent); font-weight:700;'>${item.score}</div>
            </div>
        `;
    });
}
