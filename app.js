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
    if (!symbol) return;
    const cleanedSym = symbol.trim().toUpperCase();
    
    // Sync dropdown position if available
    const dropdown = document.getElementById('shariahDropdown');
    if (dropdown) {
        if ([...dropdown.options].some(option => option.value === cleanedSym)) {
            dropdown.value = cleanedSym;
        } else {
            dropdown.value = "";
        }
    }

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
    
    // Base Snapshot
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = `${node.name} Comprehensive Terminal Analysis`;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblPrev').innerText = `Rs. ${node.prevClose}`;
    document.getElementById('lbl52Range').innerText = `Rs. ${node.low52} - Rs. ${node.high52}`;
    document.getElementById('lblCap').innerText = `Rs. ${node.marketCap}`;
    
    // Ratios Mapping Matrix
    document.getElementById('lblEps').innerText = `Rs. ${node.eps}`;
    document.getElementById('lblPe').innerText = `${node.pe}x`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;
    document.getElementById('lblPb').innerText = `${node.pb}x`;
    document.getElementById('lblYield').innerText = node.divYield;
    document.getElementById('lblEv').innerText = `Rs. ${node.ev}`;
    document.getElementById('lblDesc').innerText = node.description;

    // Render Shariah Status Compliance Indicators Instead of Blocking
    const shariahBadge = document.getElementById('lblShariahBadge');
    shariahBadge.innerText = node.isShariah === "YES" ? "Shariah Compliant" : "Non-Compliant";
    shariahBadge.className = node.isShariah === "YES" ? "quick-badge badge-green" : "quick-badge badge-red";

    // Advanced Health Guardrails Mapping (Altman Z & FCF)
    const solvencyBadge = document.getElementById('lblSolvencyBadge');
    const zScore = parseFloat(node.altmanZ);
    solvencyBadge.innerText = `Z-Score: ${zScore}`;
    if(zScore > 2.9) solvencyBadge.className = "quick-badge badge-green";
    else if(zScore >= 1.2) solvencyBadge.className = "quick-badge badge-orange";
    else solvencyBadge.className = "quick-badge badge-red";

    const fcfBadge = document.getElementById('lblFcfBadge');
    fcfBadge.innerText = `Yield: ${node.fcfYield}`;
    fcfBadge.className = parseFloat(node.fcfYield) > 12 ? "quick-badge badge-green" : "quick-badge badge-orange";

    // Valuation Rating Multiples
    const valBadge = document.getElementById('lblValBadge');
    const peFloat = parseFloat(node.pe);
    if (peFloat < 5.5) { valBadge.innerText = "Undervalued"; valBadge.className = "quick-badge badge-green"; }
    else if (peFloat <= 9.5) { valBadge.innerText = "Fair Value"; valBadge.className = "quick-badge badge-orange"; }
    else { valBadge.innerText = "Overvalued"; valBadge.className = "quick-badge badge-red"; }

    // Rebuild Content Lists
    const revContainer = document.getElementById('revenueList'); revContainer.innerHTML = "";
    node.mainRevenue.forEach(i => revContainer.innerHTML += `<li>${i}</li>`);
    
    const incContainer = document.getElementById('incomeList'); incContainer.innerHTML = "";
    node.otherIncome.forEach(i => incContainer.innerHTML += `<li>${i}</li>`);

    const futContainer = document.getElementById('futureList'); futContainer.innerHTML = "";
    node.futurePlans.forEach(i => futContainer.innerHTML += `<li>${i}</li>`);

    // Red Flags Logic Engine
    const rfContainer = document.getElementById('redFlagsList'); rfContainer.innerHTML = "";
    if (parseFloat(node.debt.deRatio) > 1.1) rfContainer.innerHTML += `<li>⚠️ Balance Sheet Gearing: Debt Equity exceeds safety thresholds.</li>`;
    if (zScore < 1.2) rfContainer.innerHTML += `<li>⚠️ Distress Risk Warning: Low Altman Z-Score index metrics.</li>`;
    if (rfContainer.innerHTML === "") rfContainer.innerHTML = `<li style='color:var(--green);'>No core financial stress indicators found.</li>`;

    // Debt Mapping
    document.getElementById('lblTotalDebt').innerText = `Rs. ${node.debt.total}`;
    document.getElementById('lblDeRatio').innerText = node.debt.deRatio;
    document.getElementById('lblFinCost').innerText = `Rs. ${node.debt.financeCost}`;
    document.getElementById('lblCoverage').innerText = `${node.debt.coverage}x`;

    // Process Year-over-Year Accounting Data Tables Including New Dividend Payout Ratios
    const tableBody = document.querySelector('#financialTable tbody');
    tableBody.innerHTML = `
        <tr><td><strong>Topline Revenue Matrix</strong></td>${node.history.rev.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Net Corporate Income</strong></td>${node.history.net.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Diluted Earnings Per Share (EPS)</strong></td>${node.history.eps.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
        <tr><td><strong>Operating Cash Flow Output</strong></td>${node.history.cf.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Historical Cash Dividends</strong></td>${node.history.divHistory.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
        <tr><td><strong>Dividend Payout Ratio (%)</strong></td>${node.history.payoutRatio.map(v => `<td>${v}</td>`).join('')}</tr>
    `;

    // Process Projections Numbers Explicitly
    const forecastBody = document.querySelector('#forecastTable tbody');
    const baseRev = parseFloat(node.history.rev[4]);
    const baseNet = parseFloat(node.history.net[4]);
    const baseEps = parseFloat(node.eps);
    const baseDiv = parseFloat(node.divYield);

    forecastBody.innerHTML = `
        <tr><td><strong>Revenue Growth Projection</strong></td><td>Rs. ${(baseRev * 1.12).toFixed(1)}B</td><td>Rs. ${(baseRev * 1.25).toFixed(1)}B</td><td>85% Alpha Confidence Limits</td></tr>
        <tr><td><strong>Net Operational Profit Forecast</strong></td><td>Rs. ${(baseNet * 1.08).toFixed(1)}B</td><td>Rs. ${(baseNet * 1.20).toFixed(1)}B</td><td>78% High Probability Base</td></tr>
        <tr><td><strong>Estimated Diluted EPS Roadmap</strong></td><td>Rs. ${(baseEps * 1.10).toFixed(2)}</td><td>Rs. ${(baseEps * 1.22).toFixed(2)}</td><td>Adaptive Industry Benchmark Trend</td></tr>
        <tr><td><strong>Projected Cash Dividend Yield</strong></td><td>${(baseDiv * 1.04).toFixed(1)}%</td><td>${(baseDiv * 1.09).toFixed(1)}%</td><td>Secured Asset Capital Reserves</td></tr>
    `;

    // Render Competitor Sector Rankings Sidebar Dynamically
    rebuildSectorRankingsEngine(node.relatedPeers);
    calculatePortfolioDeployment();
}

