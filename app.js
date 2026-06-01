let focusedCorporateDataNode = null;
let comparativeBasketMatrix = [];

// Curated List of Secure Underdogs Trading Under Asset Value
const underdogDatabaseGrid = [
    { symbol: "NML", name: "Nishat Mills Ltd", pb: "0.28", price: "78.50", assetSafety: "Outstanding 72% Discount on Assets" },
    { symbol: "FATIMA", name: "Fatima Fertilizer", pb: "0.74", price: "92.00", assetSafety: "Agri Backbone Under Real Worth" },
    { symbol: "DGKC", name: "DG Khan Cement", pb: "0.42", price: "65.20", assetSafety: "Factories worth 2x current stock value" },
    { symbol: "NPL", name: "Nishat Power Ltd", pb: "0.55", price: "38.10", assetSafety: "Asset Rich High Payout Discount" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderUnderdogRadar();
    triggerDirectTickerQuery("NML");
    runLiveCalculation(); // Initialize calculator defaults
});

// A. Render the Underdog Target Grid Area
function renderUnderdogRadar() {
    const radarContainer = document.getElementById('underdogRadarContainer');
    radarContainer.innerHTML = "";
    
    underdogDatabaseGrid.forEach(stock => {
        const card = document.createElement('div');
        card.className = "radar-card";
        card.style.cursor = "pointer";
        card.onclick = () => triggerDirectTickerQuery(stock.symbol);
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:1.1rem; color:var(--accent);">${stock.symbol}</strong>
                <span class="quick-badge badge-green">P/B: ${stock.pb}x</span>
            </div>
            <div style="font-size:0.8rem; color:#fff; margin:5px 0;">${stock.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Price: Rs. ${stock.price}</div>
            <div style="font-size:0.75rem; color:var(--green); font-weight:600; margin-top:8px;">🛡️ ${stock.assetSafety}</div>
        `;
        radarContainer.appendChild(card);
    });
}

// B. Live Interactive Book Value Calculator Logic Engine
function runLiveCalculation() {
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const assets = parseFloat(document.getElementById('calcAssets').value) || 0;
    const liabilities = parseFloat(document.getElementById('calcLiab').value) || 0;
    const shares = parseFloat(document.getElementById('calcShares').value) || 1; // Prevent divide by zero

    // Net Worth = Assets - Liabilities (Convert billions to millions for scaling math alignment)
    const netWorthMillions = (assets - liabilities) * 1000;
    const bvPerShare = netWorthMillions / shares;
    const pbRatio = bvPerShare > 0 ? (price / bvPerShare) : 0;

    document.getElementById('calcOutputBv').innerText = `Rs. ${bvPerShare.toFixed(2)}`;
    
    const pbOutputEl = document.getElementById('calcOutputPb');
    if (pbRatio <= 0) {
        pbOutputEl.innerText = "N/A";
        pbOutputEl.className = "";
    } else if (pbRatio < 1.0) {
        pbOutputEl.innerText = `${pbRatio.toFixed(2)}x (🔥 Underdog Bargain)`;
        pbOutputEl.className = "quick-badge badge-green";
    } else {
        pbOutputEl.innerText = `${pbRatio.toFixed(2)}x (Premium Pricing)`;
        pbOutputEl.className = "quick-badge badge-accent";
    }
}

// C. Fetch Profile Infrastructure
async function triggerDirectTickerQuery(symbol) {
    if (!symbol) return;
    const cleanSym = symbol.trim().toUpperCase();
    
    try {
        const res = await fetch(`/api/company?symbol=${cleanSym}`);
        const data = await res.json();
        if (data.error) return alert(data.error);
        
        focusedCorporateDataNode = data;
        mapDataToActiveUI(data);
    } catch (e) {
        console.error("Pipeline failure fetching asset context", e);
    }
}

function triggerSearch() {
    const input = document.getElementById('targetInput').value;
    if (input) triggerDirectTickerQuery(input);
}

// D. Parse Elements to Layout Interface
function mapDataToActiveUI(node) {
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

    // Map Beginner Prescriptions & Explanations Dynamic Texts
    document.getElementById('lblShariahBadge').innerText = node.isShariah === "YES" ? "🕋 COMPLIANT" : "❌ NON-COMPLIANT";
    document.getElementById('lblShariahBadge').className = "quick-badge " + (node.isShariah === "YES" ? "badge-green" : "badge-red");

    document.getElementById('lblHorizonBadge').innerText = node.horizon.toUpperCase();
    document.getElementById('lblHorizonBadge').className = "quick-badge " + (node.horizon.includes("Secure") ? "badge-green" : "badge-accent");
    document.getElementById('tipHorizonText').innerText = `Target Classification: [${node.horizon}]. This tells a beginner how long to securely hold this company to let asset worth expand.`;

    document.getElementById('lblRiskBadge').innerText = node.riskClass.toUpperCase();
    document.getElementById('lblRiskBadge').className = "quick-badge " + (node.riskClass.includes("Low") ? "badge-green" : "badge-accent");
    document.getElementById('tipRiskText').innerText = `Risk Level Evaluated: [${node.riskClass}]. Derived via Debt Ratio: ${node.deRatio}. Lower debt provides a safe cushion during economic stress.`;

    const pbNum = parseFloat(node.pb);
    const valBadge = document.getElementById('lblValBadge');
    if (pbNum < 1.0) {
        valBadge.innerText = "🔥 SECURE UNDERDOG VALUE";
        valBadge.className = "quick-badge badge-green";
        document.getElementById('tipValText').innerText = `This asset is an Underdog choice! At a P/B of ${node.pb}x, you are buying its physical assets for less than they are actually worth. Excellent loss protection.`;
    } else {
        valBadge.innerText = "🎯 PREMIUM MARKET PRICING";
        valBadge.className = "quick-badge badge-accent";
        document.getElementById('tipValText').innerText = `Priced at ${node.pb}x its asset base. Investors are paying a premium because the company generates solid active earnings.`;
    }

    // Suggestions & Red Flags Rendering Pipeline
    const sugList = document.getElementById('suggestionsList'); sugList.innerHTML = "";
    node.suggestions.forEach(txt => { let li = document.createElement('li'); li.innerText = txt; sugList.appendChild(li); });

    const flagList = document.getElementById('redFlagsList'); flagList.innerHTML = "";
    node.redFlags.forEach(txt => { let li = document.createElement('li'); li.innerText = txt; flagList.appendChild(li); });
}

// E. Multi-Staging System Framework
function stageCurrentToMatrix() {
    if (!focusedCorporateDataNode) return;
    if (comparativeBasketMatrix.some(x => x.symbol === focusedCorporateDataNode.symbol)) return;
    if (comparativeBasketMatrix.length >= 5) comparativeBasketMatrix.shift(); // Max 5 cap limit carousel rolling track

    comparativeBasketMatrix.push({
        symbol: focusedCorporateDataNode.symbol,
        sector: focusedCorporateDataNode.sector,
        price: focusedCorporateDataNode.price,
        pe: focusedCorporateDataNode.pe,
        pb: focusedCorporateDataNode.pb,
        de: focusedCorporateDataNode.deRatio,
        yield: focusedCorporateDataNode.divYield
    });
    renderMatrixUI();
}

function removeStagedNode(sym) {
    comparativeBasketMatrix = comparativeBasketMatrix.filter(x => x.symbol !== sym);
    renderMatrixUI();
}

function renderMatrixUI() {
    const body = document.getElementById('comparisonMatrixBody');
    body.innerHTML = "";
    if (comparativeBasketMatrix.length === 0) {
        body.innerHTML = `<tr><td colspan="8" style="color:var(--text-muted); text-align:center; padding:2rem;">No companies staged. Run queries above and stage them to execute multi-company comparisons.</td></tr>`;
        return;
    }
    comparativeBasketMatrix.forEach(x => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:var(--accent);">${x.symbol}</strong></td>
            <td>${x.sector}</td>
            <td>Rs. ${x.price}</td>
            <td>${x.pe}x</td>
            <td style="color:${parseFloat(x.pb) < 1.0 ? 'var(--green)' : '#fff'}; font-weight:bold;">${x.pb}x</td>
            <td>${x.de}</td>
            <td style="color:var(--green);">${x.yield}</td>
            <td><button class="filter-btn" style="color:var(--red); border-color:rgba(231,76,60,0.2);" onclick="removeStagedNode('${x.symbol}')">Remove</button></td>
        `;
        body.appendChild(tr);
    });
}
