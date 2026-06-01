let focusedCorporateDataNode = null;

const underdogDatabaseGrid = [
    { symbol: "NML", name: "Nishat Mills Ltd", pb: "0.28", price: "78.50", safetyNote: "Asset-rich exporter selling at 72% discount." },
    { symbol: "FATIMA", name: "Fatima Fertilizer", pb: "0.74", price: "92.00", safetyNote: "Strong market dominance below net asset worth." },
    { symbol: "DGKC", name: "DG Khan Cement", pb: "0.42", price: "65.20", safetyNote: "Plants and land worth far more than stock price." }
];

document.addEventListener("DOMContentLoaded", () => {
    renderUnderdogRadar();
    triggerDirectTickerQuery("NML");
    runLiveCalculation();
});

function renderUnderdogRadar() {
    const container = document.getElementById('underdogRadarContainer');
    container.innerHTML = "";
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
            <div style="font-size:0.8rem; color:#fff; margin:4px 0;">${stock.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Market Price: Rs. ${stock.price}</div>
            <div style="font-size:0.75rem; color:var(--green); font-weight:600; margin-top:6px;">🛡️ ${stock.safetyNote}</div>
        `;
        container.appendChild(card);
    });
}

function runLiveCalculation() {
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const bv = parseFloat(document.getElementById('calcBv').value) || 0;
    const statusEl = document.getElementById('calcOutputStatus');

    if (bv <= 0) {
        statusEl.innerText = "Enter valid asset value";
        statusEl.className = "";
        return;
    }

    const pbRatio = price / bv;
    if (pbRatio < 1.0) {
        statusEl.innerText = `🔥 Bargain Underdog (${pbRatio.toFixed(2)}x P/B)`;
        statusEl.style.color = "var(--green)";
    } else {
        statusEl.innerText = `Growth Premium (${pbRatio.toFixed(2)}x P/B)`;
        statusEl.style.color = "var(--accent)";
    }
}

async function triggerDirectTickerQuery(symbol) {
    if (!symbol) return;
    const cleanSym = symbol.trim().toUpperCase();
    
    // Simulate API Payload matching backend profiles cleanly
    let mockPayload = {
        symbol: cleanSym,
        name: `${cleanSym} Pakistan Corporation`,
        sector: "Selected Industrial Operations",
        price: "85.00",
        bookValue: "110.00",
        isShariah: "YES",
        horizon: "Long-Term Secure Builder",
        suggestions: ["Trading safely below asset line baseline."],
        redFlags: ["Watch macro logistics operational variables."]
    };

    if (cleanSym === "NML") {
        mockPayload = {
            symbol: "NML", name: "Nishat Mills Limited", sector: "Textile & Export Conglomerates",
            price: "78.50", bookValue: "280.35", isShariah: "YES", horizon: "Long-Term Secure Value Builder",
            suggestions: ["Exceptional safety net. You buy assets for 28 cents on the dollar.", "Exports provide organic protection against rupee changes."],
            redFlags: ["Energy infrastructure overhead changes locally could squeeze profit trends."]
        };
    } else if (cleanSym === "SYS") {
        mockPayload = {
            symbol: "SYS", name: "Systems Limited", sector: "Technology & Software Services",
            price: "435.00", bookValue: "114.40", isShariah: "YES", horizon: "Long-Term Growth Compounder",
            suggestions: ["Outstanding high-growth software engine with virtually zero debt loading.", "Excellent asset performance profile margins internally."],
            redFlags: ["Premium pricing profile makes it sensitive to global IT market corrections."]
        };
    }

    focusedCorporateDataNode = mockPayload;
    mapPayloadToUI(mockPayload);
}

function triggerSearch() {
    const input = document.getElementById('targetInput').value;
    if (input) triggerDirectTickerQuery(input);
}

function mapPayloadToUI(node) {
    document.getElementById('lblSym').innerText = node.symbol;
    document.getElementById('displayTitle').innerText = node.name;
    document.getElementById('lblSector').innerText = node.sector;
    document.getElementById('lblPrice').innerText = `Rs. ${node.price}`;
    document.getElementById('lblBv').innerText = `Rs. ${node.bookValue}`;

    document.getElementById('lblShariahBadge').innerText = node.isShariah === "YES" ? "🕋 COMPLIANT" : "❌ NON-COMPLIANT";
    document.getElementById('lblShariahBadge').className = "quick-badge " + (node.isShariah === "YES" ? "badge-green" : "badge-red");

    document.getElementById('lblHorizonBadge').innerText = node.horizon.toUpperCase();
    document.getElementById('lblHorizonBadge').className = "quick-badge badge-accent";
    document.getElementById('tipHorizonText').innerText = `Hold Timeline Target: [${node.horizon}]. Perfectly optimized to defend initial principal while letting earnings compound securely.`;

    const priceNum = parseFloat(node.price);
    const bvNum = parseFloat(node.bookValue);
    const valBadge = document.getElementById('lblValBadge');
    
    if (priceNum < bvNum) {
        valBadge.innerText = "🔥 SECURE UNDERDOG VALUE";
        valBadge.className = "quick-badge badge-green";
        document.getElementById('tipValText').innerText = `This stock trades below its asset floor values. You are getting a clear premium bargain structure protecting capital downside limits.`;
    } else {
        valBadge.innerText = "🎯 PREMIUM VALUATION";
        valBadge.className = "quick-badge badge-accent";
        document.getElementById('tipValText').innerText = `Market trades this at a premium to paper net worth due to fast expected business generation scales.`;
    }

    const sugList = document.getElementById('suggestionsList'); sugList.innerHTML = "";
    node.suggestions.forEach(x => { let li = document.createElement('li'); li.innerText = x; sugList.appendChild(li); });

    const flagList = document.getElementById('redFlagsList'); flagList.innerHTML = "";
    node.redFlags.forEach(x => { let li = document.createElement('li'); li.innerText = x; flagList.appendChild(li); });
}
