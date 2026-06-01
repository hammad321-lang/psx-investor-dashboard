let focusedCorporateDataNode = null;
let watchlistDataArray = JSON.parse(localStorage.getItem('psx_watchlist_cache')) || ["FFC", "SYS", "MARI"];
let comparativeBasketMatrix = [];

document.addEventListener("DOMContentLoaded", () => {
    initializeWatchlistUI();
    triggerDirectTickerQuery(watchlistDataArray[0] || "FFC");
});

function initializeWatchlistUI() {
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
    initializeWatchlistUI();
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
        if ([...dropdown.options].some(opt => opt.value === cleanedSym)) {
            dropdown.value = cleanedSym;
        } else {
            dropdown.value = "";
        }
    }

    try {
        const res = await fetch(`/api/company?symbol=${cleanedSym}`);
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        focusedCorporateDataNode = data;
        mapCorporateNodeToTerminalUI(data);
    } catch (e) {
        console.error("Critical structural execution error loading node assets.", e);
    }
}

function mapCorporateNodeToTerminalUI(node) {
    // 1. Basic Text Content Fields
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = node.name;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblCap').innerText = `Rs. ${node.marketCap}`;
    document.getElementById('lblEps').innerText = `Rs. ${node.eps}`;
    document.getElementById('lblPe').innerText = `${node.pe}x`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;
    document.getElementById('lblPb').innerText = `${node.pb}x`;
    document.getElementById('lblYield').innerText = node.divYield;
    document.getElementById('lblDeRatio').innerText = node.deRatio;

    // 2. KMIALL Shariah Status Badge Mapping
    const shariahEl = document.getElementById('lblShariahBadge');
    shariahEl.innerText = node.isShariah === "YES" ? "🕋 KMIALL COMPLIANT" : "❌ NON-COMPLIANT";
    shariahEl.className = "quick-badge " + (node.isShariah === "YES" ? "badge-green" : "badge-red");

    // 3. Investment Horizon Mapping Logic
    const horizonEl = document.getElementById('lblHorizonBadge');
    horizonEl.innerText = node.horizon.toUpperCase();
    if (node.horizon.includes("Long-Term")) horizonEl.className = "quick-badge badge-green";
    else if (node.horizon.includes("Moderate-Term")) horizonEl.className = "quick-badge badge-accent";
    else horizonEl.className = "quick-badge badge-red";

    // 4. Macro Risk Allocation Tracking Logic
    const riskEl = document.getElementById('lblRiskBadge');
    riskEl.innerText = node.riskClass.toUpperCase();
    const deNum = parseFloat(node.deRatio);
    if (deNum > 0.8) {
        riskEl.innerText = "HIGH LEVERAGE RISK";
        riskEl.className = "quick-badge badge-red";
    } else {
        riskEl.className = "quick-badge " + (node.riskClass.includes("Low") ? "badge-green" : "badge-accent");
    }

    // 5. Intrinsic Core Mathematical Model Framework Valuation
    const curPrice = parseFloat(node.price);
    const epsNum = parseFloat(node.eps);
    const bvNum = parseFloat(node.bookValue);
    const divYieldNum = parseFloat(node.divYield.replace('%',''));

    // A. Benjamin Graham Number Equation
    let grahamVal = 0;
    if (epsNum > 0 && bvNum > 0) {
        grahamVal = Math.sqrt(22.5 * epsNum * bvNum);
    }
    document.getElementById('valGraham').innerText = grahamVal > 0 ? `Rs. ${grahamVal.toFixed(2)}` : "N/A";

    // B. Discounted Cash Flow Model (DCF Optimization Simulation)
    let projectedGrowth = 0.08; 
    if (node.sector.includes("Technology")) projectedGrowth = 0.15; 
    const discountRate = 0.14; // Paired to reflect Pakistani macro costs
    let dummyFcf = epsNum * 0.75; 
    let sumDcf = 0;
    let tempFcf = dummyFcf;
    for (let i = 1; i <= 5; i++) {
        tempFcf = tempFcf * (1 + projectedGrowth);
        sumDcf += tempFcf / Math.pow((1 + discountRate), i);
    }
    document.getElementById('valDcf').innerText = sumDcf > 0 ? `Rs. ${sumDcf.toFixed(2)}` : "N/A";

    // C. Dividend Discount Model (Gordon Growth Allocation)
    let ddmVal = 0;
    const currentAnnDiv = epsNum * (divYieldNum / 100);
    if (currentAnnDiv > 0) {
        ddmVal = currentAnnDiv / (discountRate - 0.04);
    }
    document.getElementById('valDdm').innerText = ddmVal > 0 ? `Rs. ${ddmVal.toFixed(2)}` : "N/A";

    // D. Consensus Valuation Target Summary Array
    let validModels = [];
    if (grahamVal > 0) validModels.push(grahamVal);
    if (sumDcf > 0) validModels.push(sumDcf);
    if (ddmVal > 0) validModels.push(ddmVal);
    
    let consensusVal = curPrice;
    if (validModels.length > 0) {
        consensusVal = validModels.reduce((a,b) => a+b, 0) / validModels.length;
    }
    document.getElementById('valConsensus').innerText = `Rs. ${consensusVal.toFixed(2)}`;

    // Valuation Tag Output Calculations
    const valEl = document.getElementById('lblValBadge');
    const marginOfSafety = ((consensusVal - curPrice) / consensusVal) * 100;
    if (marginOfSafety > 15) {
        valEl.innerText = `🔥 UNDERVALUED UNDERDOG (${marginOfSafety.toFixed(0)}% MOS)`;
        valEl.className = "quick-badge badge-green";
    } else if (marginOfSafety < -15) {
        valEl.innerText = "⚠️ PREMIUM OVERVALUED";
        valEl.className = "quick-badge badge-red";
    } else {
        valEl.innerText = "🎯 FAIR VALUE RATING";
        valEl.className = "quick-badge badge-accent";
    }

    // 6. Suggestions & Red Flags Panel Rendering
    const sugContainer = document.getElementById('suggestionsList');
    sugContainer.innerHTML = "";
    node.suggestions.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        sugContainer.appendChild(li);
    });

    const flagContainer = document.getElementById('redFlagsList');
    flagContainer.innerHTML = "";
    node.redFlags.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        flagContainer.appendChild(li);
    });

    // 7. Render 5-Year Financial Statements
    const tableBody = document.getElementById('financialBody');
    tableBody.innerHTML = "";
    const metrics = [
        { name: "Revenue Turnover Base (B)", data: node.history.rev },
        { name: "Gross Margin Realization (B)", data: node.history.gp },
        { name: "Net Corporate Income (B)", data: node.history.np },
        { name: "Stated EPS Trajectory (Rs)", data: node.history.eps },
        { name: "Dividend Pay Timeline (Rs)", data: node.history.divHistory }
    ];
    metrics.forEach(m => {
        const tr = document.createElement('tr');
        let tds = `<td><strong>${m.name}</strong></td>`;
        m.data.forEach(val => { tds += `<td>${val}</td>`; });
        tr.innerHTML = tds;
        tableBody.appendChild(tr);
    });
}

