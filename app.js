// Automatically catch "Enter" button clicks for instant querying operations
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.addEventListener("keypress", (e) => {
            if (e.key === "Enter") executeLiveSearch();
        });
    }
});

async function executeLiveSearch() {
    const searchInput = document.getElementById('searchBox').value;
    const symbol = searchInput.trim().toUpperCase();
    
    if (!symbol) {
        alert("Please enter a valid PSX ticker symbol.");
        return;
    }
    
    // Set immediate loading visual placeholders across the nodes
    document.getElementById('companyName').innerText = `Querying data nodes for ${symbol}...`;
    document.getElementById('companySector').innerText = "Accessing terminal routing protocols...";
    document.getElementById('tickerSymbol').innerText = symbol;
    
    try {
        const response = await fetch(`/api/company?symbol=${symbol}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            clearTerminalUI();
            return;
        }
        
        // Push the compiled data matrix fields directly into the DOM blocks
        document.getElementById('companyName').innerText = data.name;
        document.getElementById('companySector').innerText = data.sector;
        document.getElementById('stockPrice').innerText = `Rs. ${data.price}`;
        document.getElementById('tradeVolume').innerText = data.volume;
        document.getElementById('marketCap').innerText = `Rs. ${data.marketCap}`;
        document.getElementById('peRatio').innerText = data.peRatio;
        document.getElementById('epsValue').innerText = data.eps;
        document.getElementById('divYield').innerText = data.dividendYield;
        document.getElementById('betaValue').innerText = data.beta;
        document.getElementById('dayHighLow').innerText = `Rs. ${data.low} - Rs. ${data.high}`;
        document.getElementById('yearRange').innerText = `Rs. ${data.fiftyTwoWeekLow} - Rs. ${data.fiftyTwoWeekHigh}`;
        document.getElementById('timestamp').innerText = `Refreshed at: ${data.lastUpdated}`;

        // Set indicator coloring parameters cleanly
        const changeEl = document.getElementById('stockChange');
        const changeVal = parseFloat(data.change);
        changeEl.innerText = changeVal >= 0 ? `+${data.change}%` : `${data.change}%`;
        changeEl.style.color = changeVal >= 0 ? "#34c759" : "#ff3b30";
        
    } catch (error) {
        console.error("Critical Terminal Error:", error);
        document.getElementById('companyName').innerText = "Data Line Interrupted";
        clearTerminalUI();
    }
}

function clearTerminalUI() {
    document.getElementById('tickerSymbol').innerText = "---";
    document.getElementById('stockPrice').innerText = "Rs. 0.00";
    document.getElementById('stockChange').innerText = "0.00%";
    document.getElementById('stockChange').style.color = "var(--text-main)";
    document.getElementById('tradeVolume').innerText = "-";
    document.getElementById('marketCap').innerText = "-";
    document.getElementById('peRatio').innerText = "-";
    document.getElementById('epsValue').innerText = "-";
    document.getElementById('divYield').innerText = "-";
    document.getElementById('betaValue').innerText = "-";
    document.getElementById('dayHighLow').innerText = "- / -";
    document.getElementById('yearRange').innerText = "- / -";
    document.getElementById('timestamp').innerText = "Terminal Synced";
}