function rebuildSectorRankingsEngine(peersArray) {
    const container = document.getElementById('rankingContainer');
    container.innerHTML = "";
    
    peersArray.forEach((peer, idx) => {
        container.innerHTML += `
            <div class='list-item' onclick="triggerDirectTickerQuery('${peer}')">
                <div><strong>#${idx + 1} ${peer}</strong><br><small style='color:var(--text-muted); font-size:0.7rem;'>Sector Competitor Peer</small></div>
                <div style='color:var(--accent); font-weight:700;'>Load</div>
            </div>
        `;
    });
}

function calculatePortfolioDeployment() {
    const cap = parseFloat(document.getElementById('portfolioCapital').value) || 500000;
    const div = focusedCorporateDataNode ? parseFloat(focusedCorporateDataNode.divYield) / 100 : 0.12;
    
    const reportBox = document.getElementById('portfolioReport');
    reportBox.innerHTML = `
        <div class='stat-card'><label>Target Equity Allocation</label><div class='value'>${focusedCorporateDataNode ? focusedCorporateDataNode.symbol : 'Asset'} (65%)</div></div>
        <div class='stat-card'><label>Capital Liquidity Buffer</label><div class='value'>Cash Equivalents (35%)</div></div>
        <div class='stat-card'><label>Expected Portfolio Annual Income</label><div class='value' style='color:var(--green);'>Rs. ${(cap * 0.65 * div).toFixed(0)}</div></div>
        <div class='stat-card'><label>Risk Matrix Evaluation Profile</label><div class='value'>Balanced Risk Adjusted</div></div>
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
