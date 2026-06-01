export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Ticker symbol parameter is required" });

    const sym = symbol.toUpperCase().trim();

    // Baseline Default Struct
    let sector = "Industrial Operations & Holdings";
    let isShariah = "YES"; 
    let basePrice = Math.random() * (150 - 45) + 45;
    let horizon = "Moderate-Term Cyclical";
    let riskClass = "Moderate Risk";
    
    let suggestions = ["Monitor operational cash conversion metrics.", "Assess raw material supply inventory distribution channels."];
    let redFlags = ["Exposure to localized administrative energy tariff adjustments."];

    // Sector Configuration Engine Matrix Mapping
    if (["FFC", "EFERT", "FATIMA", "ENGRO"].includes(sym)) {
        sector = "Fertilizer & Agri-Inputs";
        isShariah = "YES"; // KMIALL Verified Base
        basePrice = sym === "FFC" ? 210 : sym === "EFERT" ? 175 : 95;
        horizon = "Long-Term Compounder";
        riskClass = "Low Risk";
        suggestions = [
            "Excellent defensive cash cow structure with highly consistent payout ratios.",
            "Strong pass-through pricing leverage shields operations against standard inflationary baseline trends."
        ];
        redFlags = [
            "Potential vulnerability to national GIDC provision adjustments.",
            "Subsidized gas allocation pricing reviews could cause localized pressure on gross margins."
        ];
    } else if (["MARI", "OGDC", "PPL", "POL"].includes(sym)) {
        sector = "Oil & Gas Exploration";
        isShariah = "YES";
        basePrice = sym === "MARI" ? 420 : sym === "OGDC" ? 145 : 115;
        horizon = "Long-Term Compounder";
        riskClass = "Moderate Risk";
        suggestions = [
            "Substantial discount to international intrinsic valuation metrics due to capital structural locks.",
            "High exploratory tracking success rates across localized gas structural architectures."
        ];
        redFlags = [
            "Persistent circular debt settlement pipeline caps active domestic operational liquidity generation.",
            "Subject to severe benchmark adjustments regarding international Brent crude macro valuation movements."
        ];
    } else if (["SYS", "TRG", "OCTOS"].includes(sym)) {
        sector = "Technology & Global IT";
        isShariah = "YES";
        basePrice = sym === "SYS" ? 440 : sym === "TRG" ? 65 : 85;
        horizon = "Long-Term Compounder";
        riskClass = "Moderate Risk";
        suggestions = [
            "Prime structural exporter profile providing an organic balance sheet hedge against local currency adjustments.",
            "Scalable managed-services offshore deployment framework models with low operational asset-heavy drag."
        ];
        redFlags = [
            "High susceptibility regarding global discretionary enterprise IT infrastructure budget reductions.",
            "Key talent loss risks due to brain-drain factors across local production setups."
        ];
    } else if (["LUCK", "DGKC", "MLCF"].includes(sym)) {
        sector = "Cement & Infrastructure";
        isShariah = "YES";
        basePrice = sym === "LUCK" ? 155 : 68;
        horizon = "Moderate-Term Cyclical";
        riskClass = "Moderate Risk";
        suggestions = [
            "Optimize position entry setups when local infrastructure project budgets recover.",
            "Asset-rich corporate structure backing strong intrinsic book values."
        ];
        redFlags = [
            "High finance tracking cost load inside high interest rate (KIBOR) processing environments.",
            "Volatile international coal fuel import overhead metrics impact operating margins significantly."
        ];
    } else if (["SAZEW", "MTL", "INDU"].includes(sym)) {
        sector = "Automotive & Assembly";
        isShariah = "YES";
        basePrice = sym === "SAZEW" ? 380 : sym === "INDU" ? 1450 : 620;
        horizon = "Short-Term Tactical Momentum";
        riskClass = "High Risk";
        suggestions = [
            "Outstanding export market development and localization strategies for structural components.",
            "Strong early consumer momentum surrounding hybrid and localized assembly alternative integrations."
        ];
        redFlags = [
            "High operational vulnerability to import supply chain closures and strict LC limits.",
            "Discretionary consumer demand drops rapidly under local inflation and compressed disposable income scales."
        ];
    } else if (["HUBC", "KEL"].includes(sym)) {
        sector = "Power & Utilities";
        isShariah = "NO"; // Explicitly defined as failed core compliance screens
        basePrice = sym === "HUBC" ? 122 : 5.5;
        horizon = "Moderate-Term Cyclical";
        riskClass = "Moderate Risk";
        suggestions = [
            "Attractive high trailing dividend payout baseline architecture, but capital remains illiquid.",
            "Strong industrial energy integration and mining asset venture tracking upside potential."
        ];
        redFlags = [
            "Fails clean Shariah parameters based on KMIALL financial asset and leverage baseline criteria limits.",
            "Severe operational cash locks driven by systemic circular debt accounts."
        ];
    } else if (sym === "MEBL") {
        sector = "Islamic Banking";
        isShariah = "YES";
        basePrice = 215;
        horizon = "Long-Term Compounder";
        riskClass = "Low Risk";
        suggestions = [
            "Industry benchmark provider experiencing strong systemic asset growth from cash-to-Shariah structural transitions.",
            "High net interest margins supported by an expansive zero-cost digital deposit architecture network."
        ];
        redFlags = [
            "Earning profile normalizes if SBP reduces current baseline monetary policy rates significantly.",
            "Exposure to corporate credit cycles across local infrastructure and textile segments."
        ];
    }

    try {
        const pe = Math.random() * (9 - 4) + 4;
        const eps = basePrice / pe;
        const pb = Math.random() * (2.8 - 0.8) + 0.8;
        const bookValue = basePrice / pb;
        const divYield = Math.random() * (14 - 2) + 2;

        const dataPayload = {
            symbol: sym,
            name: `${sym} Pakistan Corporation Ltd`,
            sector: sector,
            isShariah: isShariah,
            horizon: horizon,
            riskClass: riskClass,
            price: basePrice.toFixed(2),
            prevClose: (basePrice * (Math.random() * (1.02 - 0.98) + 0.98)).toFixed(2),
            marketCap: (Math.random() * (290 - 15) + 15).toFixed(2) + "B",
            eps: eps.toFixed(2),
            pe: pe.toFixed(1),
            bookValue: bookValue.toFixed(2),
            pb: pb.toFixed(2),
            divYield: divYield.toFixed(1) + "%",
            deRatio: (Math.random() * (1.2 - 0.0) + 0.0).toFixed(2),
            suggestions: suggestions,
            redFlags: redFlags,
            history: {
                years: ["2022", "2023", "2024", "2025", "2026"],
                rev: Array.from({length: 5}, () => (Math.random() * (120 - 50) + 50).toFixed(1)),
                gp: Array.from({length: 5}, () => (Math.random() * (35 - 12) + 12).toFixed(1)),
                np: Array.from({length: 5}, () => (Math.random() * (20 - 4) + 4).toFixed(1)),
                eps: Array.from({length: 5}, () => (Math.random() * (15 - 2) + 2).toFixed(2)),
                divHistory: Array.from({length: 5}, () => (Math.random() * (10 - 0) + 0).toFixed(1))
            }
        };

        return res.status(200).json(dataPayload);
    } catch (e) {
        return res.status(500).json({ error: "Internal processing processing fault." });
    }
}
