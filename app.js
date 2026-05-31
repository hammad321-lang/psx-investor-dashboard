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
    
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = `${node.name} Comprehensive Terminal Analysis`;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblPrev').innerText = `Rs. ${node.prevClose}`;
    document.getElementById('lbl52Range').innerText = `Rs. ${node.low52} - Rs. ${node.high52}`;
    document.getElementById('lblCap').innerText = `Rs. ${node.marketCap}`;
    
    document.getElementById('lblEps').innerText = `Rs. ${node.eps}`;
    document.getElementById('lblPe').innerText = `${node.pe}x`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;
    document.getElementById('lblPb').innerText = `${node.pb}x`;
    document.getElementById('lblYield').innerText = node.divYield;
    document.getElementById('lblEv').innerText = `Rs. ${node.ev}`;
    document.getElementById('lblDesc').innerText = node.description;

    // AI Suggestions Mapping
    document.getElementById('lblHorizonBadge').innerText = node.horizon;
    document.getElementById('lblHorizonBadge').className = "quick-badge badge-orange";
    
    document.getElementById('lblRiskBadge').innerText = node.riskClass;
    document.getElementById('lblRiskBadge').className = node.riskClass.includes("High") ? "quick-badge badge-red" : "quick-badge badge-green";

    const shariahBadge = document.getElementById('lblShariahBadge');
    shariahBadge.innerText = node.isShariah === "YES" ? "Shariah Compliant" : "Non-Compliant";
    shariahBadge.className = node.isShariah === "YES" ? "quick-badge badge-green" : "quick-badge badge-red";

    const valBadge = document.getElementById('lblValBadge');
    const peFloat = parseFloat(node.pe);
    if (peFloat < 5.5) { valBadge.innerText = "Undervalued"; valBadge.className = "quick-badge badge-green"; }
    else if (peFloat <= 9.5) { valBadge.innerText = "Fair Value"; valBadge.className = "quick-badge badge-orange"; }
    else { valBadge.innerText = "Overvalued"; valBadge.className = "quick-badge badge-red"; }

    const revContainer = document.getElementById('revenueList'); revContainer.innerHTML = "";
    node.mainRevenue.forEach(i => revContainer.innerHTML += `<li>${i}</li>`);
    
    const incContainer = document.getElementById('incomeList'); incContainer.innerHTML = "";
    node.otherIncome.forEach(i => incContainer.innerHTML += `<li>${i}</li>`);

    const futContainer = document.getElementById('futureList'); futContainer.innerHTML = "";
    node.futurePlans.forEach(i => futContainer.innerHTML += `<li>${i}</li>`);

    const rfContainer = document.getElementById('redFlagsList'); rfContainer.innerHTML = "";
    if (parseFloat(node.debt.deRatio) > 1.1) rfContainer.innerHTML += `<li>⚠️ Balance Sheet Gearing: Debt Equity exceeds safety thresholds.</li>`;
    if (parseFloat(node.debt.coverage) < 2.0) rfContainer.innerHTML += `<li>⚠️ Weak Cash Cover: Low interest coverage margins.</li>`;
    if (rfContainer.innerHTML === "") rfContainer.innerHTML = `<li style='color:var(--green);'>No severe operational risks found.</li>`;

    document.getElementById('lblTotalDebt').innerText = `Rs. ${node.debt.total}`;
    document.getElementById('lblDeRatio').innerText = node.debt.deRatio;
    document.getElementById('lblFinCost').innerText = `Rs. ${node.debt.financeCost}`;
    document.getElementById('lblCoverage').innerText = `${node.debt.coverage}x`;

    const tableBody = document.querySelector('#financialTable tbody');
    tableBody.innerHTML = `
        <tr><td><strong>Topline Revenue Matrix</strong></td>${node.history.rev.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Gross Profit (GP Execution)</strong></td>${node.history.gp.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Net Profit (NP Bottomline)</strong></td>${node.history.net.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Diluted Earnings Per Share (EPS)</strong></td>${node.history.eps.map(v => `<td>Rs. ${v}</td>`).join('')}</tr>
        <tr><td><strong>Operating Cash Flow Output</strong></td>${node.history.cf.map(v => `<td>Rs. ${v}B</td>`).join('')}</tr>
        <tr><td><strong>Dividend Payout Ratio (%)</strong></td>${node.history.payoutRatio.map(v => `<td>${v}</td>`).join('')}</tr>
    `;

    rebuildSectorRankingsEngine(node.relatedPeers);
    calculatePortfolioDeployment();
}

