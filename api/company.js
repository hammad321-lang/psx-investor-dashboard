export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Ticker symbol parameter required" });

    const sym = symbol.toUpperCase().trim();

    // Default Fallback Archetype Profile Block
    let sector = "Industrial Operations & Holdings";
    let isShariah = "YES"; 
    let basePrice = 85.00;
    let horizon = "Moderate-Term Cyclical";
    let riskClass = "Moderate Risk";
    let pb = 0.95;
    let deRatio = "0.45";
    let divYield = "6.5%";
    let eps = "12.40";

    let suggestions = ["Verify export order pipeline stability scales.", "Analyze raw inventory raw pricing structures."];
    let redFlags = ["Subject to local energy supply grid pricing adjustments."];

    // Core PSX Archetypes Designed for Safety Testing
    if (sym === "NML") {
        sector = "Textile & Export Conglomerates";
        isShariah = "YES";
        basePrice = 78.50;
        horizon = "Long-Term Underdog Compounder";
        riskClass = "Low Risk (Asset Backed)";
        pb = 0.28; // Deeply below physical book asset pricing limits
        deRatio = "0.35";
        divYield = "8.2%";
        eps = "24.50";
        suggestions = [
            "Trading at a huge 72% discount to its physical asset base. Outstanding safety backup.",
            "Strong international dollar revenue stream keeps the business safe from local currency drops."
        ];
        redFlags = [
            "Local power grid cost updates can create minor short-term friction on production margins."
        ];
    } else if (sym === "FFC") {
        sector = "Fertilizer & Agri-Inputs";
        isShariah = "YES";
        basePrice = 215.00;
        horizon = "Long-Term Secure Wealth Builder";
        riskClass = "Ultra-Low Risk";
        pb = 2.10;
        deRatio = "0.15";
        divYield = "14.5%";
        eps = "38.20";
        suggestions = [
            "Superb defensive cash flow cow. Massive dividend performance gives reliable returns even if market drops.",
            "Essential agricultural market priority grants unmatched business safety shields."
        ];
        redFlags = [
            "Subject to government policy decisions regarding natural gas base allocations."
        ];
    } else if (sym === "SYS") {
        sector = "Technology & Software Exports";
        isShariah = "YES";
        basePrice = 435.00;
        horizon = "Long-Term Growth Compounder";
        riskClass = "Low Risk (Zero Debt)";
        pb = 3.80;
        deRatio = "0.02";
        divYield = "2.5%";
        eps = "32.10";
        suggestions = [
            "Zero borrowing debt means high interest rates cannot hurt this business's bottom line profits.",
            "Global software exporting model provides a strong shield against domestic economic pressure."
        ];
        redFlags = [
            "Priced at a higher value multiple, requiring sustained international expansion."
        ];
    } else if (sym === "MARI") {
        sector = "Oil & Gas Exploration";
        isShariah = "YES";
        basePrice = 460.00;
        horizon = "Long-Term Secure Wealth Builder";
        riskClass = "Low Risk";
        pb = 1.40;
        deRatio = "0.05";
        divYield = "10.8%";
        eps = "78.40";
        suggestions = [
            "Strategic energy resource security ensures highly stable long-term operations.",
            "Excellent history of finding fresh exploration resources with minimal debt usage."
        ];
        redFlags = [
            "Energy sector circular debt issues can occasionally tie up short-term cash flows."
        ];
    } else if (sym === "HUBC") {
        sector = "Power & Utilities Infrastructure";
        isShariah = "NO";
        basePrice = 120.00;
        horizon = "Moderate-Term Income Play";
        riskClass = "Moderate Risk";
        pb = 1.65;
        deRatio = "1.10";
        divYield = "15.0%";
        eps = "22.10";
        suggestions = [
            "High cash distribution yield provides regular payouts, but watch the debt load closely.",
            "Diversified mining and alternative energy projects offer good future revenue potential."
        ];
        redFlags = [
            "Fails clean Shariah compliance metrics due to interest-bearing borrowing ratio caps.",
            "Higher debt load means rising interest rates increase operational finance costs."
        ];
    } else if (sym === "MEBL") {
        sector = "Islamic Banking Institutions";
        isShariah = "YES";
        basePrice = 210.00;
        horizon = "Long-Term Secure Wealth Builder";
        riskClass = "Ultra-Low Risk";
        pb = 1.55;
        deRatio = "0.00";
        divYield = "11.2%";
        eps = "34.60";
        suggestions = [
            "The market gold-standard Shariah banking model, capturing massive user transitions.",
            "Superb capital buffers and high returns make this a premier wealth-preservation asset."
        ];
        redFlags = [
            "Profit margins will gently normalize when state policy tracking benchmarks adjust downward."
        ];
    }

    const bookValue = (basePrice / pb).toFixed(2);
    const pe = (basePrice / parseFloat(eps)).toFixed(1);

    return res.status(200).json({
        symbol: sym,
        name: `${sym} Pakistan Corporation Ltd`,
        sector: sector,
        isShariah: isShariah,
        horizon: horizon,
        riskClass: riskClass,
        price: basePrice.toFixed(2),
        marketCap: (Math.random() * (150 - 20) + 20).toFixed(1) + "B",
        eps: eps,
        pe: pe,
        bookValue: bookValue,
        pb: pb.toFixed(2),
        divYield: divYield,
        deRatio: deRatio,
        suggestions: suggestions,
        redFlags: redFlags
    });
}
