/**
 * PSX Investor Dashboard - Milestone 1 Core Engine
 * Handled by Hammad Hanif
 */

// Global state holding current targeted stock profile
let activeSymbol = "";

// Mock Database Infrastructure (To be swapped for Vercel /api layer in Milestone 2)
const psxMockDatabase = {
    "ENGRO": {
        name: "Engro Corporation Limited",
        symbol: "ENGRO",
        sector: "Fertilizer / Conglomerate",
        price: "PKR 340.50",
        pe: "8.09",
        bookValue: "PKR 210.00",
        pb: "1.62",
        yield: "12.5%",
        shariah: true,
        bizWhat: "Engro Corporation operates as an infrastructure provider and holding investment system managing extensive strategic operations across Pakistan.",
        bizRevenue: "Primary drivers are agricultural fertilizers, terminal processing, base plastics imports, and independent grid energy generation systems.",
        bizPosition: "Dominant enterprise player. Enjoys deep moat protections via system scale integration and cross-industry leverage profiles.",
        reports: [
            { title: "Annual Report FY 2025", type: "Annual" },
            { title: "Quarterly Review Q1 2026", type: "Quarterly" },
            { title: "Corporate Briefing Deck 2025", type: "Briefing" }
        ],
        announcements: [
            { title: "Interim Cash Dividend payout tracking at PKR 11.00/share", type: "Dividend" },
            { title: "Material Info: Capacity upgrade at Daharki facility complete", type: "Material Info" }
        ],
        quality: { business: "Excellent (Moat Protected)", dividend: "High / Safe", debt: "Stable Balance Sheet", valuation: "Highly Undervalued" }
    },
    "SYS": {
        name: "Systems Limited",
        symbol: "SYS",
        sector: "Technology",
        price: "PKR 415.00",
        pe: "14.61",
        bookValue: "PKR 95.00",
        pb: "4.37",
        yield: "2.1%",
        shariah: true,
        bizWhat: "Systems Limited operates localized and export-bound enterprise computer program builds, cloud engineering architectures, and business BPO nodes.",
        bizRevenue: "Export execution out to US and European corporate contracts billing heavily in strong global currencies (USD tracking revenue hedge).",
        bizPosition: "Tier 1 technical operations outfit within local software systems export index fields.",
        reports: [
            { title: "Annual Engineering Audit Report 2025", type: "Annual" },
            { title: "Strategic Investor Presentation Q3", type: "Briefing" }
        ],
        announcements: [
            { title: "Bonus Issue allocation matrix tracking at 10% confirmation", type: "Bonus" },
            { title: "Material Info: Expansion operations into Middle-East markets executed", type: "Material Info" }
        ],
        quality: { business: "Exceptional (High Growth)", dividend: "Low Growth Payout", debt: "Virtually Zero Debt", valuation: "Growth Premium Pricing" }
    }
};

// UI Element Targets
const searchInput = document.getElementById("companySearch");
const filterSelect = document.getElementById("companyFilter");
const searchBtn = document.getElementById("searchBtn");
const saveJournalBtn = document.getElementById("saveJournalBtn");

// Journal Textarea Hooks
const journalBought = document.getElementById("journalBought");
const journalNotBought = document.getElementById("journalNotBought");
const journalNotes = document.getElementById("journalNotes");

// Core Execution Search logic 
function executeCompanySearch() {
    const rawInput = searchInput.value.toUpperCase().trim();
    const filterValue = filterSelect.value;
    
    if (!rawInput) {
        alert("Please enter a valid stock symbol ticker code (e.g., ENGRO, SYS)");
        return;
    }

    const companyData = psxMockDatabase[rawInput];

    // Filter verification validation check
    if (!companyData || (filterValue === "shariah" && !companyData.shariah)) {
        alert(`No data found for symbol "${rawInput}" matching the filter constraints. Try searching for 'ENGRO' or 'SYS'.`);
        return;
    }

    // Bind current target configuration reference state
    activeSymbol = companyData.symbol;

    // Phase 1: Populate Company Snapshot Cards UI
    document.getElementById("companyName").innerText = companyData.name;
    document.getElementById("symbol").innerText = companyData.symbol;
    document.getElementById("sector").innerText = companyData.sector;
    document.getElementById("price").innerText = companyData.price;
    document.getElementById("pe").innerText = companyData.pe;
    document.getElementById("bookValue").innerText = companyData.bookValue;
    document.getElementById("pb").innerText = companyData.pb;
    document.getElementById("yield").innerText = companyData.yield;

    // Phase 2: Populate Business Overview Modules
    document.getElementById("bizWhat").innerText = companyData.bizWhat;
    document.getElementById("bizRevenue").innerText = companyData.bizRevenue;
    document.getElementById("bizPosition").innerText = companyData.bizPosition;

    // Phase 3: Populating Document Reports Hub
    const reportsArea = document.getElementById("reportsArea");
    reportsArea.innerHTML = companyData.reports.map(rep => `
        <div class="doc-item">
            <a href="#" onclick="alert('Downloading simulated document link stream...')">📄 ${rep.title}</a>
            <span class="tag-ann">${rep.type}</span>
        </div>
    `).join('');

    // Phase 4: Populating Corporate Announcements Registry
    const announcementArea = document.getElementById("announcementArea");
    announcementArea.innerHTML = companyData.announcements.map(ann => `
        <div class="doc-item">
            <span>📢 ${ann.title}</span>
            <span class="tag-ann" style="background-color: #6366f1;">${ann.type}</span>
        </div>
    `).join('');

    // Phase 5: Populate Quick Assessment Summary Grid
    document.getElementById("qBusiness").innerText = companyData.quality.business;
    document.getElementById("qDividend").innerText = companyData.quality.dividend;
    document.getElementById("qDebt").innerText = companyData.quality.debt;
    document.getElementById("qValuation").innerText = companyData.quality.valuation;

    // Phase 6: Load Cached Investment Journal Data for target asset
    loadJournalFromCache(activeSymbol);
}

// LocalStorage Browser Cache Journal Mechanics 
function loadJournalFromCache(symbol) {
    const cachedData = localStorage.getItem(`psx_journal_${symbol}`);
    if (cachedData) {
        const parsed = JSON.parse(cachedData);
        journalBought.value = parsed.bought || "";
        journalNotBought.value = parsed.notBought || "";
        journalNotes.value = parsed.notes || "";
    } else {
        // Clear layout panels back to clean empty slate text boxes
        journalBought.value = "";
        journalNotBought.value = "";
        journalNotes.value = "";
    }
    // Turn button live
    saveJournalBtn.disabled = false;
}

function saveJournalToCache() {
    if (!activeSymbol) return;
    
    const journalPayload = {
        bought: journalBought.value,
        notBought: journalNotBought.value,
        notes: journalNotes.value
    };

    localStorage.setItem(`psx_journal_${activeSymbol}`, JSON.stringify(journalPayload));
    alert(`Investment Journal records updated for ${activeSymbol} in browser cache memory successfully.`);
}

// Trigger Hooks Registration Wireframes
searchBtn.addEventListener("click", executeCompanySearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") executeCompanySearch();
});
saveJournalBtn.addEventListener("click", saveJournalToCache);

// Version Code Auto-Downloader Engine Hook
document.getElementById("downloadLatest").addEventListener("click", () => {
    alert("Enterprise Packaging Feature: In dynamic deployments, this compiles local asset distributions via GitHub webhook directly.");
});