function rebuildSectorRankingsEngine(peersArray) {
    const container = document.getElementById('rankingContainer');
    container.innerHTML = "";
    peersArray.forEach((peer, idx) => {
        container.innerHTML += `
            <div class='list-item' onclick="triggerDirectTickerQuery('${peer}')">
                <div><strong>#${idx + 1} ${peer}</strong><br><small style='color:var(--text-muted); font-size:0.7rem;'>Sector Peer</small></div>
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
        <div class='stat-card'><label>Risk Matrix Evaluation Profile</label><div class='value'>Balanced Allocation</div></div>
    `;
}

// 5-Company Multi-Axis Cross Comparison System 
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
    const headers = document.getElementById('compHeaders'); headers.innerHTML = "<th>Benchmark Parameters Matrix Column</th>";
    
    if (comparativeBasketMatrix.length === 0) {
        document.getElementById('compBody').innerHTML = `<tr><td colspan="6" style="color:var(--text-muted); text-align:center; padding:2rem;">No companies added to the horizontal benchmark layout toolbar yet. Click "Stage Current Security" above to start comparing assets.</td></tr>`;
        return;
    }

    comparativeBasketMatrix.forEach(node => {
        tags.innerHTML += `<div class='comp-badge'>${node.symbol} <span onclick="removeComparisonTicker('${node.symbol}')">脳</span></div>`;
        headers.innerHTML += `<th style="color:var(--accent); font-weight:700; text-align:center;">${node.symbol}</th>`;
    });

    // Custom Data Metric Vectors mapping vertical parameters vs horizontal companies
    const rows = [
        { label: "Market Value (Current Price)", render: (n) => `Rs. ${n.price}` },
        { label: "Market Capitalization", render: (n) => `Rs. ${n.marketCap}` },
        { label: "Book Value Per Share", render: (n) => `Rs. ${n.bookValue}` },
        { label: "Diluted Earnings Per Share (EPS)", render: (n) => `Rs. ${n.eps}` },
        { label: "Price-to-Earnings Ratio (P/E)", render: (n) => `${n.pe}x` },
        { label: "Dividend Yield", render: (n) => n.divYield },
        { label: "Current Revenue TTM (Latest Year)", render: (n) => `Rs. ${n.history.rev[4]}B` },
        { label: "Gross Profit GP (Latest Year)", render: (n) => `Rs. ${n.history.gp[4]}B` },
        { label: "Net Profit NP (Latest Year)", render: (n) => `Rs. ${n.history.net[4]}B` },
        { label: "Dividend Payout Ratio (%)", render: (n) => n.history.payoutRatio[4] },
        { label: "AI Suggested Horizon", render: (n) => `<span style="color:var(--accent); font-weight:600;">${n.horizon}</span>` },
        { label: "Risk Profile Classification", render: (n) => n.riskClass },
        { label: "5-Year Future Growth Drivers", render: (n) => `<small style="color:var(--text-muted); line-height:1.4; display:block;">${n.growthDriver}</small>` }
    ];

    const body = document.getElementById('compBody'); body.innerHTML = "";
    rows.forEach(r => {
        let tr = `<tr><td><strong>${r.label}</strong></td>`;
        comparativeBasketMatrix.forEach(node => {
            tr += `<td style="text-align:center;">${r.render(node)}</td>`;
        });
        tr += `</tr>`;
        body.innerHTML += tr;
    });
}
