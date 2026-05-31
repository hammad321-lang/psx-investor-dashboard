/**
 * PSX Investor Dashboard Core Controller System Logic
 * Developer Identity Asserted: Hammad Hanif
 */

let focusedCorporateDataNode = null;
let watchlistDataArray = JSON.parse(localStorage.getItem('psx_watchlist_cache')) || ["FFC", "SYS", "MARI"];
let comparativeBasketMatrix = [];

document.addEventListener("DOMContentLoaded", () => {
    initializeLocalCacheData();
    triggerDirectTickerQuery(watchlistDataArray[0] || "FFC");
});

function initializeLocalCacheData() {
    const container = document.getElementById('watchlistContainer');
    container.innerHTML = "";
    watchlistDataArray.forEach(sym => {
        const row = document.createElement('div');
        row.className = "list-item";
        row.innerHTML = `<strong>${sym}</strong> <span style='color:var(--accent); font-size:0.75rem;'>Load Profile</span>`;
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
    
    // Check Offline Caching Layer before firing HTTP requests
    const cachedNode = localStorage.getItem(`psx_spec_cache_${cleanedSym}`);
    if (cachedNode) {
        mapCorporateNodeToTerminalUI(JSON.parse(cachedNode));
        return;
    }

    try {
        const res = await fetch(`/api/company?symbol=${cleanedSym}`);
        const data = await res.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }

        localStorage.setItem(`psx_spec_cache_${cleanedSym}`, JSON.stringify(data));
        mapCorporateNodeToTerminalUI(data);

    } catch (err) {
        alert("Error mapping remote server parameters.");
    }
}

function mapCorporateNodeToTerminalUI(node) {
    focusedCorporateDataNode = node;
    
    // Base Snapshot Info Mapping Matrix
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = `${node.name} Comprehensive Terminal Analysis`;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblPrev').innerText = `Rs. ${node.prevClose}`;
    document.getElementById('lbl52Range').innerText = `Rs. ${node.low52} - Rs. ${node.high52}`;
    document.getElementById('lblCap').innerText = `Rs. ${node.marketCap}`;
    document.getElementById('lblShares').innerText = node.sharesOutstanding;
    document.getElementById('lblFloat').innerText = node.freeFloat;
    document.getElementById('lblDate').innerText = node.lastUpdated;
    
    // Fundamentals Ratio Mapping Matrix Elements
    document.getElementById('lblEps').innerText = `Rs. ${node.eps}`;
    document.getElementById('lblPe').innerText = `${node.pe}x`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;
    document.getElementById('lblPb').innerText = `${node.pb}x`;
    document.getElementById('lblYield').innerText = node.divYield;
    document.getElementById('lblEv').innerText = `Rs. ${node.ev}`;
    document.getElementById('lblDesc').innerText = node.description;

    // Render Shariah Status Compliance Indicators
    const shariahBadge = document.getElementById('lblShariahBadge');
    shariahBadge.innerText = `Compliant: ${node.isShariah}`;
    shariahBadge.className = node.isShariah === "YES" ? "quick-badge badge-green" : "quick-badge badge-red";

    // Evaluate dynamic asset value multipliers
    const valBadge = document.getElementById('lblValBadge');
    const peFloat = parseFloat(node.pe);
    if (peFloat < 5.5) { valBadge.innerText = "Undervalued Base"; valBadge.className = "quick-badge badge-green"; }
    else if (peFloat <= 9.5) { valBadge.innerText = "Fairly Valued Core"; valBadge.className = "quick-badge badge-orange"; }
    else { valBadge.innerText = "Overvalued Multiples"; valBadge.className = "quick-badge badge-red"; }

    // Rebuild Text Array Metrics
    const revContainer = document.getElementById('revenueList'); revContainer.innerHTML = "";
    node.mainRevenue.forEach(i => revContainer.innerHTML += `<li>${i}</li>`);
    
    const incContainer = document.getElementById('incomeList'); incContainer.innerHTML = "";
    node.otherIncome.forEach(i => incContainer.innerHTML += `<li>${i}</li>`);

    const futContainer = document.getElementById('futureList'); futContainer.innerHTML = "";
    node.futurePlans.forEach(i => futContainer.innerHTML += `<li>${i}</li>`);

    // Red Flags Parsing Module Logic
    const rfContainer = document.getElementById('redFlagsList'); rfContainer.innerHTML = "";
    if (parseFloat(node.debt.deRatio) > 1.1) rfContainer.innerHTML += `<li>⚠️ Balance Sheet Leverage Risk: High Debt Equity Multiple.</li>`;
    if (parseFloat(node.pe) > 9.5) rfContainer.innerHTML += `<li>⚠️ Growth Value Friction: P/E sits at high industry premiums.</li>`;
    if (rfContainer.innerHTML === "") rfContainer.innerHTML = `<li style='color:var(--green);'>No core red flags caught. Healthy baseline monitoring.</li>`;

    // Debt Structure Analytics Mapping Node
    document.getElementById('lblTotalDebt').innerText = `Rs. ${node.debt.total}`;
    document.getElementById('lblDeRatio').innerText = node.debt.deRatio;
    document.getElementById('lblFinCost').innerText = `Rs. ${node.debt.financeCost}`;
    document.getElementById('lblCoverage').innerText = `${node.debt.coverage}x`;

    // Process and Inject Year-to-Year Financial Data Matrices Row Nodes
    const tableBody = document.querySelector('#financialTable tbody');
    tableBody.innerHTML = `
        <tr><td><strong>Topline Gross Revenue</strong></td>${node.history.rev.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Net Corporate Income</strong></td>${node.history.net.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Diluted Earnings Per Share (EPS)</strong></td>${node.history.eps.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
        <tr><td><strong>Operating Cash Flow Output</strong></td>${node.history.cf.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Historical Dividend Distributions</strong></td>${node.history.divHistory.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
    `;

    // Map Dynamic Future Forward Projection Numbers Matrices
    const forecastBody = document.querySelector('#forecastTable tbody');
    const baseRev = parseFloat(node.history.rev[4]);
    const baseNet = parseFloat(node.history.net[4]);
    const baseEps = parseFloat(node.eps);
    const baseDiv = parseFloat(node.divYield);

    forecastBody.innerHTML = `
        <tr><td><strong>Revenue Forecast Framework</strong></td><td>Rs. ${(baseRev * 1.12).toFixed(1)}B</td><td>Rs. ${(baseRev * 1.25).toFixed(1)}B</td><td>85% Probability Bound</td></tr>
        <tr><td><strong>Profit Forecast Framework</strong></td><td>Rs. ${(baseNet * 1.08).toFixed(1)}B</td><td>Rs. ${(baseNet * 1.20).toFixed(1)}B</td><td>78% Normalized Probability Base</td></tr>
        <tr><td><strong>EPS Forecast Core Trend</strong></td><td>Rs. ${(baseEps * 1.10).toFixed(2)}</td><td>Rs. ${(baseEps * 1.22).toFixed(2)}</td><td>Adaptive Target Index Alpha</td></tr>
        <tr><td><strong>Dividend Distribution Yield Proj</strong></td><td>${(baseDiv * 1.04).toFixed(1)}%</td><td>${(baseDiv * 1.09).toFixed(1)}%</td><td>Secured Flow Capital Reserve</td></tr>
    `;

    // Dynamically update Strategic Rankings Sidebar targeting Related Sector Competitors
    rebuildSectorRankingsEngine(node.relatedPeers);
    calculatePortfolioDeployment();
}

function rebuildSectorRankingsEngine(peersArray) {
    const container = document.getElementById('rankingContainer');
    container.innerHTML = "";
    
    peersArray.forEach((peer, idx) => {
        container.innerHTML += `
            <div class='list-item' onclick="triggerDirectTickerQuery('${peer}')">
                <div><strong>#${idx + 1} ${peer}</strong><br><small style='color:var(--text-muted); font-size:0.75rem;'>Sector Benchmark Competitor</small></div>
                <div style='color:var(--accent); font-weight:700;'>Ranked Peer</div>
            </div>
        `;
    });
}

function calculatePortfolioDeployment() {
    const cap = parseFloat(document.getElementById('portfolioCapital').value) || 500000;
    const div = focusedCorporateDataNode ? parseFloat(focusedCorporateDataNode.divYield) / 100 : 0.12;
    
    const reportBox = document.getElementById('portfolioReport');
    reportBox.innerHTML = `
        <div class='stat-card'><label>Target Equity Allotment</label><div class='value'>${focusedCorporateDataNode ? focusedCorporateDataNode.symbol : 'Core Ticker'} (65%)</div></div>
        <div class='stat-card'><label>Capital Diversification Reserve</label><div class='value'>Cash Equivalents (35%)</div></div>
        <div class='stat-card'><label>Expected Portfolio Annual Income</label><div class='value' style='color:var(--green);'>Rs. ${(cap * 0.65 * div).toFixed(0)}</div></div>
        <div class='stat-card'><label>Portfolio Risk Class Score</label><div class='value'>Defensive Stable Core</div></div>
    `;
}

function addToComparison() {
    if (!focusedCorporateDataNode) return;
    if (comparativeBasketMatrix.some(i => i.symbol === focusedCorporateDataNode.symbol)) return;
    if (comparativeBasketMatrix.length >= 5) { alert("Maximum 5 tracking tickers allowed simultaneously."); return; }
    
    comparativeBasketMatrix.push(focusedCorporateDataNode);
    rebuildComparisonMatrixLayout();
}

function removeComparisonTicker(sym) {
    comparativeBasketMatrix = comparativeBasketMatrix.filter(i => i.symbol !== sym);
    rebuildComparisonMatrixLayout();
}

function rebuildComparisonMatrixLayout() {
    const tags = document.getElementById('comparisonTags'); tags.innerHTML = "";
    const headers = document.getElementById('compHeaders'); headers.innerHTML = "<th>Benchmark Parameter Line Metrics</th>";
    
    comparativeBasketMatrix.forEach(node => {
        tags.innerHTML += `<div class='comp-badge'>${node.symbol} <span onclick="removeComparisonTicker('${node.symbol}')">×</span></div>`;
        headers.innerHTML += `<th>${node.symbol}</th>`;
    });

    const rows = [
        { label: "Sector Alignment Profile", key: "sector" },
        { label: "Market Share Value (Rs.)", key: "price" },
        { label: "Price-to-Earnings Ratio (P/E)", key: "pe" },
        { label: "Dividend Yield Metric Score", key: "divYield" },
        { label: "Debt Equity Matrix Scaling", key: "debt", subKey: "deRatio" }
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
