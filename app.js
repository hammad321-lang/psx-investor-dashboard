/**
 * PSX Investor Dashboard - Core Controller Logic
 * Handles real-time search extraction, serverless API execution, and UI mapping.
 */

// Listen for the "Enter" key press inside the input box for a smoother user experience
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                executeLiveSearch();
            }
        });
    }
});

async function executeLiveSearch() {
    const searchInput = document.getElementById('searchBox').value;
    
    // Clean up input spaces and force to uppercase (e.g., "ogdc " becomes "OGDC")
    const symbol = searchInput.trim().toUpperCase();
    
    if (!symbol) {
        alert("Please enter a valid PSX company symbol first.");
        return;
    }
    
    // Set immediate visual loading state across target UI blocks
    document.getElementById('companyName').innerText = `Fetching market engine stats...`;
    document.getElementById('companySector').innerText = `Querying PSX server registry for token: ${symbol}`;
    document.getElementById('tickerSymbol').innerText = symbol;
    
    try {
        // Fetch data from the serverless API backend running on Vercel
        const response = await fetch(`/api/company?symbol=${symbol}`);
        
        if (!response.ok) {
            throw new Error(`Server returned status code: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            resetDashboardUI();
            return;
        }
        
        // Dynamically inject the calculated financial metrics array directly into the UI layout
        updateDashboardUI(data);
        
    } catch (error) {
        console.error("Dashboard engine connection fault:", error);
        document.getElementById('companyName').innerText = "Data Feed Disconnected";
        document.getElementById('companySector').innerText = "Verify connection parameters or retry tracking symbol.";
        resetDashboardUI();
    }
}

function updateDashboardUI(data) {
    // Inject identification profiles
    if (document.getElementById('tickerSymbol')) document.getElementById('tickerSymbol').innerText = data.symbol;
    if (document.getElementById('companyName')) document.getElementById('companyName').innerText = data.name;
    if (document.getElementById('companySector')) document.getElementById('companySector').innerText = data.sector;
    
    // Inject calculated financial metrics
    if (document.getElementById('stockPrice')) document.getElementById('stockPrice').innerText = `Rs. ${data.price}`;
    if (document.getElementById('tradeVolume')) document.getElementById('tradeVolume').innerText = data.volume;
    if (document.getElementById('peRatio')) document.getElementById('peRatio').innerText = data.peRatio;
    if (document.getElementById('divYield')) document.getElementById('divYield').innerText = data.dividendYield;
    
    // Calculate color styling dynamically based on positive/negative trading shifts
    if (document.getElementById('stockChange')) {
        const changeEl = document.getElementById('stockChange');
        const changeValue = parseFloat(data.change);
        
        if (changeValue >= 0) {
            changeEl.innerText = `+${data.change}%`;
            changeEl.style.color = "#00cc66"; // Success Green
        } else {
            changeEl.innerText = `${data.change}%`;
            changeEl.style.color = "#ff3333"; // Error Red
        }
    }
}

function resetDashboardUI() {
    if (document.getElementById('tickerSymbol')) document.getElementById('tickerSymbol').innerText = "---";
    if (document.getElementById('stockPrice')) document.getElementById('stockPrice').innerText = "Rs. 0.00";
    if (document.getElementById('stockChange')) {
        const changeEl = document.getElementById('stockChange');
        changeEl.innerText = "0.00%";
        changeEl.style.color = "#ffffff";
    }
    if (document.getElementById('tradeVolume')) document.getElementById('tradeVolume').innerText = "-";
    if (document.getElementById('peRatio')) document.getElementById('peRatio').innerText = "-";
    if (document.getElementById('divYield')) document.getElementById('divYield').innerText = "-";
}
