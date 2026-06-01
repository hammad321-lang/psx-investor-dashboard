async function fetchStock(ticker) {
    const res = await fetch(`/api/stock/${ticker}`);
    return await res.json();
}

async function loadAsset() {

    const t = document.getElementById("tickerInput").value.trim().toUpperCase();
    if (!t) return;

    const data = await fetchStock(t);

    document.getElementById("ticker").value = t;
    document.getElementById("price").value = data.price;
    document.getElementById("bv").value = data.bv;
    document.getElementById("shares").value = data.shares;
    document.getElementById("sector").value = data.sector;
    document.getElementById("shariah").value = data.shariah;

    calculate();
}

function calculate() {

    const price = +document.getElementById("price").value;
    const bv = +document.getElementById("bv").value;
    const shares = +document.getElementById("shares").value;

    const pb = price / bv;
    const mc = price * shares;
    const bvt = bv * shares;

    document.getElementById("pb").innerText = pb.toFixed(2);
    document.getElementById("mc").innerText = mc.toLocaleString();
    document.getElementById("bvTotal").innerText = bvt.toLocaleString();

    for (let i = 1; i <= 5; i++) {

        const div = +document.getElementById("d" + i).value || 0;

        const yieldVal = price ? (div / price) * 100 : 0;

        document.getElementById("y" + i).innerText =
            yieldVal.toFixed(2) + "%";
    }
}

setInterval(() => {
    calculate();
}, 5000);