// 8. 5-Company Bottom Comparison Matrix Processing Engine
function stageCurrentToMatrix() {
    if (!focusedCorporateDataNode) return;
    const matchIndex = comparativeBasketMatrix.findIndex(item => item.symbol === focusedCorporateDataNode.symbol);
    if (matchIndex === -1) {
        if (comparativeBasketMatrix.length >= 5) {
            alert("Matrix capacity limit reached. Please remove an existing asset before staging a new one.");
            return;
        }
        // Calculate dynamic consensus target value for the record
        const eps = parseFloat(focusedCorporateDataNode.eps);
        const bv = parseFloat(focusedCorporateDataNode.bookValue);
        const graham = (eps > 0 && bv > 0) ? Math.sqrt(22.5 * eps * bv) : parseFloat(focusedCorporateDataNode.price);
        
        const stagedRecordNode = {
            symbol: focusedCorporateDataNode.symbol,
            sector: focusedCorporateDataNode.sector,
            price: focusedCorporateDataNode.price,
            pe: focusedCorporateDataNode.pe,
            pb: focusedCorporateDataNode.pb,
            de: focusedCorporateDataNode.deRatio,
            yield: focusedCorporateDataNode.divYield,
            consensus: graham.toFixed(2)
        };
        comparativeBasketMatrix.push(stagedRecordNode);
        renderComparativeMatrixUI();
    }
}

function removeNodeFromMatrix(symbol) {
    comparativeBasketMatrix = comparativeBasketMatrix.filter(item => item.symbol !== symbol);
    renderComparativeMatrixUI();
}

function renderComparativeMatrixUI() {
    const body = document.getElementById('comparisonMatrixBody');
    body.innerHTML = "";
    
    if (comparativeBasketMatrix.length === 0) {
        body.innerHTML = `<tr><td colspan="9" style="color:var(--text-muted); text-align:center; padding:2rem;">No companies staged yet. Select from the dropdown and click "Stage Active Asset" to run a cross-comparison pipeline.</td></tr>`;
        return;
    }

    // Algorithmic Analysis Step: Find the absolute minimum valuation P/E entry in the array
    let minPeVal = Infinity;
    comparativeBasketMatrix.forEach(item => {
        const peNum = parseFloat(item.pe);
        if (peNum < minPeVal) minPeVal = peNum;
    });

    comparativeBasketMatrix.forEach(item => {
        const tr = document.createElement('tr');
        const isPeWinner = parseFloat(item.pe) === minPeVal && comparativeBasketMatrix.length > 1;
        
        tr.innerHTML = `
            <td><strong style="color:var(--accent);">${item.symbol}</strong> ${isPeWinner ? '⭐ <span style="font-size:0.75rem; color:var(--green)">VALUE PIPELINE LEADER</span>' : ''}</td>
            <td>${item.sector}</td>
            <td>Rs. ${item.price}</td>
            <td class="${isPeWinner ? 'highlight-val' : ''}">${item.pe}x</td>
            <td>${item.pb}x</td>
            <td>${item.de}</td>
            <td style="color:var(--green); font-weight:600;">${item.yield}</td>
            <td style="color:var(--accent); font-weight:600;">Rs. ${item.consensus}</td>
            <td><button class="filter-btn" style="color:var(--red); border-color:rgba(231,76,60,0.3);" onclick="removeNodeFromMatrix('${item.symbol}')">Delete</button></td>
        `;
        body.appendChild(tr);
    });
}
