async function fetchStock(ticker) {
    const res = await fetch(`/api/stock/${ticker}`);
    return await res.json();
}

async function loadAsset() {
    const t = document.getElementById("manualTickerInput").value.trim().toUpperCase();
    if (!t) return;

    const data = await fetchStock(t);

    // Fill form
    document.getElementById("varTicker").value = t;
    document.getElementById("varPrice").value = data.price || 0;
    document.getElementById("varBv").value = data.bv || 1;
    document.getElementById("compShares").value = data.shares || 0;
    document.getElementById("varSector").value = data.sector || "Unknown";
    document.getElementById("varShariah").value = data.shariah || "YES";

    // FIX: dividends vs divs mismatch
    const dividends = data.dividends || data.divs || [0,0,0,0,0];

    for (let i = 1; i <= 5; i++) {
        document.getElementById("div" + i).value = dividends[i - 1] || 0;
    }

    calculate();
}

function calculate() {

    const price = parseFloat(document.getElementById("varPrice").value) || 0;
    const bv = parseFloat(document.getElementById("varBv").value) || 1;
    const shares = parseFloat(document.getElementById("compShares").value) || 0;

    const pb = price / bv;
    const mc = price * shares;
    const bvt = bv * shares;

    // snapshot safety
    const pbEl = document.getElementById("cardPbVal");
    if (pbEl) {
        pbEl.innerText = pb.toFixed(2) + "x";
        pbEl.style.color = pb < 1 ? "var(--green)" : "var(--accent)";
    }

    const mcEl = document.getElementById("lblMarketCap");
    const bvEl = document.getElementById("lblNetWorth");

    if (mcEl) mcEl.innerText = "Rs. " + mc.toLocaleString();
    if (bvEl) bvEl.innerText = "Rs. " + bvt.toLocaleString();

    // dividends yield
    for (let i = 1; i <= 5; i++) {
        const div = parseFloat(document.getElementById("div" + i).value) || 0;
        const yieldVal = price ? (div / price) * 100 : 0;
        document.getElementById("yield" + i).innerText = yieldVal.toFixed(2) + "%";
    }

    // snapshot labels
    const ticker = document.getElementById("varTicker").value;
    const sector = document.getElementById("varSector").value;

    const tEl = document.getElementById("cardTicker");
    const sEl = document.getElementById("cardSector");

    if (tEl) tEl.innerText = ticker;
    if (sEl) sEl.innerText = sector;
}

setInterval(calculate, 3000);
